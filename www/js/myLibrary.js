
/*
 * @auther BaconBabao
*/


//Permission Check for android 6.0+
function permissionCheck() {
    if (ionic.Platform.is('android') === true){
        if (ionic.Platform.version() >= 6.0){
            var permissions = cordova.plugins.permissions;
            //Camera Permission Check
            permissions.hasPermission(permissions.CAMERA, 
                function(status){
                    if (!status.hasPermission){
                        var errorCallback = function() {
                            alert('Camera permission is not turned on');
                        }
                        permissions.requestPermission(
                            permissions.CAMERA,
                            function(status) {
                                if(!status.hasPermission) errorCallback();
                            },
                            errorCallback );
                    }
                });
            //Microphone Permission Check
            permissions.hasPermission(permissions.RECORD_AUDIO, 
                function(status){
                    if (!status.hasPermission){
                        var errorCallback = function() {
                            alert('Microphone permission is not turned on');
                        }
                        permissions.requestPermission(
                            permissions.RECORD_AUDIO,
                            function(status) {
                                if(!status.hasPermission) errorCallback();
                            },
                            errorCallback );
                    }
                });
        }
    }
}
