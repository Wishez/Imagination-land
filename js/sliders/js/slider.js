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
			padding: '5% 0 5% 5%'
		});
		const hrefText = $slider.data('href-text');
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
			currentTrack.width = imageWidth * (currentTrack.childrenLength + 1);

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
				const $child = $(child).wrap('<div class="slide_container">').addClass('slider_slide');
				const $container = $child.parent();
				const data = $child.data();
				const $info = $('<div class="slide_info">');
				
				$info.html(
					`<h4 class="info_title">${data.title}<h4>
					<p class="info_date">${data.date}</p>
					<a href='${data.popupId}' class='info_reffer'>${hrefText}</a>`
				);
				$container.append($info);
				
			});
		});
		// Общее состояния слайдера
	 	let _state = { 
			currentPosition: 0, // Позиция в пикселях.
	    	currentSlide:  0, // Индекс.
			tl: new TimelineMax(), // Глобальная сцена переходов.
			isPlay: true
	 	}; 
	 	// Меняет ширину трека, когда исчезают слайды при прокрутке.
	 	function _changeTrack(track, currentSlide, reverse=false) {
	 		if (!_state.isPlay) return false;
	 		// Слайд, который скроется при прокрутке
	 		let currentChildren = track.$track.children();
	 		const $firstHiddenSlide = $(currentChildren[currentSlide]).find('.slider_slide');
	 	
	 		let removeClass = '';
	 		let addClass = '';
	 		let isAppend = true;
	 		let leftTransition = imageWidth / 2 + 20; // Переменная для плавного сокрытия слайда. 
	 		
	 		// Проверяет, в какаую сторону пользователь двигает слайд.
	 		if (!reverse) {
	 			addClass = 'slide_hidden';
	 			removeClass = 'slide_shown';
	 		} else {
	 			addClass = 'slide_shown';
	 			removeClass = 'slide_hidden';
				isAppend = false;
				leftTransition = 0;
				
	 		}

	 		function animate(anotherDuration=false) {
	 			$firstHiddenSlide
					.addClass(addClass)
					.removeClass(removeClass);
		 			
		 		new TweenLite().to($firstHiddenSlide, anotherDuration ? anotherDuration : 0.1, {
		 			left: leftTransition	 			
		 		});
	 		}
	 		if (reverse) {
		 		setTimeout(() => {
			 		animate(0.5);
		 		}, 250);
	 		} else {
	 			animate();
	 		}

	 		let $copyHiddenSlide = $firstHiddenSlide.parent().clone();
	 		$copyHiddenSlide.find('.slider_slide')
	 			.addClass('slide_shown')
	 			.removeClass('slide_hidden');

			
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
		$(document)
			.on('mouseover', '.slide_container', e => {
				_state.isPlay = false;
		})
			.on('mouseout', '.slide_container', e => {
				_state.isPlay = true;
		});

		$slider.on('wheel', e => {
			e.preventDefault();
			if (!_state.isPlay) return false;

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