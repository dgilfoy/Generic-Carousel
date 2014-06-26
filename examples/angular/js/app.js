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
    [ '$document', 
    function ($document) {
        var defaults = {
            "autoplay"      : false,
            "sourceUrl"     : false,
            "animationIn"   : false,
            "animationOut"  : false,
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
            angular.forEach( defaults, function (value,key) {
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

                this.animate = function (current,target,text) {
                    var animationInEffect = ( this.config.animationIn ) ? this.config.animationIn + direction: "",
                      animationOutEffect = ( this.config.animationOut ) ? this.config.animationOut + direction : "",
                      animationInAction = document.querySelectorAll('.' + this.config.wrapperClass + ' .' + animationOutEffect );
                    if( animationInAction.length > 0 ){
                        // stop additional requests for changes until animation stops.  
                        // @todo:  add animation queue and let them build up
                        return false;
                    }
                    this.current = target;
                    // currently the setup here only allows you to animate the frame when the animation ends.  Let's eventually 
                    // add some functionality to end the animation (if possible) and increment it anyway.
                    if( target !== current ){
                        this.slides[current].className = this.config.frameClass + " active " + animationOutEffect;
                        /*this.slides[current].addEventListener(
                            "webkitAnimationEnd", 
                            this.animationEnd.bind(this,current, target, animationOutEffect), 
                        false);*/
                    }
                    this.slides[target].className = this.config.frameClass + " active " + animationInEffect;
                    this.slides[target].addEventListener(
                        "webkitAnimationEnd", 
                        this.animationEnd.bind(this, target, current, animationInEffect), 
                    false);
                };

                this.selectSlide = function (target) {
                    var current = $scope.carousel.index.current;
                    $scope.carousel.index.current = target;
                    // calculate direction here, add it to the functionality, make "next by default"
                    if( this.slides.length > 0 && this.slides[current].hasOwnProperty('className')){
                        this.animate(current,target, "Next");
                    }
                };
            },
            compile : function (tScope, tElem, tAttrs) {
                return {
                    pre : function (scope, elem, attrs) {
                        scope.carousel = {};
                        scope.carousel.index = {
                            current : 0  // eventually we'll track next and previous this way.
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
        carousel.selectSlide(1);
        console.log('next');
    };
    function prevBtn(e) {
        console.log('previous');
    };
    return {
        restrict    : 'AC',
        scope       : {},
        require     : '^ngCarousel',
        link : function controlsLink(scope, elem, attrs, controllerInstance ) {
                carousel = controllerInstance;
                parentScope = carousel.getScope();
                initControls();
            }
    }
}]);

