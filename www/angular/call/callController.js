/*
 * @author Micael Gallego (micael.gallego@gmail.com)
 * @author Raquel Díaz González
 * @modified BaconBabao
 */

(function () {
    'use strict';

    var appCtrlCall = angular.module('appCtrlCall', []);

    appCtrlCall.controller('callController', function ($scope, $window, $state, ServiceParticipant, ServiceRoom, $ionicPopup) {

            $scope.roomName = ServiceRoom.getRoomName();
            $scope.userName = ServiceRoom.getUserName();
            $scope.participants = ServiceParticipant.getParticipants();
            $scope.kurento = ServiceRoom.getKurento();
        
            $scope.leaveRoom = function () {
        
		        ServiceRoom.getKurento().close();
        
                ServiceParticipant.removeParticipants();
        
                //redirect to login
                $window.location.href = '#/login';
            };
        
            window.onbeforeunload = function () {
                //not necessary if not connected
                if (ServiceParticipant.isConnected()) {
 		   		ServiceRoom.getKurento().close();
                }
            };
        
            //Bacon
            // $scope.goFullscreen = function () {
        
            //     if (Fullscreen.isEnabled())
            //         Fullscreen.cancel();
            //     else
            //         Fullscreen.all();
        
            // };
        
            $scope.disableMainSpeaker = function (value) {
        
                var element = document.getElementById("buttonMainSpeaker");
                if (element.classList.contains("ion-android-volume-off")) { //md-person  //on
                    element.classList.remove("ion-android-volume-off");  //md-person
                    element.classList.add("ion-android-volume-up");  //md-recent-actors
                    ServiceParticipant.enableMainSpeaker();
                } else { //off
                    element.classList.remove("ion-android-volume-up");   //md-recent-actors
                    element.classList.add("ion-android-volume-off");      //md-person
                    ServiceParticipant.disableMainSpeaker();
                }
            }
        
            $scope.onOffVolume = function () {
                var localStream = ServiceRoom.getLocalStream();
                var element = document.getElementById("buttonVolume");
                if (element.classList.contains("ion-android-microphone-off")) { //on //md-volume-off
                    element.classList.remove("ion-android-microphone-off"); //md-volume-off
                    element.classList.add("ion-android-microphone");       //md-volume-up
                    localStream.audioEnabled = true;
                } else { //off
                    element.classList.remove("ion-android-microphone");    //md-volume-up
                    element.classList.add("ion-android-microphone-off"); //md-volume-off
                    localStream.audioEnabled = false;
        
                }
            };
        
            $scope.onOffVideocam = function () {
                var localStream = ServiceRoom.getLocalStream();
                var element = document.getElementById("buttonVideocam");
                if (element.classList.contains("ion-android-alert")) {//on
                    element.classList.remove("ion-android-alert");
                    element.classList.add("ion-ios-videocam");
                    localStream.videoEnabled = true;
                } else {//off
                    element.classList.remove("ion-ios-videocam");
                    element.classList.add("ion-android-alert");
                    localStream.videoEnabled = false;
                }
            };

            //Bacon This function is NOT used.
            $scope.disconnectStream = function () {
                var localStream = ServiceRoom.getLocalStream();
                var participant = ServiceParticipant.getMainParticipant();
                if (!localStream || !participant) {
                    alert("Not connected yet");
                    return false;
                }
                ServiceParticipant.disconnectParticipant(participant);
                ServiceRoom.getKurento().disconnectParticipant(participant.getStream());
            }

            //Bacon ----------------------------------------
            //chat
            // $scope.message;
        
            // $scope.sendMessage = function () {
            //     console.log("Sending message", $scope.message);
            //     var kurento = ServiceRoom.getKurento();
            //     kurento.sendMessage($scope.roomName, $scope.userName, $scope.message);
            //     $scope.message = "";
            // };
        
            //open or close chat when click in chat button
            // $scope.toggleChat = function () {
            //     var selectedEffect = "slide";
            //     // most effect types need no options passed by default
            //     var options = {direction: "right"};
            //     if ($("#effect").is(':visible')) {
            //         $("#content").animate({width: '100%'}, 500);
            //     } else {
            //         $("#content").animate({width: '80%'}, 500);
            //     }
            //     // run the effect
            //     $("#effect").toggle(selectedEffect, options, 500);
            // };
            //-------------------------------------
            
    });

})();
