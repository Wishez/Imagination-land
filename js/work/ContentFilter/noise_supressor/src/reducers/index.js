import { combineReducers } from 'redux';
import user from './user.js';
import registration from './registration.js';
import { reducer as formReducer } from 'redux-form';

const rootReducer = combineReducers({
	user,
	form: formReducer,
	registration
});

export default rootReducer;