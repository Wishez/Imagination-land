 import {
	REQUEST_REGISTER,
 	REGISTER
 } from './../constants/registrationTypes.js';


export const initAccountState = {
	registerMessage: '',
	isRegistering: false,
	registered: false
};


const registration = (
	state = {},
	action
) => {
	switch (action.type) {
		case REQUEST_REGISTER: 
			return {
				...state,
				isRegistering: true
			};
		case REGISTER:
			return {
				...state,
				registered: action.registered,
				registerMessage: action.registerMessage,
				isRegistering: false
			};

		default:
			return state;
	}
};

export default registration;