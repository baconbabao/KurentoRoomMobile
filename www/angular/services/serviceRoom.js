/*
 * @author Raquel Díaz González
 * @modified BaconBabao
 */

(function () {
    'use strict';

    var appCtrlSrvRoom = angular.module('appCtrlSrvRoom', []);

    appCtrlSrvRoom.service('ServiceRoom', function () {

        var kurento;
        var roomName;
        var userName;
        var localStream;
    
        this.getKurento = function () {
            return kurento;
        };
    
        this.getRoomName = function () {
            return roomName;
        };
    
        this.setKurento = function (value) {
            kurento = value;
        };
    
        this.setRoomName = function (value) {
            roomName = value;
        };
    
        this.getLocalStream = function () {
            return localStream;
        };
    
        this.setLocalStream = function (value) {
            localStream = value;
        };
    
        this.getUserName = function () {
            return userName;
        };
    
        this.setUserName = function (value) {
            userName = value;
        };

});

})();
