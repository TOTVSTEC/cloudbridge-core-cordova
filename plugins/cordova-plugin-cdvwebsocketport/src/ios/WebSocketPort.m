//
//  WebSocketPort.m
//  PhotoSharer
//
//  Created by Daniel Bolognani on 20/04/17.
//
//

#import "WebSocketPort.h"
extern int webSckPort;

@implementation CDVWebSocketPort

- (void)getPort:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult* pluginresult = nil;
    
    if (webSckPort == -1) {
        pluginresult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
    }
    else{
        pluginresult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:webSckPort];
    }
    
    [self.commandDelegate sendPluginResult:pluginresult callbackId:command.callbackId];
}

@end
