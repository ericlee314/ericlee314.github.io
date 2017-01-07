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

hs.graphicsDir = 'resources/ui/highslide/';
hs.showCredits = false;
hs.align = 'center';
hs.captionEval = 'this.a.title';
hs.blockRightClick = true;
hs.allowMultipleInstances = false;
hs.enableKeyListener = false;
hs.dimmingOpacity = 0.5;
hs.dimmingDuration = 200;
hs.registerOverlay({
	html: '<div class="closebutton" onclick="return hs.close(this)" title="Close"></div>',
	position: 'top right',
	useOnHtml: true,
	fade: 2 // fading the semi-transparent overlay looks bad in IE
});
hs.lang.restoreTitle = 'Click to close image, click and drag to move.';


$(document).ready(function(){
    
    
    $('header, footer').css('min-height', screen.height + 100);
    
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
    setInterval(resizeHandler, 2000);
    
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
    
    $('html > head').append($('<style>.block { visibility: hidden; }</style>'));
    
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
    $('#pages').css('padding-top', sp_width * .4);
    $('.icon').height(sp_width * .2).width(sp_width * .2);
    $('.strip h2').css('top', sp_width * .1);
    $('.blocks').BlocksIt({
        numOfCol: Math.max(2, Math.min(4, Math.ceil($(this).width() / 250))),
        offsetX: 8,
        offsetY: 8,
        blockElement: '.block'
    });
    $('.block').each(function() {
      if ($(this).height() > 10) {
          $(this).css('visibility', 'visible');
      }
    });
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
    break;
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
            case 1: page.load("resources/html/code.html .page > *", resizeHandler);
                    break;
            case 2: page.load("resources/html/web.html .page > *", resizeHandler);
                    break;
            case 3: page.load("resources/html/art.html .page > *", resizeHandler);
                    break;
            }
        }
        window.setTimeout(resizeHandler, 200);
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
