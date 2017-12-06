import 'jquery';
import Slider from './slider.js';

// ScrewDriver.mount('fashionableCards', fashionableCards);
// ScrewDriver.init('orderForm');



$(function() {
	// Слайдер с идентификатором #slider.
	Slider.init({
		imageHeight: 150,
		imageWidth: 150
	});
	// Слайдер с определённым идентификатором.
	Slider.init({
		sliderId: '#secondSlider',
		imageHeight: 200,
		imageWidth: 200
	});
	// Под скоростями.
	Slider.init({
		sliderId: '#thirdSlider',
		imageHeight: 170,
		imageWidth: 170,
		speed: 1500
	});
	// Слайдер если слайдера нет.
	Slider.init({
		sliderId: '#thirdSlider_v2',
		imageHeight: 180,
		imageWidth: 180
	});

	
});
