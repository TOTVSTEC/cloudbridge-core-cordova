/*
/-------------------------------------------------------------\
| u_websck() - Exemplo de funcionamento do WebSocket          |
|-------------------------------------------------------------|
| Preferencialmente, utilize o codigo abaixo como base na sua |
| implementacao ADVPL, alterando apenas o trecho dentro do    |
| begin sequence ---- end sequence.                           |
|                                                             |
| Para utilizacao no projeto Cloudbridge Cordova-like, o nome |
| da funcao nao deve ser alterado (verificar o appserver.ini  |
| que define esta funcao como onstart).                       |
|                                                             |
|-------------------------------------------------------------|
| Autor - Daniel Otto Bolognani                               |
| Data  - 01/07/2017                                          |
\-------------------------------------------------------------/
*/
user function websck()
  Local oError, ret, hasSend 

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
  
    // Espera conexao
    if websck:nConnected() > 0
      conout("Client Connected " + cvaltochar(websck:nConnected()))
      
      // Assim que um cliente conectar, fica em loop esperando receber uma mensagem
      if websck:Receive(txtRecv, nCon, 500) == 0
      
        conout("Message Received from " + cvaltochar(nCon) + " - " + txtRecv)
        
        // Substitui o errorblock com um codigo para enviar o erro ADVPL por websocket para o cliente
        oError := ErrorBlock({ |e|u_errHandler(e:Description, websck, nCon) })
        
        begin sequence
          // Cria o objeto para parser do JSON
          oJson := tJsonParser():New()
          lenStrJson := Len(txtRecv)
          jsonfields := {}
          nRetParser := 0  
          oJHM := .F.
      		
          // Realiza o parse do JSON transformando em HashMap
          lRet := oJson:Json_Hash(txtRecv, lenStrJson, @jsonfields, @nRetParser, @oJHM)

          // Se ocorrer algum erro no parser, envia uma mensagem por WebSocket
          if !lRet
            websck:Send(MountJSON( "ADVPLERROR", "Invalid JSON"), ncon, 1000 )
          else
            cCode := ""
            cContent := ""
            cMsgRet := ""
            cCodRet := ""
            // Pega os dois valores que interessa (codMessage e contentMessage)
            lRet1 := HMGet(oJHM, "codMessage", cCode)
            lRet2 := HMGet(oJHM, "contentMessage", cContent)
      		  
            // So continua se os valores existem
            if lRet1 == .T. .AND. lRet2 == .T.
              DO CASE
                CASE cCode == "execADVPL"
                  // Pega o texto recebido e transforma em Bloco de codigo
                  bloco := &("{||" + cContent + "}")
                  // Executa o bloco de codigo e salva o retorno na variavel ret
                  cMsgRet := cvaltochar( eval(bloco) )
                  cCodRet := "returnADVPL"

                // Adicionar outros cases aqui quando necessario
                    
              ENDCASE
    			    
              //jsonRes := '{"codMessage": "' + cCodRet + '", "contentMessage": "' + cMsgRet + '"}'
              jsonRes := MountJSON(cCodRet, cMsgRet)
              hasSend := websck:Send( jsonRes,nCon,500 )
            else
              // Se nao veio codMessage e contentMessage envia mensagem de erro por WebSocket
              hasSend := websck:Send(MountJSON( "ADVPLERROR", "Invalid JSON"), ncon, 1000 )
            endif
    			  
          endif

        end sequence
        
        // Restaura o bloco de codigo de erro ADVPL padrao
        ErrorBlock := oError
        
        // Se por algum motivo nao conseguiu enviar a resposta, mostra pelo menos um aviso no console
        if hasSend != 0
          conout("WebSocket Send error (" + cvaltochar(hasSend) + ")")
        endif
        
      endif
    else
      conout("Waiting conection on port " + cvaltochar(websck:getport()))
      // Nenhum cliente conectado, manda o websocket Server continuar esperando por conexao
      websck:PingServer(500)
    endif
  enddo

return

// Funcao para controle de erro
user function errHandler(sDescr, websck, ncon)
	websck:Send(MountJSON( "ADVPLERROR", sDescr), ncon, 1000 )
	Break
RETURN 

// Monta JSON de resposta
static function MountJSON(CCode, CContent)
	jsonResult := '{ "codMessage": "' + CCode + '", "contentMessage": "' + CContent + '" }'
return jsonResult
