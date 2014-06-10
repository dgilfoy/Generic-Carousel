(function ($) {
	var Carousel = function (elem,settings) {
        this.container = elem;
		if (typeof settings === 'object') {
        // call the init function automatically if the settings are passed to constructor.
            this.init(settings);
        }
    };

    $.fn.jCarousel = function (settings) {
        return new Carousel(this,settings);
    };

    Carousel.prototype.init = function (settings) {
        this.config(settings);  // set the defaults.

        if(this.config.sourceUrl) {
            var self = this;
            // send a GET xmlhttp request to retrieve the json data and build the slides
            this.buildSlides.call(this).then(function(){
                self.setSource.call(self);
            });
        }else{
            this.setSource();
        }

        if( this.config.thumbs.show !== false ) {
            this.addThumbnails();
        }

        if( this.config.autoplay ){
            this.play();
        }
    };

    Carousel.prototype.setSource = function () {
        
        this.slideWrapper = this.container.children('.' + this.config.wrapperClass );
        this.slides = this.slideWrapper.children('.'+  this.config.frameClass);
        this.current = this.config.first;
        this.container.css({"display" : "block"});
        $(this.slides[this.current]).addClass('active');

        this.total = this.slides.length; 

        $('.ctrlbutton .next').on("click", this.next.bind(this));
        $('.ctrlbutton .prev').on("click", this.prev.bind(this));
    };

    Carousel.prototype.buildSlides = function () {
        var self = this;
        return this.getJson().then(function ( slides ) {
            var slideElements = slides.length,
            index = 0,
            frameEle = self.config.frameEle,
            frameClass = self.config.frameClass,
            wrapperClass = self.config.wrapperClass;
            for (index; index < slideElements; index++) {
                var slideEle = $("<"+frameEle+">")
                .addClass(frameClass)
                .html(slides[index]["content"]);
                $( '.' + wrapperClass, self.container).append(slideEle);     
            }
        });
    };

    Carousel.prototype.play = function () {
        this.interval = window.setInterval( this.next.bind(this), this.config.delay);
    };

    Carousel.prototype.stopPlay = function () {
        clearInterval(this.interval);   
    };

    Carousel.prototype.next = function () {
        var current = this.current,
          next = current + 1,
          target = (typeof this.slides[next] === 'undefined')  ? 0 : next;

        this.current = target;
        this.animate(current,target);
    };

    Carousel.prototype.prev = function () {
        var current = this.current,
          previous = current-1,
          target = (typeof this.slides[previous] === 'undefined')  ? (this.total - 1) : previous;

        this.current = target;
        this.animate(current,target);
    };

    Carousel.prototype.selectSlide = function (target) {
        var current = this.current;
        this.current = target;
        if( this.slides.length > 0 && this.slides[current].hasOwnProperty('className')){
            this.slides[current].className = this.config.frameClass;
            this.slides[target].className = this.config.frameClass + ' active';
        }
        
    };

    Carousel.prototype.addThumbnails = function () {
        // placeholder thumbnails dynamically 
        // @todo: possibly add some default images, and/or change thumbnail elements to something other than button
        var index = 0,
          total = this.total
          thumbConfig = this.config.thumbs,
          slideWrapper = this.container.children('.' + this.config.wrapperClass ),
          thumbWrapper = slideWrapper.children('.' + thumbConfig.container);
        if( thumbWrapper === null ) {  // there isn't a wrapper container for the thumbnails.
            thumbWrapper = document.querySelector('.' +  this.config.wrapperClass );  // default to the main Carousel container
        };
        for( index; index < total; index++ ) {
            var thumbEle = document.createElement(thumbConfig.thumbEle);
            thumbEle.className = thumbConfig.thumbClass;
            thumbEle.innerHTML = index+1;
            thumbEle.onclick = this.selectSlide.bind(this,index);
            thumbWrapper.appendChild(thumbEle);
        }
    };

    Carousel.prototype.config = function (settings) {
        var settings = (typeof settings === 'object') ? settings : {},
           config = {
            "first"         : 0,
            "autoplay"      : false,
            "sourceUrl"     : false,
            "wrapperClass"  : "slidesWrapper",
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
        this.config = $.extend( true, config, settings );
    };

    Carousel.prototype.animate = function ( current, target ) {
        // add some animation here - but let's wait until we decide on a library or method (CSS animation?)
        var activeEle = $(this.slides[current]),
          targetEle = $(this.slides[target]);
        activeEle.removeClass('active');
        targetEle.addClass('active');
    };

    Carousel.prototype.getJson = function () {
        return $.get(this.config.sourceUrl, function (resp) {
            return resp; 
        });
    };

})(jQuery);