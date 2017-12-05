import 'jquery';
import Slider from './slider.js';

// ScrewDriver.mount('fashionableCards', fashionableCards);
// ScrewDriver.init('orderForm');



$(function() {
	Slider.init({
		sliderId: '#slider',
		imageHeight: 150,
		imageWidth: 150
	});
});
