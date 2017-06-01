/*
/-------------------------------------------------------------\
| u_websck() - Exemplo de funcionamento do WebSocket          |
|-------------------------------------------------------------|
| Preferencialmente, utilize o código abaixo como base na sua |
| implementação ADVPL, alterando apenas o trecho dentro do    |
| begin sequence ---- end sequence.                           |
|                                                             |
| Para utilização no projeto Cloudbridge Cordova-like, o nome |
| da função não deve ser alterado (verificar o appserver.ini  |
| que define esta função como onstart).                       |
|                                                             |
|-------------------------------------------------------------|
| Autor - Daniel Otto Bolognani                               |
| Data  - 01/06/2017                                          |
\-------------------------------------------------------------/
*/
user function websck()
  Local oError, ret 
  
  //Cria objeto WEBSOCKET SERVER
  PUBLIC websck := TWEBSOCKET():NEW()
  
  // Inicia Servidor WebSocket em uma porta indicada pelo sistema operacional
  nsServer := websck:StartServer(0)
  if nsServer != 0
    conout("Error starting WebSocket server (" + cvlatochar(nsServer) + ")")
    return
  endif
  
  txtRecv := ""
  Public nCon := 0
  
  While .T.
  
    // Espera conexão
    if websck:nConnected() > 0
      conout("Client Connected "+ cvaltochar(websck:nConnected()))
      
      // Assim que um cliente conectar, fica em loop esperando receber uma mensagem
      if websck:Receive(txtRecv, nCon, 500) == 0
      
        conout("Message Received from " + cvaltochar(nCon) + " - " + txtRecv)
        
        // Substitui o errorblock com um bloco código (neste caso, chama uma função) para enviar o erro ADVPL por websocket para o cliente
        oError := ErrorBlock({ |e|u_errHandler(e:Description, websck, nCon) })
        
        begin sequence
          // Pega o texto recebido e transforma em Bloco de código
          bloco := &("{||" + txtRecv + "}")
          // Executa o bloco de código e salva o retorno na variável ret
          ret := cvaltochar( eval(bloco) )
          // Envia como resposta o retorno da execução do bloco de código
          hasSend := websck:Send( ret,nCon,500 )
        end sequence 
        
        // Restaura o bloco de código de erro ADVPL padrão
        ErrorBlock := oError
        
        // Se por algum motivo não conseguiu enviar a resposta, mostra pelo menos um aviso no console
        if hasSend != 0
          conout("WebSocket Send error (" + cvaltochar(hasSend) + ")")
        endif
        
      endif
    else
      conout("Waiting conection on port " + cvaltochar(websck:getport()))
      // Nenhum cliente conectado, manda o websocket Server continuar esperando por conexão
      websck:PingServer(500)
    endif
  enddo

return

User function errHandler(sDescr, websck, ncon)

  websck:Send("[ADVPLERROR]: " + sDescr, ncon, 1000 )

RETURN 
