// ==UserScript==
// @name         Enhanced Giveaway Network
// @namespace    https://github.com/adhiwena
// @version      0.0.3
// @author       Cypherpunks
// @description  What
// @homepage     https://github.com/adhiwena/ganetwork
// @icon         https://www.google.com/s2/favicons?domain=store.giveawaynetwork.xyz
// @updateURL    https://github.com/adhiwena/ganetwork/raw/master/egn.user.js
// @downloadURL  https://github.com/adhiwena/ganetwork/raw/master/egn.user.js
// @supportURL   https://github.com/adhiwena/ganetwork/issues
// @include      /^http(s)?\:\/\/store.giveawaynetwork.xyz\/shop\/*
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_info
// @grant        GM_unsafeWindow
// ==/UserScript==

(function() {
    var pn = location.pathname;
    if (pn.includes('/shop/me/show')) return;
    console.log('[Enhanced Giveaway Network] Script Version: '+GM_info.script.version);

    $('tbody th').wrapInner('<td/>').find('td').unwrap();
    $('table').attr({id:'game-list',class:'table table-hover table-condensed',style:'text-align: left'});
    $('table thead tr').attr('style', 'cursor:pointer');

    if (pn !== '/shop/me/keys/inv') {
        $('body > .container a[class*=btn]:not(:contains(View))').each(function() {
            var appID = $(this).attr('href').match(/\/[0-9]{1,6}\b/g);
            $(this).after(`
            <div class="btn-group" role="group" style="margin: 2px">
            <a class="btn btn-danger" id="egn-barter" href="https://barter.vg/steam/app${appID}" target="_blank">Barter</a>
            <a class="btn btn-primary" id="egn-steam" href="https://store.steampowered.com/app${appID}" target="_blank">Steam</a>
            </div>`);
        });
    }

    $('table .btn').addClass('btn-xs');

    if (pn.match(/[0-9]{18}/gi)) {
        generateCopies();
        generateExport();
        makeAllSortable();
    } else if (pn === '/shop/me/keys/inv') {
        generateMarker();
        generateExport();
        makeAllSortable();
    }

    function generateMarker () {
        var used;

        $('table th:contains(Infos)').text('↑↓ Price').after('<th>↑↓ Seller</th>');
        $('table th:first').prepend('↑↓ ');
        $('table thead tr').prepend('<th><input type="checkbox" id="egn-cb-all" vallue="cbAll"></th>');

        $('.shop_header').append(`<br>
            <div class="btn-group" role="group" style="margin: 5px">
                <button type="button" class="btn btn-primary" id="egn-show"><span class="glyphicon glyphicon-eye-open"></span></button>
                <button type="button" class="btn btn-danger" id="egn-hide"><span class="glyphicon glyphicon-eye-close"></span></button>
            </div>`);

        $('table tbody tr').each(function() {
            var $this = $(this);
            $this.attr('data-row-id', $this.find('a[key]').attr('key').split('-')[0]);

            var infos = $this.find('td:contains(Bought)');
            var price = infos.text().split(' ')[2];
            var seller = infos.text().split(' ')[5];

            $this.prepend('<td><input type="checkbox" class="egn-cb"></td>');
            infos.after('<td>'+seller+'</td>');
            infos.text(price+' credits');
        });

        showMarker();

        $('#egn-cb-all').click(function() {
            $('.egn-cb').prop('checked', this.checked);
        });

        $('#egn-hide').click(function () {
            if ($('.egn-cb:checked').length === 0) return;
            var isChecked = false;
            if (used) {
                $('.egn-cb:checked').each(function(i,e) {
                    var rowid = $(e).closest('tr').attr('data-row-id').toUpperCase();
                    if (used.includes(rowid)) return;
                    used.push(rowid);
                    isChecked = true;
                });
            } else {
                $('.egn-cb:checked').each(function(i,e) {
                    var rowid = $(e).closest('tr').attr('data-row-id').toUpperCase();
                    used = [rowid];
                });
                isChecked = true;
            }
            if (isChecked) {
                GM_setValue("egn-used",JSON.stringify({used}));
                showMarker();
                $('#egn-cb-all,.egn-cb').prop('checked', false );
            }
        });

        $('#egn-show').click(function () {
            if ($('.egn-cb:checked').length === 0) return;
            if (used) {
                var isChecked = false;
                $('.egn-cb:checked').each(function(i,e) {
                    var rowid = $(e).closest('tr').attr('data-row-id').toUpperCase();
                    var index = used.indexOf(rowid);
                    if (index > -1) {
                        used.splice(index, 1);
                        isChecked = true;
                    }
                });

                if (isChecked) {
                    GM_setValue("egn-used",JSON.stringify({used}));
                    showMarker();
                    $('#egn-cb-all,.egn-cb').prop('checked', false );
                }
            }
        });

        function showMarker () {
            var egnUsed = JSON.parse(GM_getValue('egn-used','{}'));
            used = egnUsed['used'];
            if (used) {
                $('table tbody tr').removeClass('danger');
                used.forEach( function(element, index) {
                    $('tr[data-row-id='+element+']').attr('class','danger');
                });
            }
        }
    }

    function generateExport () {
        $('.shop_header').append('<br><input type="button" id="egn-btn-export" class="btn btn-info" value="Export" data-toggle="modal" data-target="#egn-modal-export">');
        $('body').append(`
        <div class="modal fade" id="egn-modal-export" role="dialog">
        <div class="modal-dialog">
        <div class="modal-content">
        <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">×</button>
        <h4 class="modal-title">Export</h4>
        </div>
        <div class="modal-body">
        <textarea id="egn-output-area" style="width:-webkit-fill-available;height:30em;resize:none;"></textarea>
        </div>
        <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        </div>
        </div>
        </div>
        </div>`);

        $('#egn-btn-export').click(function() {
            var output = '';
            $('table tbody tr').each(function() {
                if (pn === '/shop/me/keys/inv') {
                    output += $(this).find('.egn-cb:checked').length !== 0 ?
                     `${$(this).find('a[key]').attr('key')}   ${$(this).find('td:eq(1)').text()}\n` : '' ;
                } else {
                    output += $(this).find('td:first').text()+'\n';
                }
            });
            $("#egn-output-area").val(output);
            $('#egn-cb-all,.egn-cb').prop('checked', false );
        });
    }

    function generateCopies(){
        $('table th:first').after('<th id="egn-copies" style="cursor:pointer">↑↓ Copies</th>');
        $('table th:first, table th:eq(2)').prepend('↑↓ ');

        //compre
        var seen = {};
        $('table tbody tr').each(function() {
            var txt = $(this).find('td:first').text();
            if (seen[txt]) {
                seen[txt] += 1;
                $(this).remove();
            } else {
                seen[txt] = 1;
            }
        });

        for (var i in seen) {
            $('table tbody tr').each(function(index, el) {
                var tdGame = $(el).find('td:first');
                if (tdGame.text() === i) {
                    tdGame.after('<td>x'+seen[i]+'</td>');
                }
            });
        }
        //end compre
    }

    function sortTable(table, col, reverse) {
        var tb = table.tBodies[0],
            tr = Array.prototype.slice.call(tb.rows, 0),
            i;
        reverse = -((+reverse) || -1);
        tr = tr.sort(function (a, b) {
            return reverse
                * (a.cells[col].textContent.trim()
                   .localeCompare(b.cells[col].textContent.trim(), undefined, {numeric: true})
                  );
        });
        for(i = 0; i < tr.length; ++i) tb.appendChild(tr[i]);
    }

    function makeSortable(table) {
        var th = table.tHead, i;
        th && (th = th.rows[0]) && (th = th.cells);
        if (th) i = th.length;
        else return;
        while (--i >= 0) (function (i) {
            var dir = 1;
            th[i].addEventListener('click', function () {sortTable(table, i, (dir = 1 - dir))});
        }(i));
    }

    function makeAllSortable(parent) {
        parent = parent || document.body;
        var t = parent.getElementsByTagName('table'), i = t.length;
        while (--i >= 0) makeSortable(t[i]);
    }

    $('body').on('DOMNodeInserted', '.select2-results li', function () {
          $(this).parent().addClass('list-group');
          $(this).addClass('list-group-item');
          $(this).find('.select2-result-game__img').attr('style','display:none');
          $(this).find('.select2-result-game__title').attr('style', 'font-size: inherit');
          $(this).find('.select2-result-game__price').attr('style', 'text-align: right');
    });
})();
