// ==UserScript==
// @name         GA Network Steam Button
// @icon         http://store.giveawaynetwork.xyz/shop/dist/img/favicon.ico
// @namespace    http://giveawaynetwork.xyz/
// @version      0.4
// @description  what
// @homepage 	https://github.com/adhiwena/ganetwork
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
        let barterlnk = $(this).parent().parent().find('th:first').text();
        $(this).parent().append('<a class="btn btn-danger barterLink" style="margin:2px;" href="https://barter.vg/search?q='+barterlnk+'" target="_blank">'+'Barter</a>');
        
        let str = $(this).attr('href');
        let steamlnk = 'https://store.steampowered.com/app/' + str.substring(6, 12);
        $(this).parent().append('<a class="btn btn-primary steamLink" style="margin:2px;" href="'+steamlnk+'" target="_blank">'+'Steam</a>');

    });
})();
