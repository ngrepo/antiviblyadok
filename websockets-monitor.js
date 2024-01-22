// ==UserScript==
// @name        Websockets
// @namespace   https://<your site here>
// @version     1.0.0
// @description Logs sent websocket events
// @namespace   https://livacha.com/
// @match       https://livacha.com/*
// @connect     livacha.com
// @require     https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/crypto-js.min.js
// @run-at      document-start
// ==/UserScript==

const WebSocketProxy = new Proxy(window.unsafeWindow.WebSocket, {
construct(target, args) {
    console.log(args);

    const instance = new target(...args);

    const openHandler = (event) => {
//        console.log(event);
        logger(event.data);
    };

    const messageHandler = (event) => {
//        console.log(event);
        logger(event.data);
    };

    const closeHandler = (event) => {
//        console.log(event);
        logger(event.data);
        instance.removeEventListener('open', openHandler);
        instance.removeEventListener('message', messageHandler);
        instance.removeEventListener('close', closeHandler);
    };

    instance.addEventListener('open', openHandler);
    instance.addEventListener('message', messageHandler);
    instance.addEventListener('close', closeHandler);

    const sendProxy = new Proxy(instance.send, {
        apply: function(target, thisArg, _args) {
//            console.log(event);
            logger(_args.data);
            target.apply(thisArg, _args);
        }
    });

    instance.send = sendProxy;

    return instance;
},
});

window.unsafeWindow.WebSocket = WebSocketProxy;

exportFunction(logger, unsafeWindow, { defineAs: "logger" });

function logger(data){
    if (data !== undefined ) {
        let message = JSON.parse(data);
        if (message['mess'] != 'money' && message['mess'] != 'pong') {
            console.log(message);
        }
    }
}
