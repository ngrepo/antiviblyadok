// ==UserScript==
// @name        AntiviblyadokNew
// @description Script - Antiviblyadok
// @author      AntiviblyadokNew
// @version     0.5
// @namespace   https://livacha.com/
// @match       https://livacha.com/*
// @match       https://smiles.su/dist/*
// @connect     livacha.com
// @run-at      document-start
// @noframes
// ==/UserScript==
// @unwrap

    const WebSocketProxy = new Proxy(window.unsafeWindow.WebSocket, {
        construct(target, args) {
        //    console.log(args);

            const instance = new target(...args);

            const messageHandler = (event) => {
        //        console.log(event);
                messageDispather(event.data);
            };

            const closeHandler = (event) => {
        //        console.log(event);
                messageDispather(event.data);
                instance.removeEventListener('message', messageHandler);
                instance.removeEventListener('close', closeHandler);
            };

        instance.addEventListener('message', messageHandler);
        instance.addEventListener('close', closeHandler);

        return instance;
        },
    });

    window.unsafeWindow.WebSocket = WebSocketProxy;

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

.app-chat .chat-messages .mess-row:not(:hover) .mess-actions-self {
    display: none
}

.app-chat .chat-messages .mess-row .mess-actions-self {
    position: absolute;
    right: 24px;
    top: 0
}

.app-chat .chat-messages .mess-row .mess-actions-self .btn {
    font-size: 10px;
    padding: 0 3px
}

.btn-secondary-pre {
    color: #ff1111;
    background-color: #6c757d;
    border-color: #6c757d
}

.btn-secondary-pre:hover {
    color: #fff;
    background-color: #5a6268;
    border-color: #545b62
}

.btn-secondary-pre.focus,.btn-secondary-pre:focus {
    box-shadow: 0 0 0 .2rem rgba(108,117,125,.5)
}

.btn-secondary-pre.disabled,.btn-secondary-pre:disabled {
    color: #fff;
    background-color: #6c757d;
    border-color: #6c757d
}

.btn-secondary-pre:not(:disabled):not(.disabled).active,.btn-secondary-pre:not(:disabled):not(.disabled):active,.show>.btn-secondary-pre.dropdown-toggle {
    color: #fff;
    background-color: #545b62;
    border-color: #4e555b
}

.btn-secondary-pre:not(:disabled):not(.disabled).active:focus,.btn-secondary-pre:not(:disabled):not(.disabled):active:focus,.show>.btn-secondary-pre.dropdown-toggle:focus {
    box-shadow: 0 0 0 .2rem rgba(108,117,125,.5)
}

<!-- ============================================================================================ -->
`;

var DocStile = create( "style",{type: "text/css"},css_block);

    document.getElementsByTagName('head')[0].appendChild(DocStile);

/*const ScrptContent = `
<div class="test" z-index:99999999;  >test</div>

`
;

var Scrpt = create("div",ScrptContent);
	document.getElementById('content').appendChild(Scrpt); */
        var AntiviblyadokEnabled = true;

        var userlist = new Map();
        var msglist = new Map();
        const ignore_time = 86400000 * 1195 // время игнора в днях 1195 - 3 года, 86400000 - 1 день

        var ignorelist = new Array(); // '','',0,0,0
        var author_user_id;
        var author_nickname;
        var author_profile;
        var nickname_self;
        var profile_self;
        var user_id_self;
//console.log(document.getElementsByClassName('d-inline-block app-text-overflow text-white')[0].getElementsByTagName("strong"));
      //  var nickname = document.getElementsByClassName('d-inline-block app-text-overflow text-white')[0].getElementsByTagName("strong")[0].innerHTML;

     //   console.log(nickname);
     //   if (typeof nickname === 'undefined') { nickname = "" };

        const ignore_nick_uid_country = 0;
        const ignore_profile_uid_country = 1;
        const ignore_all_params = 2;
        const ignore_temp_profile = 3;
        const ignore_permanent = 4;

//        let e_app_nickname = document.getElementsByClassName("app-nickanme")[0]; // old
      //  let e_app_nickname = document.getElementsByClassName("nickname text-truncate")[0].getElementsByTagName("strong")[0].getElementsByTagName("a")[0];;
      //  var author_id = '';                                              // id
//        console.log(e_app_nickname);
      //  var author_nick = e_app_nickname.innerHTML;                      // nick
      //  console.log(author_nick);
      //  var author_login = e_app_nickname.href.replace(/.*\/user\//,''); // login
      //  console.log(author_login);

        //console.log(author_nick + '|' + author_login + '|' + nickname); // на данной стадии не пишет в консоль !

function SaveData() {
//========================New==========================
// [0] nick [1] login [2] instruction [3] ignore time offset [4] modification time [5] counter
// [6] comment [7] country [8] uid [9] reserved [10] reserved
//=======================================================
// [2] instruction: 0: - блокировать по нику + uid + по стране с разбаном по значению константы в днях в коде
// [2] instruction: 1: - блокировать по логину + uid + по стране с разбаном по значению константы в днях в коде
// [2] instruction: 2: - блокировка по всем параметрам с разбаном по значению константы в днях в коде
// [2] instruction: 3: - игнор на день по нику и стране для временных профилей
// [2] instruction: 4: - перманентный игнор по всем параметрам
// [2] instruction: 5: - reserved
// [2] instruction: 6: - reserved
// [2] instruction: 7: - reserved
//const ignore_nick_uid_country = 0;
//const ignore_profile_uid_country = 1;
//const ignore_all_params = 2;
//const ignore_temp_profile = 3;
//const ignore_permanent = 4;
//=====================================================
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

    if (ignorelist_loaded !== undefined || ignorelist_loaded.length > 0) {
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
                if (array1[i][4] < array2[c][4]) { // 86400000
                    if ( (((ticks - array2[c][3]) > 86400000) && (array2[c][2] == ignore_temp_profile) )
                        ||
                       (((ticks - array2[c][3]) > ignore_time) && (array2[c][2] == ignore_nick_uid_country ||
                                                                array2[c][2] == ignore_profile_uid_country ||
                                                                array2[c][2] == ignore_all_params ||
                                                                array2[c][2] == ignore_permanent)) ) {
                        console.log("%cantyviblyadok(" + ((now.getHours() < 10 && now.getHours() >= 0) ? "0" + now.getHours() : "") +
                                    ":" + ((now.getMinutes() < 10 && now.getMinutes() >= 0) ? "0" + now.getMinutes() : "") + "): " +
                                    "nick:" + array2[c][0] + "|login:" + array2[c][1] +
                                    "|removed from ignorelist by timeoffset > " +
                                    ((array2[c][2] == ignore_nick_uid_country) ? "ignore_nick_uid_country" : "") +
                                    ((array2[c][2] == ignore_profile_uid_country) ? "ignore_profile_uid_country" : "") +
                                    ((array2[c][2] == ignore_all_params) ? "ignore_all_params" : "") +
                                    ((array2[c][2] == ignore_temp_profile) ? "ignore_temp_profile" : "") +
                                    ((array2[c][2] == ignore_permanent) ? "ignore_permanent" : ""),
                                    'background: LemonChiffon; color: red');
                    } else { ignorelist_temp.push(array2[c]) }
                } else {
                    if ( (((ticks - array1[i][3]) > 86400000) && (array1[i][2] == ignore_temp_profile ) )
                        ||
                       (((ticks - array1[i][3]) > ignore_time) && (array1[i][2] == ignore_nick_uid_country ||
                                                                array1[i][2] == ignore_profile_uid_country ||
                                                                array1[i][2] == ignore_all_params ||
                                                                array1[i][2] == ignore_permanent)) ) {

                        console.log("%cantyviblyadok(" + ((now.getHours() < 10 && now.getHours() >= 0) ? "0" + now.getHours() : "") +
                                    ":" + ((now.getMinutes() < 10 && now.getMinutes() >= 0) ? "0" + now.getMinutes() : "") + "): " +
                                    "nick:" + array1[i][0] + "|login:" + array1[i][1] +
                                    "|removed from ignorelist by timeoffset > " +
                                    ((array1[i][2] == ignore_nick_uid_country) ? "ignore_nick_uid_country" : "") +
                                    ((array1[i][2] == ignore_profile_uid_country) ? "ignore_profile_uid_country" : "") +
                                    ((array1[i][2] == ignore_all_params) ? "ignore_all_params" : "") +
                                    ((array1[i][2] == ignore_temp_profile) ? "ignore_temp_profile" : "") +
                                    ((array1[i][2] == ignore_permanent) ? "ignore_permanent" : ""),
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
    if (AntiviblyadokEnabled == false) { return }

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
            if (confirm("Добавить в игнор \"" + n + "\" по логину ?")) { mode = ignore_login_365d }
            if (n != "Поменяйтe ник" && confirm("Добавить в игнор \"" + n + "\" по никнейму + логину ?")) { mode = ignore_both_365d }
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
                    //const ignore_nick_365d = 0;
                    //const ignore_login_365d = 1;
                    //const ignore_both_365d = 2;
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
                            console.log("added to ignore using button: " + n + "|" + login + ": на 365 дней по логину");
                            //console.log(ignorelist);
                            SaveData();
                        }
                    }

        element.remove();
        }
    }
}

function OnOffFilter()
{
var date = new Date();
var BtnOnOff = document.getElementById('BtnOnOff');
var color;
if (BtnOnOff.value == 'Выкл'){
	AntiviblyadokEnabled = true;
	BtnOnOff.value = 'Вкл';
    color = window.getComputedStyle(BtnOnOff.parentNode, null).getPropertyValue("background-color");
    BtnOnOff.style.background = color;
}else{
	AntiviblyadokEnabled = false;
	BtnOnOff.value = 'Выкл';
    color = 'Red';
    BtnOnOff.style.background = color;
}
    console.log("%cchat(" + (date.getHours() < 10 ? '0' : '') + date.getHours() + ":" +
                (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + "): " +
                (AntiviblyadokEnabled ? 'Antiviblyadok: enabled' : 'Antiviblyadok: disabled')
                ,'background: LemonChiffon;color: ' +
                 (AntiviblyadokEnabled ? color = 'Green' : color = 'Red')) ;
}

exportFunction(AddToIgnoreList, unsafeWindow, { defineAs: "AddToIgnoreList" });
exportFunction(MsgClick, unsafeWindow, { defineAs: "MsgClick" });
exportFunction(OnOffFilter, unsafeWindow, { defineAs: "OnOffFilter" });

//const JS123 = `
//`;

//let JS = create("script",{type: "text/javascript"},JS123);
//let JS1 = create("script",{type: "text/javascript"},AddToIgnoreListFunc.toString());

//document.getElementsByTagName('head')[0].appendChild(JS);
//document.getElementsByTagName('head')[0].appendChild(JS1);
/*
Событие storage
Если у вас есть потребность, или желание прослушивать изменение в localStorage, то можно просто добавить слушатель событий на 'storage':

window.addEventListener('storage', (event) => console.log(event));
*/

function messageDispather(data) {
    if (data !== undefined ) {
        let message = JSON.parse(data);
        if (message.mess != 'money' && message.mess != 'ping' && message.mess != 'pong') {

            //console.log(message);

            switch(message.mess) {
                case 'authorized': {
                    userAthorized(message);
                    break;
                }
                case 'users': {
                    addToUserList(message);
                    break;
                }
                case 'joined': {
                    roomJoin(message);
                    break;
                }
                case 'message': {
                    chatMessage(message);
                    break;
                }
                case 'typedMess': {
                    console.log('typedMess =============================');
                    break;
                }

                case 'messRemoved': { // модерастом или владельцем трансляции
                    console.log('messRemoved =============================');
                    //console.log(message);
                    console.log('removed by moderast('+ message.response.client.nickname + ':' +
                                message.response.client.info.profile.replace(/\/user\//,'') + ':' +
                                message.response.client.info.uid + ')');
                    break;
                }
                case 'baned': { // модерастом или владельцем трансляции
                    console.log('baned =============================');
                    //console.log(message);
                    console.log('baned: ('+ userlist.get(message.response.clientId).nickname + ':' +
                                userlist.get(message.response.clientId).info.profile.replace(/\/user\//,'') + ':' +
                                userlist.get(message.response.clientId).info.uid + ':' +
                                message.response.text.replace(/(<([^>]+)> ?)/gi,'') + ')');
                    break;
                }

                case 'updateRoom': {
                    updateUserList(message);
                    break;
                }

                case 'streamsUpdate': {
//                    console.log('streamsUpdate =============================');
//                    console.log(message);
                    break;
                }

                case 'streamOff': {
                    console.log('streamOff =========================');
                    console.log(message);
                    break;
                }

                case 'streamsListUpdate': {
                    //console.log('streamsListUpdate =========================');
                    break;
                }

                case 'likeMe': {
                    //console.log('likeMe =========================');
                    break;
                }

                case 'donate': {
                    console.log('donate =========================');
                    console.log(message);
                    break;
                }

                case 'subscribe': {
                    //console.log('subscribe =========================');
                    break;
                }

                default:{
                    console.log('default unknown message: ' + message.mess + ' =====================');
                    break;
                }
            }
        }
    }
}

function userAthorized (message) {
                    console.log('authorized =========================');
                    console.log('id:' + message.response.id);
                    console.log('nickname:' + message.response.client.info.nickname);
                    console.log('admin:' + message.response.client.admin);
                    console.log('banedInRoom:' + message.response.client.banedInRoom);
                    console.log('ignored:' + message.response.client.ignored);
                    console.log('moderator:' + message.response.client.moderator);
                    console.log('self:' + message.response.client.self);
                    console.log('sid:' + message.response.client.sid);
                    console.log('mobile:' + message.response.client.info.mobile);
                    console.log('profile:' + message.response.client.info.profile);
                    console.log('country:' + message.response.client.info.country);
                    console.log('country_iso:' + message.response.client.info.country_iso);
                    console.log('uid:' + message.response.client.info.uid);
    nickname_self = message.response.client.info.nickname;
    profile_self = message.response.client.info.profile;
    user_id_self = message.response.client.id;
    console.log(nickname_self);
    console.log(profile_self);
    console.log(user_id_self);
    //.replace(/\/user\//,'')
}

function roomJoin (message) {
     console.log('joined =============================');

     console.log(userlist);
     message.response.lastMessages.forEach(function(item, i, arr) {
         if (userlist.has(item.owner.id) == false) {
             userlist.set(item.owner.id,item.owner);
             console.log('added to userlist');
         };

         msglist.set(item.mid,item);
         console.log('added to msglist');
     });
     console.log(userlist);
     console.log(msglist);
}

function addToUserList (message) {
//     console.log('users ==============================');
//     console.log(message);
     message.response.list.forEach(function(item, i, arr) {
         userlist.set(item.id,item);
         if (item.owner == true ) {
             author_user_id = item.id;
             author_nickname = item.info.nickname;
             author_profile = item.info.profile;
//             console.log(author_user_id);
//             console.log(author_nickname);
//             console.log(author_profile);
         }
     });

//console.log(userlist);
}

function updateUserList (message) {
    //console.log('updateRoom ==========================');
    if ('type' in message.response) {
        //console.log('type in message.response');

        if (message.response.type == 'add') {
            userlist.set(message.response.client.id,message.response.client);
            //console.log(userlist);
        }
        if (message.response.type == 'remove') {
            if (typeof message.response.client.id === 'string') {
                //userlist.delete(message.response.client.id);
                if (userlist.length >= 500) {
                    //console.log('userlist array length:' + userlist.length);
                    //console.log(userlist);
                    userlist = userlist.slice(300,userlist.length - 1);
                    //console.log('userlist array spliced, lenght:' + userlist.length);
                    //console.log(userlist);
                }
            }
        }
    }
    if ('room' in message.response) {
        if ('publicData' in message.response.room) {
            //var room_id = message.response.room.id;
        }
    }
}

function chatMessage(message) {
    msglist.set(message.response.mid,message.response);
//    console.log(message);
/*
                    console.log('nickname:' + message.response.owner.info.nickname);
                    console.log('profile:' + message.response.owner.info.profile);
                    console.log('text:' + message.response.text);
                    console.log('textRaw:' + message.response.textRaw);
                    console.log('textWithSmiles:' + message.response.textWithSmiles);
*/
    //console.log(msglist);
    //console.log('added to msglist');
}

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

document.addEventListener("DOMContentLoaded", function(event) {
        function Antiviblyadok() {
            this.version = localStorage.getItem('tr-ver') != undefined ? localStorage.getItem('tr-ver') : "0.0.3";

            if(typeof(localStorage) != 'undefined' ) {
                if(window.localStorage.getItem('ignorelist')){
                    ignorelist = JSON.parse(window.localStorage.getItem('ignorelist'));
                }
            }
        }

    document.querySelector("div.chat-messages").addEventListener('DOMNodeRemoved', function (e) {
        var element = e.target;

        if (typeof element === 'object' && element !== null && 'getAttribute' in element) {
            var id = element.getAttribute('data-id');

            if (id !== null && id !== undefined) {
                //console.log("%celement removed from div.chat-messages mid: " + id,'background: LemonChiffon;color: red');
                //console.log(element);
                if (id.length > 0) msglist.delete(id);
                //console.log('removed from msglist');
                //console.log(msglist);
            }
        }
    });

    Antiviblyadok.prototype.initialize = function () {
       // exportFunction(messageDispatcher, unsafeWindow, { defineAs: "messageDispatcher" });
    }

    Antiviblyadok.prototype.chat = function () {

		var elements = document.getElementsByClassName("textarea-wrapper");
			//alert(elements.length);

		if (typeof elements[0] != "undefined") { // страница трансляции

			if (!document.getElementById("ChatFilterBase")) {
				elements[0].appendChild(create("input", {id:'BtnOnOff', type:'button',
                onclick: "OnOffFilter(); return false;", value:'Вкл', style: 'background: ' +
                window.getComputedStyle(elements[0], null).getPropertyValue("background-color") + '; border: 0;'}));
			}
        }

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
    }.querySelector('span.text')
})
*/

        function TextCorrector (s,anticaps,auto_dot) {
            if (typeof s === 'string' && typeof anticaps === 'boolean' &&  typeof auto_dot === 'boolean' ) {
                const autocorrect_enabled = true; if (autocorrect_enabled == false) { return }

                s = s.replace(/наврен/gi,'наверн');
                s = s.replace(/чтоли/gi,'что ли');
                s = s.replace(/врядли/gi,'вряд ли');
                s = s.replace(/вроед/gi,'вроде');
                s = s.replace(/вроед/gi,'вроде');
                s = s.replace(/\)$|\) $/gi,' :smile:');

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

                    if (result.search(/.*\[\[\d+\]\]$/) == -1 && result.length > 2) { // твик из-за старого кода в antiCapsMat
                        return result.replace(/(.*[^<>\.\(\)\!\?\:\s\+]+)$/,'$1.'); // Подстановка точки в конце
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
                        if (AntiviblyadokEnabled == false) { return }
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
            if (AntiviblyadokEnabled == false) { return }

            document.querySelector("textarea.form-control").addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    //console.log('%ctextarea.form-control','background: LemonChiffon;color: red');
                    var element = e.target;
                    element.value = TextCorrector(element.value,true,false);
                    return
                }

            });

           document.querySelector("div.chat-container").querySelectorAll("button.btn-secondary").forEach(function (userItem) {
                if (userItem.innerText.indexOf("Послать") != -1 ) {
                    userItem.addEventListener('click', (e) => {
                        var element = document.querySelector("textarea.form-control");
                        element.value = TextCorrector(element.value,true,false);
                        return
                    })
                }
           });

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
        var ignorelist_nick = ['Поменяйте ник','Поменяйтe ник'];

/*==================================================================================*/
        function antiCapsMat(m) {
            if (m === undefined) {
                return undefined;
            }

            var fm = new Array('',m.toLowerCase());

            m = m.replace(/^.*<img.*Li0qwg66tYTFsL.gif.*/, "🐖");
            m = m.replace(/^.*<img.*y64LUsus7cciDd.gif.*/, "🐖");
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
            tm = no_span_tag.replace(/^.*🏳‍🌈.*/, "🐔"); if (tm != no_span_tag) { m = tm }
            tm = no_span_tag.replace(/.*(і|ї).*/, "🐖"); if (tm != no_span_tag) { m = tm }

//🐷🐖🐔🐓🐗🪓🔪
//:134477: - антинацист
//:210718: - свинка
//:138095: - ссуший
            var dict = {
/*=================================================================*/
                '.*славв?а (геро|укр|банде|зсу|наци|америк|брита|нато).*': '🐷',
                '.*( |^)ват(н|а).*': '🐷',
                '.*( |^)ватан.*': '🐷',
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
                '.*р(((у|ю)з)|(ю(с|з))){1,2}ь?к(е|ие).*': '🐷',
                '.*русо ?(пидор|чмо|свин).*': '🐷',
                '.*( |^)р(у|ю)(с|з){1,2}иш.*': '🐷',
                '.*( |^)р(у|ю)(с|з){1,2}к(ей|ая|ий|ое) (свинья|хуесос|чмо).*': '🐷',
                '.*( |^)р(у|ю)(с|з){1,2}сиян.*': '🐷',
                '.*сдохни р(а|о)с{1,2}ия.*': '🐷',
                '.*ра(си|ис)я.*': '🐷',
                '.*( |^)на рас{1,2}(и|е){1,2}.*': '🐷',
                '.*[c]?дохни\W{1,3} р(у|ю)(с|з){1,2}к.*': '🐷',
                '.*раши(ст|зм).*': '🐷',
                '.*пид(а|о)рашк.*': '🐷',
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
/*======================хохлопидор спамер==========================*/
                '.*кидайте жалобы.*': '🐷',
/*=================================================================*/
                '.*( |^)выпьем.*': '🥛',
                '.*( |^)пойду выпью.*': '🥛',
                '.*( |^)пивка выпьем.*': '🥛',
                '.*( |^)пивк?(о|у|а).*': '🥛',
                '.*( |^)по пивку.*': '🥛',
                '.*( |^)водо(чк|вк)..*': '🥛',
                '.*( |^)водк(а|о|у|е).*': '🥛',
                '.*( |^)водяр(а|о|у|е).*': '🥛',
                '.*( |^)вин(ца|цо|цу|е|о).*': '🥛',
                '.*( |^)конья(к|ч).*': '🥛',
                '.*( |^)конин(а|о|у|е).*': '🥛',
/*=================================================================*/
                '.*(мать|мамку) (ипу|еб.+)? (св|тв)о(ю|я).*': '😫',
                '.*(тво|сво)\W{1,2} (мам\W|мат\W|бат\W).*': '😫',
/*=================================================================*/
                '.*(с|з|по|па)(дохни|дыхай).*': '😭',
                '.*умри.*': '😭',
                '.*труп.*': '😭',
/*=================================================================*/
                 '.*б(о|а)?мж.*': '🤮',
                 '.*теплотрас.*': '🤮',
                 '.*мил(о|а)стын.*': '🤮',
                 '.*бездомн.*': '🤮',
/*=================================================================*/
                 '.*на зон(у|а|ы|е).*': '🐓',
                 '.*тюрьм.*': '🐓',
                 '.*как в хату входить.*': '🐓',
                 '.*зону топтал.*': '🐓',
                 '.*сизо.*': '🐓',
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

            let shit_found = false;

            for (var key in dict) { // Проверка на список нехороших слов
                var reg = new RegExp(key,'i');
                if (m.search(key) != -1) { // тег для показа скрытого сообщения
                    m = '<div class="text service-tag" style="display: auto;" ondblclick=MsgClick(this);>'
                        + dict[key] + '</div><div class="text text-body" style="display: none">' + m + '</div>';
                    shit_found = true;
                    break;
                }
            };

            if (shit_found == false) {
                m = TextCorrector(m,true,true); // Исправление на первую заглавную и добавление точки в конце
            }

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

            const flood_reset_time = 60000;
            const flood_threshold = 2;
            const hard_flood_threshold = 4;

            var ResultArray = new Array();
            var result = new Array();

            var nick_to_tag_data = m.match(/<span[^<>]+>[^<>]+<\/span>/g);
            var nick_to_tags;
            var span_tags_inner = '';

            if (nick_to_tag_data != null) {
                for(let c = 0; c < nick_to_tag_data.length; c++){
                    nick_to_tags = nick_to_tag_data[c].match(/<span[^<>]+>([^<>]+)<\/span>/);
                    if (nick_to_tags != null) { span_tags_inner += nick_to_tags[1] }
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
                console.log('spamArray array length:' + SpamArray.length);
                //console.log(SpamArray);
                SpamArray = SpamArray.slice(200,SpamArray.length - 1);
                console.log('spamArray array spliced, lenght:' + SpamArray.length);
                //console.log(SpamArray);
            }

             return result;
        }

/*==================================================================================*/
        const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

        $("div.chat-messages").bind('DOMNodeInserted', function (e) {
//            if (AntiviblyadokEnabled == false) { return }
            //console.log('%c','background: LemonChiffon;color: red');
            var element = e.target;

            if (typeof element !== 'object' || element === null) {
                return;
            }

            var id = element.getAttribute('data-id'); // id
            if (id === null || id === undefined) {
                    return;
            }

            var message = msglist.get(id);

            if (message === undefined) { return }

/*
            var $mms = element.querySelector('span.text');     // message body backup
            console.log($mms);
            var t = $mms.innerHTML; // message body
            var n = element.querySelector('strong.nick, strong.nick-to').innerHTML;          // nick

            console.log("chat =============================");
            console.log(id);
            console.log("n:" + n);
            console.log(t.replace(/(<([^>]+)>)/gi, '')); // удаление всех тегов
            console.log("t:" + t);
            console.log("chat =============================>");
//            console.log(element.outerHTML);
*/

            var reg = new RegExp();
            var date = new Date();
            var nick_to_subjects = '';
            var is_temp = false;
            var for_me = false;
            var for_author = false;
            var comment = '';

            var is_ukropitek = false;
            var is_amoral = false;
            var is_spam = false;
            var is_restricted_country = false;
            var added_to_ignore = false;

            var is_in_ignorelist = false;
            var message_to_ignored_nick = false;

            const hide_in_message = true;
            const hide_ukropitek = true;
            const hide_amoral = false;
            const hide_spam = true;
            const hide_temp_profile = false;
            const hide_countries = true;
            const hide_temp_not_ru_country = true;

            const restrictedCountries = Array ( // boolean true - скрывать так же у зарегеных
            ['UA',false],['NL',true],['VN',true],['GB',false],['EE',false],['FR',true],['PL',false],['US',false],
            ['MD',false],['DE',false],['GE',true],['AT',true]
            //,['ES',true],['HU',true],['DZ',false],['DK',false],['BA',true]
            );

            const autoban_ukropitek = true;
            const autoban_ukropitek_treshold_msg = 2;
            const autoremove_from_ignorlist = false;
            const autoremove_from_ignorlist_time = 0; // 3 months

//            console.log('DOMNodeInserted1');
//            console.log(message);
//            console.log('DOMNodeInserted2');

            var nickname = message.owner.nickname;
            var profile = message.owner.info.profile.replace(/\/user\//,'');
            var mobile = message.owner.info.mobile; // с мобильного или нет
            var country = message.owner.info.country; // название страны
            var country_iso = message.owner.info.country_iso; // код страны
            var city = message.owner.info.city; // город
            var uid = message.owner.info.uid; // внутренний постоянный идентификатор профиля на блеваче
            var sid = message.owner.sid; // хз что за идентификатор
            var user_id = message.owner_id; // в массиве с юзерами
            var is_moder = message.owner.moder; // смотрящий
            var is_moderator = message.owner.moderator; // модератор сайта (предположительно)
            var is_admin = message.owner.admin; // администратор сайта (предположительно)
            var ignored = message.owner.ignored; // проверить
//            var text = message.text;
            var text = message.textWithSmiles;
           // var textRaw = message.textRaw;
            //var textWithSmiles = message.textWithSmiles;
            var attached = message.attached; // прикреплённое что то ... проверить
            var is_author = message.owner.owner;
            var is_me = false; (message.owner.self !== true ? is_me = false : is_me = true);

            if (profile == '' && uid == '0' ) { is_temp = true }
/*
                    console.log('message =============================>>>');
                    console.log('attached:' + message.attached);
                    console.log('mid:' + message.mid);
                    console.log('owner_id:' + message.owner_id);
                    console.log('text:' + message.text);
                    console.log('textRaw:' + message.textRaw);
                    console.log('textWithSmiles:' + message.textWithSmiles);
                    console.log('message =============================>>>');
*/


//            if (text != undefined) {
//                var a = test.match(/\*...\*/g);
//                if (a != null) {
//                    a.forEach(function (a) {
//                        t = repl(text, z, l);
//                    });
//                }
//                console.log('repl:' + t);

                //$(element).find("app-popova").click();
/*                $(element).append( "<div class=\"mess-actions-self\">" +
                                  "<button class=\"btn btn-sm btn-secondary-pre\"" +
                                   "data-title=\"В игнор\" onclick=AddToIgnoreList(this);><i class=\"fa fa-remove btn-saw-out\">" +
                                   "</i></button>" +
                                   "</div>" );
*/

                if(!is_me) { // не обрабатывать сообщения от себя
                    var antiSpamResult = antiSpam(nickname,profile,text);
                    if (antiSpamResult[0] > 0) { is_spam = true }
                    let SpamResult;
                    SpamResult = antiCapsMat(text);
                    text = SpamResult[0];
                    element.querySelector('span.text').innerHTML = text;
                    //console.log('%cantiCapsMat:' + text,'background: LemonChiffon;color: red');
                    //console.log(SpamResult[1]); // данные сообщения для более глубокого разбора
                }


                //text = antiCapsMat(text); // обрабатывать сообщения от себя

                //$($mms).html(t);

                if (text.search("🐖") != -1) { is_ukropitek = true }
                if (text.search("🤮") != -1 || text.search("🤡") != -1 || text.search("🐓") != -1 ||
                   (text.search("😭") != -1 || text.search('😫') != -1  || text.search('🥛') != -1 &&
                    is_me == false)) { is_amoral = true }

                var now = new Date();
                var ticks = now.getTime();
                var date_diff = 0;
                var ignorelist_match = '';
                var ignore_date;

//========================New==========================
// [0] nick [1] login [2] instruction [3] ignore time offset [4] modification time [5] counter
// [6] comment [7] country [8] uid [9] reserved [10] reserved
//=======================================================
// [2] instruction: 0: - блокировать по нику + uid с разбаном по значению константы в днях в коде
// [2] instruction: 1: - блокировать по логину + uid с разбаном по значению константы в днях в коде
// [2] instruction: 2: - блокировка по всем параметрам с разбаном по значению константы в днях в коде
// [2] instruction: 3: - игнор на день по нику и стране для временных профилей
// [2] instruction: 4: - перманентный игнор по всем параметрам
// [2] instruction: 5: - reserved
// [2] instruction: 6: - reserved
// [2] instruction: 7: - reserved
//const ignore_nick_uid_country = 0;
//const ignore_profile_uid_country = 1;
//const ignore_all_params = 2;
//const ignore_temp_profile = 3;
//const ignore_permanent = 4;
//=====================================================

                function SetVars (i) {
                    ignore_date = new Date(ignorelist[i][3]);
                    date_diff = ticks - ignore_date.getTime();
                    comment = ignorelist[i][6];
                    is_in_ignorelist = true;

                    if (ignorelist[i][2] != 4 && ignorelist[i][2] != 3 && date_diff >= ignore_time) {
                        ignorelist.splice(i, 1);
                        is_in_ignorelist = false;
                        console.log(nickname + "|" + profile + " removed from ignore list by timeoffset");
                        console.log(ignorelist);
                        return;
                    } else if (ignorelist[i][2] == 3 && date_diff >= 86400000) {
                        ignorelist.splice(i, 1);
                        is_in_ignorelist = false;
                        console.log(nickname + "|" + profile + " removed from ignore list by timeoffset");
                        console.log(ignorelist);
                        return;
                    }

                    if (ignorelist[i][0] == nickname) { ignorelist_match = 'n' }
                    if (ignorelist[i][1] == profile && ignorelist[i][1] != '')
                        ignorelist_match += ((ignorelist_match.length > 0) ? "|" : "") + 'p';
                    if (ignorelist[i][7] == country_iso && ignorelist[i][7] != '')
                        ignorelist_match += ((ignorelist_match.length > 0) ? "|" : "") + 'c';
                    if (ignorelist[i][8] == uid && ignorelist[i][8] != '0' && ignorelist[i][8] != '')
                        ignorelist_match += ((ignorelist_match.length > 0) ? "|" : "") + 'u';
                }

                is_in_ignorelist = false;

                for(let i = 0; i < ignorelist.length; i++){

                if (ignorelist[i] !== null && ignorelist[i] !== undefined) {
                    if (ignorelist[i][2] !== undefined) if (hide_in_message == true && (ignorelist[i][2] != ignore_profile_uid_country)) {
                        reg = new RegExp("<span[^<>]+>" + // .replace(/^\s+/,'').replace(/\s+$/,'')
                        escapeRegExp(ignorelist[i][0]) + "</span>",'i'); // понаблюдать за определением кому пишут

                        if (text.search(reg) != -1) { message_to_ignored_nick = true };
                        if (message_to_ignored_nick == true) {
//                            console.log(reg);
//                            console.log(message_to_ignored_nick);
                        }
                    }

                    switch(ignorelist[i][2]) {
                        case ignore_nick_uid_country:
                            //console.log('ignore_nick_uid_country');
                            if (ignorelist[i][0] == nickname || ignorelist[i][8] == uid) {
                                SetVars(i);// удаление через ignore_time дней
                            }
                            break;
                        case ignore_profile_uid_country:
                            //console.log('ignore_profile_uid_country');
                            if (ignorelist[i][1] == profile || ignorelist[i][8] == uid) {
                                SetVars(i);// удаление через ignore_time дней
                            }
                            break;
                        case ignore_all_params:
                            //console.log('ignore_all_params');
                            //console.log(nickname);
                            if (ignorelist[i][2] == nickname || ignorelist[i][1] == profile || ignorelist[i][8] == uid) {
                                SetVars(i);// удаление через ignore_time дней
                            }
                            break;
                        case ignore_temp_profile:
                            //console.log('ignore_temp_profile');
                            if (ignorelist[i][2] == nickname && ignorelist[i][7] == country_iso) {
                                SetVars(i);// удаление через ignore_time дней
                            }
                            break;
                        case ignore_permanent:
                            //console.log('ignore_permanent');
                            if (ignorelist[i][2] == nickname || ignorelist[i][1] == profile || ignorelist[i][8] == uid) {
                                SetVars(i);
                            }
                            break;
                    }
                }

                }

//console.log(levenshtein('Hello', 'HelA_1'));
//console.log(ignorelist);

                var nick_to_tag_data = text.match(/<span[^<>]+>[^<>]+<\/span>/g);
                var nick_to_tags = new Array();
                //console.log(nick_to_tag_data);
                var message_to = new Array();

                if (nick_to_tag_data != null) {
                    for(let c = 0; c < nick_to_tag_data.length; c++){
                        nick_to_tags = nick_to_tag_data[c].match(/<span[^<>]+data-client-id="([^<>"]+)">([^<>]+)<\/span>/);
                        if (nick_to_tags != null) { message_to.push([nick_to_tags[1],nick_to_tags[2]]) }
                        else {
                            nick_to_tags = nick_to_tag_data[c].match(/<span[^<>]+(nick-not-found)[^<>]+>([^<>]+)<\/span>/);
                            if (nick_to_tags != null) {
                                message_to.push([nick_to_tags[1],nick_to_tags[2]])
                            }
                        }
                    }
                    //console.log("%c" + nickname + " to " + message_to.join('|'),'background: LemonChiffon;color: red');
                }

                for (let key of userlist.keys()) {
                    let data = userlist.get(key);

                    for(let c = 0; c < message_to.length; c++){
                    //console.log("%c" + message_to[c][1] + " | " + data.nickname,'background: LemonChiffon;color: red');
                        if (message_to[c][0] == key || message_to[c][0] == "nick-not-found" ) {
                            if (message_to[c][1] == data.nickname || message_to[c][1] == "nick-not-found" ) {
                                nick_to_subjects += ((nick_to_subjects.length > 0) ? "|" + message_to[c][1] : message_to[c][1]);
                                if ( message_to[c][1] == nickname_self ) { for_me = true }

                                if (author_nickname == data.nickname && author_profile == data.info.profile && data.owner == true) {
                                    for_author = true;
                                }

                                //console.log("nick:" + message_to[c][1] + ",profile:" + data.info.profile)
                            }
                        }
                    }
                       // console.log('%cdata.info.profile:' + data.info.profile,'background: LemonChiffon;color: red');
                       // console.log('%cdata.info.uid:' + data.info.uid,'background: LemonChiffon;color: red');
                       // console.log('%chide_in_message:' + hide_in_message,'background: LemonChiffon;color: red');
                       // console.log('%chide_temp_profile:' + hide_temp_profile,'background: LemonChiffon;color: red');

                    if (hide_in_message == true && hide_temp_profile == true && data.info.uid == '0') {

                        reg = new RegExp("<span[^<>]+>" + escapeRegExp(data.nickname) + "</span>");

                        if (text.search(reg) != -1) {
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
                        if (text.search(reg) != -1) { message_to_ignored_nick = true };
                    }
                    if(ignorelist_nick[i] == nickname) {
                        is_in_ignorelist = true;
                        ignorelist_match += ((ignorelist_match.length > 0) ? "|iln" : "iln");
                        ignorelist_match += ((ignorelist_match.length = 0) ? comment = "iln" : "");

                        if (ignore_date === undefined) { ignore_date = new Date(ticks) }
                    }
                }


                if (is_spam == true && is_me == false && is_author == false) { // автобан пидоров
                    let exists = false;

                    for(let i = 0; i < ignorelist.length; i++) {
//========================New==========================
// [0] nick [1] login [2] instruction [3] ignore time offset [4] modification time [5] counter
// [6] comment [7] country [8] uid [9] reserved [10] reserved
//=======================================================
// [2] instruction: 0: - блокировать по нику + uid с разбаном по значению константы в днях в коде
// [2] instruction: 1: - блокировать по логину + uid с разбаном по значению константы в днях в коде
// [2] instruction: 2: - блокировка по всем параметрам с разбаном по значению константы в днях в коде
// [2] instruction: 3: - игнор на день по нику и стране для временных профилей
// [2] instruction: 4: - перманентный игнор по всем параметрам
// [2] instruction: 5: - reserved
// [2] instruction: 6: - reserved
// [2] instruction: 7: - reserved
//const ignore_nick_uid_country = 0;
//const ignore_profile_uid_country = 1;
//const ignore_all_params = 2;
//const ignore_temp_profile = 3;
//const ignore_permanent = 4;
//=====================================================

                        if (ignorelist[i] !== null) {
                            if (ignorelist[i][1] != '') {
                                if (ignorelist[i][0] == nickname && ignorelist[i][1] == profile) { exists = true }
                            } else {
                                if (ignorelist[i][0] == nickname && ignorelist[i][1] == '') { exists = true }
                            }
                        }
                    }
//console.log(exists);
//console.log("profile: " + profile);

                    if (exists == false) {
                        if ( (is_spam == true && antiSpamResult[0] > 2 && is_ukropitek == true ) ){
                            ignorelist.push([nickname,profile,ignore_profile_uid_country,date.getTime(),date.getTime(),0,
                            (is_spam ? 'is_spam(' + antiSpamResult[0] + ")" : '') +
                            (is_ukropitek ? 'is_ukropitek(' + antiSpamResult[0] + ")" : '') + " - автобан на " + ignore_time / 86400000 + " дней",'']);
                            added_to_ignore == true;
                            console.log("added to ignore: " + nickname + "|" + profile + ": на " + ignore_time / 86400000 + " дней по логину");
                            //console.log(ignorelist);
                        }

                        if ( (is_spam == true && antiSpamResult[0] > 4) ){
                            ignorelist.push([nickname,profile,ignore_temp_profile,date.getTime(),date.getTime(),0,
                            (is_spam ? 'is_spam(' + antiSpamResult[0] + ")" : '') +
                            (is_ukropitek ? 'is_ukropitek(' + antiSpamResult[0] + ")" : '') + ' - автобан на 1 день','']);
                            added_to_ignore == true;
                            console.log("added to ignore: " + nickname + "|" + profile + ": на 1 день по логину и нику");
                            //console.log(ignorelist);
                        }
                    }
                }

                for (let i = 0; i < restrictedCountries.length; i++) {
                    if (hide_temp_not_ru_country == true && country_iso != 'RU' && is_temp == true) {
                        is_restricted_country = true;
                    }
                    if (restrictedCountries[i][0] == country_iso) {
                         if (restrictedCountries[i][1] == true) {
                             is_restricted_country = true;
                             break;
                         } else {
                             if (is_temp == true) {
                                 is_restricted_country = true;
                                 break;
                             }
                         }
                    }
                }

                let red = false;

                if(is_in_ignorelist == true || (message_to_ignored_nick == true && for_author == false) ||
                   (is_temp == true && hide_temp_profile == true) ||
                   (is_restricted_country == true && hide_countries == true) ||
                   (is_ukropitek == true && hide_ukropitek == true)){
                    if(is_me == false && is_author == false) {

                      red = true;
                      element.remove();
                    }
                }

                if((is_spam == true && is_me == false && hide_spam == true) ||
                   (is_amoral == true && is_me == false && for_author == false && hide_amoral == true)){
                      element.remove();
                }

                    let color;

                    if (red == true) {
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

                    console.log("%cchat(" + (date.getHours() < 10 ? '0' : '') + date.getHours() + ":" +
                                (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() +
                                "):" + nickname + ":" + profile + ":" + country_iso +
                                (city !== undefined && city != '' ? '(' + city + ')' : '') + ":" +
                                "uid=" + uid + ":" +
                                //"sid=" + sid + ":" +
                                (mobile ? 'phone:' : '') +
                                (ignored ? 'ignored_in_room!??:' : '') +
                                'ul' + "=" + userlist.size + ":" +
                                'il' + "=" + ignorelist.length + ":" + "sa=" + SpamArray.length + ":" +
                                (is_temp ? 'is_temp:' : '') + (is_author ? 'is_author:' : '') +
                                (is_moder ? 'room_moder:' : '') + (is_moderator ? 'site_moder:' : '') +
                                (is_admin ? 'site_admin:' : '') +
                                (is_me ? 'is_me:' : '') + (for_me ? 'for_me:' : '') +
                                (for_author ? 'for_author:' : '') +
                                (is_spam ? 'is_spam(' + antiSpamResult[0] + '):' : '') + (is_amoral ? 'is_amoral:' : '') +
                                (is_ukropitek ? 'is_ukropitek:' : '') + (is_restricted_country ? 'country_bl:' : '') +
                                (is_in_ignorelist ? 'IGNORED(' + (
                                 Math.ceil(Math.abs((ticks - ignore_date.getTime())) / (1000 * 3600 * 24))) +
                                " д. (" + comment + ")):" : '') +
                                ((ignorelist_match != '') ? 'match:' + ignorelist_match + ':' : '') +
                                (added_to_ignore ? 'added_to_ignore:' : '') +
                                (message_to_ignored_nick ? 'to_ignored_nick:': '') +
                                ((nick_to_subjects != '') ? 'to:' + nick_to_subjects : '')
                                , (for_me ? 'background: LemonChiffon;' : '') + 'color: ' + color);

        });
    }

    var Antiviblyadok = new Antiviblyadok();
    Antiviblyadok.initialize();
    Antiviblyadok.chat();

})

})();
