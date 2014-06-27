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
        "wrapperClass"  : "carousel-wrapper",
        "animationIn"     : "slidein",
        "animationOut"    : "slideout"   
    },
    slider1 = new Carousel();
    //slider2 = new Carousel(opts2),
    
    slider1.init(opts);

}());

var jsSlider = angular.module('jsSlider', []);

jsSlider.directive(
    'ngCarousel', 
    [ '$document', '$animate', 
    function ($document, $animate) {
        var defaults = {
            "autoplay"      : false,
            "sourceUrl"     : false,
            "frameClass"    : "slide",
            "frameEle"      : "div",
            "delay"         : 4000, // 4 seconds
            "thumbs"        : {
                "show"      : false,
                "container" : "thumbsWrapper",
                "thumbEle"  : "button",
                "thumbClass": "selectSlide"
            }
        };
        function setScopeDefaults(scope, attrs){
            scope.carousel.config = {}; // define object to store all config data to
            // loop through the defaults, checking if there is an attribute set for any of them and
            // overwrite them as necessary.
            angular.forEach( defaults, function (value, key) {
                scope.carousel.config[key] = attrs[key] || value;   
            });
        };
        return {
            restrict : 'AC',
            scope   : {},
            controller : function ($scope, $compile, $http) {
                this.getScope = function () {
                    return $scope;
                };
                this.animateEndThen = function ( elem, callback ) {
                    var handlers = [ "animationend", "webkitAnimationEnd", "oanimationend", "MSAnimationEnd"];
                    angular.forEach( handlers, function (value, key) { 
                        elem.on(value, function () {
                            callback.apply();
                        });
                    });
                }
                this.animate = function (current, target, direction) {
                    var slides = $scope.carousel.slides,
                      currentSlide = angular.element(slides[current]),
                      targetSlide = angular.element(slides[target]);

                    currentSlide.addClass('slideout' + direction);

                    this.animateEndThen(currentSlide, function (){
                        currentSlide.removeClass('active');
                        currentSlide.removeClass('slideout' + direction);
                    })

                    targetSlide.addClass('slidein' + direction);

                    this.animateEndThen(targetSlide, function () {
                        targetSlide.addClass('active');
                        targetSlide.removeClass('slidein' + direction);
                    });
                    
                };

                this.selectSlide = function (target, direction) {
                    var current = $scope.carousel.index.current,
                      slides = $scope.carousel.slides;
                    if ( angular.element( slides[current] ).hasClass('slidein' + direction )) {
                        return;
                    }
                    $scope.carousel.index.current = target;
                    // calculate direction here, add it to the functionality, make "next by default"
                    if( slides.length > 0 && slides[current].hasOwnProperty('className')){
                        this.animate(current,target, direction);
                        this.setIndex(target);
                    }
                };
                this.setIndex = function (current) {
                    $scope.carousel.index.current = current;
                    $scope.carousel.index.next = ( ( current + 1 ) < $scope.carousel.slides.length ) ?
                      current + 1 : 0;
                    $scope.carousel.index.prev = ( ( current - 1 ) < 0 ) ?
                      ($scope.carousel.slides.length-1) : (current-1);
                };
            },
            compile : function (tScope, tElem, tAttrs) {
                return {
                    pre : function (scope, elem, attrs) {
                        scope.carousel = {};
                        scope.carousel.index = {
                            current : 0,  // eventually we'll track next and previous this way.
                            next    : 1
                        };
                        setScopeDefaults(scope,attrs);
                        elem.css( "display" , "block" );
                        scope.carousel.container = elem.children();
                    }
                }
            }
        }    
    }]
)
// distinct directive for the slides.
.directive('slides', ['$document', function ($document) {
    var parentScope,
      config,
      slides;
    // initialize the slider (set wrapper and slide elements, show the first slide)
    function initSlider() {
        config = parentScope.carousel.config;

        var container = parentScope.carousel.container,
          slidesClasses = container[0].className.split(' ');

        slides = ( slidesClasses[0] === 'slides' ) ? 
            container[0].children : container[1].children;
        slides[0].className = config.frameClass + ' active';
        parentScope.carousel.index.prev = (slides.length - 1);
    };

    return {
        restrict    : 'AC',
        scope       : {},
        require     : '^ngCarousel',
        link : function slideLink(scope, elem, attrs, controllerInstance ) {
                parentScope = controllerInstance.getScope();
                initSlider();
                parentScope.carousel.slides = slides;
            }
    }
}])
// distinct directive for the controls
.directive('controls', ['$document', function ($document) {
    var carousel, parentScope, controls, prev, next;
    function initControls(){
        config = parentScope.carousel.config;

        var container = parentScope.carousel.container,
          slidesClasses = container[0].className.split(' ');

        controls = ( slidesClasses[0] === 'controls' ) ? 
            container[0].children : container[1].children;
        prev = ( controls[0].className.match(/\bprev\b/) ) ? controls[0] : controls[1];
        next = ( controls[1].className.match(/\bnext\b/) ) ? controls[1] : controls[0];
        
        // add event listeners
        prev.onclick = prevBtn.bind(this,parentScope);
        next.onclick = nextBtn.bind(this,parentScope);
    };
    function nextBtn(e) {
        carousel.selectSlide(parentScope.carousel.index.next, "Next");
    };
    function prevBtn(e) {
        carousel.selectSlide(parentScope.carousel.index.prev, "Prev");
    };
    return {
        restrict    : 'AC',
        scope       : {},
        require     : '^ngCarousel',
        link : function controlsLink(scope, elem, attrs, controllerInstance ) {
                carousel = controllerInstance;
                parentScope = carousel.getScope();
                initControls();
                parentScope.carousel.controls = {
                    prev : prev,
                    next : next
                };
            }
    }
}]);

