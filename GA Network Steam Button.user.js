// ==UserScript==
// @name         GA Network Steam Button
// @namespace    http://giveawaynetwork.xyz/
// @version      0.1
// @description  simple af
// @author       cyp
// @match        http://store.giveawaynetwork.xyz/shop/*
// @grant        none
// ==/UserScript==

(function() {
    $('.buy_button').each(function() {
        let str = $(this).attr('href');
        let steamlnk = 'https://store.steampowered.com/app/' + str.substring(6, 12);
        $(this).parent().append('<a class="btn btn-primary steamLink" style="margin:2px;" href="'+steamlnk+'" target="_blank">'+'Shop</a>');
    });
})();
