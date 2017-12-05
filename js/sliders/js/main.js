import 'jquery';
import Slider from './slider.js';

// ScrewDriver.mount('fashionableCards', fashionableCards);
// ScrewDriver.init('orderForm');



$(function() {
	Slider.init({
		sliderId: '#slider',
		imageHeight: 160,
		imageWidth: 160
	});
});
