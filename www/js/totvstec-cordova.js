
  var wsUri = "ws://localhost:";
  var onErrorMsg;
  var onRecMsg;
  var onStatusMsg;

  var WSEnum = {
    WSADVPLERROR: -200,
    WSGETPORTERROR: -100,
    WSGENERROR: -1,
    WSOK: 0,
    WSCONNECTED : 1
  };

  function initWebSockets(onADVPLMsg, onADVPLError, onStatus)
  {
    onRecMsg = function(len, evt) { onADVPLMsg(len, evt); };
    onErrorMsg = function(code, evt) { onADVPLError(code, evt); };
    onStatusMsg = function(code, evt) { onStatus(code, evt); };
    window.plugins.websocketport.getPort(initWebSocketsOK, initWebSocketsErr);
  }

  function initWebSocketsErr(errorMsg)
  {
    if (onErrorMsg)
      onErrorMsg(WSEnum.WSGETPORTERROR, errorMsg);
  }

  function initWebSocketsOK(websckport)
  {
      wsUri = wsUri + websckport.toString();
      websocket = new WebSocket(wsUri);
      websocket.onopen = function(evt) { onOpenWS(evt); };
      websocket.onclose = function(evt) { onCloseWS(evt); };
      websocket.onmessage = function(evt) { onMessageWS(evt); };
      websocket.onerror = function(evt) { onErrorWS(evt); };
  }

  function onOpenWS(evt)
  {
    if (onStatusMsg)
      onStatusMsg(WSEnum.WSCONNECTED, "WebSocket: Conectado");
  }

  function onCloseWS(evt)
  {
    if (onStatusMsg)
      onStatusMsg(evt.code, evt.reason.length > 0 ? evt.reason : "");
  }

  function onMessageWS(evt)
  {
    // mensagem recebida
    if (evt.data.length >= 12 && evt.data.substring(0,12)=="[ADVPLERROR]")
    {
      if (onErrorMsg)
        onErrorMsg(WSEnum.WSADVPLERROR, evt.data);
    }
    else
    {
      if (onRecMsg)
        onRecMsg(evt.length, evt.data);
    }
  }

  function onErrorWS(evt)
  {
    if (evt.data && onErrorMsg)
      onErrorMsg(WSEnum.WSGENERROR, evt.data);
  }

  function doSend(message)
  {
    websocket.send(message);
  }
