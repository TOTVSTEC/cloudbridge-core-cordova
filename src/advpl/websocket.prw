user function websck()
  Local oError, ret 
  PUBLIC websck := TWEBSOCKET():NEW()
  
  nsServer := websck:StartServer(0)
  if nsServer != 0
    conout("Error starting WebSocket server (" + cvlatochar(nsServer) + ")")
    return
  endif
  
  txtRecv := ""
  Public nCon := 0
  While .T.
    if websck:nConnected() > 0
      conout("Client Connected "+ cvaltochar(websck:nConnected()))
      if websck:Receive(txtRecv, nCon, 500) == 0
        conout("Message Received from " + cvaltochar(nCon) + " - " + txtRecv)
        oError := ErrorBlock({ |e|u_errHandler(e:Description, websck, nCon) })
        begin sequence
          bloco := &("{||" + txtRecv + "}")
          ret := cvaltochar( eval(bloco) )
          hasSend := websck:Send( ret,nCon,500 )
        end sequence 
        ErrorBlock := oError
        if hasSend != 0
          conout("WebSocket Send error (" + cvaltochar(hasSend) + ")")
        endif
      endif
    else
      conout("Waiting conection on port " + cvaltochar(websck:getport()))
      websck:PingServer(500)
    endif
  enddo

return

User function errHandler(sDescr, websck, ncon)

  websck:Send("[ADVPLERROR]: " + sDescr, ncon, 1000 )

BREAK 
