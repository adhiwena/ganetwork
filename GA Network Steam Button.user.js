$('.buy_button').each(function() {
        let str = $(this).attr('href');
        let steamlnk = 'https://store.steampowered.com/app/' + str.substring(6, 12);
        $(this).parent().append('<a class="btn btn-primary steamLink" style="margin:2px;" href="'+steamlnk+'" target="_blank">'+'Shop</a>');
    });
})();
