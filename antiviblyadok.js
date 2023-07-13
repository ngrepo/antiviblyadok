// ==UserScript==
// @name        Antiviblyadok
// @description Script - Antiviblyadok
// @author      Antiviblyadok
// @version     0.0.3
// @namespace   https://livacha.com/
// @match       https://livacha.com/chat/*
// @match       https://livacha.com/post/*
// @connect     livacha.com
// @require     https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/crypto-js.min.js
// @grant       GM_xmlhttpRequest
// @run-at      document-end
// @noframes
// ==/UserScript==
// unwrap

function create( name, attributes )
{
	var el = document.createElement( name );
	if ( typeof attributes == 'object' ) {
		for ( var i in attributes ) {
			el.setAttribute( i, attributes[i] );
			if ( i.toLowerCase() == 'class' ) {
				el.className = attributes[i];
			} else if ( i.toLowerCase() == 'style' ) {
				el.style.cssText = attributes[i];
			}
		}
	}

	for ( let i = 2; i < arguments.length; i++ ) {
		let val = arguments[i];
		if ( typeof val == 'string' ) { val = document.createTextNode( val ) }
		el.appendChild( val );
	}

	return el;
}

/**
 * @param {string} s1 Исходная строка
 * @param {string} s2 Сравниваемая строка
 * @param {object} [costs] Веса операций { [replace], [replaceCase], [insert], [remove] }
 * @return {number} Расстояние Левенштейна
 */
function levenshtein(s1, s2, costs) {
    var i, j, l1, l2, flip, ch, chl, ii, ii2, cost, cutHalf;
    l1 = s1.length;
    l2 = s2.length;

    costs = costs || {};
    var cr = costs.replace || 1;
    var cri = costs.replaceCase || costs.replace || 1;
    var ci = costs.insert || 1;
    var cd = costs.remove || 1;

    cutHalf = flip = Math.max(l1, l2);

    var minCost = Math.min(cd, ci, cr);
    var minD = Math.max(minCost, (l1 - l2) * cd);
    var minI = Math.max(minCost, (l2 - l1) * ci);
    var buf = new Array((cutHalf * 2) - 1);

    for (i = 0; i <= l2; ++i) {
        buf[i] = i * minD;
    }

    for (i = 0; i < l1; ++i, flip = cutHalf - flip) {
        ch = s1[i];
        chl = ch.toLowerCase();

        buf[flip] = (i + 1) * minI;

        ii = flip;
        ii2 = cutHalf - flip;

        for (j = 0; j < l2; ++j, ++ii, ++ii2) {
            cost = (ch === s2[j] ? 0 : (chl === s2[j].toLowerCase()) ? cri : cr);
            buf[ii + 1] = Math.min(buf[ii2 + 1] + cd, buf[ii] + ci, buf[ii2] + cost);
        }
    }
    return buf[l2 + cutHalf - flip];
}

const css_block =`
/* Кнопка, используемая для открытия формы чата - закреплена в нижней части страницы */
.open-button {
  background-color: #555;
  color: white;
  padding: 16px 20px;
  border: none;
  cursor: pointer;
  opacity: 0.8;
  position: fixed;
  bottom: 23px;
  right: 28px;
  width: 280px;
}
`;

var DocStile = create( "style",{type: "text/css"},css_block);

document.getElementsByTagName('head')[0].appendChild(DocStile);

        var userlist = new Map();

        var ignorelist = new Array(); // '','',0,0,0

        var nickname = document.getElementsByClassName('app-text-overflow')[0].innerHTML;

        if (typeof nickname === 'undefined') { nickname = "" };

        const ignore_nick_100d = 0;
        const ignore_login_100d = 1;
        const ignore_both_100d = 2;
        const ignore_nick_temp_1d = 3;
        const ignore_both_1d = 4;

        let e_app_nickname = document.getElementsByClassName("app-nickanme")[0];
        var author_id = '';                                              // id
        var author_nick = e_app_nickname.innerHTML;                      // nick
        var author_login = e_app_nickname.href.replace(/.*\/user\//,''); // login

        //console.log(author_nick + '|' + author_login + '|' + nickname); // на данной стадии не пишет в консоль !

function SaveData() {
                    // [0] nick [1] login [2] instruction [3] ignore time offset [4] modification time [5] counter [6] comment [7] country
                    // [2] instruction: 0: блокировать по нику; 1: блокировать по логину; 2: блокировать по логину и нику;
                    // [2] instruction: 3: - бан на день нику для временных ников;
                    // [2] instruction: 4: - бан на день по логину и нику;
                    // [2] instruction: 5: - бан навсегда по логину и нику;
                    //const ignore_nick_100d = 0;
                    //const ignore_login_100d = 1;
                    //const ignore_both_100d = 2;
                    //const ignore_nick_temp_1d = 3;
                    //const ignore_both_1d = 4;
    let now = new Date();
    let ticks = now.getTime();
    let ignorelist_loaded = new Array();
    let ignorelist_temp = new Array();
    let array1 = new Array();
    let array2 = new Array();

    if(typeof(localStorage) != 'undefined' ) {
        if(window.localStorage.getItem('ignorelist')){
                ignorelist_loaded = JSON.parse(window.localStorage.getItem('ignorelist'));
            }
    }
//console.log(ignorelist_loaded);
//console.log(ignorelist);

    if (ignorelist_loaded.length > ignorelist.length) {
		array1 = ignorelist_loaded.slice(0);
		array2 = ignorelist.slice(0);
        console.log("ignorelist_loaded.length:" + ignorelist_loaded.length + " + " + "ignorelist.length:" + ignorelist.length)
	} else {
		array1 = ignorelist.slice(0);
		array2 = ignorelist_loaded.slice(0);
        console.log("ignorelist.length:" + ignorelist.length + " + " + "ignorelist_loaded.length:" + ignorelist_loaded.length)
	}

    if (ignorelist_loaded !== 'undefined' || ignorelist_loaded.length > 0) {
    let exists = false;

    for(var i = 0; i < array1.length; i++) {
        exists = false;

        for(var c = 0; c < array2.length; c++) {
            if (array1[i] !== null && array2[c] !== null && array1[i] !== undefined && array2[c] !== undefined) {
                if (array1[i][1] == array2[c][1] && array1[i][0] == array2[c][0]){
                    exists = true;
                    break;
                }
            }
        }

        if (exists == true) {
//            console.log("exists = true;" + array1[i][1] + "|" + array2[c][1]);
            if (array1[i] !== null && array2[c] !== null &&
                array1[i] !== undefined && array2[c] !== undefined &&
                array1[i] != '' && array2[c] != '') {
//                console.log("array1[i][4]:" + array1[i][4]);
//                console.log("array2[c]:" + array2[c]);
//                console.log("array2[c][4]:" + typeof array2[c][4]);
                    //const ignore_nick_100d = 0;
                    //const ignore_login_100d = 1;
                    //const ignore_both_100d = 2;
                    //const ignore_nick_temp_1d = 3;
                    //const ignore_both_1d = 4;
                if (array1[i][4] < array2[c][4]) { // 86400000
                    if ( (((ticks - array2[c][3]) > 1 * 24 * 3600000) && (array2[c][2] == ignore_nick_temp_1d ||
                                                                array2[c][2] == ignore_both_1d) )
                        ||
                       (((ticks - array2[c][3]) > 100 * 24 * 3600000) && (array2[c][2] == ignore_nick_100d ||
                                                                array2[c][2] == ignore_login_100d ||
                                                                array2[c][2] == ignore_both_100d)) ) {
                        console.log("%cantyviblyadok(" + ((now.getHours() < 10 && now.getHours() >= 0) ? "0" + now.getHours() : "") +
                                    ":" + ((now.getMinutes() < 10 && now.getMinutes() >= 0) ? "0" + now.getMinutes() : "") + "): " +
                                    "nick:" + array2[c][0] + "|login:" + array2[c][1] +
                                    "|removed from ignorelist by timeoffset > " +
                                    ((array2[c][2] == ignore_nick_temp_1d) ? "ignore_nick_temp_1d" : "") +
                                    ((array2[c][2] == ignore_both_1d) ? "ignore_both_1d" : "") +
                                    ((array2[c][2] == ignore_nick_100d) ? "ignore_nick_100d" : "") +
                                    ((array2[c][2] == ignore_login_100d) ? "ignore_login_100d" : "") +
                                    ((array2[c][2] == ignore_both_100d) ? "ignore_both_100d" : ""),
                                    'background: LemonChiffon; color: red');
                    } else { ignorelist_temp.push(array2[c]) }
                } else {
                    if ( (((ticks - array1[i][3]) > 1 * 24 * 3600000) && (array1[i][2] == ignore_nick_temp_1d ||
                                                                array1[i][2] == ignore_both_1d) )
                        ||
                       (((ticks - array1[i][3]) > 100 * 24 * 3600000) && (array1[i][2] == ignore_nick_100d ||
                                                                array1[i][2] == ignore_login_100d ||
                                                                array1[i][2] == ignore_both_100d)) ) {

                        console.log("%cantyviblyadok(" + ((now.getHours() < 10 && now.getHours() >= 0) ? "0" + now.getHours() : "") +
                                    ":" + ((now.getMinutes() < 10 && now.getMinutes() >= 0) ? "0" + now.getMinutes() : "") + "): " +
                                    "nick:" + array1[i][0] + "|login:" + array1[i][1] +
                                    "|removed from ignorelist by timeoffset > " +
                                    ((array1[i][2] == ignore_nick_temp_1d) ? "ignore_nick_temp_1d" : "") +
                                    ((array1[i][2] == ignore_both_1d) ? "ignore_both_1d" : "") +
                                    ((array1[i][2] == ignore_nick_100d) ? "ignore_nick_100d" : "") +
                                    ((array1[i][2] == ignore_login_100d) ? "ignore_login_100d" : "") +
                                    ((array1[i][2] == ignore_both_100d) ? "ignore_both_100d" : ""),
                                    'background: LemonChiffon; color: red');
                    } else { ignorelist_temp.push(array1[i]) }
                }
            }
        } else {
//                    console.log("===");
//                    console.log(array1[i]);
//                    console.log(array2[c]);
            if (array1[i] !== null && array1[i] !== undefined && array1[i] != '') {
//                    console.log("===array1[i]");
//                    console.log(array1[i]);
//                    console.log(array2[c]);
            ignorelist_temp.push(array1[i]);
//                console.log(array1[i]);
//                console.log("array1 - i:" + i);
//                console.log("array2 - c:" + c);
            }
            if (array2[c] !== null && array2[c] !== undefined && array2[c] != '') {
//                console.log("===array2[c]");
//                console.log("array1 - i:" + i);
//                console.log("array2 - c:" + c);
            ignorelist_temp.push(array2[c]);
//                console.log(array2[c]);
            }
        }
        console.log(array1[i][1] + "|" + typeof array1[i][1]);
    }
    } else (ignorelist_temp = ignorelist.slice(0))

console.log("Func SaveData:");
console.log(ignorelist_temp);
      if((typeof(localStorage) != 'undefined') && (ignorelist.length > 0)) { localStorage.setItem('ignorelist', JSON.stringify(ignorelist_temp)) }
}

//var MsgClickFunc = function MsgClick(e) {
function MsgClick(e) {
    var element = e.parentElement;
    var ServiceTag = e.parentElement.getElementsByClassName("service-tag")[0];
    var TextBody = e.parentElement.getElementsByClassName("text-body")[0];

    if (typeof TextBody !== 'undefined') {
        e.parentElement.innerHTML = '<div class="text service-tag" style="display: auto" ondblclick=MsgClick(this);>' +
        ServiceTag.innerHTML + '</div> ' + TextBody.innerHTML;
        TextBody.remove;
    } else {
        let service_tag_html = '<div class="text service-tag" style="display: auto" ondblclick=MsgClick(this);>' +
        ServiceTag.innerHTML + '</div>';
        let text_body_html = e.parentElement.innerHTML.replace(ServiceTag.outerHTML,'');
        e.parentElement.innerHTML = service_tag_html + '<div class="text text-body" style="display: none">' + text_body_html + '</div>';
    }
}

//var AddToIgnoreListFunc = function AddToIgnoreList(e) {
function AddToIgnoreList(e) {
    var element = e.parentElement.parentElement;
    var id = element.getAttribute('data-id');                          // id
    var nn = $(element).find("div.nick").find("span.nick-to").html();  // nick from tag
    var exists = false;
    var userdata = new Array("","","",false);

    console.log('Nick from tag:' + nn);
    console.log(id); // для только что забаненных в чате, проверить ещё это
    console.log(userlist); // для только что забаненных в чате, проверить ещё это
    if (id === null) { return } // для только что забаненных в чате, проверить ещё это

        userdata = userlist.get(id);
//        console.log(userdata);
        if (typeof userdata != 'undefined') {
            var n = userdata[0];
            var login = userdata[1];

            if (userdata[2] == 'автор') {
                alert('Нельзя добавить в игнор автора!');
                return;
            }
            if (typeof userdata[3] == true || n == nickname) {
                alert('Нельзя добавить в игнор себя!');
                return;
            }

        let mode = -1;
        let comment = "ui";
        if (login == '' && n != '' && confirm("Добавить в игнор временный профиль \"" + n + "\"?")) { mode = ignore_nick_temp_1d }
        if (login != '' && n != '') {
            if (confirm("Добавить в игнор \"" + n + "\" по логину ?")) { mode = ignore_login_100d }
            if (n != "Поменяйтe ник" && confirm("Добавить в игнор \"" + n + "\" по никнейму + логину ?")) { mode = ignore_both_100d }
            if (mode != -1) { comment = prompt("Комментарий:","ui") }
            if (comment == null) { mode = -1 }
        }

        if (mode != -1) {
                    for(let i = 0; i < ignorelist.length; i++) {
                    // [0] nick [1] login [2] instruction [3] ignore time offset [4] modification time [5] counter [6] comment [7] country
                    // [2] instruction: 0: блокировать по нику; 1: блокировать по логину; 2: блокировать по логину и нику;
                    // [2] instruction: 3: - бан на день нику для временных ников;
                    // [2] instruction: 4: - бан на день по логину и нику;
                    // [2] instruction: 5: - бан навсегда по логину и нику;
                    //const ignore_nick_100d = 0;
                    //const ignore_login_100d = 1;
                    //const ignore_both_100d = 2;
                    //const ignore_nick_temp_1d = 3;
                    //const ignore_both_1d = 4;

                        if (ignorelist[i] !== null) {
                            if ((ignorelist[i][0] == n && ignorelist[i][1] == login) ||
                                 (ignorelist[i][0] == n && ignorelist[i][1] == '')) { exists = true }
                        }
                    }

                    if (exists == false) {
                        var date = new Date();

                        if (login == '' && n != '') {
                            ignorelist.push([n,login,mode,date.getTime(),date.getTime(),0,comment,''])
                            console.log("added to ignore using button: " + n + "|" + login + ": на 1 день по нику для временного профиля");
                            //console.log(ignorelist);
                            SaveData();
                        }
                        if (login != '' && n != '') {
                            ignorelist.push([n,login,mode,date.getTime(),date.getTime(),0,comment,''])
                            console.log("added to ignore using button: " + n + "|" + login + ": на 100 дней по логину");
                            //console.log(ignorelist);
                            SaveData();
                        }
                    }

        element.remove();
        }
    }
}

exportFunction(AddToIgnoreList, unsafeWindow, { defineAs: "AddToIgnoreList" });
exportFunction(MsgClick, unsafeWindow, { defineAs: "MsgClick" });

//let JS = create("script",{type: "text/javascript"},MsgClickFunc.toString());
//let JS1 = create("script",{type: "text/javascript"},AddToIgnoreListFunc.toString());

//document.getElementsByTagName('head')[0].appendChild(JS);
//document.getElementsByTagName('head')[0].appendChild(JS1);
/*
Событие storage
Если у вас есть потребность, или желание прослушивать изменение в localStorage, то можно просто добавить слушатель событий на 'storage':

window.addEventListener('storage', (event) => console.log(event));
*/

window.addEventListener('beforeunload', function(event) {
                    // [0] nick [1] login [2] instruction [3] ignore time offset [4] modification time [5] counter [6] comment [7] country
                    // [2] instruction: 0: блокировать по нику; 1: блокировать по логину; 2: блокировать по логину и нику;
                    // [2] instruction: 3: - бан на день нику для временных ников;
                    // [2] instruction: 4: - бан на день по логину и нику;
                    // [2] instruction: 5: - бан навсегда по логину и нику;


//    var now = new Date();
//    var ticks = now.getTime();
//new Date(ignorelist[i][3]).getTime();
//|| ignorelist_loaded[i][2] == 3 ||
//                    if (ticks - ignorelist_loaded[i][3] < 86400000) { ignorelist_temp.push(ignorelist[i]); }
//                        if (ignorelist_loaded[i][0] == ignorelist[c][0] || ignorelist_loaded[i][2] == 3 || ignorelist[c][1] == '') {
//                if (ticks - ignorelist_loaded[i][2] < 86400000) { ignorelist_temp.push(ignorelist[i]); }

//      if((typeof(localStorage) != 'undefined') && (ignorelist_temp.length > 0)) { localStorage.setItem('ignorelist', JSON.stringify(ignorelist_temp)) }

      //event.preventDefault();
      //event.returnValue = true;

//      if((typeof(localStorage) != 'undefined') && (ignorelist.length > 0)) { localStorage.setItem('ignorelist', JSON.stringify(ignorelist)) }
      //event.preventDefault();
      //event.returnValue = true;
});

(function () {
    'use strict';

    var w = window.unsafeWindow || window;

    if (w.self != w.top) {
        return;
    }
/*
    if (/http:\/\/userscripts.org/.test(w.location.href)) {
        //Ниже идёт непосредственно код скрипта
        alert("Userscripts приветствует вас навязчивым окном.");
    }
*/
    function getHostName(url) {
        var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
        if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
            return match[2];
        } else {
            return null;
        }


    }

$(document).ready(function () {
    function Antiviblyadok() {
        this.version = localStorage.getItem('tr-ver') != undefined ? localStorage.getItem('tr-ver') : "0.0.3";

        if(typeof(localStorage) != 'undefined' ) {
            if(window.localStorage.getItem('ignorelist')){
                ignorelist = JSON.parse(window.localStorage.getItem('ignorelist'));
            }
        }
    }

    Antiviblyadok.prototype.run = function () {

        var waitPanel = setInterval(function () {
            if ($(".stream-starter").length) {
                if ($(".video-output-container").length) {
                    clearInterval(waitPanel);
                } else {
                    return true;
                }
            }
            if ($("i.em-smiley").length) {
                clearInterval(waitPanel);
            }
        }, 1000);
    };

    Antiviblyadok.prototype.chat = function () {
        function repl(str, f, r) {
            var regex = new RegExp(f, "g");
            var l = str.replace(regex, r);
            return l.split("*").join("");
        }

        function escapeRegExp(string){
            return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        }

/*
const textArea = document.getElementById('my_text_area');
textArea.addEventListener('input', () => {
    var textLn =  textArea.value.length;
    if(textLn >= 100) {
        textArea.style.fontSize = '10pt';
    }
})
*/

        function autocorrect (s,anticaps,auto_dot) {
            if (typeof s === 'string' && typeof anticaps === 'boolean' &&  typeof auto_dot === 'boolean' ) {
                const autocorrect_enabled = true; if (autocorrect_enabled == false) { return }

                s = s.replace(/наврен/gi,'наверн',);
                s = s.replace(/чтоли/gi,'что ли',);
                s = s.replace(/врядли/gi,'вряд ли',);

                var arrayOfStrings = s.split(/(#[^#:]+:|:[^:]+:|\. |\!|\?|\)|\()/); // Делим на предложения, ники, смайлы
                //console.log(arrayOfStrings);
			    for(var c = 0; c < arrayOfStrings.length; c++){

                let match_value = arrayOfStrings[c].match(/[^<>/\d\[\]\s:,;\.\-\!\?]+/);
                    //console.log(match_value);
                    if (match_value !== null) { // Делаем первую букву заглавной
                       if (match_value[0] == '') { return s }
                       let str = match_value[0];
                        //console.log(arrayOfStrings[c] + "|" + /:[^:]+:/.test(arrayOfStrings[c]));
                        if (/:[^:]+:|#[^#:]+:/.test(arrayOfStrings[c]) == false) {
                            if (anticaps == true) {
                                arrayOfStrings[c] = arrayOfStrings[c].toLowerCase(); // Полный антикапс
                                str = str.toLowerCase();
                            }
                            //console.log(arrayOfStrings[c]);

                            str = str.replace(str[0], str[0].toUpperCase());
                            //console.log(str);
                            arrayOfStrings[c] = arrayOfStrings[c].replace(str.toLowerCase(),str);
                        }
                    }
			    }
                //console.log(arrayOfStrings);
                let result = arrayOfStrings.join(''); // Соединяем обратно

                //console.log(result);
                if (auto_dot == true) {
                    //console.log(result);
                    //console.log(result.replace(/(.*[^<>\.\(\)\!\?\:\[\]]+)(\[\[\d+\]\])?$/,'$1.$2'));
                    //console.log(result.match(/(.*[^<>\.\(\)\!\?\:\[\]]+)(\[\[\d+\]\])?$/));
                    //console.log(result.search(/.*\[\[\d+\]\]$/));
                    if (result.search(/.*\[\[\d+\]\]$/) == -1) { // твик из-за старого кода в antiCapsMat
                        return result.replace(/(.*[^<>\.\(\)\!\?:\s\+]+)$/,'$1.'); // Подстановка точки в конце
                    } else { return result } // твик из-за старого кода
                } else {
                    return result; //.replace(/\s+$/)
                }

            } else { return undefined }
        }

        var url = window.location.href;
/*
        if ( url.indexOf('https://livacha.com/post/') != -1 ) {

            var waitPanel = setInterval(function () {

                if ($("ul.pagination").length) {

                    clearInterval(waitPanel);

                    let comments = document.querySelector('.app-comments-out').children;
                    //alert(typeof comments);
                    if (comments) {
                        for (var g of comments) {
                            let nickname = $(g).find("a.app-nickanme");
                            console.log(typeof nickname);
                            if ($(nickname).html() !== undefined ) {
                                var n = $(nickname).html();
                                var l = $(nickname).attr('href').replace(/\/user\//,'');
                                var t = $(g).find("div.text").html().replace(/^\s+/,'').replace(/\s+$/,'');

                                for(let i = 0; i < ignorelist_nick.length; i++){

                                    if(ignorelist_nick[i] == n) {
                                        g.remove();
                                    }
                                }
                            }
                        }
                    };
                }
            }, 10);
        }
*/

        if ( url.indexOf('https://livacha.com/post/') != -1 ) {

            var waitPanel = setInterval(function () {

                if ($("ul.pagination").length) {

                    clearInterval(waitPanel);

                    let comments = document.querySelector('.app-comments-out').children;
                    //alert(typeof comments);
                    if (comments) {
                        for (var g of comments) {
                            let nickname = $(g).find("a.app-nickanme");
                            console.log(typeof nickname);

                    $("div.app-comments-out").bind('DOMNodeInserted', function (e) {
                        var waitPanel1 = setInterval(function () {

                        if ($("ul.pagination").length) {
                            clearInterval(waitPanel1);
                            let comments = document.querySelector('.app-comments-out').children;
                        if (comments) {
                        for (var g of comments) {
                            let nickname = $(g).find("a.app-nickanme");
                            console.log(typeof nickname);
                        }
                        }
/*                                var n = $(nickname).html();
                                var l = $(nickname).attr('href').replace(/\/user\//,'');
                                var t = $(g).find("div.text").html().replace(/^\s+/,'').replace(/\s+$/,'');
                                console.log(n); console.log(l); console.log(t);
*/
                        }
                    }, 10);
                    })
                            if ($(nickname).html() !== undefined ) {
                                var n = $(nickname).html();
                                var l = $(nickname).attr('href').replace(/\/user\//,'');
                                var t = $(g).find("div.text").html().replace(/^\s+/,'').replace(/\s+$/,'');

                                for(let i = 0; i < ignorelist_nick.length; i++){

                                    if(ignorelist_nick[i] == n) {
                                        g.remove();
                                    }
                                }
                            }
                        }
                    };
                }
            }, 10);
        }

        if ( url.indexOf('https://livacha.com/chat/') != -1 ) {

            document.querySelector("div.textarea-wrapper textarea").addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    var element = e.target;
                    element.value = autocorrect(element.value,true,true);
                    return
                }

            })

            document.querySelector("div.justify-content-between .submit").addEventListener('click', (e) => {
                var element = document.querySelector("div.textarea-wrapper textarea");
                element.value = autocorrect(element.value,true,true);
                return
            })

        }
/*

//       $('.app-form-wrapper .submit').click(function(){
//  var str = "ID:" + $(this).attr('id');
//  var val = $(this).attr('data-param');
//  str = str + " PARAM: " + val;
//  val++;
//  $(this).attr('data-param', val);
//                alert('test');
//        });

        $('div.textarea-wrapper').on('input','textarea',function (e) {
            const autocorrect_enabled = true; if (autocorrect_enabled == false) { return }

            var element = e.target;

            var arrayOfStrings = element.value.split(/(\.|!|\?)/); // Делим на предложения
            //console.log(arrayOfStrings);

			for(var c = 0; c < arrayOfStrings.length; c++){

            let match_value = arrayOfStrings[c].match(/[^<>/\d\[\]\s:,;\.\-\!\?]+/);
                //console.log(match_value);
                if (match_value !== null) { // Делаем первую букву заглавной
                    if (match_value[0] == '') { return }
                    let str = match_value[0];
                    //str = str.toLowerCase(); arrayOfStrings[c] = arrayOfStrings[c].toLowerCase(); // Полный антикапс
                    str = str.replace(str[0], str[0].toUpperCase());
                    //console.log(str);
                    arrayOfStrings[c] = arrayOfStrings[c].replace(str.toLowerCase(),str);
                }
            }
            element.value = arrayOfStrings.join(''); // Соединяем обратно
            //console.log(arrayOfStrings);
        });
*/
/*
        var ignorelist_nick = ['АМанда Иоановна','ВЛАДиМИР Иллюминатов',
            'Sjawa','White_Zombie','Дрочер №1',
            'ЛеНиН ЖиВ','Збройнi Сили Украiни','ДИРИЖАБЛЬ','WESTRUST',
            'Linux','Absolut','Klarissa','` don&amp;#039;t panic..',
            'чепухан','Побочки','&amp;amp;ГосподинСвободныхМыслей',
            'Войнючий Капутин','Тэ...','☜верблюжья лапка',
            'Даздраперма Алоизовна Хёек','Слава Украине','Vit','☼ SerJ ☼',
            'Пушок','Очкастый мачо','antol777','indigosan','fifa4732',
            'antura','Рипа','Владимир','Lucky person','polten',
            'gerrrd944','naganxad','mirevid','ivanovna1985','ஜЛИДИЯஜ',
            'Фриц','ganger','Балумба','Стебан Бендера','вася пряник',
            'fleur','КОНДРАТ','Prisma','Sir','Українська захисниця (93 ОМБР)',
            'фашистская расия алкашей','Кристина','FREEDOM&amp;amp;PEACE','Лапти',
            'Julia','† КАЗЬЁЛЬ †','МЭРЗОСТЬ','tor','Игрок',
            'Черная вагина по-зарински','Ошейник вассала','ТэмП','Антикацапка',
            'Zlobnyi element ❣','Комаров','ОТПЕРДОЛЕННАЯ ПАКСОЙ ДАШКА','RTX',
            'жопоскряб','эхо','Vip','Habit','синяя борода',
            'fradysariel','Bolt','jkguy','FROZMAN','Черничная',
            'Поменяйте ник','шебутной мальчуган','ЗАБАНЕННЫЙ У КАРПА,НА ПОЖИЗНЕННО...',
            'Ярополк','grizli','бункерная вошь','КАЛЯСКА МАХАЧЬ',
            'zoro ','Сергеич','Саша','Penis Ebmundovich','besgmo',
            'covid2021','Collectors everywhere','wafhas','ТРАХНИ ТАФФИ',
            'Смотрящий за путями','фрифе','Блестящий член','kira_556',
            'Tankist228','Dark Reg','и запятая','ᗪIᗩᖇY Oᖴ ᒍᗩᑎE*',
            'kittygalor','РУБИКОН','АНУС','Ouen','УРФИН ДЖЮС',
            'Болт','ПЮЗДУН','Дарья Трепова',
            'командир  x','Бандера','⚡☑ᗫoᏰᏒo✪⚡','⚡☑ᗫoᏰᏒo⚡',
            'ВасилиЙ','Зритель','netzv','Двоешник','Поменяйте ник.',
            'vova','veб66','Слепой Пью','Арчи','Lexus','Максим',
            'цып цып цып','ыть','jghkh','Гаврош','Шамиль(чеченец )',
            'ВЕЛИКАЯ АМЕРИКА','ADIDAS','ВСУ','Руткит',
            'MAXWELL_777','PLATINUMMAX112','Полковник Мамура','Слепой Пью',
            'Nikita HUEEVICH LOH','osa22','boss2003',
            '` dont panic&amp;amp; ..','sofia28','kilovatw','ЯНА ВОЛЬКОВА','прямо_к****',
            'ines96','bond666','✔️Чпок','deep777','Pepe','ДжейКей','Джей Кей','Strong78',
            'Бесперспективняк','Поменяйтe ник','tata666','болек',
            '❣ Zlobnyi element ❣☕','МАСОЛ','Дима Франк',
            'чабан(дмитрий владимирович)','Слепой Пью','PITHECANTHROP','mrdefton',
            'ozone92','Шеф','RadioXoi','СВЯТОЙ   ИОАН','Извинись Дурачок',
            'Олег Бобков (от сына отказался)','AktivniyGomes',
            'Уасилий Синеносов','CЛАВА УКРАИНЕ','stranger','ИКСОНОГ','Alex-England','ZLOVoinie',
            'Иван','Рембо первая бровь','степанычь','Потапич','Белоснежка','Оближи меня',
            'BYДУ','Беркут','Олечка','lenatits','А что если дедушка - законченный муд@к',
            'Гансик','Феодулия','мудачок яйцашлёп клоун ливачи','gva777','Извинись Дурачок',
            'Атрейдес','Овод','мудачок яйцашлёп','elementcrime','xxx5','зНенацька',
            'Минздрав','Бонс','дима','Зарина Вагинова','в Твоём Доме','CS_GO','пан','ana ana',
            'Хрюк','Fejut','ARRUTA','Примат','rokan nonaev','цыганёнок алёша','kylinar','ПУТИН_ХУЙЛО',
            'godar','Nespi','Mariya Pazhitnova','Здрасьте','Kirzenbaum P.','Муди','Jeangrey','Nespi',
            'Zалупочёс','Оближи себя','Шнурок','Архитектор','ученик 1 б класса',
            'laopao','``HooLiGaN ``','немец','АДИСИТ БЕНЯ С ФТОРЧЕРМЕТА','zzvvzz','ivan jones',
            'magik_cаn','ТРЕВОЖНО','Ватное болото','gfgf300','чаkи','Без ника','ЙыЙ',
            'easy_peasy_lemon_squeezy','Кондратьев','протри монитор','Ммм ','УКРАИНА СИЛА',
            'dfgfdgdfgdfg','пишу...','Гугол','Ммм','andrei','Ядерный муровей','Alоx-pEngland',
            'gkblijhk'];
            //'⚡Эстонец⚡️' 'Надежда Осипова' 'Harter'
*/
        var ignorelist_nick = [];
            //'⚡Эстонец⚡️'
        //var ignorelist_login = ['morf1','Zdraste','pupkinzzzzz','116500','zgaz'];
/*==================================================================================*/
        function antiCapsMat(m) {
            if (m === undefined) {
                return undefined;
            }

            var fm = new Array('',m.toLowerCase());

            m = m.replace(/^.*<img.*Li0qwg66tYTFsL.gif.*/, "🐖");
            m = m.replace(/^.*<img.*126179.*/, "🐖"); // хохлы
            m = m.replace(/^.*<img.*182113.*/, "🐖"); // хохлы
            m = m.replace(/^.*<img.*126716.*/, "🐖"); // хохлы
            m = m.replace(/^.*<img.*195552.*/, "🐖"); // хохлы
            m = m.replace(/^.*<img.*195312.*/, "🐖"); // хохлы
            m = m.replace(/^.*<img.*126359.*/, "🐖"); // хохлы
            m = m.replace(/^.*<img.*195881.*/, "🐖"); // хохлы
            m = m.replace(/^.*<img.*126582.*/, "🐖"); // хохлы
            m = m.replace(/^.*<img.*126574.*/, "🐖"); // хохлы
            m = m.replace(/^.*<img.*126458.*/, "🐖"); // хохлы
            m = m.replace(/^.*<img.*126454.*/, "🐖"); // хохлы
            m = m.replace(/^.*<img.*126362.*/, "🐖"); // хохлы
            m = m.replace(/^.*<img.*126357.*/, "🐖"); // хохлы
            m = m.replace(/^.*<img.*126359.*/, "🐖"); // хохлы
            m = m.replace(/^.*<img.*223972.*/, "🐖"); // хохлы
            m = m.replace(/^.*<img.*195311.*/, "🐖"); // хохлы
            m = m.replace(/^.*<img.*126173.*/, "🐖"); // бриташка
            m = m.replace(/^.*<img.*126401.*/, "🐖"); // бриташка
            m = m.replace(/^.*<img.*126171.*/, "🐖"); // пиндошка

            m = m.replace(/^.*<img.*Ei_aaBHZgb9tueQMUzemVxdDvDh38zvhtt5OsW2US4l.*/, "🤮"); // мерзость
            m = m.replace(/^.*<img.*HQrqpmNxtC6HsUorlq5TaeUC2l8N8HoMcuZiJOu9.*/, "🤮"); // мерзость

            // не учитываем символы в никах:
            let no_span_tag = m.replace(/<span[^<>]+>[^<>]+<\/span>/i,''); let tm;
            tm = no_span_tag.replace(/^.*🇺🇦.*/, "🐖"); if (tm != no_span_tag) { m = tm }
            tm = no_span_tag.replace(/^.*🇬🇧.*/, "🐖"); if (tm != no_span_tag) { m = tm }
            tm = no_span_tag.replace(/^.*🇺🇸.*/, "🐖"); if (tm != no_span_tag) { m = tm }
            tm = no_span_tag.replace(/.*(і|ї).*/, "🐖"); if (tm != no_span_tag) { m = tm }

//🐷🐖🐔🐓🐗🪓🔪
//:134477: - антинацист
//:210718: - свинка
//:138095: - ссуший
            var dict = {
/*=================================================================*/
                '.*славв?а (геро|укр|банде|зсу|наци|америк|брита|нато).*': '🐷',
                '.*( |^)ват(н|а).*': '🐷',
                '.*( |^)рас?шк.*': '🐷',
                '.*р(а|о)с{1,2}ея(нец|нц|\s|$|нск|нин).*': '🐷',
                '.*расс?(и|е)(йск|я(\s|$)|янц|и|е).*': '🐷',
                '.*св(и|е)н[о]?[c]?р(у|ю)(с|з){1,2}.*': '🐷',
                '.*ср(у|ю)(с|з){1,2}к.*': '🐷',
                '.*р(у|ю)(с|з){1,2}к.{1,2} ((свино)?фаш|свин|пид).*': '🐷',
                '.*путин( хуйло| убийца| пид(а|о)р|ист|изм|ойд|оид|ск\W+ мраз).*': '🐷',
                '.*преступн.* путинск.* власт.*': '🐷',
                '.*мелкоботексн.*': '🐷',
                '.*путл(ер|ло).*': '🐷',
                '.*хуйло (международный )?преступник.*': '🐷',
                '.*бункерн.*': '🐷',
                '.*хутин пуйло.*': '🐷',
                '.*( |^)пыня.*': '🐷',
                '.*пид(а|о)рус.*': '🐷',
                '.*кацап.* фаш.*': '🐷',
                '.*свино(лапт|больн).*': '🐷',
                '.*лапотн.*': '🐷',
                '.*параш.* раб.*': '🐷',
                '.*быдловата.*': '🐷',
                '.*р(у|ю)(с|з){1,2}ь?к(е|ие).*': '🐷',
                '.*русо ?(пидор|чмо|свин).*': '🐷',
                '.*р(у|ю)(с|з){1,2}иш.*': '🐷',
                '.*р(у|ю)(с|з){1,2}к(ей|ая|ий|ое) (свинья|хуесос|чмо).*': '🐷',
                '.*р(у|ю)(с|з){1,2}сиян.*': '🐷',
                '.*сдохни р(а|о)с{1,2}ия.*': '🐷',
                '.*ра(си|ис)я.*': '🐷',
                '.*( |^)на рас{1,2}(и|е){1,2}.*': '🐷',
                '.*[c]?дохни\W{1,3} р(у|ю)(с|з){1,2}к.*': '🐷',
                '.*раши(ст|зм).*': '🐷',
                '.*пид(а|о)рашк.*': '🐷',
                '.*ватан.*': '🐷',
                '.*срасеи.*': '🐷',
                '.*кацап.*': '🐷',
                '.*рузг\W.*': '🐷',
                '.*р(у|ю)(с|з){1,2}к\\S{1,5} алкаш.*': '🐷',
                '.*это мусарской сайт.*': '🐷',
                '.*(д(а|о)мби) ?(б(а|о)мбас)?.*': '🐷',
                '.*русс?к\W+ (свин\W+|пидарас\W+|пидор\W+).*': '🐷',
                '.*скреп(оно|н).*': '🐷',
                '.*ебу р(у|ю)(с|з){1,2}к.*': '🐷',
                '.*я уничтожу каждую мразь.*': '🐷',
                '.*каждая трансляция записывается.*': '🐷',
                '.*мус(а|о)рско.? сай.*': '🐷',
                '.*чмо( ебаное)? р(у|ю)(с|з){1,2}к.*': '🐷',
                '.*поджигайте расию.*': '🐷',
                '.*крепостн.*': '🐷',
                '.*я найду каждое место где ты.*': '🐷',
                '.*я тебя лично найду.*': '🐷',
                '.*скрепоноzн.*': '🐷',
                '.*раис(и|я).*': '🐷',
/*=================================================================*/
                '.*выпьем.*': '🥛',
                '.*пойду выпью.*': '🥛',
                '.*пивка выпьем.*': '🥛',
                '.*пивк?(о|у|а).*': '🥛',
                '.*по пивку.*': '🥛',
                '.*водо(чк|вк)..*': '🥛',
                '.*водк(а|о|у|е).*': '🥛',
                '.*водяр(а|о|у|е).*': '🥛',
/*=================================================================*/
                '.*(мать|мамку) (ипу|еб.+)? (св|тв)о(ю|я).*': '😫',
                '.*(тво|сво)\W{1,2} (мам\W|мат\W|бат\W).*': '😫',
/*=================================================================*/
//                '.*(с|з|по)(дохн|дыха).*': '😭',
                '.*(с|з|по)(дохни|дыхай).*': '😭',
                '.*умри.*': '😭',
                '.*труп.*': '😭',
/*=================================================================*/
                 '.*б(о|а)?мж.*': '🤮',
                 '.*теплотрас.*': '🤮',
                 '.*мил(о|а)стын.*': '🤮',
/*=================================================================*/
                 '.*на зон(у|а|ы|е).*': '🐓',
                 '.*тюрьм.*': '🐓',
                 '.*как в хату входить.*': '🐓',
                 '.*зону топтал.*': '🐓',
/*=================================================================*/
                 '.*пр(а|о)коп.*': '🤡',
                 '.*юрпоп.*': '🤡',
                 '.*яйц(а|е)шлёп.*': '🤡'
            };

            m = $("<tag>" + m + "</tag>");

            var i = 0;
            var o = [];
            $(m).find("img,span,div,a").map(function (i, h) {
                o[i] = $(h);
                $(h).after('[[' + i + ']]').detach();
                i++
            })

                m = $(m).html().toLowerCase(); // Перевод в нижний регистр.

                for (var key in dict) { // Проверка на список нехороших слов
                    var reg = new RegExp(key,'i');
                    if (m.search(key) != -1) { // тег для показа скрытого сообщения
                        m = '<div class="text service-tag" style="display: auto;" ondblclick=MsgClick(this);>'
                            + dict[key] + '</div><div class="text text-body" style="display: none">' + m + '</div>';
                        break;
                    }
                };

            m = autocorrect(m,true,true); // Исправление на первую заглавную и добавление точки в конце

            o.map(function (h, i) {
                m = m.split("[[" + i + "]]").join(h[0].outerHTML);
            });

            fm[0] = m;
            return fm;
        }

        var SpamArray = new Array();

        function antiSpam(nickname,login,m) {
            if (nickname === undefined || login === undefined || m === undefined) {
                return undefined;
            }

			var tickcount = new Date().getTime();

            const flood_reset_time = 30000;
            const flood_threshold = 2;
            const hard_flood_threshold = 5;

            var ResultArray = new Array();
            var result = new Array();

            var nick_to_tags = m.match(/<span[^<>]+>[^<>]+<\/span>/g);
            var nick_to_tag_data;
            var span_tags_inner = '';

            if (nick_to_tags != null) {
                for(let c = 0; c < nick_to_tags.length; c++){
                    nick_to_tag_data = nick_to_tags[c].match(/<span[^<>]+>([^<>]+)<\/span>/);
                    if (nick_to_tag_data != null) { span_tags_inner += nick_to_tag_data[1] }
                }
            }
//            console.log(span_tags_inner);
//            var shortstr = m.replace(/[\s.']+/g,"").replace(/<[^<>]+>/g,"").replace(/[^\W\w]+/g,"").toLowerCase();
//                shortstr = shortstr.replace(/<[^<>]+>/g,"").replace(/[^\W\w]+/g,"").toLowerCase();
            var shortstr = m.replace(/[\s.,.:;-]+/g,"").replace(/<span[^<>]+>[^<>]+<\/[^<>]+>/g,"");

            var imgtag = m.match(/<img src="[^<>]+\/([\w.]+)">/g);
                shortstr = shortstr.replace(/<[^<>]+>/g,"").toLowerCase();

            var img_tags_str = '';

            if (imgtag != null) {
                for(let c = 0; c < imgtag.length; c++){
                    var imgtag1 = imgtag[c].match(/smile_([^<>\/"']+)\.gif/);
                    var imgtag2 = imgtag[c].match(/smiles.su\/\w\/([0-9]+)/);
                    //console.log(imgtag1);
                    if (imgtag1 != null) { img_tags_str += imgtag1[1] }
                    if (imgtag2 != null) { img_tags_str += imgtag2[1] }
                }
            }

            var len = 0;

            if (shortstr != '' || img_tags_str != '' || span_tags_inner != '') {
                if (shortstr.length > 40) {
                    len = (Math.round(Math.round(shortstr.length / 20) * 15));
                } else if (shortstr.length > 10) {
					len = (Math.round(Math.round(shortstr.length / 7) * 5));
                } else {
                    len = shortstr.length;
                }

                shortstr = img_tags_str + span_tags_inner.replace(/\s+/,'') + shortstr.substr(0,len);

                shortstr = shortstr.toLowerCase();

//                console.log("(" + shortstr + "):" + shortstr.length + " ↓");
//                console.log(SpamArray);
				var exists = false;
//console.log(nickname + "|" + login);
					for(var c = SpamArray.length - 1; c >= 0; c--){
						if ((SpamArray[c][0] == shortstr) && (SpamArray[c][1] == nickname)){
							if ((tickcount - SpamArray[c][3]) >= flood_reset_time) {
                                SpamArray[c][3] = tickcount;
                                SpamArray[c][4] = 1;
                            } else {
                                SpamArray[c][3] = tickcount;
                                SpamArray[c][4]++;
                            }
//                            console.log("Diff(" + (tickcount - SpamArray[c][3]) + ")");
                            if (SpamArray[c][4] >= flood_threshold) {
								exists = true;

                                if (SpamArray[c][4] >= hard_flood_threshold) {
                                    for(let i = 0; i < SpamArray.length; i++){
                                        if (SpamArray[i][0] == shortstr && SpamArray[i][4] >= flood_threshold) {
                                            SpamArray[c][3] = tickcount;
                                            SpamArray[i][4]++;
                                            ResultArray.push([shortstr,SpamArray[i][1],SpamArray[i][2]]);
                                        }
                                    }
                                } else { ResultArray.push([shortstr,SpamArray[c][1],SpamArray[c][2]]) }

								break;
                            }
						}
					}

					if (exists) {
                        // [0] - spam count ; array of ([1][0] - nickname ; [1][1] - login ; [1][2] - SpamMatch);
                        let arr = '';
                        result = [SpamArray[c][4],ResultArray];
                        for(let i = 0; i < ResultArray.length; i++){
                            arr += "[" + ResultArray[i][0] + "|" + ResultArray[i][1] + "]";
                        }
                        console.log("SpamMatch:" + arr); //SpamArray[c][0]
					} else {
						SpamArray.push([shortstr,nickname,login,tickcount,1]);
//                        console.log(shortstr,nickname,login,tickcount,1);
                    }
             }

            if (SpamArray.length >= 500) {
                console.log('SpamArray array length:' + SpamArray.length);
                console.log(SpamArray);
                SpamArray = SpamArray.slice(200,SpamArray.length - 1);
                console.log('userlist array spliced, lenght:' + SpamArray.length);
                console.log(SpamArray);
            }

             return result;
        }

/*==================================================================================*/
        $("div.users-list-wrapper").bind('DOMNodeInserted', function (e) {

            var element = e.target;
            var id = $(element).data('id');                 // id
            var n = $(element).find("span.txt").html();     // nick
            var h = $(element).find("a.nick").attr('href'); // login
            var s = $(element).find("span.role").html();    // status
            var c = $(element).attr('class');               // class

            if (typeof h === 'string') { h = h.replace(/\/user\//,"") } else { h = '' };
            if (typeof n === 'string') { n = n.replace(/^\s+/,"").replace(/\s+<.+$/,"") } else { n = '' };

            if (n != '') {
                var userdata = new Array("","","",false);

                userdata[0] = n;
                userdata[1] = h;
                userdata[2] = s;
                if ( c.search("self") != -1 ) { userdata[3] = true } else { userdata[3] = false };

                userlist.set(id,userdata);
                //console.log(userlist);
            }
        });
/*==================================================================================*/

        $("div.users-list-wrapper").bind('DOMNodeRemoved', function (e) {
            var element = e.target;
            var id = $(element).data('id');
            var t = $(element).find("span.txt").html();     // nick
            if (typeof id === 'string') {
                //userlist.delete(id);
                if (userlist.length >= 500) {
                    console.log('userlist array length:' + userlist.length);
                    console.log(userlist);
                    userlist = userlist.slice(300,userlist.length - 1);
                    console.log('userlist array spliced, lenght:' + userlist.length);
                    console.log(userlist);
                }
            }
        });

/*==================================================================================*/

        $("div.app-chat").bind('DOMNodeInserted', function (e) {

            var element = e.target;
            var id = $(element).data('id');                          // id
            var $mms = $(element).find("div.chat-text-content");     // message body backup
            var t = $(element).find("div.chat-text-content").html(); // message body
            var n = $(element).find("span.nick-to").html();          // nick
            var login = '';                                          // login
            var s = false;
            var reg = new RegExp();
            var date = new Date();
            var nick_to_subjects = '';
            var is_temp = false;
            var is_author = false;
            var is_me = false;
            var for_me = false;
            var for_author = false;
            var comment = '';

            var is_ukropitek = false;
            var is_amoral = false;
            var is_spam = false;
            var added_to_ignore = false;

            var is_in_ignorelist = false;
            var message_to_ignored_nick = false;

            const hide_temp_profile = true;
            const hide_in_message = true;
            const hide_ukropitek = true;
            const hide_amoral = false;
            const hide_spam = true;
            const autoban_ukropitek = false;
            const autoban_ukropitek_treshold_msg = 2;
            const autoremove_from_ignorlist = false;
            const autoremove_from_ignorlist_time = 0; // 3 months

            if (t != undefined) {
                var a = t.match(/\*...\*/g);
                if (a != null) {
                    a.forEach(function (a) {
                        t = repl(t, z, l);
                    });
                }

                //$(element).find("app-popova").click();
                $(element).append( "<div class=\"mess-actions\"><button class=\"btn btn-sm btn-secondary\"" +
                                   "data-title=\"Выпилить\" onclick=AddToIgnoreList(this);><i class=\"fa fa-remove btn-saw-out\">" +
                                   "</i></button></div>" );
                if(n == nickname) { is_me = true }

                var userdata = new Array("","","",false);

                userdata = userlist.get(id);

                if (typeof userdata === 'object') {
                    if (userdata[1] == '') { is_temp = true }; login = userdata[1];
                    if (userdata[2] == 'автор') { is_author = true }
                    if (typeof userdata[3] === "boolean") {
                        is_me = userdata[3];
                        if (is_me == true && userdata[0] != nickname) {
                            nickname = userdata[0];
                        }
                    }
                }

                if(n != nickname) { // не обрабатывать сообщения от себя
                    if (typeof userdata === 'object') {
                        //console.log(antiSpam(userdata[0],userdata[1],t));
                        var antiSpamResult = antiSpam(userdata[0],userdata[1],t);
                        if (antiSpamResult[0] > 0) { is_spam = true }
                    }
                    let SpamResult;
                    SpamResult = antiCapsMat(t);
                    t = SpamResult[0]
                    //console.log(SpamResult[1]); // данные сообщения для более глубокого разбора
                }

                //if (typeof userdata === 'object') { is_spam = antiSpam(userdata[0],t) }
                //t = antiCapsMat(t); // обрабатывать сообщения от себя

                $($mms).html(t);

//                if (t.search("🐖") != -1 || t.search("🐷") != -1) { is_ukropitek = true }
                if (t.search("🐖") != -1) { is_ukropitek = true }
                if (t.search("🤮") != -1 || t.search("🤡") != -1 || t.search("🐓") != -1 ||
                   (t.search("😭") != -1 || t.search('😫') != -1  || t.search('🥛') != -1 &&
                    is_me == false)) { is_amoral = true }

                var now = new Date();
                var ticks = now.getTime();
                var date_diff = 0;
                var ignorelist_match = '';

                for(let i = 0; i < ignorelist.length; i++){
                    // [0] nick [1] login [2] instruction [3] ignore time offset [4] modification time [5] counter [6] comment [7] country
                    // [2] instruction: 0: блокировать по нику; 1: блокировать по логину; 2: блокировать по логину и нику;
                    // [2] instruction: 3: - бан на день нику для временных ников;
                    // [2] instruction: 4: - бан на день по логину и нику;
                    // [2] instruction: 5: - бан навсегда по логину и нику;
                    //const ignore_nick_100d = 0;
                    //const ignore_login_100d = 1;
                    //const ignore_both_100d = 2;
                    //const ignore_nick_temp_1d = 3;
                    //const ignore_both_1d = 4;

                if (ignorelist[i] !== null) {
                    date_diff = ticks - new Date(ignorelist[i][3]).getTime();

                       if(is_temp == false && (
                          ((ignorelist[i][2] == ignore_nick_100d || ignorelist[i][2] == ignore_both_100d) &&
                           ignorelist[i][0] == n) ||
                          ((ignorelist[i][2] == ignore_login_100d || ignorelist[i][2] == ignore_both_100d) &&
                           ignorelist[i][1] == login) ))
                          {
                              if (date_diff >= 8640000000 ) // удаление через 100 дней
                              {
                                  ignorelist.splice(i, 1);
                                  is_in_ignorelist = false;
                              } else {
                                  is_in_ignorelist = true;
                                  comment = ignorelist[i][6];
                                  if (ignorelist[i][0] == n) { ignorelist_match = 'nick' }
                                  ignorelist_match += ((ignorelist_match.length > 0) ? "|" : "");
                                  if (ignorelist[i][1] == login) { ignorelist_match += 'login' }
                                  //if (typeof comment == 'string' && comment !== null) { comment = ignorelist[i][6]; console.log (1); console.log(typeof comment )}
                              }

                         } else if (is_temp == true && (ignorelist[i][2] == ignore_nick_temp_1d &&
                                                        ignorelist[i][0] == n)) {
                              if (date_diff >= 86400000 ) // удаление через 1 день
                              {
                                  ignorelist.splice(i, 1); // подумать над delete
                                  is_in_ignorelist = false;
                              } else {
                                  is_in_ignorelist = true;
                                  comment = ignorelist[i][6];
                                  ignorelist_match = 'nick';
                                  //if (typeof comment == 'string' && comment !== null) { comment = ignorelist[i][6]; console.log (2); console.log(typeof comment )}
                              }
                         } else if (ignorelist[i][2] == ignore_both_1d && ignorelist[i][0] == n) {
                              if (date_diff >= 86400000 ) // удаление через 1 день
                              {
                                  ignorelist.splice(i, 1); // подумать над delete
                                  is_in_ignorelist = false;
                              } else {
                                  is_in_ignorelist = true;
                                  comment = ignorelist[i][6];
                                  if (ignorelist[i][0] == n) { ignorelist_match = 'nick' }
                                  ignorelist_match += ((ignorelist_match.length > 0) ? "|" : "");
                                  if (ignorelist[i][1] == login) { ignorelist_match += 'login' }
                                  //if (typeof comment == 'string' && comment !== null) { comment = ignorelist[i][6]; console.log (3); console.log(typeof comment )}
                              }
                         }

                    if (hide_in_message == true && (ignorelist[i][2] == ignore_nick_100d || ignorelist[i][2] == ignore_both_100d ||
                                                    ignorelist[i][2] == ignore_both_1d || ignorelist[i][2] == 5)) {
//                    if (hide_in_message == true) {
                        reg = new RegExp("<span[^<>]+>" +
                        // .replace(/^\s+/,'').replace(/\s+$/,'')
                        escapeRegExp(ignorelist[i][0]) + "</span>",'i'); // понаблюдать за определением кому пишут

                        if (t.search(reg) != -1) { message_to_ignored_nick = true };
                        if (message_to_ignored_nick == true) {
//                            console.log(reg);
//                            console.log(message_to_ignored_nick);
                        }
                    }
                }
                }
//console.log(levenshtein('Hello', 'HelA_1'));
//console.log(ignorelist);

                var nick_to_tags = t.match(/<span[^<>]+>[^<>]+<\/span>/g);
                var nick_to_tag_data = new Array();
                //console.log(nick_to_tags);
                var message_to = new Array();

                if (nick_to_tags != null) {
                    for(let c = 0; c < nick_to_tags.length; c++){
                        nick_to_tag_data = nick_to_tags[c].match(/<span[^<>]+data-client-id="([^<>"]+)">([^<>]+)<\/span>/);
                        if (nick_to_tag_data != null) { message_to.push([nick_to_tag_data[1],nick_to_tag_data[2]]) }
                        else {
                            nick_to_tag_data = nick_to_tags[c].match(/<span[^<>]+(nick-not-found)[^<>]+>([^<>]+)<\/span>/);
                            if (nick_to_tag_data != null) {
                                message_to.push([nick_to_tag_data[1],nick_to_tag_data[2]])
                            }
                        }
                    }
                    //console.log(message_to.join('|'));
                }

                for (let key of userlist.keys()) {
                    let data = new Array("","","",false);
                    data = userlist.get(key);

                    for(let c = 0; c < message_to.length; c++){
                        if (message_to[c][0] == key || message_to[c][0] == "nick-not-found" ) {
                            if (message_to[c][1] == data[0] || message_to[c][1] == "nick-not-found" ) {
                                //console.log(message_to[c][1]+ "," + nickname);
                                nick_to_subjects += "|" + message_to[c][1];
                                if ( message_to[c][1] == nickname ) { for_me = true }

                                if (author_nick == data[0] && author_login == data[1]) {
                                    if ( data[2] == 'автор' || 'смотрящий') { for_author = true }
                                }

                                //console.log(data);
                                //console.log("nick:" + message_to[c][1] + ",login:" + data[1])
                            }
                        }
                    }

                    if (hide_in_message == true && hide_temp_profile == true && data[0] == '') { // !!! проверить это место data[0] ==

                        reg = new RegExp("<span[^<>]+>" + escapeRegExp(data[0]) + "</span>");

                        if (t.search(reg) != -1) {
                            message_to_ignored_nick = true;
                            if (message_to.length < 1) { break }
                        };
                    }
                }

                for(let i = 0; i < ignorelist_nick.length; i++){

                    if (hide_in_message == true) {
                        reg = new RegExp("<span[^<>]+>" +
                        escapeRegExp(ignorelist_nick[i].replace(/^\s+/,'').replace(/\s+$/,'')) + // понаблюдать за определением кому пишут
                        "</span>",'i');
                        if (t.search(reg) != -1) { message_to_ignored_nick = true };
                    }
                    if(ignorelist_nick[i] == n) {
                        is_in_ignorelist = true;
                        ignorelist_match += ((ignorelist_match.length > 0) ? "+ignorelist_nick" : "");
                        comment = "ignorelist_nick";
                    }
                }

                if (is_spam == true && is_ukropitek == true && is_me == false && is_author == false) { // автобан пидоров
                    let exists = false;

                    for(let i = 0; i < ignorelist.length; i++) {
                    // [0] nick [1] login [2] instruction [3] ignore time offset [4] modification time [5] counter [6] comment [7] country
                    // [2] instruction: 0: блокировать по нику; 1: блокировать по логину; 2: блокировать по логину и нику;
                    // [2] instruction: 3: - бан на день нику для временных ников;
                    // [2] instruction: 4: - бан на день по логину и нику;
                    // [2] instruction: 5: - бан навсегда по логину и нику;

                        if (ignorelist[i] !== null) {
                            if (ignorelist[i][1] != '') {
                                if (ignorelist[i][0] == n && ignorelist[i][1] == login) { exists = true }
                            } else {
                                if (ignorelist[i][0] == n &&  ignorelist[i][1] == '') { exists = true }
                            }
                        }
                    }
//console.log(exists);
//console.log("login: " + login);

                    if (exists == false) {
                        ignorelist.push([n,login,ignore_both_1d,date.getTime(),date.getTime(),0,'','']);
                        added_to_ignore == true;
                        console.log("added to ignore: " + n + "|" + login + ": на 1 день по логину и нику");
                        console.log(ignorelist);
                    }
                }

                if(is_in_ignorelist == true || (message_to_ignored_nick == true && for_author == false) || (is_temp == true && hide_temp_profile == true) ||
                   (is_ukropitek == true && hide_ukropitek == true)){
                    if(is_me == false && is_author == false) {
                      element.remove();
                      s = true;
                    }
                }

                if((is_spam == true && is_me == false && hide_spam == true) ||
                   (is_amoral == true && is_me == false && for_author == false && hide_amoral == true)){
                      element.remove();
                }

                if (typeof userdata === 'object') {
                    var color = "";
                    if (s == true) {
                        color = "red";
                    } else if (is_me == true) {
                        color = "green";
                    } else if (for_me == true) {
                        color = "DarkRed";
                    } else if (is_spam == true) {
                        color = "orange";
                    } else if (is_author == true) {
                        color = "purple";
                    } else if (is_ukropitek == true) {
                        color = "Yellow"; //Brown
                    } else if (is_amoral == true) {
                        color = "Grey";
                    } else if (added_to_ignore == true) {
                        color = "Pink";
                    } else {
                        color = "blue";
                    }

                    console.log("%cchat(" + date.getHours() + ":" + date.getMinutes() + "): " + userdata[0] + ":" + userdata[1] + ":" + userdata[2] + ":" + 'ul' + "=" +
                                userlist.size + ":" + 'il' + "=" + ignorelist.length + ":" + "sa=" + SpamArray.length + ":" +
                                (is_temp ? 'is_temp' : '') + ":" + (is_author ? 'is_author' : '') + ":" +
                                (userdata[3] ? 'is_me' : '') + ":" + (for_me ? 'for_me' : '') + ":" +
                                (for_author ? 'for_author' : '') + ":" +
                                (is_spam ? 'is_spam(' + antiSpamResult[0] + ')' : '') + ":" + (is_amoral ? 'is_amoral' : '') + ":" +
                                (is_ukropitek ? 'is_ukropitek' : '') + ":" +
                                (is_in_ignorelist ? 'ignored' + "(" + comment + ")" : '') + ":" +
                                ((ignorelist_match != '') ? ignorelist_match : '') + ":" +
                                (added_to_ignore ? 'added_to_ignore' : '') + ":" +
                                (message_to_ignored_nick ? 'to_ignored_nick': '') + ":" +
                                ((nick_to_subjects != '') ? 'to:' + nick_to_subjects : '')
                                , (for_me ? 'background: LemonChiffon;' : '') + 'color: ' + color);
                }
           }

        });
    }

    var Antiviblyadok = new Antiviblyadok();
    Antiviblyadok.run();
    Antiviblyadok.chat();

})

})();
