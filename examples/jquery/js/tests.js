
(function($) {
    var opts = {
        wrapperClass: 'carousel-wrapper'
    },
    slider1 = new Carousel();
	
    test('New Carousel', function() {
        ok( typeof slider1 === 'object', "New Object Created" );
        ok( !slider1.hasOwnProperty('defaults'), 'Object is not initalized'); 
	});
    
    setTimeOut(function () {
        test('Initialize Carousel Settings', function() {
            slider1.init(opts);
            ok( slider1.hasOwnProperty('config'), 'Object is initalized');
            ok( slider1.config.wrapperClass === opts.wrapperClass, 'Wrapper class is successfully overwritten');
            ok( slider1.slides[slider1.current].className === 'slide active', 'Initial slide is set to active');
        });

        test('Carousel Next', function() {
            slider1.next();
            ok(slider1.current > 0, 'Slide element is incremented');
        });

        test('Carousel Previous', function() {
            slider1.prev();
            ok(slider1.current === 0, 'Slide element is decremented');
        });
    }, 1000);

    

})(jQuery);