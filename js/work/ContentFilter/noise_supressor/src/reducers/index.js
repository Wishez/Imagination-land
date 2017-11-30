import { combineReducers } from 'redux';
import user from './user.js';
import registration from './registration.js';
import account from './account.js';
import view from './view.js';
import { reducer as formReducer } from 'redux-form';

const rootReducer = combineReducers({
	user,
	form: formReducer,
	registration,
	account,
	view
});

export default rootReducer;