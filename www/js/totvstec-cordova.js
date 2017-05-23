
  var wsUri = "ws://localhost:";
  var output;
  var onRecMsg;

  function setStatusReceiver(div)
  {
    output = div;
  }

  function initWebSockets(onReceiveMsg, StatusDiv)
  {
    onRecMsg = function(evt) { onReceiveMsg(evt); };
    output = StatusDiv;
    window.plugins.websocketport.getPort(initWebSocketsOK, initWebSocketsErr);
  }

  function initWebSocketsport(websckport, onReceiveMsg, StatusDiv)
  {
    onRecMsg = function(evt) { onReceiveMsg(evt); };
    output = StatusDiv;
    wsUri = wsUri + websckport.toString();
    websocket = new WebSocket(wsUri);
    websocket.onopen = function(evt) { onOpen(evt) };
    websocket.onclose = function(evt) { onClose(evt) };
    websocket.onmessage = function(evt) { onMessage(evt) };
    websocket.onerror = function(evt) { onError(evt) };
  }

  function initWebSocketsErr(errorMsg)
  {
    if (output)
      output.prepend("WebSocketGetPortError - " + errorMsg);
  }

  function initWebSocketsOK(websckport)
  {
      wsUri = wsUri + websckport.toString();
      websocket = new WebSocket(wsUri);
      websocket.onopen = function(evt) { onOpen(evt) };
      websocket.onclose = function(evt) { onClose(evt) };
      websocket.onmessage = function(evt) { onMessage(evt) };
      websocket.onerror = function(evt) { onError(evt) };
  }

  function onOpen(evt)
  {
    if (output)
      output.prepend("<p>WebSocket: Conectado</p>");
  }

  function onClose(evt)
  {
    if (output)
      output.prepend("<p>WebSocket: Desconectado (Code: " + evt.code + (evt.reason.length > 0 ? " Reason: " + evt.reason : "") + ")</p>");
  }

  function onMessage(evt)
  {
    // mensagem recebida
    if (evt.data.length >= 12 && evt.data.substring(0,12)=="[ADVPLERROR]")
    {
      if (output)
        output.prepend("<p>WebSocket: " + evt.data + "</p>");
    }
    else
    {
      if (onRecMsg)
        onRecMsg(evt.data);
      else
      {
        if (output)
          output.prepend("<p>" + evt.data + "</p>");
      }
    }
  }

  function onError(evt)
  {
    if (evt.data && output)
      output.prepend("<p>WebSocket: " + evt.data + "</p>");
  }

  function doSend(message)
  {
    websocket.send(message);
  }
