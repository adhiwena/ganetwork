// ==UserScript==
// @name         GA Network Steam Button
// @icon         http://store.giveawaynetwork.xyz/shop/dist/img/favicon.ico
// @namespace    https://giveawaynetwork.xyz/
// @version      0.4.2
// @description  what
// @homepage 	https://github.com/adhiwena/ganetwork
// @updateURL 	https://raw.githubusercontent.com/adhiwena/ganetwork/master/GA Network Steam Button.user.js
// @downloadURL https://raw.githubusercontent.com/adhiwena/ganetwork/master/GA Network Steam Button.user.js
// @author       cyp
// @include      /^http(s)?\:\/\/store.giveawaynetwork.xyz\/shop\/(\d{18})
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
    
	//masukin ke array
	var gameList = [];
	$('table tbody tr').each(function() {
		var txt = $(this).find("th:first").text();
		gameList.push(txt);
	});

	//hitung dupe array
	var counts = {};
	gameList.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });

	//hapus dupe di table
	var seen = {};
	$('table tr').each(function() {
		var txt = $(this).find("th").text();
		if (seen[txt])
			$(this).remove();
		else
			seen[txt] = true;
	});

	//insert counts
	$('table tbody tr').each(function() {
		var txt = $(this).children(":first");
		$(txt).append(' ('+counts[txt.text()]+' Items)');
	});
})();
