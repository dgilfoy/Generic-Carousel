
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
            test('New Carousel', 2, function( ) {
                ok( typeof slider === 'object', "New Object Created" );
                ok( !slider.hasOwnProperty('config'), 'Object is not initalized');
                return slider;
            });        
        }, slider);
    })
      .then( function(slider){
        var opts = {
            wrapperClass: 'carousel-wrapper',
            thumbnails: true, 
        };
        slider.init( opts );
        return deferTest( function () {
            test('Initialize Carousel Settings', 3, function() {
                ok( slider.hasOwnProperty('config'), 'Object is initalized');
                ok( slider.config.wrapperClass === opts.wrapperClass, 'Wrapper class is successfully overwritten');
                ok( slider.slides[slider.current].className === 'slide active', 'Initial slide is set to active');
            });    
        }, slider );
        // see if Carousel has been initialized and wrapper and initial slides are set to visible (class="active")
        
    })
      .then( function (slider) {
        return deferTest( function () {
            test('Carousel Next', 1, function() {
                slider.next();
                ok(slider.current > 0, 'Slide element is incremented');
            });   
        }, slider );
    })
      .then( function (slider) {
        return deferTest( function () {
            test('Carousel Previous', 1, function() {
                slider.prev();
                ok(slider.current === 0, 'Slide element is decremented');
            });   
        }, slider );
    })
      .then( function (slider) {
        return deferTest( function () {
            test('Carousel AutoPlay', 1, function() {
                slider.play();
                ok(slider.interval, 'Slide element is playing');
            });   
        }, slider );
    })
      .then( function (slider) {
        return deferTest( function () {
            test('Carousel AutoPlay Off', 1, function() {
                slider.stopPlay();
                ok( !slider.interval, 'Slide element is stopped');   
            } );
        }, slider, 5000);
    })
      .done(
        function ( slider ) {
            console.log(slider);
        }
    );
})(jQuery);