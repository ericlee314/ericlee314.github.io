$.ajaxSetup ({
    // Disable caching of AJAX responses
    cache: false
});


var animation_finished = false;
var current_mode = 0;
var loaded = [false, false, false];

var isMobile = {
	Android: function() { return navigator.userAgent.match(/Android/i); },
	BlackBerry: function() { return navigator.userAgent.match(/BlackBerry/i); },
	iOS: function() { return navigator.userAgent.match(/iPhone|iPad|iPod/i); },
	Opera: function() { return navigator.userAgent.match(/Opera Mini/i); },
	Windows: function() { return navigator.userAgent.match(/IEMobile/i); },
	any: function() { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); }
};


$(document).ready(function(){
	
	
	$('header, #pages, footer').css('min-height', screen.height + 100);
	
	scrollHandler();
	resizeHandler();
	
	var hide = $('#name, .tile, .tile > *, #navigation');
	hide.css('display', 'none');
	window.setTimeout(function() { hide.addClass('hidden'); hide.css('display', 'block'); }, 0);
	window.setTimeout(function() { $('.tile').removeClass('hidden'); }, 250);
	window.setTimeout(function() { $('#tile_1 *').removeClass('hidden'); }, 1000);
	window.setTimeout(function() { $('#tile_2 *').removeClass('hidden'); }, 1500);
	window.setTimeout(function() { $('#tile_3 *').removeClass('hidden'); }, 2000);
	window.setTimeout(function() { $('#name, #navigation').removeClass('hidden'); }, 2250);
	window.setTimeout(function() { animation_finished = true; }, 3750);
	
	if(!isMobile.any()) {
		$('body').css('background-attachment', 'fixed');
		$(window).scroll(scrollHandler);
	}
	
	$(window).resize(resizeHandler);
	
    $('.tile').hover(
		function() { if(current_mode == 0) activateTile($(this)); },
		function() { if(current_mode == 0) deactivateTiles(); }
	);
	
	$('#tile_1, #portfolio-link').click(function(event) {
		event.preventDefault();
		changeMode(1);
	});
	$('#tile_2').click(function(event) {
		event.preventDefault();
		changeMode(2);
	});
	$('#tile_3').click(function(event) {
		event.preventDefault();
		changeMode(3);
	});
	$('#arrow_1').click(function(event) {
		event.preventDefault();
		if(current_mode > 0) {
			var mode = current_mode - 1;
			if(mode == 0) mode = 3;
			changeMode(mode);
		}
	});
	$('#arrow_2').click(function(event) {
		event.preventDefault();
		if(current_mode > 0) {
			var mode = current_mode + 1;
			if(mode == 4) mode = 1;
			changeMode(mode);
		}
	});
	$('#about-link').click(function(event) {
		event.preventDefault();
		$(document).scrollTo($('footer'), 600);
	});
	
});

function scrollHandler() {
	var scroll = $(window).scrollTop();
	$('body').css('background-position', '50% '+ (scroll / -5) + 'px');
}

function resizeHandler() {
	var sp_width = Math.min(window.innerWidth, 640);
	$('#name, #tiles, #arrows, #navigation').width(sp_width * .8).css('margin-left', sp_width * -.4);
	$('#name').css('margin-top', -128 - (sp_width * .05));
	$('#tiles, #arrows').height(sp_width * .2).css('margin-top', sp_width * .05);
	$('#navigation').css('margin-top', sp_width * .4);
	$('.page').css('padding-top', sp_width * .4);
	$('.icon').height(sp_width * .2).width(sp_width * .2);
	$('.strip h2').css('top', sp_width * .1);
}

function getTileObj(n) {
	switch(n) {
	case 1: return $('#tile_1');
	case 2: return $('#tile_2');
	case 3: return $('#tile_3');
	}
}

function getTileNum(obj) {
	switch(obj) {
	case $('#tile_1'): return 1;
	case $('#tile_2'): return 2;
	case $('#tile_3'): return 3;
	}
}

function getPageObj(n) {
	switch(n) {
	case 1: return $('#page_1');
	case 2: return $('#page_2');
	case 3: return $('#page_3');
	}
}

/**
 * Switch to a different mode.
 * 0: Default (home page)
 * 1: Code (portfolio)
 * 2: Web (portfolio)
 * 3: Art (portfolio)
 */
function changeMode(n) {
	if(n == current_mode || n == 0) {
		// Revert to home page
		deactivateTiles();
		getPageObj(current_mode).fadeOut(200);
		$('#navigation').css('display', 'block');
		window.setTimeout(function() {
			$('body').removeClass();
		}, 0);
		current_mode = 0;
		
	}
	else {
		if(current_mode != 0) {
			// Switch between portfolios
			deactivateTiles();
			getPageObj(current_mode).fadeOut(200);
			window.setTimeout(function() {
				activateTile(getTileObj(n));
				getPageObj(n).fadeIn(200);
				$('#navigation').css('display', 'none');
			}, 200);
		}
		else {
			// Load portfolio from home page
			activateTile(getTileObj(n));
			window.setTimeout(function() {
				getPageObj(n).fadeIn(200);
				$('#navigation').css('display', 'none');
			}, 200);
			$('body').removeClass().addClass('portfolio');
		}
		
		current_mode = n;
		var page = getPageObj(n);
		if(page.is(':empty')) {
			switch(n) {
			case 1: page.load("pages/page1.txt", resizeHandler);
					break;
			case 2: page.load("pages/page2.txt", resizeHandler);
					break;
			case 3: page.load("pages/page3.txt", resizeHandler);
					break;
			}
		}
	}
	
	$(document).scrollTo(0, 400);
}

/**
 * Visually activate the specified tile.
 */
function activateTile(tile) {
	tile.css('z-index','1');
	$('.tile').css('z-index','auto');
	tile.css('z-index','1');
	tile.addClass('activated');
}

/**
 * Visually deactivate all tiles.
 */
function deactivateTiles() {
	$('.tile').removeClass('activated');
}