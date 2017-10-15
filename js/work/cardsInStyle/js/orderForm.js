import { styles } from './conf.js';

const orderForm = function() {
	/* 
	 * Обычная обёртка для установки события элементу.
	 * 
	 * @param {String} selector - Селектор, к которому привязывается событие. 
	 * @param {Function} callback - Обратный вызов, вызывающийся после того, как событие произойдёт.
	 * @param {String} event - Событие, на которое будет тригерить функция
	 * По умолчанию стоит событие клика.
	 *
	 * @public
	 */
	const _screwed = (selector, callback, event='click') =>  {
		$(document).on(event, selector, callback);
	};
	const _openForm = ($node) => {
	};

	const _cloeseForm = () => {

	};

	const _tryMakeOrder = (
		url,
		data, 
		callback, 
		failure
	) => {
		

		$.ajaxSetup({
			url,
			method: 'POST',
			data
		});

		$.ajax({
			success: response => {
				callback(response);
			},
			error: (xhr, errmsg, err) => {
				failure(xhr, errmsg, err);
			}
		});
	};

	const _createNumOption = num => (
		`<option value='${num}' class='orderFormController__option'>${num}</option>`
	);

	const _composeAndShowNumbersOfImages = ($node, examples) => {
		let resultHtml = "<option value='' disabled selected " +
			"class='orderFormController__option'>Номер изображения</option>"

		examples.forEach(example => {
			resultHtml += _createNumOption(example.num);
		});

		$node.html(resultHtml);
	}

	 

	const customForm = (
		props = {
			formId: "#orderForm",
			containerFormId: "#orderFormContainer",
			containerFormClass: '.orderFormContainer',
			openFormButtonId: "#orderPictureButton",
			closeFormButtonId: "#orderFormCloseButton",
			submitButtonId: '#orderFormSubmitButton',
			formTitleId: '#orderFormTitle',
			fieldWithNumId: '#preferedImageNum',
			formErrorId: '#formError',
			url: '/fashionableImages/registerOrder/',
			errorHandler: false,
			successHandler: false
		}
	) => {
		let $form = $(props.fromId);
		let $formContainer = $(props.containerFormId);
		let $openButton = $(props.openFormButtonId);
		let $closeButton = $(props.closeFormButtonId);
		let $submitButton = $(props.submitButtonId);
		let $formTitle = $(props.formTitleId);
		let $preferedNumField = $(props.fieldWithNumId);
		let $formError = $(props.formErrorId);

		_screwed(props.closeFormButtonId, () => {
			// Убираю точку вначале строки.
			const cls = props.containerFormClass.slice(1)

			$formContainer.addClass(`${cls}_closed`)

			setTimeout(() => {
				$formContainer.addClass(`${cls}_hidden`);
				$preferedNumField.empty();
			}, 1200)	
		});

		_screwed(props.openFormButtonId, () => {
			// Убираю точку вначале строки.
			const data = $openButton.data();
			const cls = props.containerFormClass.slice(1)
			// Заполняет форму данными - ставит стиль в заголовок и добавляет номера изображений
			// в поле с выбором предпочтительного изображения.
			$formTitle.html(`Заказать портрет в стиле "${data.styleName}"`);
			_composeAndShowNumbersOfImages($preferedNumField, styles[data.style].examples);
			// Отображает форму.
			$formContainer.removeClass(`${cls}_closed ${cls}_hidden`);
		});

		_screwed(props.formId, e => {
			const formData = $(this).serialize();

			_tryMakeOrder(
				props.url,
				formData,
				props.success ? 
					props.success : 
					response => {
						const message = '<p class="orderForm__successMessage">' + 
							'В ближайшее время мы свяжемся с вами, чтобы обсудить детали.</p>';
							
						$form.html(message);
					},// end props.success
				props.error ?
					props.error :
					(xhr, errmsg, err) => {
						$formError.html('Внутренняя ошибка сервера');
					} // end props.error
			); // end _tryMakeOrder

			e.preventDefault();

		}, 'submit'); // end _screwed
	};

	this.orderForm = {
		run: customForm
	};

};


export default orderForm;