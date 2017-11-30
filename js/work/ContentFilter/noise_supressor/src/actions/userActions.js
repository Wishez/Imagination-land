import { change } from 'redux-form';

import {
	REQUEST_USER_DATA,
	REACHING_USER_DATA,
	ADD_WORD,
	REMOVE_WORD,
	THANK_YOU_SERVER
} from './../constants/actionTypes.js';

import customAjaxRequest, { make_request } from './../constants/ajax.js';
import { 
	setUserStateUrl,
	removeWordUrl,
	addWordUrl,
	thankYouServerUrl,
	userDataForPluginUrl
} from './../constants/conf.js';

const thankYouServer = () => ({
	type: THANK_YOU_SERVER
});

const addWord = words => ({
	type: ADD_WORD,
	words
});

const removeWord = words => ({
	type: REMOVE_WORD,
	words
});

const showDataRequesting = () => ({
	type: REACHING_USER_DATA
});

const requestUserData = user_data => ({
	type: REQUEST_USER_DATA,
	user_data
});


const make_action = ({
	createdAction, 
	success,
	failure,
	url,
	data
}) => dispatch => {
	dispatch(createdAction);
	
	customAjaxRequest({
		type: 'POST',
		url,
		data: data,
		processData: true,
		cache: true
	});

	return make_request(success, 
	failure);

};

export const tryRemoveWord = (words, word, uuid) => dispatch => {
	dispatch( 
		make_action({
			createdAction: (function() {
				// Cache index.
				const index = words.indexOf(word);
				// Create the action.
				return removeWord(
					[...words.slice(0, index), ...words.slice(index + 1)]
				);
			}()),
			url: removeWordUrl,
			data: {
				word,
				uuid
			},
			success: response =>  {
				console.log(response);
			},
			failure: (xhr, errmsg, err) => {
				console.log(err);
			}
		}) 
	);
};

export const tryAddWord = (words, word, uuid) => dispatch => {
	if ( words.indexOf(word) !== -1 ) {
		dispatch(change('addWordForm', 'word', ''));
		return false;
	} 
	dispatch(
			make_action({
			createdAction: addWord( [...words.slice(0), word] ),
			url: addWordUrl,
			data: {
				word,
				uuid
			},
			success: response =>  {
				dispatch(change('addWordForm', 'word', ''));
			},
			failure: (xhr, errmsg, err) => {
				console.log(err);
			}
		})
	);
};
// Test action. In futer, i will get data with logining.
export const getUserData = uuid => dispatch => {
	dispatch(showDataRequesting());
	return fetch(`${userDataForPluginUrl}${uuid}/`)
		.then(resp => resp.json())
		.then(data => { 
			dispatch(requestUserData(data))
		})
		.catch(err => {
			console.log(err);
		});
};



export const setUserCurrentSite_test = () => {
	customAjaxRequest({
		type: 'POST',
		url: setUserStateUrl,
		data: {
			"current_site": "localhost:8080"
		},
		processData: true,
		cache: true
	});

	return make_request(resp => {
		console.log(resp)
	}, 
	(xhr, errmsg, err) => {
		console.log(err);
	})

};

export const setUserQuantity_test = () => {
	customAjaxRequest({
		type: 'POST',
		url: setUserStateUrl,
		data: {
			"quantity_words": Math.round((Math.random() + 1) * 100)
		},
		processData: true,
		cache: true
	});

	return make_request(resp => {
		console.log(resp);
	}, 
	(xhr, errmsg, err) => {
		console.log(err);
	})
};

export const tryThankYouServer = uuid => {
	make_action({
		createdAction: thankYouServer(),
		url: thankYouServerUrl,
		data: {
			uuid: uuid
		},
		success: response =>  {
			console.log(response);
		},
		failure: (xhr, errmsg, err) => {
			console.log(err);
		}
	});
};