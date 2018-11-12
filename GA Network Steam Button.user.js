// ==UserScript==
// @name         GA Network Steam Button
// @icon         *://store.giveawaynetwork.xyz/shop/dist/img/favicon.ico
// @namespace    http://giveawaynetwork.xyz/
// @version      0.2
// @description  whay
// @homepage 	https://github.com/adhiwena/tmprmnky
// @updateURL 	https://raw.githubusercontent.com/adhiwena/ganetwork/master/GA Network Steam Button.user.js
// @downloadURL https://raw.githubusercontent.com/adhiwena/ganetwork/master/GA Network Steam Button.user.js
// @author       cyp
// @match        *://store.giveawaynetwork.xyz/shop/*
// @exclude		 *://store.giveawaynetwork.xyz/shop/
// @exclude 	 *://store.giveawaynetwork.xyz/shop/game/*
// @grant        none
// ==/UserScript==

(function() {
    $('.buy_button').each(function() {
        let str = $(this).attr('href');
        let steamlnk = 'https://store.steampowered.com/app/' + str.substring(6, 12);
        $(this).parent().append('<a class="btn btn-primary steamLink" style="margin:2px;" href="'+steamlnk+'" target="_blank">'+'Steam</a>');
    });
    $('.table-hover tbody tr th:first-child').each(function() {
        let barterlnk = $(this).text();
        $(this).append('<a style="margin:2px;" href="https://barter.vg/search?q='+barterlnk+'" target="_blank">(Barter)</a>');
    });
})();
