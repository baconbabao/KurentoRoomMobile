
/*
 * @author Micael Gallego (micael.gallego@gmail.com)
 * @author Radu Tom Vlad
 * @modified BaconBabao
 */
(function () {
    'use strict';

    var appCtrlLogin = angular.module('appCtrlLogin', []);

     appCtrlLogin.controller('loginController', function ($scope, $rootScope, $http, $window, ServiceParticipant, ServiceRoom, $ionicPopup, $state, $stateParams) {

    //Bacon ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
    //  TODO: uriとwssをKurentoRoom Serverのアドレスに変更してください。
    var uri = 'https://';
    var wss = 'wss://';
    //★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★

    $scope.existingRoomName = false;
    $scope.roomPickerClass = 'grid__col6';
    $scope.roomPickerLabel = 'Room';
    //Bacon RoomNameが既にある場合の処理をコメントアウト
    //var name = $routeParams["existingRoomName"];
    // if (name && name.length > 0) {
    //     $scope.room = {
    //         roomName: name
    //     }
    //     $scope.existingRoomName = true;
    //     $scope.roomPickerClass = 'grid__col';
    //     $scope.roomPickerLabel = 'Fixed room name';
    // }

    $scope.nameValidation = function(name) {
        return /^[a-zA-Z0-9]+$/.test(name);
    };

    $rootScope.isParticipant = false;
    
    var contextpath = uri; //(location.pathname == '/') ? '' : location.pathname;

    $rootScope.contextpath = uri; //(location.pathname == '/') ? '' : location.pathname;

    var roomsFragment = $rootScope.contextpath.endsWith('/') ? '#/rooms/' : '/#/rooms/';

    $http.get($rootScope.contextpath + '/getAllRooms').success(function(data, status, headers, config) {
        console.log(JSON.stringify(data));
        $scope.listRooms = data;
    }).error(function(data, status, headers, config) {});

    $http.get($rootScope.contextpath + '/getClientConfig').success(function(data, status, headers, config) {
        console.log(JSON.stringify(data));
        $scope.clientConfig = data;
    }).error(function(data, status, headers, config) {});

    $http.get($rootScope.contextpath + '/getUpdateSpeakerInterval').success(function(data, status, headers, config) {
        $scope.updateSpeakerInterval = data
    }).error(function(data, status, headers, config) {});

    $http.get($rootScope.contextpath + '/getThresholdSpeaker').success(function(data, status, headers, config) {
        $scope.thresholdSpeaker = data
    }).error(function(data, status, headers, config) {});

    $scope.register = function(room) {

        if (!room)
            ServiceParticipant.showError($window, $ionicPopup, {
                error: {
                    message: "Username and room fields are both required"
                }
            });

        $scope.userName = room.userName;
        $scope.roomName = room.roomName;

        var wsUri = wss + '/room';
        //var wsUri = 'wss://' + location.host + $rootScope.contextpath + '/room';

        //show loopback stream from server
        var displayPublished = $scope.clientConfig.loopbackRemote || false;
        //also show local stream when display my remote
        var mirrorLocal = $scope.clientConfig.loopbackAndLocal || false;

        var kurento = KurentoRoom(wsUri, function(error, kurento) {

            if (error) {
                return console.error('Error in KurentoRoom client', error);
            }

            //TODO token should be generated by the server or a 3rd-party component  
            //kurento.setRpcParams({token : "securityToken"});

            room = kurento.Room({
                room: $scope.roomName,
                user: $scope.userName,
                updateSpeakerInterval: $scope.updateSpeakerInterval,
                thresholdSpeaker: $scope.thresholdSpeaker
            });

            var localStream = kurento.Stream(room, {
                audio: true,
                video: true,
                data: false
            });

            localStream.addEventListener("access-accepted", function() {
                room.addEventListener("room-connected", function(roomEvent) {
                    var streams = roomEvent.streams;
                    if (displayPublished) {
                        localStream.subscribeToMyRemote();
                    }
                    localStream.publish();
                    ServiceRoom.setLocalStream(localStream.getWebRtcPeer());
                    for (var i = 0; i < streams.length; i++) {
                        ServiceParticipant.addParticipant(streams[i]);
                    }
                });

                room.addEventListener("stream-published", function(streamEvent) {
                    ServiceParticipant.addLocalParticipant(localStream);
                    if (mirrorLocal && localStream.displayMyRemote()) {
                        var localVideo = kurento.Stream(room, {
                            video: true,
                            id: "localStream"
                        });
                        localVideo.mirrorLocalStream(localStream.getWrStream());
                        ServiceParticipant.addLocalMirror(localVideo);
                    }
                });

                room.addEventListener("stream-added", function(streamEvent) {
                    ServiceParticipant.addParticipant(streamEvent.stream);
                });

                room.addEventListener("stream-removed", function(streamEvent) {
                    ServiceParticipant.removeParticipantByStream(streamEvent.stream);
                });

                room.addEventListener("newMessage", function(msg) {
                    ServiceParticipant.showMessage(msg.room, msg.user, msg.message);
                });

                room.addEventListener("error-room", function(error) {
                    ServiceParticipant.showError($window, $ionicPopup, error);
                });

                room.addEventListener("error-media", function(msg) {
                    ServiceParticipant.alertMediaError($window, $ionicPopup, msg.error, function (answer) {
                        console.warn("Leave room because of error: " + answer);
                        if (answer) {
                            kurento.close(true);
                        }
                    });
                });

                room.addEventListener("room-closed", function(msg) {
                    if (msg.room !== $scope.roomName) {
                        console.error("Closed room name doesn't match this room's name",
                            msg.room, $scope.roomName);
                    } else {
                        kurento.close(true);
                        ServiceParticipant.forceClose($window, $ionicPopup, 'Room ' +
                            msg.room + ' has been forcibly closed from server');
                    }
                });

                room.addEventListener("lost-connection", function(msg) {
                    kurento.close(true);
                    ServiceParticipant.forceClose($window, $ionicPopup,
                        'Lost connection with room "' + msg.room +
                        '". Please try reloading the webpage...');
                });

                room.addEventListener("stream-stopped-speaking", function(participantId) {
                    ServiceParticipant.streamStoppedSpeaking(participantId);
                });

                room.addEventListener("stream-speaking", function(participantId) {
                    ServiceParticipant.streamSpeaking(participantId);
                });

                room.addEventListener("update-main-speaker", function(participantId) {
                    ServiceParticipant.updateMainSpeaker(participantId);
                });

                room.connect();
            });

            localStream.addEventListener("access-denied", function() {
                ServiceParticipant.showError($window, $ionicPopup, {
                    error: {
                        message: "Access not granted to camera and microphone"
                    }
                });
            });
            localStream.init();
        });

        //save kurento & roomName & userName in service
        ServiceRoom.setKurento(kurento);
        ServiceRoom.setRoomName($scope.roomName);
        ServiceRoom.setUserName($scope.userName);

        //redirect to call
        $window.location.href = '#/call';
    };
    $scope.clear = function() {
        $scope.room = "";
        $scope.userName = "";
        $scope.roomName = "";
    };

    //Bacon for android, required permission check in advance.
    permissionCheck();

});

})();