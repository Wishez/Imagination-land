import { combineReducers } from 'redux';
import words from './words.js';
import registration from './registration.js';
import { reducer as formReducer } from 'redux-form';

const rootReducer = combineReducers({
	words,
	form: formReducer,
	registration
});

export default rootReducer;