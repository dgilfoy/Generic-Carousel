
(function($) {

    function TestSuite() {
        slider = new Carousel();
        return Q.fcall(function () {
            return slider;
        });
    };

    function deferTest( callback, slider, ms ){
        var deferred = Q.defer(),
          ms = ms || 1000;
        setTimeout(function () {
            callback.call(this, slider);
            deferred.resolve( slider );
        }, ms);
        return deferred.promise;
    };

    var tests = new TestSuite()
      .then( function(slider) {
        return deferTest( function(){
            test('New Carousel', 2, function ( assert ) {
                assert.equal( typeof slider, 'object', "New Object Created");
                assert.ok( !slider.hasOwnProperty('config'), 'Object is not initalized');
                return slider;
            });        
        }, slider);
    })
      .then( function(slider){
        var opts = {
            wrapperClass: 'carousel-wrapper',
            thumbnails: true,
            delay: 1000 
        };
        slider.init( opts );
        return deferTest( function () {
            test('Initialize Carousel Settings', 3, function(assert) {
                assert.ok( slider.hasOwnProperty('config'), 'Object is initalized');
                assert.ok( slider.config.wrapperClass === opts.wrapperClass, 'Wrapper class is successfully overwritten');
                assert.ok( slider.slides[slider.current].className === 'slide active', 'Initial slide is set to active');
            });    
        }, slider );
        // see if Carousel has been initialized and wrapper and initial slides are set to visible (class="active")
        
    })
      .then( function (slider) {
        return deferTest( function () {
            test('Carousel Next', 1, function(assert) {
                slider.next();
                assert.ok(slider.current > 0, 'Slide element is incremented');
            });   
        }, slider );
    })
      .then( function (slider) {
        return deferTest( function () {
            test('Carousel Previous', 1, function(assert) {
                slider.prev();
                assert.ok(slider.current === 0, 'Slide element is decremented');
            });   
        }, slider, 2000 );
    })
      .then( function (slider) {
        return deferTest( function () {
            test('Enable Slide In Animation', 2, function(assert) {
                slider.addConfig({
                    "animationIn" : "slidein",
                    "animationOut": "slideout"
                });
                assert.ok(slider.config.animationIn, 'Slide In animation is added');
                assert.ok(slider.config.animationOut, 'Slide Out animation is added');
            });   
        }, slider );
    })
      .then( function (slider) {
        return deferTest( function () {
            test('Carousel AutoPlay', 1, function(assert) {
                slider.play();
                assert.ok(slider.interval, 'Slide element is playing');
            });   
        }, slider );
    })
      .then( function (slider) {
        return deferTest( function () {
            test('Carousel AutoPlay Off', 1, function(assert) {
                slider.stopPlay();
                assert.ok( !slider.interval, 'Slide element is stopped');   
            } );
        }, slider, 4000);
    })
      .then( function (slider) {
        return deferTest( function () {
            test('Add thumbnails', 1, function(assert) {
                slider.addConfig({"thumbs" : { "show" : true}});
                slider.addThumbnails();
                assert.ok( slider.config.thumbs.show, 'Add Thumbnails');
                // maybe add test to see if thumbnails were added to the DOM  
            } );
        }, slider, 3000);
    })
      .then( function (slider) {
        return deferTest( function (assert) {
            test('Click to first slide', 1, function() {
               slider.selectSlide(0);
               ok(slider.current === 0, 'Slider is set to first slide');
            } );
        }, slider, 5000);
    })
      .done(
        function ( slider ) {
            console.log(slider);
        }
    );
})(jQuery);