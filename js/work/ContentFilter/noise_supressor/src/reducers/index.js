import { combineReducers } from 'redux';
import words from './words.js';
import { reducer as formReducer } from 'redux-form';

const rootReducer = combineReducers({
	words,
	form: formReducer
});

export default rootReducer;