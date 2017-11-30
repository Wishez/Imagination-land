import {
	SHOW_WORDS_LIST,
 	SHOW_REGISTRATION_FORM,
 	SHOW_LOGIN_FORM,
 	SET_SOMETHING_SHOWN
} from './../constants/viewTypes.js';

/* Blocks are that is showing:
 * #logInForm
 * #registrationForm
 * #wordsList
 */   
const initViewState = {
	isShownRegistrationForm: false,
	isShownLogInForm: false,
	isShownWordsList: false,
	didFadeIn: false,
	currentIsShownBlockID: '#logInForm'	
};

const view = (
	state=initViewState,
	action
) => {
	switch (action.type) {
		case SHOW_REGISTRATION_FORM:
			return {
				...state,
				...initViewState,
				isShownRegistrationForm: true,
				currentIsShownBlockID: 'registrationForm'
			};
		case SHOW_WORDS_LIST:
			return {
				...state,
				...initViewState,
				isShownWordsList: true,
				currentIsShownBlockID: 'wordsList'
			};
		case SHOW_LOGIN_FORM:
			return {
				...state,
				...initViewState,
				isShownLogInForm: true,
				currentIsShownBlockID: 'logInForm'
			};
		case SET_SOMETHING_SHOWN:
			return {
				...state,
				didFadeIn: true
			}
		default:
			return state
	}
}

export default view;