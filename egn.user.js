// ==UserScript==
// @name         Enhanced Giveaway Network
// @icon         http://store.giveawaynetwork.xyz/shop/dist/img/favicon.ico
// @namespace    https://giveawaynetwork.xyz/
// @version      0.0.1
// @description  what
// @author       cyp
// @include      /^http(s)?\:\/\/store.giveawaynetwork.xyz\/shop\/*
// @homepage	https://github.com/adhiwena/ganetwork
// @updateURL	https://raw.githubusercontent.com/adhiwena/ganetwork/master/egn.user.js
// @downloadURL	https://raw.githubusercontent.com/adhiwena/ganetwork/master/egn.user.js
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {
	if (location.pathname == '/shop/me/show') return;

	$('tbody th').wrapInner('<td/>').find('td').unwrap();
	$('table').attr({id:'game-list',class:'table table-hover table-condensed'});
	$('table').attr('style','text-align: left');
	$('.key_list thead tr').attr('style', 'cursor:pointer');


	$('body > .container a:not(:contains("View")) :not(:has[key])').each(function() {
		var pathname = $(this).attr('href').split('/');
		var appID = location.pathname == '/shop/' ? pathname[3] : pathname[2];
		GenRichButton($(this),appID);
	});

	$('body').on('DOMNodeInserted', '.select2-results li', function () {
	      $(this).parent().addClass('list-group');
	      $(this).addClass('list-group-item');
	      $(this).find('.select2-result-game__img').attr('style','display:none');
	      $(this).find('.select2-result-game__title').attr('style', 'font-size: inherit');
	      $(this).find('.select2-result-game__price').attr('style', 'text-align: right');
	});

	var mdlExport = (function () {/*
	<div class="modal fade" id="egn-modal-export" role="dialog">
	  <div class="modal-dialog">
	    <div class="modal-content">
	      <div class="modal-header">
	        <button type="button" class="close" data-dismiss="modal">×</button>
	        <h4 class="modal-title">Export</h4>
	      </div>
	      <div class="modal-body">
	        <textarea id="egn-output-area" style="width:-webkit-fill-available;height:10em;resize:none;"></textarea>
	      </div>
	      <div class="modal-footer">
	        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
	      </div>
	    </div>
	  </div>
	</div>*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];

	$('body').append(mdlExport);
	$('.shop_header').append('<br><input type="button" id="egn-btn-export" class="btn btn-default" value="Export" data-toggle="modal" data-target="#egn-modal-export">');

	if (location.pathname.includes('/me/keys/inv')) {
		var egnUsed = JSON.parse(GM_getValue('egn-used','{}'));
		var used = egnUsed['used'];

	    $('.key_list th:contains(Infos)').after('<th id="egn-seller">Seller</th>');
	    $('.key_list th:contains(Infos)').attr('id','egn-price').text('Price');
	    $('.key_list th:first').attr('id','egn-name');
		$('.key_list th:not(:last)').prepend('↑↓ ');

		var btnMark = (function () {/*<br>
			<div class="btn-group" role="group" style="margin: 5px">
				<button type="button" class="btn btn-primary" id="egn-show"><span class="glyphicon glyphicon-eye-open"></span></button>
				<button type="button" class="btn btn-danger" id="egn-hide"><span class="glyphicon glyphicon-eye-close"></span></button>
			</div>*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];
		$('.shop_header').append(btnMark);

	    $('.key_list thead tr').prepend('<th><input type="checkbox" id="egn-cb-all" vallue="cbAll"></th>');

	    $('.key_list tbody tr').each(function() {
	    	var $this = $(this);
	    	$(this).attr('data-row-id', $this.find('a[key]').attr('key').split('-')[0]);

	    	var infos = $this.find('td:contains(Bought)');
	    	var price = infos.text().split(' ')[2];
	    	var seller = infos.text().split(' ')[5];

	    	$this.prepend('<td><input type="checkbox" class="egn-cb"></td>');
	    	infos.after('<td>'+seller+'</td>');
	    	infos.html(price+' credits');
	    });

	    $('#egn-cb-all').click(function() {
	    	$('.egn-cb').not(this).prop('checked', this.checked);
	    });

	    $('#egn-hide').click(function () {
	    	if ($('.egn-cb:checked').length == 0) return;
	    	var isChanged = false;
	    	$('.egn-cb:checked').each(function(i,e) {
	        	var rowid = $(this).closest('tr').attr('data-row-id').toUpperCase();
	        	if (used) {
	        		if (used.includes(rowid)) return;
	        		used.push(rowid);
	        		isChanged = true;
	        	} else {
	        		used = [rowid];
	        		isChanged = true;
	        	}
	    	});
	    	if (isChanged) {
		    	GM_setValue("egn-used",JSON.stringify({used}));
		    	location.reload();
	    	}
	    });

		$('#egn-btn-export').click(function() {
			$("#egn-output-area").val("");
			var output = "";
			$('.key_list tbody tr').each(function() {
				 output += $(this).find('td:contains(credits)').prev().text()+'\n';
			});
			$("#egn-output-area").val(output);
		});

	    $('#egn-show').click(function () {
	    	if ($('.egn-cb:checked').length == 0) return;
	    	var isChanged = false;
	    	$('.egn-cb:checked').each(function(i,e) {
	        	var rowid = $(this).closest('tr').attr('data-row-id').toUpperCase();
	        	if (used) {
					var index = used.indexOf(rowid);
					if (index > -1) {
						used.splice(index, 1);
						isChanged = true;
					}
			    }
	    	});
	    	if (isChanged) {
		    	GM_setValue("egn-used",JSON.stringify({used}));
		    	location.reload();
	    	}
	    });

		if (used) {
			used.forEach( function(element, index) {
				$('tr[data-row-id='+element+']').attr('class','danger');
			});
		}


		$('#egn-name').click(function() {
			sortTable(1,false);
		});
		$('#egn-price').click(function() {
			sortTable(2,true);
		});
		$('#egn-seller').click(function() {
			sortTable(3,false);
		});
	}

	if (location.pathname.match(new RegExp('[0-9]{18}', 'g'))) {
		$('.key_list th:first').after('<th id="egn-copies" style="cursor:pointer">Copies</th>');
		$('.key_list th:first').attr('id','egn-name');
		$('#egn-copies').next().attr('id','egn-price');
		$('.key_list th:not(:last)').prepend('↑↓ ');
		var copies = 1;
		$('.key_list tbody tr').each(function() {
			var $this = $(this);
			if ($this.html() == $this.next().html()) {
				$this.remove();
				copies++;
			} else {
				$this.find('td:first').after('<td>x'+copies+'</td>');
				copies = 1;
			}
		});

		$('#egn-name').click(function() {
			sortTable(0,false);
		});
		$('#egn-copies').click(function() {
			sortTable(1,true);
		});
		$('#egn-price').click(function() {
			sortTable(2,true);
		});

		$('#egn-btn-export').click(function() {
			$("#egn-output-area").val("");
			var output = "";
			$('.key_list tbody tr').each(function() {
				output += $(this).find('td:first').text()+'\n';
			});
			$("#egn-output-area").val(output);
		});
	}

	function GenRichButton ($this,appID) {
		var genBtn = (function () {/*
		<a class="btn btn-danger egn-barter" style="margin: 2px 1px 2px 2px" href="https://barter.vg/steam/app/{appID}" target="_blank">Barter</a>
		<a class="btn btn-primary egn-steam" style="margin: 2px 2px 2px 1px" href="https://store.steampowered.com/app/{appID}" target="_blank">Steam</a>
		*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];
		$this.after(genBtn.replace(/{appID}/gi, appID));
		$('td > .btn').addClass('btn-xs');
	}

	function sortTable(n,isNumber) {
		var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
		table = document.getElementById('game-list');
		switching = true;
		dir = 'asc';
		while (switching) {
			switching = false;
			rows = table.rows;
			for (i = 1; i < (rows.length - 1); i++) {
				shouldSwitch = false;
				x = rows[i].getElementsByTagName('td')[n];
				y = rows[i + 1].getElementsByTagName('td')[n];
				if (isNumber) {
					x = n == 1 ? x.innerHTML.slice(1) : x.innerHTML.slice(0,-8);
					y = n == 1 ? y.innerHTML.slice(1) : y.innerHTML.slice(0,-8);
					if (dir == 'asc') {
						if (Number(x) > Number(y)) {
						  shouldSwitch = true;
						  break;
						}
					} else if (dir == 'desc') {
						if (Number(x) < Number(y)) {
						  shouldSwitch = true;
						  break;
						}
					}
				} else {
					if (dir == 'asc') {
						if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
							shouldSwitch = true;
							break;
						}
					} else if (dir == 'desc') {
						if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
							shouldSwitch = true;
							break;
						}
					}
				}
			}

			if (shouldSwitch) {
			  rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
			  switching = true;
			  switchcount ++;
			} else {
			  if (switchcount == 0 && dir == 'asc') {
			  	dir = 'desc';
			  	switching = true;
			  }
			}
		}
	}
})();
