import {
	SHOW_WORDS_LIST,
 	SHOW_REGISTRATION_FORM,
 	SHOW_LOGIN_FORM,
 	SET_SOMETHING_SHOWN
} from './../constants/viewTypes.js';


export const showWordsList = () => ({
	type: SHOW_WORDS_LIST
});

export const showRegistrationForm = () => ({
	type: SHOW_REGISTRATION_FORM
});

export const showLogInForm = () => ({
	type: SHOW_LOGIN_FORM
});


export const setSomthingShown = () => ({
	type: SET_SOMETHING_SHOWN
});