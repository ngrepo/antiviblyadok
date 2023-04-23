// ==UserScript==
// @name        Antiviblyadok
// @description Script - Antiviblyadok
// @author      Antiviblyadok
// @version     0.0.3
// @namespace   https://livacha.com/
// @match       https://livacha.com/*
// @connect     livacha.com
// @require     https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/crypto-js.min.js
// @grant       GM_xmlhttpRequest
// @run-at      document-end
// ==/UserScript==

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

var MsgClickFunc = function MsgClick(e) {
  var element = e.parentElement;
  var ServiceTag = e.parentElement.getElementsByClassName("service-tag")[0];
  var TextBody = e.parentElement.getElementsByClassName("text-body")[0];

  if (typeof TextBody !== 'undefined') {
      e.parentElement.innerHTML = '<div class="text service-tag" style="display: auto" ondblclick=MsgClick(this);>' +
      ServiceTag.innerHTML + '</div>' + TextBody.innerHTML;
      TextBody.remove;
  } else {
      let service_tag_html = '<div class="text service-tag" style="display: auto" ondblclick=MsgClick(this);>' +
      ServiceTag.innerHTML + '</div>';
      let text_body_html = e.parentElement.innerHTML.replace(ServiceTag.outerHTML,'');
      e.parentElement.innerHTML = service_tag_html + '<div class="text text-body" style="display: none">' + text_body_html + '</div>';
  }
}

var JS = create("script",{type: "text/javascript"},MsgClickFunc.toString());

document.getElementsByTagName('head')[0].appendChild(JS);

var ignorelist = new Array();

window.addEventListener('beforeunload', (event) => {
                    // [0] nick [1] login [2] instruction [3] ignore time offset [4] modification time
                    // [2] instruction: 0: блокировать по нику; 1: блокировать по логину; 2: блокировать по логину и нику;
                    // [2] instruction: 3: - бан на день нику для временных ников;
                    // [2] instruction: 4: - бан на день по логину и нику;

    var ignorelist_loaded = new Array();
    var ignorelist_temp = new Array();

    if(typeof(localStorage) != 'undefined' ) {
        if(window.localStorage.getItem('ignorelist')){
                ignorelist_temp = JSON.parse(window.localStorage.getItem('ignorelist'));
            }
    }

    for(let i = 0; i < ignorelist_loaded.length; i++) {
        for(let c = 0; c < ignorelist.length; c++) {
            if (ignorelist_loaded[i][1] == ignorelist[c][1]){
                if (ignorelist_loaded[i][4] < ignorelist[c][4]) { ignorelist_temp.push(ignorelist[i]); }
                else if (ignorelist_loaded[i][4] >= ignorelist[c][4]) { ignorelist_temp.push(ignorelist_loaded[i]); }
            } else if (ignorelist_loaded[i][0] == ignorelist[c][0]) {
                if ((ignorelist_loaded[i][4] < ignorelist[c][4]) && ignorelist[c][1] == '') { ignorelist_temp.push(ignorelist[i]); }
                else if (ignorelist_loaded[i][4] >= ignorelist[c][4] && ignorelist_loaded[c][1] == '') { ignorelist_temp.push(ignorelist_loaded[i]); }
            }
        }
    }
//    var now = new Date();
//    var ticks = now.getTime();
//new Date(ignorelist[i][3]).getTime();
//|| ignorelist_loaded[i][2] == 3 ||
//                    if (ticks - ignorelist_loaded[i][3] < 86400000) { ignorelist_temp.push(ignorelist[i]); }
//                        if (ignorelist_loaded[i][0] == ignorelist[c][0] || ignorelist_loaded[i][2] == 3 || ignorelist[c][1] == '') {
//                if (ticks - ignorelist_loaded[i][2] < 86400000) { ignorelist_temp.push(ignorelist[i]); }

      if(typeof(localStorage) != 'undefined' && ignorelist_temp.length >= 1) { localStorage.setItem('ignorelist', JSON.stringify(ignorelist_temp)) }
      //event.preventDefault();
      //event.returnValue = true;
});

(function () {
    'use strict';

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
        }, 3000);
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

        function antiCapsMat(m) {
            if (m === undefined) {
                return undefined;
            }
            m = m.replace(/^.*<img.*Li0qwg66tYTFsL.gif.*/, "🐖");
            m = m.replace(/^.*<img.*126179.*/, "🐖");
            m = m.replace(/^.*<img.*182113.*/, "🐖");
            m = m.replace(/^.*<img.*126716.*/, "🐖");
            m = m.replace(/^.*<img.*195552.*/, "🐖");
            m = m.replace(/🇺🇦/, "🐖");
            m = m.replace(/.+(і|ї).+/, "🐖");


//            console.log(m);
//🐷🐖🐔🐓🐗🪓🔪
//:210718:

            var dict = {
/*=================================================================*/
                '.*слава геро.*': '🐷',
                '.*слава укра.*': '🐷',
                '.*слава банде.*': '🐷',
                '.*слава зсу.*': '🐷',
                '.*( |^)ватн.*': '🐷',
                '.*( |^)рашк.*': '🐷',
                '.*р(а|о)с{1,2}ея.*': '🐷',
                '(.*( |^)[^г]+|^)рус{1,2}н.*': '🐷',
                '.*свин[о]?[c]?рус{1,2}.*': '🐷',
                '.*сруск.*': '🐷',
                '.*путин (хуйло|убийца).*': '🐷',
                '.*рус{1,2}к.{1,2} свин.*': '🐷',
                '.*рус{1,2}к.{1,2} (свино)?фаш.*': '🐷',
                '.*путин(а|о)(й|и)д.*': '🐷',
                '.*путинск.* мраз.*': '🐷',
                '.*пид(а|о)рус.*': '🐷',
                '.*кацап.* фаш.*': '🐷',
                '.*свинолапт.*': '🐷',
                '.*лапотн.*': '🐷',
                '.*параш.* раб.*': '🐷',
                '.*свинобольн.*': '🐷',
                '.*быдловата.*': '🐷',
                '.*путлер.*': '🐷',
                '.*рузьке.*': '🐷',
                '.*сдохни р(а|о)с{1,2}ия.*': '🐷',
                '.*раися.*': '🐷',
                '.*раси..*': '🐷',
                '.*( |^)на рас{1,2}(и|е){1,2}.*': '🐷',
                '.*[c]?дохните рус[с]?к.*': '🐷',
                '.*рашист.*': '🐷',
                '.*путло.*': '🐷',
                '.*пидорашк.*': '🐷',
                '.*ватан.*': '🐷',
                '.*мелкоботексн.*': '🐷',
                '.*срасеи.*': '🐷',
                '.*хуйло международный преступник.*': '🐷',
                '.*кацап.*': '🐷',
                '.*рузг..*': '🐷',
                '.*путинист.*': '🐷',
                '.*росс?(и|е)янц.*': '🐷',
                '.*р(у|ю)с?(с|з)к\\S{1,5} алкаш.*': '🐷',
                '.*это мусарской сайт.*': '🐷',
/*=================================================================*/
                '.*(с|по)дохн.*': '😭',
                '.*умри.*': '😭',
/*=================================================================*/
                 '.*б(о|а)?мж.*': '🤮',
                 '.*теплотрас.*': '🤮',
                 '.*мил(о|а)стын.*': '🤮',
                 '.*на зон(у|а|ы|е).*': '🐓',
                 '.*пр(а|о)коп.*': '🤡'

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
                        m = '<div class="text service-tag" style="display: auto" ondblclick=MsgClick(this);>' + dict[key] + '</div>' +
                            '<div class="text text-body" style="display: none">' + m + '</div>';
                        break;
                    }
                };
/*
                let str = m.match(/[^<>/\d\[\]\s:,;\.\-\!\?]+/);

                if (str !== null) { // Делаем первую букву заглавной
                    str = str[0];
                    str = str.replace(str[0], str[0].toUpperCase());
                    m = m.replace(str.toLowerCase(),str);
               }
*/
            o.map(function (h, i) {
                m = m.split("[[" + i + "]]").join(h[0].outerHTML);
            });

            return m;
        }

        var SpamArray = new Array();

        function antiSpam(nickname,m) {
            if (m == undefined) {
                return undefined;
            }

			var tickcount = new Date().getTime();

            var flood_reset_time = 1 * 60000;
            var flood_threshold = 2;
            var Spam = false;
            var SpamMatch = '';
            var shortstr = m.replace(/\s+/g,"").replace(/<[^<>]+>/g,"").toLowerCase();
            var imgtag = m.match(/<img src="[^<>]+\/([\w.]+)">/g);

            if (imgtag != null) {
                for(let c = 0; c < imgtag.length; c++){
                    var imgtag1 = imgtag[c].match(/smile_([^<>\/"']+)\.gif/);
                    var imgtag2 = imgtag[c].match(/smiles.su\/\w\/([0-9]+)/);
                    //console.log(imgtag1);
                    if (imgtag1 != null) { shortstr = imgtag1[1] + shortstr }
                    if (imgtag2 != null) { shortstr = imgtag2[1] + shortstr }
                }
            }

             var len = 0;

             if (shortstr != '') {
                 if (shortstr.length > 40) {
                     len = (Math.round(Math.round(shortstr.length / 20) * 15));
                 } else if (shortstr.length > 10) {
					 len = (Math.round(Math.round(shortstr.length / 7) * 5));
                 } else len = shortstr.length;

                 shortstr = shortstr.toLowerCase().substr(0,len);

                 //console.log(shortstr);

                 var search = true;
				 var exists = false;

					for(var c = 0; c < SpamArray.length; c++){
						if ((SpamArray[c][0] == shortstr) && (SpamArray[c][1] == nickname)){
							if ((tickcount - SpamArray[c][2]) > flood_reset_time) { SpamArray[c][3] = 1 } else { SpamArray[c][3]++ }
							exists = true;
							break;
						};
					}
					if (exists) {
						if (SpamArray[c][3] >= flood_threshold){
							SpamArray[c][2] = tickcount;
							Spam = true;
							SpamMatch = SpamArray[c][0];
						}
					} else {
						if (SpamArray.length >= 500) SpamArray = SpamArray.splice(SpamArray.length - 201,SpamArray.length - 1);
						SpamArray.push([shortstr,nickname,tickcount,1]);
                    }
             }

              //console.log(SpamArray);
              //console.log(shortstr);

              return Spam;
        }

        var ignorelist_nick = ['АМанда Иоановна','ВЛАДиМИР Иллюминатов',
            'Sjawa','White_Zombie','Дрочер №1',
            'ЛеНиН ЖиВ','Збройнi Сили Украiни','ДИРИЖАБЛЬ','WESTRUST',
            'Linux','Absolut','Klarissa','` don&amp;#039;t panic..',
            'чепухан','Побочки','&amp;amp;ГосподинСвободныхМыслей',
            'Войнючий Капутин','Тэ...','Arbuz24','☜верблюжья лапка',
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
            'Ярополк','grizli','Harter','бункерная вошь','КАЛЯСКА МАХАЧЬ',
            'zoro ','Сергеич','Саша','Penis Ebmundovich','besgmo',
            'covid2021','Collectors everywhere','wafhas','ТРАХНИ ТАФФИ',
            'Смотрящий за путями','фрифе','Блестящий член','kira_556',
            'Tankist228','Dark Reg','и запятая','ᗪIᗩᖇY Oᖴ ᒍᗩᑎE*',
            'kittygalor','РУБИКОН','АНУС','Ouen','УРФИН ДЖЮС',
            'Болт','ПЮЗДУН','Дарья Трепова','Кеша Лобков',
            'командир  x','Бандера','⚡☑ᗫoᏰᏒo✪⚡','⚡☑ᗫoᏰᏒo⚡',
            'ВасилиЙ','Зритель','netzv','Двоешник','Поменяйте ник.',
            'vova','veб66','Слепой Пью','Арчи','Lexus','Максим',
            'цып цып цып','ыть','jghkh','Гаврош','Шамиль(чеченец )','УРФИН ДЖЮС]',
            'ВЕЛИКАЯ АМЕРИКА','ADIDAS','ВСУ','Руткит','Надежда Осипова',
            'MAXWELL_777','PLATINUMMAX112','Полковник Мамура','Слепой Пью',
            'Nikita HUEEVICH LOH','Donald','osa22','boss2003',
            '` dont panic&amp;amp; ..','sofia28','kilovatw','ЯНА ВОЛЬКОВА','прямо_к****',
            'ines96','bond666','✔️Чпок','deep777','Pepe','ДжейКей','Джей Кей','Strong78',
            'Бесперспективняк','Поменяйтe ник','болек','Propaganda','tata666'];
            //'⚡Эстонец⚡️','❣ Zlobnyi element ❣☕'

        var userlist = new Map();

        var nickname = document.getElementsByClassName('app-text-overflow')[0].innerHTML;

        if (typeof nickname === 'undefined') { nickname = "" };

        $("div.users-list-wrapper").bind('DOMNodeInserted', function (e) {

            var element = e.target;
            var id = $(element).data('id');                 // id
            var t = $(element).find("span.txt").html();     // nick
            var h = $(element).find("a.nick").attr('href'); // login
            var s = $(element).find("span.role").html();    // status
            var c = $(element).attr('class');               // class

            if (typeof h === 'string') { h = h.replace(/\/user\//,"") } else { h = '' };
            if (typeof t === 'string') { t = t.replace(/^\s+/,"").replace(/\s+<.+$/,"") } else { t = '' };

            if (t != '') {
                var userdata = new Array("","","",false);

                userdata[0] = t;
                userdata[1] = h;
                userdata[2] = s;
                if ( c.search("self") != -1 ) { userdata[3] = true } else { userdata[3] = false };

                userlist.set(id,userdata);
                //console.log(userlist);
            }
        });

        $("div.users-list-wrapper").bind('DOMNodeRemoved', function (e) {
            var element = e.target;
            var id = $(element).data('id');
            var t = $(element).find("span.txt").html();     // nick
            if (typeof id === 'string') {
                userlist.delete(id);
            }
        });

/*==================================================================================*/

        $("div.app-chat").bind('DOMNodeInserted', function (e) {

            var element = e.target;
            var id = $(element).data('id');                          // id
            var $mms = $(element).find("div.chat-text-content");     // message body backup
            var t = $(element).find("div.chat-text-content").html(); // message body
            var n = $(element).find("span.nick-to").html();          // nick
            var l = '';                                              // login
            var s = false;
            var nick_to_subjects = '';
            var is_temp = false;
            var is_author = false;
            var is_me = false;
            var for_me = false;

            var is_ukropitek = false;
            var is_amoral = false;
            var is_spam = false;
            var added_to_ignore = false;

            var is_in_ignorelist = false;
            var message_to_ignored_nick = false;

            const hide_temp_profile = false;
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
                                   "data-title=\"Выпилить\"><i class=\"fa fa-remove btn-saw-out\"></i></button></div>" );
                if(n.toLowerCase() == nickname.toLowerCase()) { is_me = true }

                var userdata = new Array("","","",false);

                userdata = userlist.get(id);

                if (typeof userdata === 'object') {
                    if (userdata[1] == '') { is_temp = true }; l = userdata[1];
                    if (userdata[2] == 'автор') { is_author = true }
                    if (typeof userdata[3] === "boolean") {
                        is_me = userdata[3];
                        if (is_me == true && userdata[0] != nickname) {
                            nickname = userdata[0];
                        }
                    }
                }

                if(n.toLowerCase() != nickname.toLowerCase()) {
                    if (typeof userdata === 'object') { is_spam = antiSpam(userdata[0],t) }
                }

                t = antiCapsMat(t);

                $($mms).html(t);

//                if (t.search("🐖") != -1 || t.search("🐷") != -1) { is_ukropitek = true }
                if (t.search("🐖") != -1) { is_ukropitek = true }
                if (t.search("🤮") != -1 || t.search("🤡") != -1 || t.search("🐓") != -1 ||
                   (t.search("😭") != -1 && is_me != true)) { is_amoral = true }

                var reg = new RegExp();

                for(let i = 0; i < ignorelist_nick.length; i++){

                    if (hide_in_message == true) {
                        reg = new RegExp("<span[^<>]+>[^<>]*" + escapeRegExp(ignorelist_nick[i]) + "[^<>]*</span>",'i');
                        if (t.search(reg) != -1) { message_to_ignored_nick = true };
                    }
                    if(ignorelist_nick[i].toLowerCase() == n.toLowerCase()) {
                      is_in_ignorelist = true;
                    }
                }

                var now = new Date();
                var ticks = now.getTime();
                var date_diff = 0;

                for(let i = 0; i < ignorelist.length; i++){
//                  console.log(ignorelist[i]);
                    // [0] nick [1] login [2] instruction [3] ignore time offset [4] modification time
                    // [2] instruction: 0: блокировать по нику; 1: блокировать по логину; 2: блокировать по логину и нику;
                    // [2] instruction: 3: - бан на день нику для временных ников;
                    // [2] instruction: 4: - бан на день по логину и нику;

                    date_diff = ticks - new Date(ignorelist[i][3]).getTime();

                    if(is_temp == false && (
                       ((ignorelist[i][2] == 0 || ignorelist[i][2] == 2) && ignorelist[i][0].toLowerCase() == n.toLowerCase()) ||
                       ((ignorelist[i][2] == 1 || ignorelist[i][2] == 2) && ignorelist[i][1].toLowerCase() == l.toLowerCase()) ))
                    {
                              if (date_diff >= 8640000000 ) // удаление через 100 дней
                              {
                                  ignorelist.splice(i, 1);
                                  is_in_ignorelist = false;
                              } else {
                                  is_in_ignorelist = true;
                              }
                    } else if (ignorelist[i][2] == 3 && ignorelist[i][0].toLowerCase() == n.toLowerCase()) {
                              is_in_ignorelist = true;
                    } else if (ignorelist[i][2] == 4 && ignorelist[i][0].toLowerCase() == n.toLowerCase()) {
                              if (date_diff >= 86400000 ) // удаление через 1 день
                              {
                                  ignorelist.splice(i, 1);
                                  is_in_ignorelist = false;
                              } else { is_in_ignorelist = true; }
                    }
                }

                var nick_to_tags = t.match(/<span[^<>]+>[^<>]+<\/span>/g);
                var nick_to_tag_data = new Array();
                var nick_to_tag_data_broken = new Array();
                //console.log(nick_to_tags);
                var message_to = new Array();

                if (nick_to_tags != null) {
                    for(let c = 0; c < nick_to_tags.length; c++){
                        nick_to_tag_data = nick_to_tags[c].match(/<span[^<>]+data-client-id="([^<>"]+)">([^<>]+)<\/span>/);
                        //console.log(nick_to_tag_data);
                        //console.log(nick_to_tag_data_broken);
                        //<span class="nick-not-found">` dont panic&amp;amp; ..</span>
                        if (nick_to_tag_data != null) { message_to.push([nick_to_tag_data[1],nick_to_tag_data[2]]) }
                        else {
                            nick_to_tag_data_broken = nick_to_tags[c].match(/<span[^<>]+(nick-not-found)[^<>]+>([^<>]+)<\/span>/);
                            if (nick_to_tag_data_broken != null) {
                                message_to.push([nick_to_tag_data_broken[1],nick_to_tag_data_broken[2]])
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
                                //console.log("nick:" + message_to[c][1] + ",login:" + data[1])
                            }
                        }
                    }

                    if (hide_in_message == true && hide_temp_profile == true && data[0] == '') {

                        reg = new RegExp("<span[^<>]+>" + escapeRegExp(data[0]) + "</span>");

                        if (t.search(reg) != -1) {
                            message_to_ignored_nick = true;
                            if (message_to.length < 1) { break }
                        };
                    }
                }

/*
                if(((is_ukropitek == true && is_me == false) && is_author == false)){
                    let data = new Array("","",0);
                    if (typeof userdata === 'object') {
                    data[0] = nickname;
                    data[1] = userdata[1];
                    ignorelist_nick.push(data);
                    added_to_ignore = true;
                    }
                }
*/

                if(is_in_ignorelist == true || message_to_ignored_nick == true || (is_temp == true && hide_temp_profile == true) ||
                   (is_ukropitek == true && hide_ukropitek == true)){
                    if(is_me == false && is_author == false) {
                      element.remove();
                      s = true;
                    }
                }

                if((is_spam == true && is_me == false && hide_spam == true) ||
                   (is_amoral == true && is_me == false && hide_amoral == true)){
                      element.remove();
                }

                if (typeof userdata === 'object') {
                    var color = "";
                    if (s == true || message_to_ignored_nick == true) {
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

                    console.log("%cchat: " + userdata[0] + ":" + userdata[1] + ":" + userdata[2] + ":" + userlist.size + ":" +
                                (is_temp ? 'is_temp' : '') + ":" + (is_author ? 'is_author' : '') + ":" +
                                (userdata[3] ? 'is_me' : '') + ":" + (for_me ? 'for_me' : '') + ":" +
                                (is_spam ? 'is_spam' : '') + ":" + (is_amoral ? 'is_amoral' : '') + ":" +
                                (is_ukropitek ? 'is_ukropitek' : '') + ":" + (is_in_ignorelist ? 'in_ignorelist': '') + ":" +
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
