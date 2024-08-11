// ==UserScript==
// @name         MutationObserverDemo
// @namespace    https://livacha.com/
// @version      2024-08-10
// @description  try to take over the world!
// @author       You
// @match        https://livacha.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=livacha.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
// Выбираем целевой элемент
    console.log('test');
    setTimeout(() => {
var target = document.getElementsByClassName("chat-messages")[0];

// Конфигурация observer (за какими изменениями наблюдать)
const config = {
  attributes: true,
  childList: true,
  subtree: true,
  characterDataOldValue: true,
};

// Колбэк-функция при срабатывании мутации
const callback = function (mutationsList, observer) {
   console.log("==============");
  for (let mutation of mutationsList) {
    if (mutation.type === "childList") {
                    if (mutation.target && [...mutation.addedNodes].length) {
                        for (let node of mutation.addedNodes) {
                            if (node.className == 'mess-row') {
                                console.log(`A child node has been added!`, node);
                            }
                        }
                    }

                    if (mutation.target && [...mutation.removedNodes].length) {
                        for (let node of mutation.removedNodes) {
                            if (node.className == 'mess-row') {
                                console.log(`A child node has been removed!`, node);
                            }
                        }
                    }
    } else if (mutation.type === "attributes") {
      console.log("The " + mutation.attributeName + " attribute was modified.");
    }
  }
};

// Создаём экземпляр наблюдателя с указанной функцией колбэка
const observer = new MutationObserver(callback);

// Начинаем наблюдение за настроенными изменениями целевого элемента
observer.observe(target, config);

// Позже можно остановить наблюдение
//observer.disconnect();
    // Your code here...
    }, 3000);
})();
