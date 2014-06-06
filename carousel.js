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
    if( this.config.thumbnails ) {
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
      this.container = doc.querySelector(parentContainer);
    if(this.config.sourceUrl) {
        //@todo : add get call to call in json.  Mock it for now
        this.buildSlides();
    }
    this.slides = doc.querySelectorAll(parentContainer + ' .' + this.config.frameClass);
    this.container.style.display = "block";

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
        var slideEle = document.createElement('div');
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
      target = (typeof this.slides[previous] === 'undefined')  ? 0 : previous;

    this.current = target;
    this.animate(current,target);
};

Carousel.prototype.selectSlide = function (target) {
    var current = this.current;
    this.current = target;
    if( this.slides.length > 0 && this.slides[this.current].hasOwnProperty('className')){
        this.slides[this.current].className = this.config.frameClass;
        this.slides[target].className = this.config.frameClass + ' active';
    }
    
};

Carousel.prototype.addThumbnails = function () {
    // placeholder thumbnails dynamically 
    // @todo: possibly add some default images, and/or change thumbnail elements to something other than button
    var index = 0,
      total = this.total,
      thumbWrapper = document.querySelector('.' + this.config.thumbWrapper);
    for( index; index < total; index++ ) {
        var thumbEle = document.createElement('button');
        thumbEle.className = this.config.thumbClass;
        thumbEle.innerHTML = index+1;
        thumbEle.onclick = this.selectSlide.bind(this,index);
        thumbWrapper.appendChild(thumbEle);
    }
}

Carousel.prototype.config = function (settings) {
    var settings = (typeof settings === 'object') ? settings : {},
       config = {
        "thumbnails"    : false,
        "autoplay"      : false,
        "sourceUrl"     : false,
        "wrapperClass"  : "slidesWrapper",
        "frameClass"    : "slide",
        "delay"         : 4000, // 4 seconds
        "thumbWrapper"  : "thumbs",
        "thumbClass"    : "selectSlide"
      };
    this.config = this.merge( config, settings );
};

Carousel.prototype.animate = function ( current, target ) {
    // add some animation here - but let's wait until we decide on a library or method (CSS animation?)
    this.slides[current].className = this.config.frameClass;
    this.slides[target].className = this.config.frameClass + " active";
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