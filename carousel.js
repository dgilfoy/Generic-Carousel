var Carousel = function (settings) {
    if (typeof settings === 'object') {
        // call the init function automatically if the settings are passed to constructor.
        this.init(settings);
    }
};

Carousel.prototype.init = function (settings) {
    this.config(settings);  // set the defaults.

    this.setSource();

    if( this.nextbtn && this.nextbtn.hasOwnProperty('onclick') ){
        this.nextbtn.onclick = this.next.bind(this);
    }
    if( this.config.thumbs.show !== false ) {
        this.addThumbnails();
    }

    if( this.prevbtn && this.prevbtn.hasOwnProperty('onclick') ){
        this.prevbtn.onclick = this.prev.bind(this);
    }

    if( this.config.autoplay ){
        this.play();
    }
};

Carousel.prototype.setSource = function () {
    var parentContainer = '.' + this.config.wrapperClass,
      doc = document;
    // @todo: abstract this out somehow so you can load the slides via an external call and build the slides dynamically.
    
    this.current = 0,
    this.interval = false,
      this.container = doc.querySelector(parentContainer);
    if(this.config.sourceUrl) {
        // send a GET xmlhttp request to retrieve the json data and build the slides
        this.buildSlides();
    }

    this.slides = doc.querySelectorAll(parentContainer + ' .' + this.config.frameClass);
    if( this.container && this.container.hasOwnProperty('style') ){
        this.container.style.display = "block";
    }

    this.selectSlide(this.current);

    this.total = this.slides.length,
      this.prevbtn = doc.querySelector(parentContainer + ' .ctrlbutton .prev'),
      this.nextbtn = doc.querySelector(parentContainer + ' .ctrlbutton .next');
};

Carousel.prototype.buildSlides = function () {
    var slides = this.getJson(),
      slideElements = slides.length,
      index = 0;
    for (index; index < slideElements; index++) {
        var slideEle = document.createElement(this.config.frameEle);
        slideEle.className = this.config.frameClass;
        slideEle.innerHTML = slides[index].content;
        this.container.appendChild(slideEle);    
    }
};

Carousel.prototype.play = function () {
    this.interval = window.setInterval( this.next.bind(this), this.config.delay);
};

Carousel.prototype.stopPlay = function () {
    clearInterval(this.interval);
    this.interval = false;
};

Carousel.prototype.next = function () {
    // @todo: change it so that "looping" is a setting and is on by default (?)
    // same thing with previous.
    var current = this.current,
      next = current + 1,
      target = (typeof this.slides[next] === 'undefined')  ? 0 : next;

    this.animate(current,target, "Next");
};

Carousel.prototype.prev = function () {
    var current = this.current,
      previous = current-1,
      target = (typeof this.slides[previous] === 'undefined')  ? ( this.total - 1 ) : previous;

    this.animate(current,target, "Prev");
};

Carousel.prototype.selectSlide = function (target) {
    var current = this.current;
    // calculate direction here, add it to the functionality, make "next by default"
    if( this.slides.length > 0 && this.slides[current].hasOwnProperty('className')){
        this.animate(current,target, "Next");
    }
};

Carousel.prototype.addThumbnails = function () {
    // placeholder thumbnails dynamically 
    // @todo: possibly add some default images, and/or change thumbnail elements to something other than button
    var index = 0,
      total = this.total,
      thumbConfig = this.config.thumbs,
      thumbWrapper = document.querySelector('.' + thumbConfig.container);
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
}

Carousel.prototype.config = function (settings) {
    var settings = (typeof settings === 'object') ? settings : {},
       config = {
        "autoplay"      : false,
        "sourceUrl"     : false,
        "wrapperClass"  : "slidesWrapper",
        "frameClass"    : "slide",
        "frameEle"      : "div",
        "delay"         : 4000, // 4 seconds
        "animationIn"   : false,
        "animationOut"  : false,  
        "thumbs"        : {
            "show"      : false,
            "container" : "thumbsWrapper",
            "thumbEle"  : "button",
            "thumbClass": "selectSlide"
        }
      };
    this.config = this.merge( config, settings );
};

Carousel.prototype.addConfig = function (config) {
    this.config = this.merge(this.config, config );
};

Carousel.prototype.animate = function ( current, target, direction ) {
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

Carousel.prototype.animationEnd = function (show,hide,effect,e) {
    if( e.animationName === effect.trim(' ')) {
        e.target.className = this.config.frameClass + " active";
        if( show !== hide ){
            this.slides[hide].className = this.config.frameClass;
        }
    } 
};

Carousel.prototype.getJson = function () {
    var req = new XMLHttpRequest();
    var list = [];
    req.open('get', this.config.sourceUrl, false);
    req.onload = function(resp){
        list = resp.target.response;
        return list;
    };
    req.send();
    return JSON.parse(list);
};

Carousel.prototype.merge = function (target,source) {
    var merged = ( typeof target !== 'object' ) ? {} : target;
    for ( var property in source) {
        if( source.hasOwnProperty(property) ) {
            var sourceProperty = source[property];
            if(typeof sourceProperty === 'object') {
                // call this same function recursively
                merged[property] = this.merge( merged[property], sourceProperty );
                continue;
            }
            merged[property] = sourceProperty;
        }
    }
    return merged;
};