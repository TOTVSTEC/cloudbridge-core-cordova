/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        // inicia a comunicação webSocket, os três parâmetros são 3 funções de callback
        // 1 - Chamado quando recebe uma mensagem pelo websocket 
        //     A função precisa esperar 2 parâmetros, sendo o primeiro o tamanho do pacote e o segundo a mensagem em si
        // 2 - Chamado em alguma situação de erro (tanto de websocket como de ADVPL)
        //     A função precisa esperar 2 parâmetros, sendo o primeiro um código de erro e o segundo uma descrição do erro
        // 3 - Chamado para informar que a conexão foi bem sucedida ou foi desconectado
        //     A função precisa esperar 2 parâmetros, sendo o primeiro um código (1 quando conectado e != 1 quando desconectado) e o segundo uma descrição
        initWebSockets(onReceive, onError, onStatus);
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);

        //Exemplo de comunicação ADVPL <-> JS
        //Envio comando para mudar o formato da data e depois para retornar a Data do sistema
        doSend("SET(4,'dd/mm/yy'),date()");
    }
};

// CallBack chamado quando recebe mensagem por WEBSOCKET
function onReceive(length, msg)
{
    // Exemplo de retorno do ADVPL (neste caso retorna a data do sistema)
    document.getElementById('data').innerHTML = "<p>" + msg + "</p>";
}

// CallBack chamado devido a algum erro no WEBSOCKET ou ADVPL
function onError(code, descr)
{
    alert(code + " - " + descr);
}

// CallBack chamado para alertar Connect e Disconnect do WEBSOCKET
function onStatus(code, descr)
{

  if (code == WSEnum.WSCONNECTED)
    app.receivedEvent('deviceready');

}

app.initialize();