import { 
	LOGIN,
 	LOGOUT,
 	RECOVER_PASSWORD, 
 	CHANGE_EMAIL,
 	CHANGE_PASSWORD,
 	REPLANISH_BALANCE,
 	REQUEST_LOGIN_IN,
 	SET_USER_TO_COOKIES,
 	REQUEST_IN_PERSONAL_ROOM,
 	SUBSCRIBE,
 	CHANGE_USER_AVATAR
} from './../constants/accountTypes.js';
import customAjaxRequest, { make_request } from './../constants/ajax.js';
import { convertDate } from './../constants/pureFunctions.js';
/* User 
 * 
 * username
 * password
 * UserData will get to request to server as object.
 * { 
 * 	name: string,
 * 	sureface: string,
 * 	email:　string,
 * 	active_until,
 * 	status: date or string,
 * 	balance: number,
 * 	avatar: url  
 * }
 */
const logIn = (
	data,
	userData,
	isLogged,
	message,
	registerMessage
) => ({
	type: LOGIN,
	isLogged,
	registered: isLogged,
	username: data.username,
	password: data.password,
	userData: {
		...userData
	},
	message
});


const loggining = () => ({
	type: REQUEST_LOGIN_IN
});

// Аргумент data - это логин и пароль 
// входящего в свой аккаунт пользователя,
// используещего форму logInForm.
const setUserToCookies = (
	data
) => ({
	type: SET_USER_TO_COOKIES,
	username: data.username,
	password: data.password
});

// Делает запрос на сервер, после изменяет состояние приложения
// в зависимости от ответа сервера.
export const tryLogin = data => dispatch => {
	const empty_data = {
		username: '',
		password: ''
	};	

	dispatch(loggining());

	customAjaxRequest({
		url: '/log_in/',
		data: data,
		type: 'GET',
        processData: true,
        cache: true
	});
	return make_request(userData => {
			if (userData) {
				// Меняет состояние на удачный заход пользователя в аккаунт
				dispatch(logIn(data, userData, true, '', 'Да прибудет с вами сила!'));
				dispatch(setUserToCookies(data))
			} else {
				// Меняется только сообщение в состояние аккаунта,
				// не устанавливая неправильно введённый или 
				// не подходящий логин с паролем.
				dispatch(logIn(empty_data, {}, false, 'Неправильный логин или пароль', ''));	
			}

		},
		(xhr, errmsg, err) => {
			dispatch(logIn(
				empty_data, 
				{},
				false, 
				'Внутренняя ошибка сервера',
				''
			));	
		});
};

export const logOut = () => ({
	type: LOGOUT
});

const changing = () => ({
	type: REQUEST_IN_PERSONAL_ROOM
});


const changePassword = (
	changePasswordMessage,
	password
) => ({
	type: CHANGE_PASSWORD,
	changePasswordMessage,
	password
});

export const tryChangeAccountPassword = data => dispatch => {
	// Показывает обработку изменения пароля
	dispatch(changing());
	// Не делает запрос на сервер, если текущий пароль введён не правильно.
	const oldPassword = data.oldPassword;
	const newPassword = data.newPassword;

	if (data.currentPassword !== oldPassword) {
		dispatch(changePassword(
			'Неправильный текущий пароль', 
			oldPassword
		));
		return false;
	} else if (newPassword !== data.newPasswordRepeated) {
		// Проверяется совпадение паролей.
		dispatch(changePassword(
			'Пароли не совпадают', 
			oldPassword
		));
		return false;
	} else

	customAjaxRequest({
		url: '/change_password/',
		data: data,
		type: 'POST',
		cache: true
	});
	
    return make_request(
    	changePasswordMessage => {
			dispatch(changePassword(
				changePasswordMessage, 
				newPassword
			));
			dispatch(setUserToCookies(
				{
					username: data.username,
					password: newPassword
				}
			));
		},
		(xhr, errmsg, err) => {
			dispatch(changePassword(
			 	'Внутрянняя ошибка сервера',
			 	oldPassword
			 ));
		}
	);
};

const changeEmail = (
	changeEmailMessage,
	email
) => ({
	type: CHANGE_EMAIL,
	changeEmailMessage,
	email
});

export const tryChangeAccountEmail = data => dispatch => {
	dispatch(changing());

	const oldEmail = data.oldEmail;

	if (data.currentPassword !== data.password) {
		dispatch(changeEmail('Неправильный пароль', oldEmail));
		return false;
	}

	customAjaxRequest({
		url: '/change_email/',
		data: data,
		type: 'POST',
		cache: true
	});

	return make_request(
		changeEmailMessage => {
			dispatch(changeEmail(
				changeEmailMessage, 
				data.newEmail
			));
		}, 
		(xhr, errmsg, err) => {
			dispatch(changeEmail(
				'Внутрянняя ошибка сервера', 
				oldEmail
			));
		}
	);
};

const subscribe = (
	subscribeMessage,
	userData
) => ({
	type: SUBSCRIBE,
	subscribeMessage,
	userData: {
		...userData
	}
});


export const trySubscribeAccount = data => dispatch => {
	dispatch(changing());


	customAjaxRequest({
		url: '/subscribe/',
		data: data,
		type: 'POST',
		processData: true,
		cache: true
	});
	return make_request(
		data => {
			// Копируется сообщение.
			const subscribeMessage = data.message;
			// Удаляется сообщение из возвращенных данных, которые будут распляться
			// в объект userData  - данные об аккаунте пользователя.
			delete data.message;
			// Преобразование даты в более читаем формат.
			data.activeUntil = convertDate(data.activeUntil);
			dispatch(subscribe(subscribeMessage, data));
		},
		(xhr, errmsg, err) => {
			dispatch(subscribe('Внутрянняя ошибка сервера'));
		}
	);
    
};

export const tryReplanishAccountBalance = data => dispatch => {

};

const changeUserAvatar = (
	avatar
) => ({
	type: CHANGE_USER_AVATAR,
	userData: {
		avatar: avatar
	}
});

export const tryChangeUserAvatar =  data => dispatch => {
	let validData = new FormData();

	validData.append('username', data.username);
	validData.append('newAvatar', data.newAvatar);

	customAjaxRequest({
		url: '/change_user_avatar/',
		data: validData, 
		type: 'POST',
		dataType: 'json',
        processData: false, 
       	contentType: false
    });

	return make_request(
		response => {
			dispatch(changeUserAvatar(response.avatar))
		},
		(xhr, errmsg, err) => {
			console.log('err ====>', err);
			dispatch(changeUserAvatar(data.oldAvatar))
		}
	);
};

const recoverPassword = (
	recoverPasswordMessage
) => ({
	type: RECOVER_PASSWORD,
	recoverPasswordMessage
});

export const tryRecoverPassword = data => dispatch => {
	dispatch(changing());

	customAjaxRequest({
		url: '/recover_password/',
		data: data,
		type: 'POST',
		processData: true
	});

	return make_request(
		responseMessage => {
			dispatch(recoverPassword(responseMessage));
		},
		(xhr, errmsg, err) => {
			dispatch(recoverPassword('Внутренняя ошибка сервера'));
			console.log('failure ======>\n', err);
		}
	);
};