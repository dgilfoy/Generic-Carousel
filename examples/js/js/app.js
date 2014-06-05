// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }

    // Create Carousel;
    var opts = {
        wrapperClass: 'carousel-wrapper'
    }
    opts2 = {
        wrapperClass: 'carousel2-wrapper',
        autoplay    : true,
        delay       : 6000
    },
    slider1 = new Carousel(),
    slider2 = new Carousel(opts2),
    slider3 = new Carousel({
        "wrapperClass"  : "carousel3-wrapper",
        "sourceUrl"   : "external"  
    });
    
    slider1.init(opts);

}());

