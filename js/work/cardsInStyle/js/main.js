import { styles } from './conf.js';

(function(factory) {
 	if ( typeof define === 'function' && define.amd ) {
	       // AMD. Регистрирует как анонимный модуль.
	        define(['jquery', 'lozad', 'zooming'], factory);
	} else if ( typeof exports === 'object' ) {
	      // CommonJS
	      module.exports = factory( 
	      	require('jquery'),
	      	require('lozad'),
	      	require('zooming')
	      );
	} else {
  		// Импорт в jQuery 
  		factory( jQuery, lozad, zooming );
  		
	}
})(function($, lozad, Zooming) {
	/* 
	 * Производительно загружает картинки, добавляя им анимацию, когда они загрузились
	 * и собираются появится.
	 * 
	 * @param {String} imageClass - Класс изображений, собирающиеся плавно появится.
	 *
	 * @public
	 */
	const _loadImages = imageClass => {
		lozad(imageClass, {
			load: el => {
				el.src = el.dataset.src;
				el.onload = function() {
					el.classList.add('imageContainer_fadeIn')
				}
			}
		}).observe();
	};

	/* 
	 * Обычная обёртка для установки события элементу
	 * 
	 * @param {String} selector - Селектор, к которому привязывается событие. 
	 * @param {Function} callback - Обратный вызов, вызывающийся после того, как событие произойдёт.
	 * @param {String} event - Событие, на которое будет тригерить функция
	 * По умолчанию стоит событие клика.
	 *
	 * @public
	 */
	const screwedClick = (selector, callback, event='click') =>  {
		$(document).on(event, selector, callback);
	}

	const _createExample = (src, before, num) => (
		`<img data-src='${src}' data-before='${before}' data-num='${num}'` +
		' alt="Пример работы" class="imageContainer workExamples__image"/>'
	);
	
	const _composeAndShowExamples = ($node, examples) => {
		let resultHtml = '';

		examples.forEach(example => {
			// Компануется строка с картинками работ.
			resultHtml += _createExample(
				example.src,
				example.before,
				example.num
			);
		});
		// Отображается в DOM.
		$node.html(resultHtml);
	};

	const _customMainImage = (props) => {
			props.$mainImage.attr('src', props.src);
			props.$before.data('src', props.before);
			props.$after.data('src', props.src);
			props.$imageNumber.text(props.num);
	};

	const _changeActiveButton = $node => {
		const activeCls = 'styleCardPresentation__button_active';

		$(`.${activeCls}`).removeClass(activeCls);
		$node.addClass(activeCls);
	}
	/*
	 * Привязывает события к базовым элементам, а как после того, как 
	 * событие тригерит - выполняет задачу.
	 * 
	 * @public
	 */
	const baseScrewed = imageClass => {
		// Выборки
		let $styleCard = $('#styleCard');
		let $styles = $('#styles');
		let $mainImage = $('#mainImage');
		let $styleName = $('#styleName');
		let $before = $('#before');
		let $after = $('#after');
		let $imageNumber = $('#imageNumber');
		let $workExamples = $('#workExamples');
		let $styleDescription = $('#stlyleDescription');
		// Устанавливает масштабирование для главной картинки в карточке стиля
		const zooming = new Zooming({
			bgColor: '#212121'
		});
		zooming.listen('#mainImage');
		
		/*
		 * Открывает краточку стиля по нажатию на кнопку "Подробнее",
		 * а после заполняет её данными
		 */
		$.ScrewDriver.screwed('.workExamples__image', function(e) {
			_customMainImage({
				...$(this).data(),
				$imageNumber,
				$mainImage,
				$before,
				$after
			});
			_changeActiveButton($after);
		});

		/*
		 * Открывает краточку стиля по нажатию на кнопку "Подробнее",
		 * а после заполняет её данными
		 */
		$.ScrewDriver.screwed('.singleStyleImageContainer__button', e => {
			// Берутся данные о стиле и его примеры
			const cls = 'styleCard';
			const styleData = styles[e.target.dataset.style];
			// Object
			const meta = styleData.meta;
			// Array
			const examples = styleData.examples;
			const firstExample = examples[0];

			// Анимация карточки и стилей
			$styles.addClass('styles_hidden');
			$styleCard
				.removeClass(`${cls}_zeroHeight`)
				.addClass(`${cls}_shown`);

			// Заполнение карточки данными
			$styleName.text(meta.name);
			$styleDescription.text(meta.description);
			// Главная картинка
			_customMainImage({
				src: firstExample.src,
				before: firstExample.before,
				num: firstExample.num,
				$imageNumber,
				$mainImage,
				$before,
				$after
			});
			// Устанавливается по-умолчанию активный класс
			// "готовой работе".
			_changeActiveButton($after);
			// Компануются примеры стиля, а после отображаются
			_composeAndShowExamples($workExamples, examples)
			// Все скомпонованные картинки плавно загружаются
			_loadImages('.imageContainer');

		}); // End screwed


		/*
		 * Плавно закрывает карточку стиля 
		 * и очищает контейнер с экземплярами работ.
		 */
		$.ScrewDriver.screwed('#closeStyleCardButton', e => {
			const cls = 'styleCard';
			$styles.removeClass('styles_hidden');
			$styleCard.removeClass(`${cls}_shown`);
			
			setTimeout(() => {
				$styleCard.addClass(`${cls}_zeroHeight`);
			}, 1000)

			$workExamples.empty();
		}); // End screwed

		/*
		 * Меняется активное состояние кнопки "До" и "После" состояние кнопки,
		 * вместе с главной картинкой в карточке стиля.
		 */
		$.ScrewDriver.screwed('#after, #before', function(e) {
			let $this = $(this);
			// Меняется картинка
			$mainImage.attr('src', $this.data('src'));
			// Меняется активная кнопка
			_changeActiveButton($this);

		}); // End screwed

		/*
		 * Плавно и производительно загружает все картинки стилей.
		 */
		_loadImages(imageClass);
	}; // End baseScrewed

	// Фасад, импортируемый, как подмодуль jQuery.
	$.ScrewDriver = {
		screwed: screwedClick,
		customScrewed: baseScrewed
	};
});

$(document).ready(function() {
	$.ScrewDriver.customScrewed('.imageContainer');
});