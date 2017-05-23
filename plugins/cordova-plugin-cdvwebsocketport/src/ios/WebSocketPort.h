//
//  WebSocketPort.h
//  PhotoSharer
//
//  Created by Daniel Bolognani on 20/04/17.
//
//

#ifndef WebSocketPort_h
#define WebSocketPort_h

#import <Cordova/CDVPlugin.h>

@interface CDVWebSocketPort : CDVPlugin

- (void)getPort: (CDVInvokedUrlCommand*)command;

@end

#endif /* WebSocketPort_h */
