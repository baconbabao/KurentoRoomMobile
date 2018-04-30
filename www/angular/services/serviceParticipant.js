/*
 * @author Raquel Díaz González
 */

(function () {
'use strict';

    var appCtrlSrvPart = angular.module('appCtrlSrvPart', []);

    appCtrlSrvPart.factory('ServiceParticipant', function () {

    return new Participants();

});

})();
