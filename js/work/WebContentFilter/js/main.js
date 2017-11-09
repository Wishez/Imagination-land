import 'jquery';
import DocumentFilter from './DocumentFilter.js';

// ScrewDriver.mount('fashionableCards', fashionableCards);
// ScrewDriver.init('orderForm');

$(function () {
	const _screwed = (selector, callback, event='click') =>  {
		$(document).on(event, selector, callback);
	};

	const filter = new DocumentFilter;
	let $wordsList = $('#wordsList');

	const addWord = function(e) {
		e.preventDefault();
		const word = $('#addWordField').val();
		filter.pushWord(word);
		// Debug
		$wordsList.append(`<li class='word'>${word}<span class='removeWord glyphicon glyphicon-remove'></span></li>`);

		filter.filterDOM();
	};
	const removeWord = function(e) {
		let $word = $(this).parent();
	
		filter.removeWord($word.text());
		$word.remove();
	};

	// Add a word to the words' array.
	_screwed('#addWordForm', addWord, 'submit')

	// Remove a word from the words' array.
	_screwed('.removeWord', removeWord);

	// filter.filterDOM();
});