import { TimelineMax, TweenLite } from 'gsap';
import NormalizeWheel from './lib/normwheel.js';

(function (factory) {
	if ( typeof define === 'function' && define.amd ) {
       // AMD. Регистрирует как анонимный модуль.
        define(['jquery', TimelineMax, NormalizeWheel], factory);
	} else if ( typeof exports === 'object' ) {
		// Common JS
		
	    module.exports = factory(require('jquery'), TimelineMax, NormalizeWheel);
	} else {
		// Globals
  		window.SmoothSlider = factory(require('jquery'), TimelineMax, NormalizeWheel);
	}
}(function($, TweenLite, NormalizeWheel) {
	// $ - jQuery
	// TweenLite - объект для реализации плавного перехода.

	const init = (props={
		sliderId: '',
		imageHeight: 50,
		imageWidth: 50
	}) => {
		// Высота и ширина картинки.
		const imageHeight = props.imageHeight;
		const imageWidth = props.imageWidth;

		// Выборки слайдера и трека
		// и Стандартные стили слайдера.
		const $slider = $(props.sliderId).css({
			position: 'relative',
			overflow: 'hidden',
			paddingLeft: '1%'
		});
		// Выборка треков.
		const $allTracks = $slider.find('.slider-track');
		/* 
		 * Массив с объектами данных треков. 
  		 * В каждом треке содержится 
  		 * {
  		 * 	   $track: jQuery выборка трека,
  		 * 	   width: ширина трека,
  		 * 	   childrenLength: базовая длина слайдов
  		 * } 
		 */
		const tracks = [];
		// Компонуются данные
		$allTracks.each((i, e) => {

			tracks[i] = {}
			let currentTrack = tracks[i];
			currentTrack.$track = $(e);
			let $currentChildren = currentTrack.$track.children();
			currentTrack.childrenLength = $currentChildren.length
			currentTrack.width = imageWidth * (currentTrack.childrenLength + 0.5);

			$currentChildren.css({
	    		width: imageWidth,
	    		height: imageHeight
	    	});
	    	// Устанавливаются бызовые параметры трека.
	    	currentTrack.$track.css({ 
				height: imageHeight,
				width: currentTrack.width 
			});
			// Оборачивает каждый слайд в контейнер для
			// хорошей перспективы.
			$currentChildren.each((i, child) => {
				$(child).wrap('<div class="slide_container">');
			});
		});
		// Общее состояния слайдера
	 	let _state = { 
			currentPosition: 0, // Позиция в пикселях.
	    	currentSlide:  0, // Индекс.
			tl: new TimelineMax(), // Глобальная сцена переходов.
			paddingLeft: 1 // Для лучего отображения анимации.
	 	}; 
	 	// Меняет ширину трека, когда исчезают слайды при прокрутке.
	 	function _changeTrack(track, currentSlide, reverse=false) {
	 		// Слайд, который скроется при прокрутке
	 		let currentChildren = track.$track.children();
	 		const $firstHiddenSlide = $(currentChildren[currentSlide]).find(':first-child');
	 	
	 		let removeClass = '';
	 		let addClass = '';
	 		let isAppend = true;
	 		let leftTransition = imageWidth / 2 + 20; // Переменная для плавного сокрытия слайда. 
	 		
	 		// Проверяет, в какаую сторону пользователь двигает слайд.
	 		if (!reverse) {
	 			addClass = 'slide_hidden';
	 			removeClass = 'slide_shown';
				_state.paddingLeft += 1;
				
	 		} else {
	 			addClass = 'slide_shown';
	 			removeClass = 'slide_hidden';
				isAppend = false;
				leftTransition = 0;
				_state.paddingLeft -= 1;
	 		}

	 		$firstHiddenSlide
				.addClass(addClass)
				.removeClass(removeClass);
	 			
	 		new TweenLite().to($firstHiddenSlide, 0.1, {
	 			left: leftTransition	 			
	 		});

	 		let $copyHiddenSlide = $firstHiddenSlide.parent().clone();
	 		$copyHiddenSlide.find(':first-child')
	 			.addClass('slide_shown')
	 			.removeClass('slide_hidden');

			$slider.css('paddingLeft', `${_state.paddingLeft}%`);
	 		// Бесконечная прокрутка.
	 		if (isAppend) {
	 			// В треке увеличивается количество слайдов.
	 			track.width += imageWidth;
	 			// Ширина трека увеличивается до того, как слайд будет добавлен.
	 			// Также это относится и к уменьшению.
	 			track.$track.css('width', track.width);
	 			track.$track.append($copyHiddenSlide);

	 		} else {
	 			track.width -= imageWidth;
	 			track.$track.css('width', track.width);
	 			// В треке уменьшается количество слайдов.
	 			track.$track.html(currentChildren.slice(0, currentChildren.length - 1));
	 		}
	 	}

		$slider.on('wheel', e => {
			e.preventDefault();
			const norm = NormalizeWheel(e.originalEvent);
			const spinY = norm.spinY;

			
			if (spinY > 0) {
				_state.tl.clear();
				tracks.forEach(track => {
					_changeTrack(track, _state.currentSlide)
				});

				_state.currentPosition -= imageWidth;
				_state.currentSlide += 1;
			} else {
				_state.tl.clear();
				_state.currentPosition += imageWidth;
				_state.currentSlide -= 1;
				// Скидывает состояние, если пользователь уперся в левый край слайдера.
				if (_state.currentPosition > 0) {
					_state.currentPosition = 0;
					_state.currentSlide = 0;

					tracks.forEach(track => {
						track.width = imageWidth * (track.childrenLength + 0.5);
						// track.$track.css('width', track.width);
					});
					new TweenLite().to($allTracks, 1, {
						left: _state.currentPosition
					})
					return false;
				}
				
				tracks.forEach(track => {
					_changeTrack(track, _state.currentSlide, true)
				});
				
			}
			
			
			_state.tl.add( 
				new TweenLite().to($allTracks, 1, {
					left: _state.currentPosition
				})
			);
		});
	}

	return {
		init
	};
}));