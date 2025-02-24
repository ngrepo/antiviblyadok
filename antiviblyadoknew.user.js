// ==UserScript==
// @name        AntiviblyadokNew
// @description Script - Antiviblyadok
// @author      AntiviblyadokNew
// @version     0.6.6
// @updateURL   https://raw.githubusercontent.com/ngrepo/antiviblyadok/main/antiviblyadoknew.meta.js
// @downloadURL https://raw.githubusercontent.com/ngrepo/antiviblyadok/main/antiviblyadoknew.user.js
// @namespace   https://livacha.com/
// @match       https://livacha.com/*
// @connect     livacha.com
// @run-at      document-start
// @noframes
// ==/UserScript==

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

const countries_map = new Map([
        ["AD","🇦🇩"],["AE","🇦🇪"],["AF","🇦🇫"],["AG","🇦🇬"],["AI","🇦🇮"],["AL","🇦🇱"],["AM","🇦🇲"],["AO","🇦🇴"],
            ["AQ","🇦🇶"],["AR","🇦🇷"],["AS","🇦🇸"],["AT","🇦🇹"],["AU","🇦🇺"],["AW","🇦🇼"],["AX","🇦🇽"],["AZ","🇦🇿"],
            ["BA","🇧🇦"],["BB","🇧🇧"],["BD","🇧🇩"],["BE","🇧🇪"],["BF","🇧🇫"],["BG","🇧🇬"],["BH","🇧🇭"],["BI","🇧🇮"],
            ["BJ","🇧🇯"],["BL","🇧🇱"],["BM","🇧🇲"],["BN","🇧🇳"],["BO","🇧🇴"],["BQ","🇧🇶"],["BR","🇧🇷"],["BS","🇧🇸"],
            ["BT","🇧🇹"],["BV","🇧🇻"],["BW","🇧🇼"],["BY","🇧🇾"],["BZ","🇧🇿"],["CA","🇨🇦"],["CC","🇨🇨"],["CD","🇨🇩"],
            ["CF","🇨🇫"],["CG","🇨🇬"],["CH","🇨🇭"],["CI","🇨🇮"],["CK","🇨🇰"],["CL","🇨🇱"],["CM","🇨🇲"],["CN","🇨🇳"],
            ["CO","🇨🇴"],["CR","🇨🇷"],["CU","🇨🇺"],["CV","🇨🇻"],["CW","🇨🇼"],["CX","🇨🇽"],["CY","🇨🇾"],["CZ","🇨🇿"],
            ["DE","🇩🇪"],["DJ","🇩🇯"],["DK","🇩🇰"],["DM","🇩🇲"],["DO","🇩🇴"],["DZ","🇩🇿"],["EC","🇪🇨"],["EE","🇪🇪"],
            ["EG","🇪🇬"],["EH","🇪🇭"],["ER","🇪🇷"],["ES","🇪🇸"],["ET","🇪🇹"],["FI","🇫🇮"],["FJ","🇫🇯"],["FK","🇫🇰"],
            ["FM","🇫🇲"],["FO","🇫🇴"],["FR","🇫🇷"],["GA","🇬🇦"],["GB","🇬🇧"],["GD","🇬🇩"],["GE","🇬🇪"],["GF","🇬🇫"],
            ["GG","🇬🇬"],["GH","🇬🇭"],["GI","🇬🇮"],["GL","🇬🇱"],["GM","🇬🇲"],["GN","🇬🇳"],["GP","🇬🇵"],["GQ","🇬🇶"],
            ["GR","🇬🇷"],["GS","🇬🇸"],["GT","🇬🇹"],["GU","🇬🇺"],["GW","🇬🇼"],["GY","🇬🇾"],["HK","🇭🇰"],["HM","🇭🇲"],
            ["HN","🇭🇳"],["HR","🇭🇷"],["HT","🇭🇹"],["HU","🇭🇺"],["ID","🇮🇩"],["IE","🇮🇪"],["IL","🇮🇱"],["IM","🇮🇲"],
            ["IN","🇮🇳"],["IO","🇮🇴"],["IQ","🇮🇶"],["IR","🇮🇷"],["IS","🇮🇸"],["IT","🇮🇹"],["JE","🇯🇪"],["JM","🇯🇲"],
            ["JO","🇯🇴"],["JP","🇯🇵"],["KE","🇰🇪"],["KG","🇰🇬"],["KH","🇰🇭"],["KI","🇰🇮"],["KM","🇰🇲"],["KN","🇰🇳"],
            ["KP","🇰🇵"],["KR","🇰🇷"],["KW","🇰🇼"],["KY","🇰🇾"],["KZ","🇰🇿"],["LA","🇱🇦"],["LB","🇱🇧"],["LC","🇱🇨"],
            ["LI","🇱🇮"],["LK","🇱🇰"],["LR","🇱🇷"],["LS","🇱🇸"],["LT","🇱🇹"],["LU","🇱🇺"],["LV","🇱🇻"],["LY","🇱🇾"],
            ["MA","🇲🇦"],["MC","🇲🇨"],["MD","🇲🇩"],["ME","🇲🇪"],["MF","🇲🇫"],["MG","🇲🇬"],["MH","🇲🇭"],["MK","🇲🇰"],
            ["ML","🇲🇱"],["MM","🇲🇲"],["MN","🇲🇳"],["MO","🇲🇴"],["MP","🇲🇵"],["MQ","🇲🇶"],["MR","🇲🇷"],["MS","🇲🇸"],
            ["MT","🇲🇹"],["MU","🇲🇺"],["MV","🇲🇻"],["MW","🇲🇼"],["MX","🇲🇽"],["MY","🇲🇾"],["MZ","🇲🇿"],["NA","🇳🇦"],
            ["NC","🇳🇨"],["NE","🇳🇪"],["NF","🇳🇫"],["NG","🇳🇬"],["NI","🇳🇮"],["NL","🇳🇱"],["NO","🇳🇴"],["NP","🇳🇵"],
            ["NR","🇳🇷"],["NU","🇳🇺"],["NZ","🇳🇿"],["OM","🇴🇲"],["PA","🇵🇦"],["PE","🇵🇪"],["PF","🇵🇫"],["PG","🇵🇬"],
            ["PH","🇵🇭"],["PK","🇵🇰"],["PL","🇵🇱"],["PM","🇵🇲"],["PN","🇵🇳"],["PR","🇵🇷"],["PS","🇵🇸"],["PT","🇵🇹"],
            ["PW","🇵🇼"],["PY","🇵🇾"],["QA","🇶🇦"],["RE","🇷🇪"],["RO","🇷🇴"],["RS","🇷🇸"],["RU","🇷🇺"],["RW","🇷🇼"],
            ["SA","🇸🇦"],["SB","🇸🇧"],["SC","🇸🇨"],["SD","🇸🇩"],["SE","🇸🇪"],["SG","🇸🇬"],["SH","🇸🇭"],["SI","🇸🇮"],
            ["SJ","🇸🇯"],["SK","🇸🇰"],["SL","🇸🇱"],["SM","🇸🇲"],["SN","🇸🇳"],["SO","🇸🇴"],["SR","🇸🇷"],["SS","🇸🇸"],
            ["ST","🇸🇹"],["SV","🇸🇻"],["SX","🇸🇽"],["SY","🇸🇾"],["SZ","🇸🇿"],["TC","🇹🇨"],["TD","🇹🇩"],["TF","🇹🇫"],
            ["TG","🇹🇬"],["TH","🇹🇭"],["TJ","🇹🇯"],["TK","🇹🇰"],["TL","🇹🇱"],["TM","🇹🇲"],["TN","🇹🇳"],["TO","🇹🇴"],
            ["TR","🇹🇷"],["TT","🇹🇹"],["TV","🇹🇻"],["TW","🇹🇼"],["TZ","🇹🇿"],["UA","🇺🇦"],["UG","🇺🇬"],["UM","🇺🇲"],
            ["US","🇺🇸"],["UY","🇺🇾"],["UZ","🇺🇿"],["VA","🇻🇦"],["VC","🇻🇨"],["VE","🇻🇪"],["VG","🇻🇬"],["VI","🇻🇮"],
            ["VN","🇻🇳"],["VU","🇻🇺"],["WF","🇼🇫"],["WS","🇼🇸"],["XK","🇽🇰"],["YE","🇾🇪"],["YT","🇾🇹"],["ZA","🇿🇦"],
            ["ZM","🇿🇲"],["ZW","🇿🇼"]]);

        var AntiviblyadokEnabled = true;

        var userlist = new Map();
        var msglist = new Map();
        var users_max = 0;
        var ml_timer = 0;

        const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

        const ignore_time = 86400000 * 1195 // время игнора в днях 1195 - 3 года           //86400000 - 1 день
        const ignore_temp_time = 86400000 // время игнора временных профилей - 1 день
        const ignore_spam_time = 60000 * 60 * 6 // время игнора спамеров 6 часов           //60000 - 1 минута
        const remove_from_pending_time = 86400000 * 3 // время игнора в днях               //86400000 - 1 день

        var ignorelist = new Array();
        var SpamArray = new Array();

        var ignorelist_nick = ['Поменяйте ник','Поменяйтe ник'];

        const filtering_enabled = true; // фильтрация стримов включена
        const hide_unpopular = false; // скрыть с низким рейтингом
        const hide_locked = true; // скрыть запороленные шлюх и дрочил

        var ignorelist_stream = [
                                 ['Психея','m94794','наставила выблядков в модерасты'],
/*не разбанивать ёбнутое чмо*/   ['KISS ME','KatyaLeto','чмо, кидает в чс'],
                                 ['TiVi','tivi','шлак'],
                                 ['✅ᗫoᏰᏒo','Nevskiy','шлак'],
                                 ['ВероНика','rfgecnf','шлак'],
//                                 ['Брюня','jovtoblakitna','хохлопидорша, кидает в чс'],
                                 ['$$$ Капитан Америка $$$','vaso12345','пиндосское уг'],
                                 ['Δημήτριος Ντουρμουσίδης','ivanov78','ебанутый грек'],
                                 ['БИЗНЕСВУМЕН','buzzazals','чушь'],
                                 ['Зачот','svet260492','какой то ебанат унылый'],
                                 ['','filippk2555','пиндосский старый жид'],
/*не разбанивать ёбнутое чмо*/   ['','yourdirty_desire','свинья канадская банит'],
/*не разбанивать ёбнутое чмо*/   ['sumkina','sumkina','сукина'],
                                 ['','vdamkah','жаба'],
                                 ['','vasily_alibabaich','изврот'],
                                 ['','julia-S','инвалид'],
                                 ['','damka','жаба'],
                                 ['','EDS','алкаш'],
                                 ['','Stepnyak','неприятный очкир'],
                                 ['','zlobik','хохлопидор с куива'],
                                 ['','valdemar_ogly','русофобский пидор старый'],
//                                 ['','shursheshon','шиза инетная'],
                                 ['','zeeko','хуйло с еблом навального'],
                                 ['','cj_manylighter','уг'],
                                 ['','bumer','уг'],
                                 ['','boomer254','уг'],
                                 ['','Absolut','хохлопидор с куива'],
                                 ['','LaS_WeGas','грузинское чмо русофобское'],
                                 ['','White_Zoombie','грузинское чмо русофобское'],
                                 ['','Los_Vladus','грузинское чмо русофобское'],
                                 ['','filanda','инвалид'],
                                 ['','Filanday','инвалид'],
                                 ['','PIZDANCE','шлак'],
                                 ['','Budkin','пиндосское чмо, унтерменш'],
                                 ['','stepdaddy','унылое'],
                                 ['','agrippa_perturbaciya','шиз какой то'],
//                                 ['Кристина','kris_top','интернет проститутка, банит'],
/*не разбанивать ёбнутое чмо*/   ['','Clay','пездна банит неоднократно'],
                                 ['','Karina-kim20','проститутка с бонги банит'],
                                 ['','mudila88855','инвал из кунсткамеры'],
/*не разбанивать картавую мразь*/['Рома','Mavkaa','из-за этой мрази забанили по айпи, в очередной раз внесла в чёрный список чмо, многократно'],
//                                 ['Шеф','Dillinger','чмо уфимское, банит как крыса в других трансляциях'],
                                 ['*(Real) Ya- Bog (999)*','vladimir_gennad','урка, либераст'],
                                 ['','nadin27nadin','держит ублюдков модерастов и сама банит'],
                                 ['Лакомый агнетц','karps','шлак'],
                                 ['грешницы','sed_kid_kat','неприятно смотреть'],
                                 ['Nadin21','nadin21"','держит ублюдков модерастов и сама банит'],
                                 ['alice_noire','alicenoire','рестрим хуеты'],
                                 ['⚡✪ У л Ё т ✪⚡','ulyot','чушь'],
                                 ['DJ  ВОЛЬДЕМАР','VOIDEMAR','чушь'],
                                 ['Анна','annaq123679','шаболда'],
                                 ['Женя Жданов','zhenya_zhdanov','дрочила'],
                                 ['Nublin157','stylo','уг какое то'],
                                 ['D£√ȋȽ ȟ£ȽȽ','DevilHell','ещё одно непонятное'],
                                 ['чаkи','gfgf300','старая бандера банит'],
                                 ['ＯｍｎｉＳｙｎｃ','OmniSync','чушь'],
                                 ['Freddy Black','freddy_black','шиз'],
                                 ['Бездна','vkontakte_189476012','жируська'],
                                 ['METALHEAD','brutal','чушь'],
                                 ['Julia S','julia_s','инвалид'],
                                 ['Музяка','club','шлак'],
                                 ['АЛКОТЕСТЕР','alkotester','шлак'],
                                 ['Harter','harter','отродье банит у шлюхеи'],
                                 ['ADIDAS','gucci_kapitan','русофоб с еблом навального'],
                                 ['*KАТЁНОК*','apr12820','ебанутая дура'],
                                 ['ВАСЯ  ГРАДУС','Fgk6eju','пиндос'],
                                 ['Вася  Градус','Amadei666','пиндос'],
                                 ['Нана','Nana1610','свинья с самомнением'],
///*не разбанивать тп суку*/       ['Луна 2010','luna_2010','много акков забанила сучара'],
/*шизофреник рахит*/             ['Мультик©™','Daryna','остоебавший хихикающий уебан'],
///*не разбанивать унылую*/        ['Алинка Сергеевна','Alinka_Sergeevna','забанила низачто ёбнутая, при чём ни раз.'],
                                 ['Милка Попова','milka_popova1','забанила из-за минетки'],
                                 ['Вероника Сергеевна','sdfdghj','у ёбнутой чат всегда для друзей'],
                                 ['ღ_Лялька_ღ✔','Lyalka','уёбищный транс, у которого для друзей'],
                                 ['vI.NADIN21','vl_nadin21','мразота с банщями модерастами'],
                                 ['Реалка','yuliya1237','свидомое отродье с днепропетровска банит'],
/*не разбанивать ёбнутое чмо*/   ['ponterka..','ponterka1986','животное банит часто, лживая пизда'],
/*не разбанивать ёбнутое чмо*/   ['BEZDNA','BEZDNA','из-за этого животного забанили по айпи, нажаловалась видимо мразь, постоянно банит животное'],
                                 ['Arbuz24','arbuz','либераст, нетвойнист, унылый'],
///*не разбанивать грушеёблое чмо*/['RadioXoi','radioxoi','прихуевший выблядок олигофрен банит'],
                                 ['Да, я тАкАя -))','kjuzkjz','не разбанивать минетку ебучую нацистску'],
                                 ['yaroslav','yaroslav','педояр надоел мелькать в трансляциях'],
                                 ['-= ЮлА =-','dno','дура не отвечает в чатах, в игнор'],
//                                 ['Виктор72rus','vviktor','лохотай не интересный мелькает в трансляциях'],
/*не разбанивать ёбнутое чмо*/   ['Древнее Зло','drevneezlo','чмо банило у кахтавой мхази'],
                                 ['LaS-WeGas','LaS-WeGas','русофобское чмо из грузии'],
                                 ['НИЧЕГО НЕ ПОНИМАЮ','orakul','ебаная рожа, прохвост'],
                                 ['Фаллоимитатор','aleksej_vagner','ёбнутый выблядок старый какой то'],
///*овцу не разбанивать*/          ['Милка Попова','mila_popova','забанила за то что мужик пришёл поговорить'],
                                 ['Marlon Brando','MarlonBrando','хохлопидор мурлон, друг падлы минетки банил'],
                                 ['Юсичка','usichka','хохлопидоргша свидомитовая'],
                                 ['дашка','ddashkakashkaa','банит за каждый чих тупоголовая свинья'],
                                 ['fun','fun777','шиз какой то'],
                                ];
        var whitelist_stream = [
                                ['Дѻктѻр','flus'],
                                ['⚡️Эстонец⚡️','esstonec'],
                                ['☆Серж ROCK☆','SergRock'],
                                ['vodka0404','vodka0404'],
                                ['Православный Кулак','r177688730m2'],
                                ['Алька-кексик','alka_keksik'],
//                                ['Милка Попова','milka_popova1'],
                                ['Vadik_Crypto','vadim_zolotko'],
                                ['Crazy Fox','crazyfox'],
                                ['Вязальный Пепелац','sailorleviafan'],
                                ['artem623111','artem623111'],
                                ['⚡️ЭСТОНЕЦ⚡️','estonec666'],
                               ];

        var author_user_id;
        var author_nickname;
        var author_profile;
        var nickname_self;
        var profile_self;
        var user_id_self;

        var msglist_loaded = false;

        const ignore_nick_uid_country = 0;
        const ignore_profile_uid_country = 1;
        const ignore_all_params = 2;
        const ignore_temp_profile = 3;
        const ignore_permanent = 4;
        const ignore_pending = 5;

        const send = 0;
        const recv = 1;
//        let e_app_nickname = document.getElementsByClassName("app-nickanme")[0]; // old
//        let e_app_nickname = document.getElementsByClassName("nickname text-truncate")[0].getElementsByTagName("strong")[0].getElementsByTagName("a")[0];;

function markDuplicate(array){
    let countItems = {};

    for(let i = 0; i < array.length; i++) {
        if (countItems[array[i]] = countItems[array[i]]) {
            countItems[array[i]] + 1;
            array[i] = undefined;
        } else { countItems[array[i]] = 1 }
    }

//    console.log(array);
//    console.dir(Object.keys(countItems));
}

function SaveData(autoremove) {
//========================New==========================
// [0] nick [1] login [2] instruction [3] ignore time offset [4] modification time [5] counter
// [6] comment [7] country [8] uid [9] unban time [10] reserved
//=======================================================
// [2] instruction: 0: - блокировать по нику + uid с разбаном по значению константы в днях в коде
// [2] instruction: 1: - блокировать по логину + uid с разбаном по значению константы в днях в коде
// [2] instruction: 2: - блокировка по всем параметрам с разбаном по значению константы в днях в коде
// [2] instruction: 3: - игнор на день по нику и стране для временных профилей
// [2] instruction: 4: - перманентный игнор по всем параметрам
// [2] instruction: 5: - добавлено в счётчик, в ожидании игнора
// [2] instruction: 6: - reserved
// [2] instruction: 7: - reserved
//const ignore_nick_uid_country = 0;
//const ignore_profile_uid_country = 1;
//const ignore_all_params = 2;
//const ignore_temp_profile = 3;
//const ignore_permanent = 4;
//const ignore_pending = 5;
//=====================================================
    let ignorelist_loaded = new Array();
    let ignorelist_temp = new Array();
    let a1 = new Array();
    let a2 = new Array();

    if(typeof(localStorage) != 'undefined' ) {
        if(window.localStorage.getItem('ignorelist')){
                ignorelist_loaded = JSON.parse(window.localStorage.getItem('ignorelist'));
            }
    }
//console.log(ignorelist_loaded);
//console.log(ignorelist);

    if (ignorelist_loaded.length > ignorelist.length) {
		a1 = ignorelist_loaded.slice(0);
		a2 = ignorelist.slice(0);
        console.log("ignorelist_loaded.length:" + ignorelist_loaded.length + " + " + "ignorelist.length:" + ignorelist.length)
	} else {
		a1 = ignorelist.slice(0);
		a2 = ignorelist_loaded.slice(0);
        console.log("ignorelist.length:" + ignorelist.length + " + " + "ignorelist_loaded.length:" + ignorelist_loaded.length)
	}

    if (ignorelist_loaded !== undefined || ignorelist_loaded.length > 0) {
    markDuplicate(a1);
    markDuplicate(a2);

    let existsUID = false;
    let existsProfile = false;
    let existsNick = false;
    let c = 0;

    for(let i = 0; i < a1.length; i++) {
        existsUID = false;
        existsProfile = false;
        existsNick = false;

        for(c = 0; c < a2.length; c++) {
            if (a1[i] != undefined && a2[c] != undefined && a1[i] != '' && a2[c] != '') {
                if ((a1[i][8] == a2[c][8] && (a1[i][8] != '' || a2[c][8] != ''))) { existsUID = true;}
                if (a1[i][1] == a2[c][1]) { existsProfile = true;}
                if (a1[i][0] == a2[c][0]) { existsNick = true;}
                if (existsUID == true || existsProfile == true || existsNick == true) { break; }
            }
        }

       function checkForRemoveEntry(in_item,out_array) {
           let now = new Date();
           let ticks = now.getTime();

           if ( autoremove == true && (((ticks - in_item[3]) > in_item[9])) ) {
               console.log("%cantyviblyadok(" + ((now.getHours() < 10 && now.getHours() >= 0) ? "0" + now.getHours() : "") +
                                    ":" + ((now.getMinutes() < 10 && now.getMinutes() >= 0) ? "0" + now.getMinutes() : "") + "): " +
                                    "nick:" + in_item[0] + "|login:" + in_item[1] +
                                    "|удалён из игнорлиста по истечению времени > " +
                                    ((in_item[2] == ignore_nick_uid_country) ? "ignore_nick_uid_country" : "") +
                                    ((in_item[2] == ignore_profile_uid_country) ? "ignore_profile_uid_country" : "") +
                                    ((in_item[2] == ignore_all_params) ? "ignore_all_params" : "") +
                                    ((in_item[2] == ignore_temp_profile) ? "ignore_temp_profile" : "") +
                                    ((in_item[2] == ignore_permanent) ? "ignore_permanent" : ""),
                                    ((in_item[2] == ignore_pending) ? "ignore_pending" : ""),
                                    'background: LemonChiffon; color: red');
           } else { out_array.push(in_item) }
       }

        if (existsUID == true || existsProfile == true || existsNick == true ) {
                if (a1[i][4] < a2[c][4]) { // код удаления по timeoffset
                    checkForRemoveEntry(a2[c],ignorelist_temp);
                } else {
                    checkForRemoveEntry(a1[i],ignorelist_temp);
                }
        } else { // добавление элемента - если не присутствует в массиве
            if (a1[i] != undefined && a1[i] != '') {
                ignorelist_temp.push(a1[i]);
            }
            if (a2[c] != undefined && a2[c] != '') {
                ignorelist_temp.push(a2[c]);
            }
        }
    }
    } else (ignorelist_temp = ignorelist.slice(0))

console.log("Func SaveData:");
console.log(ignorelist_temp);
      if((typeof(localStorage) != 'undefined') && (ignorelist_temp.length > 0)) { localStorage.setItem('ignorelist', JSON.stringify(ignorelist_temp)) }
}

function MsgClick(e) {
    var element = e.parentElement;
    if (element == undefined) return;
    var ServiceTag = e.parentElement.getElementsByClassName("service-tag")[0];
    var TextBody = e.parentElement.getElementsByClassName("text-body")[0];

    if (typeof TextBody !== 'undefined') {
        e.parentElement.innerHTML = '<div class="text service-tag" style="display: inline" ondblclick=MsgClick(this);>' +
        ServiceTag.innerHTML + '</div> ' + TextBody.innerHTML;
        TextBody.remove;
    } else {
        let service_tag_html = '<div class="text service-tag" style="display: inline" ondblclick=MsgClick(this);>' +
        ServiceTag.innerHTML + '</div>';
        let text_body_html = e.parentElement.innerHTML.replace(ServiceTag.outerHTML,'');
        e.parentElement.innerHTML = service_tag_html + '<div class="text text-body" style="display: none">' + text_body_html + '</div>';
    }
}

function AddToIgnoreList(e) {
    if (AntiviblyadokEnabled == false) { return }

//========================New==========================
// [0] nick [1] login [2] instruction [3] ignore time offset [4] modification time [5] counter
// [6] comment [7] country [8] uid [9] unban time [10] reserved
//=======================================================
// [2] instruction: 0: - блокировать по нику + uid с разбаном по значению константы в днях в коде
// [2] instruction: 1: - блокировать по логину + uid с разбаном по значению константы в днях в коде
// [2] instruction: 2: - блокировка по всем параметрам с разбаном по значению константы в днях в коде
// [2] instruction: 3: - игнор на день по нику и стране для временных профилей
// [2] instruction: 4: - перманентный игнор по всем параметрам
// [2] instruction: 5: - добавлено в счётчик, в ожидании игнора
// [2] instruction: 6: - reserved
// [2] instruction: 7: - reserved
//const ignore_nick_uid_country = 0;
//const ignore_profile_uid_country = 1;
//const ignore_all_params = 2;
//const ignore_temp_profile = 3;
//const ignore_permanent = 4;
//const ignore_pending = 5;
//=====================================================
    var element = e.parentElement.parentElement;
    if (element == undefined) { return; }
    var id = element.getAttribute('data-id');                                 // id
//    var nn = element.querySelector('strong.nick, strong.nick-to').innerHTML;  // nick from tag

    if (typeof msglist.get(id) == undefined) { return; }
    var profile = msglist.get(id).owner.info.profile.replace(/\/user\//,'');
    var nickname = msglist.get(id).owner.nickname;
    var uid = msglist.get(id).owner.info.uid;
    var owner = msglist.get(id).owner.owner; if (owner == undefined) {owner = false}
    var self = msglist.get(id).owner.self; if (self == undefined) {self = false}
    var country = msglist.get(id).owner.info.country_iso;
    var exists = false;
/*
    console.log('Nick from tag:' + nn);
    console.log(id);
    console.log(nickname);
    console.log(profile);
    console.log(uid);
    console.log(owner);
    console.log(self);
    console.log(country);
*/

    if (id === null) { return } // для только что забаненных в чате, проверить ещё это
    if (owner == true) {
        alert('Нельзя добавить в игнор автора!');
        return;
    }
    if (self == true || nickname == nickname_self) {
        alert('Нельзя добавить в игнор себя!');
        return;
    }

        let mode = -1;
        let comment = "выблядок";
        if (profile == '' && nickname != '' && confirm("Добавить в игнор временный профиль \"" + nickname + "\"?")) { mode = ignore_temp_profile }
        if (profile != '' && nickname != '') {
            if (confirm("Добавить в игнор \"" + nickname + "\" по логину + uid ?")) { mode = ignore_profile_uid_country }
            if (nickname != "Поменяйтe ник" && confirm("Добавить в игнор \"" + nickname + "\" по никнейму + логину + uid ?")) { mode = ignore_all_params }
            if (mode != -1) { comment = prompt("Комментарий:","выблядок") }
            if (comment == null) { mode = -1 }
        }

        let index;
        let date = new Date();

        if (mode != -1) {
                    for(let i = 0; i < ignorelist.length; i++) {
                        if (ignorelist[i] != undefined) {
                            if ((ignorelist[i][0] == nickname && ignorelist[i][1] == profile) ||
                                 (ignorelist[i][0] == nickname && ignorelist[i][1] == '')) { exists = true; index = i; break; }
                        }
                    }

                    if (exists == false) {

                        if (profile == '' && nickname != '' && uid == 0) {
                            ignorelist.push([nickname,profile,ignore_temp_profile,date.getTime(),date.getTime(),[0,0,0],comment,country,uid,ignore_temp_time,0]);
                            console.log("Добавлен в игнор кнопкой в чате: " + nickname + ": на 1 день по нику для временного профиля");
                            //console.log(ignorelist);
                            SaveData(true);
                        }
                        if (profile != '' && nickname != '' && uid != 0) {
                            ignorelist.push([nickname,profile,ignore_all_params,date.getTime(),date.getTime(),[0,0,0],comment,country,uid,ignore_time,0]);
                            console.log("Добавлен в игнор кнопкой в чате: " + nickname + "|" + profile + "|" + uid + ": на " +
                                        ignore_time / 86400000 + " дней по логину");
                            //console.log(nickname);
                            //console.log(ignorelist);
                            SaveData(true);
                        }
                    } else {
                        if (ignorelist[index][2] == ignore_pending) {
                            ignorelist[index][2] = ignore_all_params;
                            ignorelist[index][3] = date.getTime();
                            ignorelist[index][4] = date.getTime();
                            ignorelist[index][6] = comment;
                            ignorelist[index][9] = ignore_time;
                            console.log("Добавлен в игнор кнопкой в чате: " + nickname + "|" + profile + "|" + uid + ": на " +
                                        ignore_time / 86400000 + " дней по логину");
                            //console.log("Добавлен в игнор кнопкой в чате: " + nickname + ": на 1 день по нику для временного профиля");
                            console.log(ignorelist);
                            SaveData(true);
                        } else {
                            console.log("already exists in ignorelist: " + nickname + "|" + profile + "|" + uid );
                        }
                    }

            let useritem;

            document.querySelectorAll('.mess-row').forEach(function (userItem) { // снести все сообщения из чата заигноренного
                if (userItem.getAttribute('data-id').owner != undefined) {
                    useritem = msglist.get(userItem.getAttribute('data-id')).owner;
                    //console.log(useritem.nickname + "|" + nickname + ":" + useritem.info.profile +"|/user/" + profile + ":" + useritem.info.uid + "|" + uid );
                    if (useritem != undefined) {
                        if (useritem.nickname == nickname && useritem.info.profile == ("/user/" + profile) && useritem.info.uid == uid ) {
                            userItem.remove();
                        }
                    }
                }
            });

        element.remove();
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

function RemoveFromIgnore(nickname,profile,uid,savedata)
{
    let args = '';
    let counter = 0;

    function markDuplicate(array){
        let countItems = {};

        for(let i = 0; i < array.length; i++) {
            if (countItems[array[i]] = countItems[array[i]]) {
                countItems[array[i]] + 1;
                array[i] = undefined;
            } else { countItems[array[i]] = 1 }
        }

//    console.log(array);
//    console.dir(Object.keys(countItems));
    }

    function rem(array,index){
        array[index] = undefined;
        counter += 1;
//        if ((nickname !== false && nickname != undefined) || (profile !== false && profile != undefined) ||
//            (uid !== false && uid != undefined) || (savedata !== false && savedata != undefined)) save();
    }

    if (nickname != undefined && nickname != '' && isNaN(Number(nickname)) && nickname !== false ) { args += 'n' }
    if (profile != undefined  && profile != '' &&  profile !== false )  { args += 'p' }
    if (uid != undefined      && uid != '' && uid !== false)      { args += 'u' }
    if (nickname != undefined && profile == undefined && uid == undefined && !isNaN(Number(nickname)) && nickname !== false )
    { args += 'u'; uid = nickname; }

    for(let i = 0; i < ignorelist.length; i++) {
        if (ignorelist[i] == undefined) { continue }

        switch (args) {
            case 'npu':
                if ((ignorelist[i][8] == uid && ignorelist[i][8] != '') &&
                    (ignorelist[i][1].toLowerCase() == profile.toLowerCase() && ignorelist[i][1] != '')
                    && (ignorelist[i][0].toLowerCase() == nickname.toLowerCase() && ignorelist[i][0] != '')) rem(ignorelist,i);
                break;
            case 'np':
                if ((ignorelist[i][1].toLowerCase() == profile.toLowerCase() && ignorelist[i][1] != '')
                    && (ignorelist[i][0].toLowerCase() == nickname.toLowerCase() && ignorelist[i][0] != '')) rem(ignorelist,i);
                break;
            case 'pu':
                if ((ignorelist[i][8] == uid && ignorelist[i][8] != '') &&
                    (ignorelist[i][1].toLowerCase() == profile.toLowerCase() && ignorelist[i][1] != '')) rem(ignorelist,i);
                break;
            case 'nu':
                if ((ignorelist[i][8] == uid && ignorelist[i][8] != '') &&
                    (ignorelist[i][0].toLowerCase() == nickname.toLowerCase() && ignorelist[i][0] != '')) rem(ignorelist,i);
                break;
            case 'n':
                if (ignorelist[i][0].toLowerCase() == nickname.toLowerCase() && ignorelist[i][0] != '') rem(ignorelist,i);
                break;
            case 'p':
                if (ignorelist[i][1].toLowerCase() == profile.toLowerCase() && ignorelist[i][1] != '') rem(ignorelist,i);
                break;
            case 'u':
                if (ignorelist[i][8] == uid && ignorelist[i][8] != '') rem(ignorelist,i);
                break;
            default:
                console.log("Syntax: remove('nickname','profile','uid',savedata)");
                console.log("Example: remove('nickname','profile','uid')");
                console.log("Example: remove('nickname','profile')");
                console.log("Example: remove('','','uid',false)");
                console.log("Example: remove('uid')");
                return 'No args found';
                break;
        }
    }

    if (counter > 0) {
        if (savedata !== false) { save(); }
        return counter + ' элемент' + (counter > 1 ? 's ' : ' ') + 'удалён'
    } else { return 'Элемент(ы) не найден' }
}

function last(count)
{
    let counter = 0;
    let arr = new Array();

    if (isNaN(count) || count == undefined || count <= 0) {
        counter = 15;
    } else if (count > ignorelist.length) {
        counter = ignorelist.length;
    } else {
        counter = count;
    }

    console.log(counter);

    for (var i = (ignorelist.length - counter); i < ignorelist.length; i++) {
        counter++;
        arr.push(ignorelist[i]);
        //console.log(ignorelist[i]);
    }

    console.log(JSON.stringify(arr));
    console.log(arr);
    return 'ок';
}

exportFunction(AddToIgnoreList, unsafeWindow, { defineAs: "AddToIgnoreList" });
exportFunction(MsgClick, unsafeWindow, { defineAs: "MsgClick" });
exportFunction(OnOffFilter, unsafeWindow, { defineAs: "OnOffFilter" });
exportFunction(RemoveFromIgnore, unsafeWindow, { defineAs: "remove" });
exportFunction(SaveData, unsafeWindow, { defineAs: "save" });
exportFunction(last, unsafeWindow, { defineAs: "last" });
exportFunction(stub, unsafeWindow, { defineAs: "stub" });

function stub(){
    console.log('func stub');
}

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
                    console.log(message);
                    break;
                }
                case 'messRemoved': { // модерастом или владельцем трансляции
                    console.log('messRemoved ============================='); // owner иногда недоступен из msglist.get(message.response.mid);
                    console.log(message);
                    let msg = msglist.get(message.response.mid);

                    console.log(msg);
                    console.log('удалено модерастом (' + (message.response.hasOwnProperty('client') == true ? message.response.client.nickname + ':' +
                                message.response.client.info.profile.replace(/\/user\//,'') + ':' +
                                message.response.client.info.uid : userlist.get(message.response.clientId).nickname + ':' +
                                userlist.get(message.response.clientId).info.profile.replace(/\/user\//,'') + ':' +
                                userlist.get(message.response.clientId).info.uid + '):text:(' +
                                message.response.text + ')') +
                                (msg != undefined ? '):сообщение пользователя(' + msg.owner.nickname + ':' +
                                 msg.owner.info.profile.replace(/\/user\//,'') + ':' + msg.owner.info.uid +
                                 '):text:' + msg.text : '')); // '):text:' + msg.textRaw
                    break;
                }
                case 'messRemovedFiltered': {
                    console.log('messRemovedFiltered =============================');
//                    console.log(message);
//                    let msg = msglist.get(message.response.mid);
                    let usr = userlist.get(message.response.clientId);
                    //console.log(usr);
                    console.log('все сообщения пользователя(' + usr.nickname + ':' + usr.info.profile.replace(/\/user\//,'') + ':' + usr.info.uid + ') удалены');
                    break;
                }
                case 'moderated': {
                    console.log('moderated =============================');
                    console.log('добавлен в модерасты');
                    console.log(message);
                    break;
                }
                case 'moderatedremove': {
                    console.log('moderatedremove =============================');
                    console.log('удалён из модерастов');
                    console.log(message);
                    break;
                }
                case 'baned': { // модерастом или владельцем трансляции
                    console.log('banned =============================');
                    //console.log(message);
                    //console.log(userlist.get(message.response.clientId));
                    console.log('забанен:(' + ((userlist.get(message.response.clientId) != undefined &&
                                message.response.clientId != '') ? userlist.get(message.response.clientId).nickname + ':' +
                                userlist.get(message.response.clientId).info.profile.replace(/\/user\//,'') + ':' +
                                userlist.get(message.response.clientId).info.uid : '"хз"' ) + '):text:(' +
                                message.response.text + ')');
                    break;
                }
                case 'ban': { // модерастом или владельцем трансляции
                    console.log('ban =============================');
                    console.log(message);
                    console.log('бан: ('+ ((userlist.get(message.response.clientId) != undefined &&
                                message.response.clientId != '') ? userlist.get(message.response.clientId).nickname + ':' +
                                userlist.get(message.response.clientId).info.profile.replace(/\/user\//,'') + ':' +
                                userlist.get(message.response.clientId).info.uid : '"хз"' ) + '):text:(' +
                                message.response.text + ')');
                                //userlist.get(message.response.clientId).nickname + ':' +
                                //userlist.get(message.response.clientId).info.profile.replace(/\/user\//,'') + ':' +
                                //userlist.get(message.response.clientId).info.uid + '):text:(' +
                                //message.response.text + ')');
                    break;
                }
                case 'ignor': { // хз кем, возможно автором, непонятно что за чмо
                    //заигнорило или забанило, потом прилетел selfUpdate с баном.
                    console.log('ignor =============================');
                    console.log(message);
                    if (message.type == "added") console.log('added to ignor: (' + userlist.get(message.clientId).nickname + ':' +
                                userlist.get(message.clientId).info.profile.replace(/\/user\//,'') + ':' +
                                userlist.get(message.clientId).info.uid);
                    console.log("хз кем, возможно автором, непонятно что за чмо заигнорило или забанило, потом прилетел selfUpdate с баном (тихий бан).");
                    break;
                }
                case 'banAlert': { // предупреждение от модераста или владельца
                    console.log('banAlert =============================');
                    console.log(message);
                    console.log('alert from:(' + message.response.public.moder.name + ':' +
                                message.response.public.moder.link.replace(/\/user\//,'') + ':' +
                                message.response.public.moder.id + '):for_me:comment:' + message.response.comment);
                    break;
                }
                case 'unban': {
                    console.log('unban =========================');
                    console.log(message);
                    break;
                }
                case 'selfUpdate': { // модерастом или владельцем трансляции
                    console.log('selfUpdate =============================');
                    console.log(message);
                    let usr = message.response.client;
                    //console.log(usr);
                    console.log('self update:(' + usr.nickname + ':' + usr.info.profile.replace(/\/user\//,'') + ':' + usr.info.uid + ')');
                    break;
                }
                case 'updateRoom': {
                    updateUserList(message);
                    break;
                }
                case 'streamsUpdate': {
                    //console.log('streamsUpdate =============================');
                    //console.log(message);
                    break;
                }
                case 'streamOff': {
                    console.log('streamOff =========================');
                    console.log(message);
                    break;
                }
                case 'streamsListUpdate': {
                    //console.log('streamsListUpdate =========================');
                    //console.log(message);
                    setTimeout(function(){filterStreams();},51);
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
                    console.log('subscribe =========================');
                    break;
                }
                case 'notify': { // уведомление об том, что на ваш коментарий ответили
                    console.log('notify =========================');
                    console.log(message);
                    break;
                }
                case 'roomDestroyed': {
                    console.log('roomDestroyed =========================');
                    console.log(message);
                    break;
                }
                case 'site_update': {
                    console.log('site_update =========================');
                    console.log(message);
                    break;
                }
                default:{
                    console.log('default unknown message: ' + message.mess + ' =====================');
                    console.log(message);
                    break;
                }
            }
        }
    }
}

function userAthorized (message) {
    console.log(message);
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
    console.log('profile:' + message.response.client.info.profile.replace(/\/user\//,''));
    console.log('country:' + message.response.client.info.country);
    console.log('country_iso:' + message.response.client.info.country_iso);
    console.log('uid:' + message.response.client.info.uid);
    nickname_self = message.response.client.info.nickname;
    profile_self = message.response.client.info.profile;
    user_id_self = message.response.client.id;
    console.log('nickname_self:' + nickname_self);
    console.log('profile_self:' + profile_self.replace(/\/user\//,''));
    console.log('user_id_self:' + user_id_self);
}

function roomJoin (message) {
    console.log('joined =============================');
    console.log('location: ' + window.location.href);
//===============

    if ( window.location.href.indexOf('https://livacha.com/chat/') != -1 ) {

    var target = document.querySelector("div.chat-messages");

// Конфигурация observer (за какими изменениями наблюдать)
    const config = {
        attributes: true,
        childList: true,
        subtree: true,
    };

// Колбэк-функция при срабатывании мутации
    const callback = function (mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === "childList") {
                if (mutation.target && [...mutation.addedNodes].length) {
                    for (let node of mutation.addedNodes) {
                        if (node.className == 'mess-row') {
                            //console.log(`A child node has been added!`, node);
                            let TimeNowMs = new Date();

                            if (ml_timer == 0) {
                                ml_timer = TimeNowMs.getTime();
                            } else if (ml_timer > 0) {
                                if ((TimeNowMs.getTime() - ml_timer) >= 333) {
                                    msglist_loaded = true;
                                }
                            }
    //                        console.log(ml_timer);
    //                        console.log(TimeNowMs.getTime());
    //                        console.log(msglist_loaded);
                            DispatchChatMessage(node);
                        }
                    }
                }

                if (mutation.target && [...mutation.removedNodes].length) {
                    for (let node of mutation.removedNodes) {
                        if (node.className == 'mess-row') {
                            //console.log(`A child node has been removed!`, node);

                            var element = document.querySelector("div.chat-messages");

                            if (typeof element === 'object' && element != undefined && typeof element.getAttribute == 'function') {
                                var id = element.getAttribute('data-id');

                                if (id != undefined) {

                                //console.log("%cэлемент удалён из div.chat-messages mid: " + id,'background: LemonChiffon;color: red');
                                //console.log(element);

                                //if (id.length > 0) {
                                    //msglist.delete(id);
                                    //console.log('удалён  из msglist');
                                    //console.log(msglist);
                                //}
                                    let div_chat_mess_count = document.querySelectorAll('.mess-row').length;
                                    if (div_chat_mess_count == 0) div_chat_mess_count = 111;

                                    if (msglist.size >= div_chat_mess_count + 25) {
                                        console.log('msglist size:' + msglist.size);
                                        //console.log(msglist);
                                        let i = 0;
                                        for (let key of msglist.keys()) {
                                            if (i <= 15) msglist.delete(key);
                                            i++;
                                        }
                                        console.log('msglist reduced, size:' + msglist.size);
                                        //console.log(msglist);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };

// Создаём экземпляр наблюдателя с указанной функцией колбэка
    const observer = new MutationObserver(callback);

// Начинаем наблюдение за настроенными изменениями целевого элемента
    observer.observe(target, config);
}
//======================
    userlist.clear; console.log('userlist cleared, size:' + userlist.size);
    msglist.clear; console.log('msglist cleared, size:' + msglist.size);
    console.log(message);
    console.log(userlist);

    let owner_found = false;

    message.response.lastMessages.forEach(function(item, i, arr) {
        if (item.owner == true) {
            author_user_id = item.owner.id;
            author_nickname = item.owner.info.nickname;
            author_profile = item.owner.info.profile;
            owner_found = true;
        }
        if (userlist.has(item.owner.id) == false) {
            userlist.set(item.owner.id,item.owner);
//            console.log('added to userlist');
        };

        msglist.set(item.mid,item);
//         console.log('added to msglist');
    });

    if (owner_found == false) {
        let e_app_nickname = document.getElementsByClassName("nickname text-truncate")[0].getElementsByTagName("strong")[0].getElementsByTagName("a")[0];
        author_nickname = e_app_nickname.innerHTML;                    // nick
        author_profile = e_app_nickname.href.match(/(\/user\/.+)/)[0]; // login
        author_user_id = '';
    }

    console.log(userlist);
    console.log(msglist);
}

function addToUserList (message) {
    console.log('users ==============================');
    userlist.clear; console.log('userlist cleared, size:' + userlist.size);
    console.log(message);

     message.response.list.forEach(function(item, i, arr) {
         userlist.set(item.id,item);

         if (item.owner == true) {
             author_user_id = item.id;
             author_nickname = item.info.nickname;
             author_profile = item.info.profile;
//             console.log(author_user_id);
//             console.log(author_nickname);
//             console.log(author_profile);
         }
     });

     if (userlist.size > users_max) users_max = userlist.size;

//console.log(userlist);
}

function updateUserList (message) {
    //console.log('updateRoom ==========================');
    if ('type' in message.response) {
        //console.log('type in message.response');
//        console.log(message);
        if (message.response.type == 'add') {
            userlist.set(message.response.client.id,message.response.client);
            if (message.response.count > users_max) { users_max = message.response.count }
            //console.log('message.response.count=' + message.response.count + ':users_max=' +
            //users_max + ':users_max*2=' + users_max * 2);
            if (message.response.client.owner == true) {
                author_user_id = message.response.client.id;
                author_nickname = message.response.client.info.nickname;
                author_profile = message.response.client.info.profile;
         }
        }
            //console.log(userlist);
        if (message.response.type == 'remove') {
            if (typeof message.response.client.id === 'string') {
                if (userlist.size >= users_max * 5) {
                    console.log('userlist size:' + userlist.size);
                    //console.log(userlist);
                    let i = 0;
                    for (let key of userlist.keys()) {
                        if (i <= users_max / 4) userlist.delete(key);
                        i++;
                    }
                    console.log('userlist reduced, size:' + userlist.size);
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
/*
                    console.log(message);
                    console.log('nickname:' + message.response.owner.info.nickname);
                    console.log('profile:' + message.response.owner.info.profile);
                    console.log('text:' + message.response.text);
                    console.log('textRaw:' + message.response.textRaw);
                    console.log('textWithSmiles:' + message.response.textWithSmiles);
*/
    //console.log(msglist);
    //console.log('added to msglist');
}

function filterStreams() {
    if (filtering_enabled == false) return;
    let element;
    let nickname;
    let profile;
    let locked;
    let rating;
    let ignored = '';
    let whitelisted = '';
    let in_whitelist = false;
    let div_in_whitelist_exists = false;

    let elements = document.querySelector("div.app-list, div.list-stream").querySelector("div.row").childNodes;
        elements.forEach(function (userItem) {

        element = userItem.querySelector("a");

        if (element != undefined) {
            nickname = element.innerHTML.replace(/^\s+|\s+$/g,'');
            profile = element.href.replace(/.*\/user\//,'');
            rating = userItem.querySelector("span.text-white, span.badge"); // счётчик посетителей
            locked = (userItem.querySelector("i.fa-lock, i.text-danger") != undefined); // признак запароленной трансляции
            div_in_whitelist_exists = (userItem.querySelector("div.stream_whitelisted") != undefined); // признак запароленной трансляции;
            in_whitelist = false;

            for(let i = 0; (i < whitelist_stream.length); i++){
                    if ((whitelist_stream[i][0] == nickname && whitelist_stream[i][0] != '') ||
                        (whitelist_stream[i][1] == profile && whitelist_stream[i][1] != '')) {
                        in_whitelist = true;
                        userItem.appendChild(create("div", { class: 'stream_whitelisted'}));
                    }
            }

            if (locked == true && hide_locked == true && in_whitelist == false) { // скрыть запороленные шлюх и дрочил
                userItem.innerHTML = '';
            }

            if (rating != undefined && hide_unpopular == true && in_whitelist == false) { // скрыть с низким рейтингом
                if (rating.innerHTML == 'Live') {
                    userItem.innerHTML = '';
                    ignored += ':(' + nickname + ',' + profile + ',' + rating.innerHTML + ')';
                }
            }

            if (in_whitelist == false) {
                if ((locked == true && hide_locked == true) == false && ((rating != undefined ? rating.innerHTML == 'Live' : false) && hide_unpopular == true) == false ) {
                    for(let i = 0; i < ignorelist_stream.length; i++){
                        if ((ignorelist_stream[i][0] == nickname && ignorelist_stream[i][0] != '') ||
                            (ignorelist_stream[i][1] == profile && ignorelist_stream[i][1] !='')) {
                            ignored += ':(' + nickname + ',' + profile + (rating != undefined ? ',' + rating.innerHTML : '') + ' (' + ignorelist_stream[i][2] + '))';
                            userItem.innerHTML = '';
                        }
                    }
                }
            } else if (div_in_whitelist_exists == false && in_whitelist == true){
                whitelisted += ':(' + nickname + ',' + profile + (rating != undefined ? ',' + rating.innerHTML : '') + ')';
            }
        } else {
            userItem.innerHTML = '';
        }

        });
    if (ignored != '') { console.log('Streams hidden' + ignored + ';'); }
    if (whitelisted != '') { console.log('Streams whitelisted' + whitelisted + ';'); }
}

window.addEventListener('beforeunload', function(event) {
});

    var w = window.unsafeWindow || window;

    if (w.self != w.top) {
        return;
    }

    function getHostName(url) {
        var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
        if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
            return match[2];
        } else {
            return null;
        }
    }

            this.version = localStorage.getItem('tr-ver') != undefined ? localStorage.getItem('tr-ver') : "0.0.3";

            if(typeof(localStorage) != 'undefined' ) {
                if(window.localStorage.getItem('ignorelist')){
                    ignorelist = JSON.parse(window.localStorage.getItem('ignorelist'));
                }
            }

    setTimeout(function(){filterStreams();},51);

    setInterval(function(){filterStreams();}, 3000);

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

        function escapeHtml(text) {
        	return text
        	.replace(/&/g, "&amp;")
        	.replace(/</g, "&lt;")
        	.replace(/>/g, "&gt;")
        	.replace(/"/g, "&quot;")
        	.replace(/'/g, "&#039;");
        }

        function unescapeHtml(text) {
        	return text
        	.replace(/&amp;/g, "\&")
        	.replace(/&lt;/g, "<")
        	.replace(/&gt;/g, ">")
        	.replace(/&quot;/g, "\"")
        	.replace(/&#039;/g, "'");
        }

        function TextCorrector (s,anticaps,dot,direction) {
            if (typeof s === 'string' && typeof anticaps === 'boolean' &&  typeof dot === 'boolean' ) {

                if (direction == send) {
                    s = s.replace(/наврен/gi,'наверн');
                    s = s.replace(/чтоли/gi,'что ли');
                    s = s.replace(/врядли/gi,'вряд ли');
                    s = s.replace(/вроед/gi,'вроде');
                    s = s.replace(/вроед/gi,'вроде');
                    s = s.replace(/тчо/gi,'вроде');
                    s = s.replace(/из за/gi,'из-за');
                    s = s.replace(/корчое/gi,'короче');
                    s = s.replace(/никогад/gi,'никогда');
//                    s = s.replace(/(хохлопид(и|о)?р(х|г)?)|хохол/gi,'хохлован');
                    s = s.replace(/\:\?$/gi,'?');
                    s = s.replace(/\s*\.{2,}$/gi,'..');
//                    s = s.replace(/\)+\s*$/gi,' :D');
                    s = s.replace(/бошк/gi,'башк');
                    s = s.replace(/рводе/gi,'вроде');
                    s = s.replace(/вонбчка/gi,'вонючка');
                    s = s.replace(/чгео/gi,'чего');
                    s = s.replace(/всегад/gi,'всегда');
                    s = s.replace(/тогад/gi,'тогда');
                    s = s.replace(/сукурво/gi,'секуров');
                    s = s.replace(/когад/gi,'когда');
                }

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
                                //console.log(arrayOfStrings);
                                arrayOfStrings[c] = arrayOfStrings[c].toLowerCase(); // Полный антикапс
                                str = str.toLowerCase();
                                str = str.replace(str[0], str[0].toUpperCase());
                                arrayOfStrings[c] = arrayOfStrings[c].replace(str.toLowerCase(),str);
                            }
                        }
                    }
			    }
                //console.log(arrayOfStrings);
                let result = arrayOfStrings.join(''); // Соединяем обратно

                if (dot == true) {
                    //if (result.search(/.*\[\[\d+\]\]$/) == -1 && result.length > 2) { // твик из-за старого кода в antiShit
                    return result.replace(/([A-ZА-Яa-zа-я]+)(\s*\[\[\d\]\])?$/,'$1.$2'); // Подстановка точки в конце
                } else {
                    return result;
                }
            } else { return undefined }
        }
/*==================================================================================*/
/*
        if ( window.location.href.indexOf('https://livacha.com/post/') != -1 ) {

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
                                var t = $(g).find("div.text").html().replace(/^\s+|\s+$/g,'');;

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

        if ( window.location.href.indexOf('https://livacha.com/post/') != -1 ) {

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
                                var t = $(g).find("div.text").html().replace(/^\s+|\s+$/g,'');;
                                console.log(n); console.log(l); console.log(t);
*/
                        }
                    }, 10);
                    })
                            if ($(nickname).html() !== undefined ) {
                                var n = $(nickname).html();
                                var l = $(nickname).attr('href').replace(/\/user\//,'');
                                var t = $(g).find("div.text").html().replace(/^\s+|\s+$/g,'');;

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

/*==================================================================================*/
        function antiShit(m,anticaps,dot) {
            if (m === undefined) {
                return undefined;
            }

            var fm = new Array('',m,'',[]);
            var reg_triggered;
            var reg_match;

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
            m = m.replace(/^.*<img.*126173.*/, "🤮"); // бриташка
            m = m.replace(/^.*<img.*126401.*/, "🤮"); // бриташка
            m = m.replace(/^.*<img.*126171.*/, "🤮"); // пиндошка

            m = m.replace(/^.*<img.*aaBHZgb9tueQMUzemVxdDvDh38zvhtt5OsW2US4l.*/, "🤮"); // мерзость
            m = m.replace(/^.*<img.*HQrqpmNxtC6HsUorlq5TaeUC2l8N8HoMcuZiJOu9.*/, "🤮"); // мерзость
            m = m.replace(/^.*<img.*sJeEDWS4FiPeqdqJyUEOp0rcKxGXmrP91eI5QsXb.*/, "🥛"); // пивной смайл
            // не учитываем символы в никах:
            let no_span_tag = m.replace(/<span[^<>]+>[^<>]+<\/span>/i,''); let tm;
            tm = no_span_tag.replace(/^.*🇺🇦.*/, "🐖"); if (tm != no_span_tag) { m = tm }
            tm = no_span_tag.replace(/^.*🇬🇧.*/, "🤮"); if (tm != no_span_tag) { m = tm }
            tm = no_span_tag.replace(/^.*🇺🇸.*/, "🤮"); if (tm != no_span_tag) { m = tm }
            tm = no_span_tag.replace(/^.*🏳‍🌈.*/, "🐔"); if (tm != no_span_tag) { m = tm }
            tm = no_span_tag.replace(/.*(і|ї).*/, "🐷"); if (tm != no_span_tag) { m = tm }

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
                '.*зет фашизм|я узк(ий|ая).*': '🐷',
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
                '.*р(((у|ю)з)|(ю(с|з))){1,5}ь?к(е|ие).*': '🐷',
                '.*русо ?(пидор|чмо|свин).*': '🐷',
                '.*( |^)р(у|ю)(с|з){1,2}иш.*': '🐷',
                '.*( |^)р(у|ю)(с|з){1,2}к(ей|ая|ий|ое) (свинья|хуесос|чмо).*': '🐷',
                '.*( |^)р(у|ю)(с|з){1,2}сиян.*': '🐷',
                '.*сдохни р(а|о)с{1,2}ия.*': '🐷',
                '.*ра(си|ис)я.*': '🐷',
                '.*( |^)на рас{1,2}(и|е){1,2}.*': '🐷',
                '.*[c]?дохни\W{1,3} р(у|ю)(с|з){1,2}к.*': '🐷',
                '.*нищета русск.*': '🐷',
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
                '.*русн(и|я|е|ю|ёй).*': '🐷',
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
                '.*( |^)проп(ём|ил|ют|ит).*': '🥛',
                '.*( |^)нап(ютс|ётс|етс|ейс|ейтьс).*': '🥛',
                '.*( |^)бух(ат|ает|нут).*': '🥛',
/*=================================================================*/
                '.*(мать|мамку) (ипу|еб.+)? (св|тв)о(ю|я).*': '😫',
                '.*(тво|сво)\W{1,2} (мам\W|мат\W|бат\W).*': '😫',
/*=================================================================*/
                '.*(с|з|по|па)(дохни|дыхай).*': '😭',
                '.*умри.*': '😭',
                '.*труп.*': '😭',
                '.*пр(а|о)коп.*': '😭',
                '.*юрпоп.*': '😭',
                '.*яйц(а|е)шлёп.*': '😭',
                '.*спид|вич.*': '😭',
                '.*б(о|а)?мж.*': '😭',
                '.*теплотрас.*': '😭',
                '.*мил(о|а)стын.*': '😭',
                '.*бездомн.*': '😭',
                '.*на зон(у|а|ы|е).*': '😭',
                '.*з(э|е)к(у|а|и).*': '😭',
                '.*тюрьм.*': '😭',
                '.*как в хату входить.*': '😭',
                '.*зону топтал.*': '😭',
                '.*сизо.*': '😭',
/*=================================================================*/
            };

            m = $("<tag>" + m + "</tag>");

            var i = 0;
            var o = [];
            $(m).find("img,span,div,a").map(function (i, h) {
                o[i] = $(h);
                $(h).after('[[' + i + ']]').detach();
                i++
            })

            m = $(m).html();

            let shit_found = false;

            for (var key in dict) { // Проверка на список нехороших слов
                let match = m.toLowerCase().match(key);

                if (match != null) {
                    //console.log('spam reg match:');
                    reg_match = match;
                }
                //var reg = new RegExp(key,'i');
                if (m.toLowerCase().search(key) != -1) { // тег для показа скрытого сообщения
                    m = '<div class="text service-tag" style="display: inline;" ondblclick=MsgClick(this);>'
                        + dict[key] + '</div><div class="text text-body" style="display: none">' + m + '</div>';
                    shit_found = true;
                    reg_triggered = key;
                    break;
                }
            };

            if (shit_found == false) {
                m = TextCorrector(m,anticaps,dot,recv);
            }

            o.map(function (h, i) {
                m = m.split("[[" + i + "]]").join(h[0].outerHTML);
            });

            fm[0] = m;
            fm[2] = reg_triggered;
            fm[3] = reg_match;
            return fm;
        }

        function antiSpam(nickname,login,m) {
            if (nickname === undefined || login === undefined || m === undefined) {
                return undefined;
            }

			var tickcount = new Date().getTime();

            const flood_reset_time = 45000;
            const flood_threshold = 3;
            const hard_flood_threshold = 5;

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
                let rawtext = shortstr.toLowerCase();
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
                        let dist = levenshtein(rawtext, SpamArray[c][0]);
                        if (SpamArray[c][4] == 2) {
                            console.log("SpamMatch:" + arr); //SpamArray[c][0]
                        }
                        if (dist > 0) {
                            console.log("Levenstain:" + dist);
                            console.log("shortstr:" + "(" + shortstr + "):" + shortstr.length + " ↓");
                            console.log("rawtext:" + "(" + rawtext + "):" + rawtext.length + " ↓");
                        }
					} else {
						SpamArray.push([shortstr,nickname,login,tickcount,1]);
//                        console.log(shortstr,nickname,login,tickcount,1);
                    }
             }

            if (SpamArray.length >= 500) {
                console.log('spamArray array length:' + SpamArray.length);
                //console.log(SpamArray);
                SpamArray = SpamArray.slice(50,SpamArray.length - 1);
                console.log('spamArray array spliced, lenght:' + SpamArray.length);
                //console.log(SpamArray);
            }

             return result;
        }
/*==================================================================================*/
        var s_timer = setInterval( function () {
            var element = document.querySelector('textarea.form-control');

            if (element != undefined) {
                if ( window.location.href.indexOf('https://livacha.com/chat/') != -1 ) {
                    document.querySelector("textarea.form-control").addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') {
                            var element = e.target;
                            element.value = TextCorrector(element.value,false,false,send);
                            return
                        }
                    },true);
                    console.log('EventListenerAdded:textarea.form-control:keypress');
                    clearInterval(s_timer);
                }
            }
        }, 333);

        var b_timer = setInterval( function () {
            var element = document.querySelector('textarea.form-control');
            if (element != undefined) {
                if ( window.location.href.indexOf('https://livacha.com/chat/') != -1 ) {
                   document.querySelector("div.chat-container").querySelectorAll("button.btn-secondary").forEach(function (userItem) {
                        if (userItem.innerText.indexOf("Послать") != -1 ) {
                            userItem.addEventListener('click', (e) => {
                                let elem = document.querySelector("textarea.form-control");
                                elem.value = TextCorrector(elem.value,false,false,send);
                                return
                            },true)
                            console.log('EventListenerAdded:div.chat-container.button.btn-secondary:click');
                        }
                   })
                    clearInterval(b_timer);
                }
            }
        }, 333);

        var scrollPosition = 0;

        var r_timer = setInterval( function () {
            let elements = document.getElementsByClassName('chat-messages');
            if (elements.length > 0) if (elements[0] != undefined) {

                elements[0].addEventListener('scroll', function () { // получаем позицию ползунка прокрутки
                    scrollPosition = elements[0].scrollTop;
                });

                console.log('EventListenerAdded:DOMNodeInserted:chat-messages:scroll');

                setInterval(function(){
                    let elements = document.getElementsByClassName('chat-messages');  // фикс автопрокрутки рептилоидовича
                    if (elements.length > 0) if (elements[0] != undefined) {
                        if ((Math.abs(elements[0].offsetHeight - elements[0].scrollHeight) - scrollPosition) < 100) {
                            elements[0].scrollTo(0,elements[0].scrollHeight);
                        }
                    }
                }, 1000);

                clearInterval(r_timer);
            }
        }, 53);
/*==================================================================================*/
        function DispatchChatMessage(e) {
//            if (AntiviblyadokEnabled == false) { return }

            var element = e;

            if (typeof element !== 'object' || element === null || typeof element.getAttribute != 'function') {
                return;
            }
            var id = element.getAttribute('data-id'); // id

            if (id == undefined) {
                    return;
            }

            var message = msglist.get(id);

            if (message === undefined) { return }

            var reg = new RegExp();
            var date = new Date();
            var nick_to_subjects = '';
            var is_temp = false;
            var for_me = false;
            var for_author = false;
            var comment = '';
            var div_chat_mess_count = 0;
            var SpamResult;

            var is_rusofob = false;
            var is_rus_flag = ((message.textWithSmiles.search('e6670_8qTlJKQGvWvbOb0fPBpundIQTFT1rWMPtocm0VnI') != -1) ? true : false);
            var is_hohloflag = false;
            var is_amoral = false;
            var is_spam = false;
            var is_restricted_country = false;
            var added_to_ignore = false;

            var is_in_ignorelist = false;
            var is_in_ignorelist_nick = false;
            var message_to_ignored_nick = false;
            var to_nick_from_restricted_country = false;

            const hide_in_message = true;
            const hide_ukropitek = true;
            const hide_amoral = true;
            const hide_spam = true;
            const hide_temp_profile = false;
            const hide_countries = true;
            const hide_temp_not_ru_country = true;
            const hide_all_not_ru_country = false; // доделать !?

            const restrictedCountries = Array ( // boolean true - скрывать так же у зарегеных
            ['UA',false],['NL',true],['VN',true],['GB',false],['EE',false],['FR',true],['PL',false],
            ['US',false],
            ['MD',false],['DE',false],['GE',true],['AT',true],['BA',false],['NO',false],['CL',false],
            ['SE',false],['ES',false],['HU',false],['DZ',false],['DK',false],
            );

            const autoban = true;
            const autoban_rusofob_treshold_msg = 7 ;
            const autoban_hohloflag_treshold_msg = 3 ;
            const autoban_spam_treshold_msg = 10;
            const autoremove_from_ignorlist = true;

            var nickname = message.owner.nickname;
            var profile = (message.owner.info.profile != undefined && message.owner.info.profile != '' ? message.owner.info.profile.replace(/\/user\//,'') : '');
            var mobile = (message.owner.info.mobile != undefined ? message.owner.info.mobile : ''); // с мобильного или нет
            var country = (message.owner.info.country != undefined ? message.owner.info.country : ''); // название страны
            var country_iso = (message.owner.info.country_iso != undefined ? message.owner.info.country_iso : ''); // код страны
            var city = (message.owner.info.city != undefined ? message.owner.info.city : ''); // город
            var uid = (message.owner.info.uid != undefined ? message.owner.info.uid : 0); // внутренний постоянный идентификатор профиля на блеваче
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
            var joinAt = message.owner.joinAt; // дата регистрации
            var is_me = (message.owner.self !== true ? false : true);
            var is_city_changed = (city !== undefined && city != '' ? true : false);

            if (profile == '' && uid == '0' ) { is_temp = true }

            div_chat_mess_count = document.querySelectorAll('.mess-row').length;

                $(element).append( "<div class=\"mess-actions-self\">" +
                                  "<button class=\"btn btn-sm btn-secondary-pre\"" +
                                   "data-title=\"В игнор\" onclick=AddToIgnoreList(this);><i class=\"fa fa-remove btn-saw-out\">" +
                                   "</i></button>" +
                                   "</div>" );

                if(!is_me) { // не обрабатывать antiShit и antiSpam сообщения от себя
                    var antiSpamResult = [];

                    if (!is_rus_flag && msglist_loaded == true) { // не проверять на спам сообщения с русским флагом
                                                                  // и пока не загружены все сообщения при входе в трансу.
                        antiSpamResult = antiSpam(nickname,profile,text);
                    }

                    if (antiSpamResult[0] > 0) { is_spam = true }

                    SpamResult = antiShit(text,false,false);

                    text = SpamResult[0];
                    element.querySelector('span.text').innerHTML = text;
                    //console.log('%antiShit:' + text,'background: LemonChiffon;color: red');
                    //console.log(SpamResult[1]); // данные сообщения для более глубокого разбора
                } else { element.style.backgroundColor = "LemonChiffon" } // WhiteSmoke Azure Honeydew

                //text = antiShit(text,true,false); // обрабатывать сообщения от себя

                if (text.search("🐖") != -1) { is_hohloflag = true };
                if (text.search("🐷") != -1) { is_rusofob = true };
                if ((text.search("🤮") != -1 || text.search("😭") != -1 || text.search('😫') != -1 || text.search('🥛') != -1) &&
                    is_me == false) { is_amoral = true }

                var now = new Date();
                var ticks = now.getTime();
                var date_diff = 0;
                var ignorelist_match = '';
                var ignore_date;

                function isRestrictedCountry(country,temp_profile) {
                    let result = false;
                    for (let i = 0; i < restrictedCountries.length; i++) {
                        if (hide_temp_not_ru_country == true && country != 'RU' && temp_profile == true) {
                            result = true;
                        }
                        if (restrictedCountries[i][0] == country) {
                             if (restrictedCountries[i][1] == true) {
                                 result = true;
                                 break;
                             } else {
                                 if (temp_profile == true) {
                                     result = true;
                                     break;
                                 }
                             }
                        }
                    }
                    return result;
                }

//========================New==========================
// [0] nick [1] login [2] instruction [3] ignore time offset [4] modification time [5] counter
// [6] comment [7] country [8] uid [9] unban time [10] reserved
//=======================================================
// [2] instruction: 0: - блокировать по нику + uid с разбаном по значению константы в днях в коде
// [2] instruction: 1: - блокировать по логину + uid с разбаном по значению константы в днях в коде
// [2] instruction: 2: - блокировка по всем параметрам с разбаном по значению константы в днях в коде
// [2] instruction: 3: - игнор на день по нику и стране для временных профилей
// [2] instruction: 4: - перманентный игнор по всем параметрам
// [2] instruction: 5: - добавлено в счётчик, в ожидании игнора
// [2] instruction: 6: - reserved
// [2] instruction: 7: - reserved
//const ignore_nick_uid_country = 0;
//const ignore_profile_uid_country = 1;
//const ignore_all_params = 2;
//const ignore_temp_profile = 3;
//const ignore_permanent = 4;
//const ignore_pending = 5;
//=====================================================

                function SetVars (i) {
                    ignore_date = new Date(ignorelist[i][3]);
                    date_diff = ticks - ignore_date.getTime();
                    comment = ignorelist[i][6];
                    is_in_ignorelist = true;

                    if (ignorelist[i][2] != 4 && ignorelist[i][2] != 3 && date_diff >= ignore_time) {
                        ignorelist.splice(i, 1);
                        is_in_ignorelist = false;
                        console.log('date_diff >= ignore_time');
                        console.log(nickname + "|" + profile + " удалён из игнорлиста по истечению времени");
                        console.log(ignorelist);
                        return;
                    } else if (ignorelist[i][2] == 3 && date_diff >= 86400000) {
                        console.log('date_diff >= 86400000');
                        ignorelist.splice(i, 1);
                        is_in_ignorelist = false;
                        console.log(nickname + "|" + profile + " удалён из игнорлиста по истечению времени");
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

                    if (ignorelist[i][2] != ignore_temp_profile && ignorelist[i][1] != '') {
                        let ignorelist_match_n = '';
                        if (ignorelist[i][8] == '') {  // автообновление данных выблядков в игнорлисте
                                ignorelist[i][8] = uid;
                                ignorelist_match_n += ((ignorelist_match_n.length > 0) ? "|" : "") + 'u';
                        } else if (ignorelist[i][8] == uid) {
                            if (ignorelist[i][0] != nickname) {
                                ignorelist[i][0] = nickname;
                                ignorelist_match_n += ((ignorelist_match_n.length > 0) ? "|" : "") + 'n';
                            }
                            if (ignorelist[i][1] != profile) {
                                ignorelist[i][1] = profile;
                                ignorelist_match_n += ((ignorelist_match_n.length > 0) ? "|" : "") + 'p';
                            }
                        }
                        if (ignorelist[i][0] != nickname && ignorelist[i][2] != ignore_profile_uid_country) {
                            ignorelist[i][0] = nickname;
                            ignorelist_match_n += ((ignorelist_match_n.length > 0) ? "|" : "") + 'n';
                        }
                        if (ignorelist[i][1] != profile && ignorelist[i][2] == ignore_nick_uid_country) {
                            ignorelist[i][1] = profile;
                            ignorelist_match_n += ((ignorelist_match_n.length > 0) ? "|" : "") + 'p';
                        }
                        if (ignorelist[i][7] != country_iso && (ignorelist[i][1] == profile ||
                            (ignorelist[i][8] == uid && ignorelist[i][8] != ''))) {
                            // если будет страна постоянно обновляться, добавть это: && ignorelist[i][7] == '' сюда, и код для страны в else if
                            ignorelist[i][7] = country_iso;
                            ignorelist_match_n += ((ignorelist_match_n.length > 0) ? "|" : "") + 'c';
                        }
                        if (ignorelist_match_n != '') {
                            ignorelist[i][3] = date.getTime(); ignore_date = new Date(ignorelist[i][3]);
                            ignorelist[i][4] = date.getTime();

                            console.log(ignorelist[i]);
                            console.log('%cignorelist entry updated for (' + nickname + ':' + profile + ':' +
                                        uid + ':' + country_iso + '):old:(' + ignorelist_match + '):new added:(' +
                                        ignorelist_match_n + ')','background: LemonChiffon;color:red');
                            SaveData(autoremove_from_ignorlist);
                            ignorelist_match += ((ignorelist_match.length > 0) ? "|" + ignorelist_match_n : ignorelist_match_n);
                        }
                    }

/*
                    if (ignorelist[i][1] == '' && (ignorelist[i][8] == '0' || ignorelist[i][8] != '')) { // автообновление данных для временных профилей
                        if (ignorelist[i][0] == nickname && ignorelist[i][7] != country_iso) ignorelist[i][7] = country_iso;
                    }
*/
                }

                is_in_ignorelist = false;

                for(let i = 0; i < ignorelist.length; i++){

                if (ignorelist[i] !== null && ignorelist[i] !== undefined) {
                    if (ignorelist[i][2] !== undefined) if (hide_in_message == true && (ignorelist[i][2] != ignore_profile_uid_country)) {
                        reg = new RegExp("<span[^<>]+>" + // .replace(/^\s+|\s+$/g,'');
                        escapeRegExp(escapeHtml(ignorelist[i][0])) + "</span>",'i'); // понаблюдать за определением кому пишут
//console.log(escapeRegExp(escapeHtml(ignorelist[i][0])) + ':' + text);
                        if (text.search(reg) != -1) { message_to_ignored_nick = true };
                        if (message_to_ignored_nick == true) {
//                            console.log(reg);
//                            console.log(message_to_ignored_nick);
                        }
                    }

                    switch(ignorelist[i][2]) {
                        case ignore_nick_uid_country:
                            console.log('ignore_nick_uid_country');
                            if (ignorelist[i][0] == nickname || (ignorelist[i][8] == uid && uid > 0)) {
                                SetVars(i);
                            }
                            break;
                        case ignore_profile_uid_country:
                            //console.log('ignore_profile_uid_country');
                            if (ignorelist[i][1] == profile || (ignorelist[i][8] == uid && uid > 0)) {
                                SetVars(i);
                            }
                            break;
                        case ignore_all_params:
                            //console.log('ignore_all_params');
                            //console.log(nickname);
                            if (ignorelist[i][0] == nickname || ignorelist[i][1] == profile || (ignorelist[i][8] == uid && uid > 0)) {
                                SetVars(i);
                            }
                            break;
                        case ignore_temp_profile:
                            //console.log('ignore_temp_profile');
                            if (ignorelist[i][0] == nickname && ignorelist[i][7] == country_iso && (uid == 0 || uid == undefined || uid == '')) {
                                SetVars(i);
                            }
                            break;
                        case ignore_permanent:
                            //console.log('ignore_permanent');
                            if (ignorelist[i][0] == nickname || ignorelist[i][1] == profile || (ignorelist[i][8] == uid && uid > 0)) {
                                SetVars(i);
                            }
                            break;
                    }
                }

                }

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
                            //console.log(nick_to_tags);
                            if (nick_to_tags != null) {
                                message_to.push([nick_to_tags[1],nick_to_tags[2]]);
                            }
                        }
                    }
                    //console.log("%c" + nickname + " to " + message_to.join('|'),'background: LemonChiffon;color: red');
                }

                for (let key of userlist.keys()) {
                    let data = userlist.get(key);
                    let temp_profile = false; if (data.info.uid == '0') { temp_profile = true }

                    for(let c = 0; c < message_to.length; c++){
                        if (message_to[c][0] == key || message_to[c][0] == "nick-not-found" ) {

                            function add(){
                                let ignorelist_match = '';

                                if (message_to_ignored_nick == true && is_temp == false) {
                                    for(let i = 0; i < ignorelist.length; i++){
                                        if (ignorelist[i] !== null && ignorelist[i] !== undefined) {
                                            if (ignorelist[i][0] == data.nickname && ignorelist_match.indexOf('n') == -1) { ignorelist_match = 'n' }
                                            if (ignorelist[i][1] == data.info.profile.replace(/\/user\//,'') && ignorelist[i][1] != '' &&
                                                ignorelist_match.indexOf('p') == -1) ignorelist_match += ((ignorelist_match.length > 0) ? "|" : "") + 'p';
                                            if (ignorelist[i][8] == data.info.uid && ignorelist[i][8] != '0' && ignorelist[i][8] != '' &&
                                                ignorelist_match.indexOf('u') == -1) ignorelist_match += ((ignorelist_match.length > 0) ? "|" : "") + 'u';

                                            if (ignorelist_match.length > 0 && ignorelist_match.indexOf('c') == -1) {
                                                if (ignorelist[i][7] == data.info.country_iso && ignorelist[i][7] != '' && ignorelist[i][7] != undefined)
                                                { ignorelist_match += "|c"; }
                                            }
                                        }
                                    }
                                }

                                ignorelist_match = ((ignorelist_match.length > 0) ? ignorelist_match = "{" + ignorelist_match + "}" : "");
                                //if (message_to_ignored_nick == true && is_temp == false) {
                                    nick_to_subjects += ((nick_to_subjects.length > 0) ? "|" + message_to[c][1] + ignorelist_match:
                                                         message_to[c][1] + ignorelist_match);

                                //} else {
                                //    nick_to_subjects += ((nick_to_subjects.length > 0) ? "|" + message_to[c][1] + ignorelist_match : message_to[c][1] + ignorelist_match);
                                //}
//console.log('nickname_self:' + nickname_self);
//console.log('data.self:' + data.self);
                                if ( message_to[c][1] == nickname_self && message_to[c][0] == key &&
                                    (data.self !== true ? false : true)) {
                                    for_me = true;
                                    element.style.backgroundColor = "PeachPuff";
                                }
                                    //console.log(author_nickname + ':' + data.info.nickname + ':' + author_profile + ':' + data.info.profile + ':' + data.owner);
                                    //console.log(data);
                                if (author_nickname == escapeHtml(data.nickname) && author_profile == data.info.profile) {
                                    for_author = true;
                                    //console.log(author_profile + ':' + data.info.profile + ':' + data.owner);
                                    //console.log(data);
                                }

                                if (message_to_ignored_nick == false) {
                                    //console.log(data.info);
                                    message_to_ignored_nick = isRestrictedCountry(data.info.country_iso);
                                    to_nick_from_restricted_country = message_to_ignored_nick;
                                }
                            }

                            if (message_to[c][0] == "nick-not-found" && message_to[c][1] == escapeHtml(data.nickname)) { // тут всё верно
                                if (nick_to_subjects.indexOf(message_to[c][1]) == -1) {
                                    add();
                                }
                            } else if (message_to[c][1] == escapeHtml(data.nickname)) {
                                if (nick_to_subjects.indexOf(message_to[c][1]) == -1) {
                                    add();
                                }
                            }
                        }
                    }
                }

                for(let i = 0; i < ignorelist_nick.length; i++){
                    if (hide_in_message == true) {
                        reg = new RegExp("<span[^<>]+>" +
                        //escapeRegExp(ignorelist_nick[i].replace(/^\s+|\s+$/g,'');) + // понаблюдать за определением кому пишут
                        escapeRegExp(escapeHtml(ignorelist_nick[i])) + // понаблюдать за определением кому пишут
                        "</span>",'i');
//console.log(escapeRegExp(escapeHtml(ignorelist_nick[i])) + "|" + text);
                        if (text.search(reg) != -1) { message_to_ignored_nick = true };
//console.log("message_to_ignored_nick:" + message_to_ignored_nick);
                    }
                    if(ignorelist_nick[i] == nickname) {
//                        is_in_ignorelist = true;
                        is_in_ignorelist_nick = true;
                        if (ignorelist_match.length > 0) {
                            ignorelist_match += "|iln";
                            comment = "iln";
                        } else {
                            ignorelist_match += "iln";
                            comment = "";
                        }

                        if (ignore_date === undefined) { ignore_date = new Date(ticks) }
                    }
                }

                is_restricted_country = isRestrictedCountry(country_iso,is_temp);

                if ((is_spam == true || is_hohloflag == true || is_rusofob == true) &&
                    (is_in_ignorelist == false && is_in_ignorelist_nick == false && added_to_ignore == false) &&
                    is_me == false && is_author == false && autoban == true && msglist_loaded == true) { // автобан пидоров
                    let exists = false;
                    let index;

                    for(let i = 0; i < ignorelist.length; i++) {
//========================New==========================
// [0] nick [1] login [2] instruction [3] ignore time offset [4] modification time [5] counter
// [6] comment [7] country [8] uid [9] unban time [10] reserved
//=======================================================
// [2] instruction: 0: - блокировать по нику + uid с разбаном по значению константы в днях в коде
// [2] instruction: 1: - блокировать по логину + uid с разбаном по значению константы в днях в коде
// [2] instruction: 2: - блокировка по всем параметрам с разбаном по значению константы в днях в коде
// [2] instruction: 3: - игнор на день по нику и стране для временных профилей
// [2] instruction: 4: - перманентный игнор по всем параметрам
// [2] instruction: 5: - добавлено в счётчик, в ожидании игнора
// [2] instruction: 6: - reserved
// [2] instruction: 7: - reserved
//const ignore_nick_uid_country = 0;
//const ignore_profile_uid_country = 1;
//const ignore_all_params = 2;
//const ignore_temp_profile = 3;
//const ignore_permanent = 4;
//const ignore_pending = 5;
//=====================================================

                        if (ignorelist[i] != undefined) {
                            if (ignorelist[i][1] != '') {
                                if (ignorelist[i][0] == nickname && ignorelist[i][1] == profile && ignorelist[i][8] == uid) { exists = true; index = i; break; }
                            } else {
                                if (ignorelist[i][0] == nickname && ignorelist[i][1] == '' && ignorelist[i][8] == 0) { exists = true; index = i; break; }
                            }
                        }
                    }
//console.log(exists);
//console.log("profile: " + profile);
                    let reason = '';

                    if (exists == false) {
                        if ((is_spam == true && antiSpamResult[0] >= autoban_spam_treshold_msg) && is_temp == false ){
                            reason = "Причина: спамер (" + antiSpamResult[0] + " повторов) - автобан на " +
                            ignore_spam_time / 3600000 + " часов";
                            ignorelist.push([nickname,profile,ignore_profile_uid_country,date.getTime(),date.getTime(),[0,0,antiSpamResult[0]],
                            reason,country_iso,uid,ignore_spam_time,0]);
                            added_to_ignore == true;
                            console.log("Добавлен в игнор: " + nickname + "|" + profile + "|" + uid + ": на " +
                            ignore_spam_time / 3600000 + " часов по логину + uid");
                            console.log(reason);
                            SaveData(autoremove_from_ignorlist);
                            console.log(ignorelist);
                        }

                        if ((is_hohloflag == true || is_rusofob == true) && is_temp == false){
                            reason = 'Причина:' + (is_rusofob ? ' русофоб' : '') + (is_hohloflag ? ' хохлофлаг' : '');
                            let counter_array = [0,0,0];
                            if (is_hohloflag == true) counter_array[0]++;
                            if (is_rusofob == true) counter_array[1]++;
                            ignorelist.push([nickname,profile,ignore_pending,date.getTime(),date.getTime(),counter_array,reason,country_iso,uid,remove_from_pending_time,0]);
                            console.log("Добавлен в ожидание игнора: " + nickname + "|" + profile + "|" + uid);
                            console.log(reason);
                            SaveData(autoremove_from_ignorlist);
                            console.log(ignorelist);
                        }


                        if ((is_hohloflag == true || is_rusofob == true) && is_temp == true ){
                            reason = 'Причина: ' + (is_rusofob ? ' русофоб' : '') + (is_hohloflag ? ' хохлофлаг' : '') + " (1 раз) - автобан на 1 день";
                            let counter_array = [0,0,0];
                            if (is_hohloflag == true) counter_array[0]++;
                            if (is_rusofob == true) counter_array[1]++;
                            ignorelist.push([nickname,profile,ignore_temp_profile,date.getTime(),date.getTime(),counter_array,
                            reason,country_iso,uid,ignore_temp_time,0]);
                            added_to_ignore == true;
                            console.log("Добавлен в игнор: " + nickname + "|" + profile + "|" + uid + ": на 1 день по логину и нику");
                            console.log(reason);
                            SaveData(autoremove_from_ignorlist);
                            console.log(ignorelist);
                        }

                        if ( (is_spam == true && antiSpamResult[0] >= autoban_spam_treshold_msg) && is_temp == true ){
                            reason = "Причина: спамер (" +
                            antiSpamResult[0] + " повторов) - автобан на " + ignore_spam_time / 3600000 + " часов по нику";
                            ignorelist.push([nickname,profile,ignore_temp_profile,date.getTime(),date.getTime(),[0,0,antiSpamResult[0]],
                            reason,country_iso,uid,ignore_spam_time,0]);
                            added_to_ignore == true;
                            console.log("Добавлен в игнор: " + nickname + "|" + profile + "|" + uid + ": на" + ignore_spam_time / 3600000 + " часов по нику");
                            console.log(reason);
                            SaveData(autoremove_from_ignorlist);
                            console.log(ignorelist);
                        }
                    } else {
                        if (Number(ignorelist[index][5][0]) <= 1 && Number(ignorelist[index][5][1]) <= 1) ignorelist[index][6] = '';
                        // стираем старую причину добавления в ожидание игнора

                        if (is_hohloflag == true && is_temp == false && ignorelist[index][2] == ignore_pending){  // автобан по превышению порога счётчика
                            if (ignorelist[index][5][0] >= autoban_hohloflag_treshold_msg) {
                                reason =  "хохлофлаг (" +
                                (Number(ignorelist[index][5][0])) + " раза) - автобан на " + ignore_time / 86400000 + " дней по профилю и uid";
                                ignorelist[index][2] = ignore_profile_uid_country;
                                ignorelist[index][3] = date.getTime();
                                ignorelist[index][4] = date.getTime();
                                ignorelist[index][6] = ((ignorelist[index][6].search('хохлофлаг') == -1) ? ((ignorelist[index][6] != '') ? ' ; ' : '') + reason : '');
                                ignorelist[index][9] = ignore_time;
                                added_to_ignore == true;
                                console.log("Добавлен в игнор: " + nickname + "|" + profile + "|" + uid + ": на " +
                                ignore_time / 86400000 + " дней по логину");
                                SaveData(autoremove_from_ignorlist);
                                console.log(ignorelist);
                            } else {
                                if (isNaN(ignorelist[index][5][0]) == false) { // обновление счётчика
                                    ignorelist[index][5][0] = Number(ignorelist[index][5][0]) + 1;
                                } else {
                                    ignorelist[index][5][0] = 1;
                                }

                                SaveData(autoremove_from_ignorlist);
                                console.log("счётчик обновлён (хохлофлаг): (" + nickname + "|" + profile + "|" + uid + "): " + ignorelist[index][5][0] + " раз, порог: " +
                                autoban_hohloflag_treshold_msg + " раз");
                            }
                       }
                        if (is_rusofob == true && is_temp == false && ignorelist[index][2] == ignore_pending){  // автобан по превышению порога счётчика
                            if (ignorelist[index][5][1] >= autoban_rusofob_treshold_msg) {
                                reason = "русофоб (" +
                                (Number(ignorelist[index][5][1])) + " раза) - автобан на " + ignore_time / 86400000 + " дней по профилю и uid";
                                ignorelist[index][2] = ignore_profile_uid_country;
                                ignorelist[index][3] = date.getTime();
                                ignorelist[index][4] = date.getTime();
                                ignorelist[index][6] = ((ignorelist[index][6].search('русофоб') == -1) ? ((ignorelist[index][6] != '') ? ' ; ' : '') + reason : '');
                                ignorelist[index][9] = ignore_time;
                                added_to_ignore == true;
                                console.log("Добавлен в игнор: " + nickname + "|" + profile + "|" + uid + ": на " +
                                ignore_time / 86400000 + " дней по логину");
                                SaveData(autoremove_from_ignorlist);
                                console.log(ignorelist);
                            } else {
                                if (isNaN(ignorelist[index][5][1]) == false) { // обновление счётчика
                                    ignorelist[index][5][1] = Number(ignorelist[index][5][1]) + 1;
                                } else {
                                    ignorelist[index][5][1] = 1;
                                }

                                SaveData(autoremove_from_ignorlist);
                                console.log("счётчик обновлён (русофоб): (" + nickname + "|" + profile + "|" + uid + "): " + ignorelist[index][5][1] + " раз, порог: " +
                                autoban_rusofob_treshold_msg + " раз");
                            }
                       }
                    }
                }

                let red = false;

                if(is_in_ignorelist == true || is_in_ignorelist_nick == true ||
                   (message_to_ignored_nick == true && for_author == false && for_me == false) ||
                   (is_temp == true && hide_temp_profile == true) ||
                   (is_restricted_country == true && hide_countries == true) ||
                   ((is_rusofob == true || is_hohloflag == true) && hide_ukropitek == true)){
                    if(is_me == false && is_author == false && is_rus_flag == false) {

                      red = true;
                      element.remove();
                    }
                }

                if((is_spam == true && is_me == false && is_author == false && hide_spam == true && is_rus_flag == false) ||
                   (is_amoral == true && is_me == false && for_author == false && is_author == false && hide_amoral == true &&
                    is_rus_flag == false)){
                      if (hide_amoral == true && is_amoral == true) red = true;
                      element.remove();
                }

                    let color;
                    let background_color;

// https://colorscheme.ru/html-colors.html
// для бекграунда лайтовые WhiteSmoke Azure Honeydew
                    if (red == true && is_rusofob != true && is_hohloflag != true) {
                        color = "red";
                    } else if (is_me == true) {
                        color = "green";
                    } else if (for_me == true) {
                        color = "DarkRed";
                        background_color = "LemonChiffon";
                    } else if (is_spam == true) {
                        color = "orange";
                    } else if (is_author == true) {
                        color = "purple";
                        background_color = "LemonChiffon";
                    } else if (is_spam != true && (is_rusofob == true || is_hohloflag == true)) {
                        background_color = "LightYellow";
                        color = "red";
                    } else if (is_amoral == true) {
                        color = "Grey";
                    } else if (added_to_ignore == true) {
                        color = "Pink";
                    } else {
                        color = "blue";
                        if (is_city_changed == true) background_color = 'LightGray';
                    }

                    const formatDate = (date) => {
                        let tmp;
                        return ((tmp = date.getDate()) < 10 ? '0' + tmp : tmp)
                        + '-' + ((tmp = date.getMonth() + 1) < 10 ? '0' + tmp : tmp)
                        + '-' + ((tmp = (date.getFullYear())) < 10 ? '0' + tmp : tmp);
                    }

                    let country_symbol = countries_map.get(country_iso);
                    country_symbol = (country_symbol == undefined ? '' : country_symbol);

                    console.log('%cchat(' + (date.getHours() < 10 ? '0' : '') + date.getHours() + ':' +
                                (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() +
                                '):' + nickname + ':' + profile + ':' + (country_symbol != '' ? country_symbol + "(" + country_iso + ")" : 'unknown' ) +
                                (is_city_changed ? '(' + city + ')' : '') + ':' +
                                //(joinAt !== undefined ? 'joined(' + formatDate(new Date(joinAt)) + ')' : '') + ':' +
                                'uid=' + uid + ':' +
                                //'sid=' + sid + ':' +
                                (ignored ? 'ignored_in_room!??:' : '') +
                                'ul' + '=' + userlist.size + ':' + 'ml' + '=' + msglist.size + ':' +
                                'cm' + '=' + div_chat_mess_count + ':' +
                                'il' + '=' + ignorelist.length + ':' + 'sa=' + SpamArray.length + ':' +
                                (mobile ? 'phone:' : '') +
                                (is_city_changed ? 'city_changed:' : '') +
                                (is_temp ? 'is_temp:' : '') + (is_author ? 'is_author:' : '') +
                                (is_moder ? 'is_room_moder:' : '') + (is_moderator ? 'is_site_moder:' : '') +
                                (is_admin ? 'is_site_admin:' : '') +
                                (is_me ? 'is_me:' : '') + (for_me ? 'for_me:' : '') +
                                (for_author ? 'for_author:' : '') +
                                (is_spam ? 'spam_found(' + antiSpamResult[0] + ')msg:' : '') + (is_amoral ? 'is_amoral:' : '') +
                                (is_hohloflag ? 'is_hohloflag:' : '') +
                                (is_rusofob == true && SpamResult[2] != undefined && is_spam == false ? 'is_rusofob:(/' + SpamResult[2] + '/i:(' +
                                 SpamResult[1].replace(/<[^>]*>/g,'|') + '))' : '') +
                                (is_rus_flag ? 'is_rus_flag:' : '') +
                                (is_restricted_country ? 'country_bl:' : '') +
                                (is_in_ignorelist && !is_temp && !is_me && !is_author && !is_in_ignorelist_nick ? 'IGNORED(' + (
                                 Math.ceil(Math.abs((ticks - ignore_date.getTime())) / (1000 * 3600 * 24))) +
                                ' д.(' + comment + ')):' : '') +
                                ((is_in_ignorelist && is_temp) || is_in_ignorelist_nick ? 'IGNORED:' : '') +
                                ((ignorelist_match != '') ? 'match:(' + ignorelist_match + '):' : '') +
                                (added_to_ignore ? 'added_to_ignore:' : '') +
                                (message_to_ignored_nick && (message_to_ignored_nick &&
                                                             to_nick_from_restricted_country) ? 'to_ignored_nick_from_country_bl:' :
                                (message_to_ignored_nick ? 'to_ignored_nick:': '') +
                                (message_to_ignored_nick && to_nick_from_restricted_country ? 'from_country_bl:': '')) +
                                ((nick_to_subjects != '') ? 'to:' + nick_to_subjects : '')
                                ,'background: ' + background_color + ';color: ' + color);

        }

