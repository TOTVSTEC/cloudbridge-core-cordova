package org.apache.cordova.cdvwebsocketport;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import org.json.JSONArray;
import org.json.JSONException;

/**
 * This class echoes a string called from JavaScript.
 */
public class CDVWebSocketPort extends CordovaPlugin {
    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("getPort")) {
            this.getPort(callbackContext);
            return true;
        }
        return false;
    }
    
    public static int webSckPort = -1;
    
    private void getPort(CallbackContext callbackContext) {
        if (webSckPort > 0)
            callbackContext.success(webSckPort);
        else
            callbackContext.error("Failed to get Port");
    }

}