var Carousel = function (settings) {
    if (typeof settings === 'object') {
        // call the init function automatically if the settings are passed to constructor.
        this.__proto__.init.call(this, settings);
    }
    return this;
};

Carousel.prototype.init = function (settings) {
    this.__proto__.config.call(this,settings);  // set the defaults.

    var parentContainer = '.' + this.config.wrapperClass,
      doc = document;
    // @todo: abstract this out somehow so you can load the slides via an external call and build the slides dynamically.
    this.current = 0,
      this.container = doc.querySelector(parentContainer),
      this.slides = doc.querySelectorAll(parentContainer + ' .' + this.config.frameClass),
      this.total = this.slides.length,
      this.prevbtn = doc.querySelector(parentContainer + ' .ctrlbutton .prev'),
      this.nextbtn = doc.querySelector(parentContainer + ' .ctrlbutton .next');
    
    this.container.style.display = "block";
    this.slides[this.current].className = "slide active";

    if( this.nextbtn && this.nextbtn.hasOwnProperty('onclick') ){
        this.nextbtn.onclick = this.__proto__.next.bind(this);
    }
    if( this.prevbtn && this.prevbtn.hasOwnProperty('onclick') ){
        this.prevbtn.onclick = this.__proto__.prev.bind(this);
    }

    if( this.config.autoplay ){
        this.__proto__.play.call(this);
    }
};

Carousel.prototype.next = function () {
    var current = this.current,
      target = (typeof this.slides[this.current+1] === 'undefined')  ? 0 : this.current + 1;

    this.current = target;
    this.__proto__.animate.call(this,current,target);
};

Carousel.prototype.prev = function () {
    var current = this.current,
      target = (typeof this.slides[this.current-1] === 'undefined')  ? 0 : this.current - 1;

    this.current = target;
    this.__proto__.animate.call(this,current,target);
};

Carousel.prototype.selectSlide = function(target) {
    // add direct call to slide here.    
};

Carousel.prototype.config = function (settings) {
    var settings = (typeof settings === 'object') ? settings : {},
       config = {
        "wrapperClass"  : "slidesWrapper",
        "frameClass"    : "slide",
        "autoplay"      : false,
        "delay"         : 4000 // 4 seconds
      };
    this.config = this.__proto__.merge( config, settings );
};

Carousel.prototype.play = function () {
    this.interval = window.setInterval( this.__proto__.next.bind(this), this.config.delay);
};

Carousel.prototype.animate = function ( current, target ) {
    // add some animation here - but let's wait until we decide on a library or method (CSS animation?)
    this.slides[current].className = "slide";
    this.slides[target].className = "slide active";
};

Carousel.prototype.merge = function (target,source) {
    var merged = ( typeof target !== 'object' ) ? {} : target;
    for ( var property in source) {
        if( source.hasOwnProperty(property) ) {
            var sourceProperty = source[property];
            if(typeof sourceProperty === 'object') {
                // call this same function recursively
                merged[property] = this.__proto__.merge( merged[property], sourceProperty );
                continue;
            }
            merged[property] = sourceProperty;
        }
    }
    return merged;
};