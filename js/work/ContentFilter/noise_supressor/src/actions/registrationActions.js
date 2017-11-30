import { 
 	REGISTER,
 	REQUEST_REGISTER
 	
} from './../constants/registrationTypes.js';
import {
	registerUrl
} from './../constants/conf.js';
import customAjaxRequest, { make_request } from './../constants/ajax.js';

// Показывает обработку регистрации.
const registering = () => ({
	type: REQUEST_REGISTER
});

const register = (
	registered,
	registerMessage
) => ({
	type: REGISTER,
	registered: registered,
	registerMessage: registerMessage
});



export const tryRegister = data => dispatch => {	
	dispatch(registering());

	customAjaxRequest({
		url: registerUrl,
		data: data,
		type: 'POST',
		processData: true,
		cache: true
	});

	return make_request(
		resp => {
			// Сервер возвращает Вы успешно прошли регистрацию, если пользователь успешно зарегистрировался.
			// В остальных случаях он возвращает другое сообщение.
			console.log(resp);
			dispatch(register(resp.is_registered, resp.message));
		},
		(xhr, errmsg, err) => {
			dispatch(register(false, 'Внутренняя ошибка сервера'));
		}
	);
}