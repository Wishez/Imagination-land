import {
	REQUEST_USER_DATA,
	REACHING_USER_DATA,
	ADD_WORD,
	REMOVE_WORD,
	THANK_YOU_SERVER
} from './../constants/actionTypes.js';

const initialWordsState = {
	userId: 1,
	username: '',
	current_site: '',
	quantity_words: 0,
	is_parsed_data: false,
	uuid: '',
	is_requesting: false,
	words: [],
	was_got_new_domain: false
};

/* 
 * 1. Requst data for user state.
 * 2. Show loading about.
 * 3. User can remove word.
 * 4. User can add word.
 * 5. is_parsed_data will prevent from 
 * 	  showoing quantity words.
 * 6. Thank server for has gotten last user data 
 * 	  and switch his boolean fields by default
 */
const user = (
	state=initialWordsState,
	action
)  => {
	switch (action.type) {
		case REQUEST_USER_DATA:
			window.uuid = action.user_data.uuid;
			
			return {
				...state,
				...action.user_data,
				is_requesting: false
			};
		case REACHING_USER_DATA:
			return {
				...state,
				is_requesting: true	
			};
		case ADD_WORD:
			return {
				...state,
				words: action.words
			};
		case REMOVE_WORD:
			return {
				...state,
				words: action.words
			};
		case THANK_YOU_SERVER:
			return {
				...state,
				is_parsed_data: false,
				was_got_new_domain: false
			};
		default:
			return state;
	}
};

export default user;

