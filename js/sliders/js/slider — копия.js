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
		imageWidth: 50,
		speed: 1000
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
		$allTracks.each((i, track) => {

			tracks[i] = {}
			let currentTrack = tracks[i];
			currentTrack.$track = $(track);
			const $currentChildren = currentTrack.$track.children();

			currentTrack.childrenLength = $currentChildren.length;
			currentTrack.width = (imageWidth * (currentTrack.childrenLength + 1)) * 2;//+ imageWidth;
			currentTrack.currentPosition = 0;
			currentTrack.currentSlide = 0;
			currentTrack.tl = new TimelineMax();
			currentTrack.additionalTransition = 0;

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
				const popupId = data.popupId;
				
				if (!popupId) return false;
				$info.html(
					`<h4 class="info_title">${data.title}<h4>
					<p class="info_date">${data.date}</p>
					<a href='${popupId}' class='info_reffer'>${hrefText}</a>`
				);
				$container.append($info);
				$container.data('id', i);

				currentTrack.$track.append($container.clone());
			});
		});
		// Общее состояния слайдера
	 	let _state = { 
			isPlay: true,
			interval: false,
			isReverse: false,
			isTouchedSlide: false,
			lastTime: false
	 	}; 
	 	// Меняет ширину трека, когда исчезают слайды при прокрутке.
	 	function _changeTrack(track, currentSlide, reverse=false) {
	 		if (!_state.isPlay) return false;
	 		// Слайд, который скроется при прокрутке
	 		const $track = track.$track;
	 		let currentChildren = $track.children();
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

	 		function animate(anotherDuration=false, additionalTransition=0) {
	 			$firstHiddenSlide
					.addClass(addClass)
					.removeClass(removeClass);
		 			
		 		new TweenLite().to($firstHiddenSlide, anotherDuration ? anotherDuration : 0.5, {
		 			left: leftTransition 
		 		});
	 		}
	 		if (_state.isReverse) {
		 		setTimeout(() => {
			 		animate(0.5, -5);
		 		}, 250);
	 		} else {
	 			animate();
	 		}
	 		// Бесконечная прокрутка.
	 		const sliderWidth = $slider.width();
	 		const extraSlides  = (track.currentSlide + (sliderWidth / imageWidth)) ;
	 		
	 		if (!_state.isReverse) {
				const $cloneSlide = $firstHiddenSlide.parent().clone()
				$cloneSlide.find('.slider_slide')
					.addClass('slide_shown')
					.removeClass('slide_hidden');

				track.tl.add(
					new TweenLite($cloneSlide, 0, {
						left: 0
					})
				);
				track.width += imageWidth;
				track.$track.css('width', track.width);
				// track.tl.add(
				// 	new TweenLite($track, 0, {
				// 		width: track.width
				// 	})
				// );
				$track.append($cloneSlide);
	 		} else {
				$(currentChildren[currentChildren.length - 1]).remove();
				track.width -= imageWidth;
				track.$track.css('width', track.width);
	 		
	 		}

	 	}
		const clearIntervalIfNeeded = () => {
			if (_state.interval)
				clearInterval(_state.interval);
		};


		// Абстракция для скролла слайдера вправо.
		const scrollRight = () => {
			tracks.forEach(track => {
				track.tl.clear();
				_changeTrack(track, track.currentSlide)

				track.currentPosition -= imageWidth - track.additionalTransition;
				track.additionalTransition += 0.25;
				track.currentSlide += 1;

				track.tl.add( 
					new TweenLite().to(track.$track, 1, {
						left: track.currentPosition
					})
				);
			});
		};

		// Абстракция для скролла слайдера влево.
		const scrollLeft = () => {
			tracks.forEach(track => {
				const $track = track.$track;
				track.tl.clear();
				track.currentSlide -= 1;
				track.currentPosition += imageWidth + track.additionalTransition;
				track.additionalTransition += 0.25;
				// Скидывает состояние, если пользователь уперся в левый край слайдера.
				
				if (track.currentPosition > 0) {
					track.currentPosition = 0;
					track.currentSlide = 0;
					// $track.animate({
 				// 		left: 0
 				// 	}, 250);
					return false;
				}
				
				_changeTrack(track, track.currentSlide, true)
				track.tl.add( 
					new TweenLite().to($track, 1, {
						left: track.currentPosition
					})
				);		
			});	
		};

		function resetTouch() {
			setTimeout(() => {
					_state.isTouchedSlide = false;
			}, 1500);
		}
		function _makeVisible(track, node) {
			const $this = $(node);
			$this.addClass('slide_shown')
				.removeClass('slide_hidden');

			track.tl.add( 
				new TweenLite().to($this, 0, {
					left: 0
				})
			);
		}

		function _clearTrack() {
			// Если слайдер не трогали, он на автоматической прокрутке,
			// то чистим трек, если нужно.
			if (!_state.isTouchedSlide) {
				tracks.forEach(track => {
					const $track = track.$track;
					const currentChildren = $track.children();
					const currentChildrenLength = currentChildren.length;

		 			
					// console.log('curr chlds:', currentChildrenLength, '\nx3:', (track.childrenLength * 3) - 1)
					// console.log('base length', track.childrenLength);
	 				if (currentChildrenLength > (track.childrenLength * 3) - 1) {
	 					const endCycle = (currentChildrenLength / 3) - 1;
						for (let i = 0; i < endCycle; i++) {
							const $currentChild = currentChildren[i];

							$currentChild.remove()
							track.width -= imageWidth;
							track.currentPosition += imageWidth - track.additionalTransition;
							
							track.additionalTransition -= 0.25;
							track.currentSlide -= 1;
							track.tl.add( 
								new TweenLite().to($track, 0, {
									width: track.width
								})
							);
						}

						const noramalPosition = Math.ceil(track.currentPosition / imageWidth) * imageWidth;
						
						track.tl.add( 
							new TweenLite().to($track, 0, {
								left: noramalPosition
							})
						);	
	 				}
				});
			}

		}
		// Автоскролл
		function scrollTracks() {
			clearIntervalIfNeeded();

			
			_state.interval = setInterval(
				() => {
					_clearTrack()	
					setTimeout(() => {
						if (_state.isReverse)
							scrollLeft();
						else
							scrollRight();
					}, 350);
			}, props.speed ? props.speed : 3000);
		}

		scrollTracks();

		// Предотвращает передвижение слайдера при наведение на один из слайдов.
		$(document)
			.on('mouseover', '.slide_container', e => {
				_state.isPlay = false;
				clearIntervalIfNeeded();
				_state.isTouchedSlide = false;
				_clearTrack();

		})
			.on('mouseout', '.slide_container', e => {
				_state.isPlay = true;
				scrollTracks();
				
		});

		// Разрешает или не разрешает скролить.
		// Внутри стоит ограничитель на скролл по времени и
		// переключение соостояние тронутого слайдера.
		function letScroll(now) {
	 		_state.isTouchedSlide = true;
	 		
	 		if (!_state.isPlay || now - _state.lastTime < 400) {
	 			_state.lastTime = now;
	 			resetTouch();
	 			return false;
	 		}

	 		return true;
		};
		// Скролл по нажатию на стрелки влево или вправо.
	 	$(document).on('keydown', function(e) {
	 		e.preventDefault();
			const now = Date.now();

	 		if (!letScroll(now)) {
	 			e.stopPropagation();
	 			return false;
	 		}
	 		
	 		switch (event.key) {
			    case "ArrowLeft":
			    	scrollLeft();
			    	_state.isReverse = true;
			    	break;
			    case "ArrowRight":
			    	scrollRight();
			    	_state.isReverse = false;
			    	break;
			    default:
			    	return; // Quit when this doesn't handle the key event.
	    	}

			resetTouch();

			scrollTracks();
	    	_state.lastTime = now;
	 	});
	 	// Скролл по прокрутке влево или вправо.
		$slider.on('wheel', e => {
			e.preventDefault();
			const now = Date.now();

			if (!letScroll(now)) {
				e.stopPropagation();
	 			return false;
	 		}

			const norm = NormalizeWheel(e.originalEvent);
			const spinY = norm.spinY;
			_state.isReverse = !(spinY > 0);
			
			if (_state.isReverse) {
				scrollLeft();
			} else {
				scrollRight();
			}
			resetTouch();
			scrollTracks();
			_state.lastTime = now;
		});
	}

	return {
		init
	};
}));