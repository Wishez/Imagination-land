import { 
	LOGIN,
 	LOGOUT,
 	RECOVER_PASSWORD, 
 	CHANGE_EMAIL,
 	CHANGE_PASSWORD,
 	REQUEST_LOGIN_IN,
 	SET_USER_TO_COOKIES,
 	REQUEST_IN_PERSONAL_ROOM,
 	SUBSCRIBE,
 	CHANGE_USER_AVATAR
} from './../constants/accountTypes.js';
import {
	loginUrl,
	changePasswordUrl,
	changeEmailUrl,
	recoverPasswordUrl,
	changeUserAvatarUrl,
	subscribeUrl,
	logOutUrl
} from './../constants/conf.js';
import customAjaxRequest, { make_request } from './../constants/ajax.js';
import { convertDate } from './../constants/pureFunctions.js';
import { change } from 'redux-form';
import { getUserData } from './userActions.js';
import { 
	showWordsList,
	showLogInForm 
} from './viewActions.js';
/* User 
 * 
 * username
 * password
 * UserData will get to request to server as object.
 * { 
 *  username
 * 	email:　string,
 * 	status: date or string,
 * 	balance: number,
 * 	avatar: url  
 * }
 */
const logIn = (
	data,
	userData,
	isLogged,
	message
) => ({
	type: LOGIN,
	isLogged,
	...userData,
	registered: isLogged,
	username: data.username,
	password: data.password,
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
	dispatch(change('logInForm', 'username', data.username))
    dispatch(change('logInForm', 'password', data.password));

	const empty_data = {
		username: '',
		password: ''
	};	

	dispatch(loggining());

	customAjaxRequest({
		url: loginUrl,
		data: data,
		type: 'GET',
        processData: true,
        cache: true
	});
	return make_request(userData => {
			if (typeof userData === 'object') {
				// Меняет состояние на удачный заход пользователя в аккаунт
				dispatch(logIn(data, userData, true, ''));
				dispatch(setUserToCookies(data))
				dispatch(getUserData(userData.uuid));
				// Показывает список слов пользователя после того,
				// как пользователь успешно зашёл в свой аккаунт.
				dispatch(showWordsList());
			} else {
				// Меняется только сообщение в состояние аккаунта,
				// не устанавливая неправильно введённый или 
				// не подходящий логин с паролем.
				dispatch(logIn(empty_data, {}, false, userData));	
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

const logOut = () => ({
	type: LOGOUT
});

export const tryLogOut = () => dispatch => {
	customAjaxRequest({
		url: logOutUrl,
		type: 'GET',
    	processData: true,
    	cache: true
	});

	dispatch(logOut());
	dispatch(showLogInForm());

	return make_request(resp => {
		console.log(resp);
	},
	(xhr, errmsg, err) => {
		console.log(err);
	}
	);
};

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
		url: changePasswordUrl,
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
		url: changeEmailUrl,
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
		url: subscribeUrl,
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
		url: changeUserAvatarUrl,
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
		url: recoverPasswordUrl,
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