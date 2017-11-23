

(function(factory) {
	if ( typeof define === 'function' && define.amd ) {
       // AMD. Регистрирует как анонимный модуль.
        define( ['jquery'], factory );
	} else if ( typeof exports === 'object' ) {
	    module.exports = factory( require('jquery') );
	} else {
  		window.DocumentFilter = factory( require('jquery') );
  	}
})(function($) {
	const _regexp = new RegExp('<img', 'ig');
	const _filteredWords = 'filteredWords';
	

	const _getEl = selector => document.querySelector(selector);
	const _assert = (condition, message, error=Error) => {
		if (condition) {
			throw error(message);
		}
	};
	const _insistenceOf = (obj, type) => typeof obj === type;
	const _createMessage = word => `About ${ word }. Go next!`;
	const _getWords = () => chrome.words; //JSON.parse( localStorage.getItem( _filteredWords ) );
	/*
	 * @param {Array} words - The array words are filtering the page
	 */
	const _setWords = words => {
		chrome.words = words;
		console.log(_getWords());
		// localStorage.setItem( _filteredWords,  JSON.stringify( words ));
	};
	const _low = word => word.toLowerCase();  
	/*
	 *
	 */
	const _showBlock = function(node, message='', i) {
		// if (!node.tagName)
		// 	node.textContent = message;
		// else
		// 	node.innerHTML = message;
		node.remove()
	};


	const _pushWordToList = ($list, word) => {
		console.log('Will push:', `<li class='word'>${word}<span class='removeWord glyphicon glyphicon-remove'></span></li>`);
		$list
			.append(`<li class='word'>${word}<span class='removeWord glyphicon glyphicon-remove'></span></li>`);
	};
	const _showWords = function($wordsList) {
		_getWords().forEach(word => {
			_pushWordToList($wordsList, word);
		});
	};

	const _screwed = (selector, callback, event='click') =>  {
		$(document).on(event, selector, callback);
	};

	const _findAndRemoveImage = node => {
		if ( !node || node.tagName === 'BODY' ) return false
		// Блокирует поиск изображений, если узел с элемтом изображением предком 
		// был найден внутри него.
		const parent = node.parentNode;
		
		if (!parent) return false;

		const text = parent.innerHTML;

		if (text && text.length > 5000) 
			return false;
		else if (_regexp.test(text)) {
			parent.remove();
			_findAndRemoveImage(parent.parentNode);
		}

		return false;
	};

	/*
	 * 
	 * 
	 */
	const DocumentFilter = function(props) {
		// Create array of words in localStorage.
		if (!_getWords()) _setWords([]);
		this.root = props.root;
		// The base value of blocking content by matched words in a node.
		this.baseLength = props.baseLength ? 
			props.baseLength : 0;
		this.wordsListId = props.listWords ? 
			props.listWords : '#wordsList';
		this.addWordFieldId = props.addWordField ? 
			props.addWordField : '#addWordField';
		this.foundWords = 0;
		this.domain = window.origin;
	};



	
	DocumentFilter.prototype.pushWord = function(word) {
		_assert(
			!_insistenceOf(word, 'string'),
			'First argument must be a string.',
			TypeError
		);

		const oldWords = _getWords();
		const lowerWord = _low(word);
		console.log('Word in push:', word);
		_assert(
			oldWords.some(arrWord => _low(arrWord) === lowerWord),
			'Threre is the same word word in array'
		);

		_setWords( [...oldWords, word] );
	};

	DocumentFilter.prototype.removeWord = function(word) {
		_assert(
			!_insistenceOf(word, 'string'),
			'First argument must be a string.',
			TypeError
		);

		const words = _getWords();
		const index = words.indexOf(word);
		
		_setWords( [
			...words.slice(0, index),
			...words.slice(index + 1)
		] );
	};

	

	
	DocumentFilter.prototype.filterTextInNode = function(node, baseLength=0) {
		const text = node.textContent;
		
		// Count words.
		
		
		if (text)
			_getWords().forEach( word => {
				const regexp = new RegExp( word, 'gi' );

				const matchedWords = text.match( regexp );
				const amountWords = matchedWords ? matchedWords.length : false;
				
				if ( amountWords && (amountWords >= baseLength)) {
					// _showBlock( node, '_createMessage(word)' );
					_showBlock( node, '' );
					_findAndRemoveImage( node );
					

					// Exit
					return false;
				}
			}); // end this.words.forEach
		// Exit
		return false;
	};	
	/*
	 * The function filter DOM taking unwhised words.
	 * 
	 */
	DocumentFilter.prototype.filterDOM = function(root) {
		const children = !root ? 
			this.root.childNodes : 
			root.childNodes;

		const length = children.length;
		
		
		if (length > 1) {
			// Go throught children nodes, but it isn't a place for searching bad content.
			for (let i = children.length - 1; i >= 0; i--) {
				if (children[i].childNodes.length > 1) {
					this.filterDOM(children[i]);
				} else {
					this.filterTextInNode(children[i], 0, 'Iteration');
				}
			}

		} else if ( length === 0 ) {
			// Nothing to filter.
			return false;
		} else {
			// If found one node in node, then a text will be
			this.filterTextInNode(children[0], 0, 'Single');
			
			return false;
		}
	};
	

	DocumentFilter.prototype.addWordEvent = function(context, $wordsList, $addWordField) {
		return function(e) {
			e.preventDefault();
			const word = $addWordField.val();
			console.log(word);
			$addWordField.val('');
			context.pushWord(word);

			// Debug
			_pushWordToList($wordsList, word);
			context.filterDOM();
		};
	};

	
	DocumentFilter.prototype.removeWordEvent = function(context) {
		return function(e) {
			let $word = $(this).parent();
			
			context.removeWord($word.text());
			$word.remove();
		};
	};

	DocumentFilter.prototype.init = function(domainName) {
		
		const that = this;
		$(function () {
			let $wordsList = $(that.wordsListId);
			_showWords($wordsList);
			console.log('Set', domainName);
			$('#domainName').html(domainName);
			let $addWordField = $(that.addWordFieldId);

			const _addWord = that.addWordEvent(that, $wordsList, $addWordField);
			const _removeWord = that.removeWordEvent(that);
			
			that.filterDOM();
			// Add a word to the words' array.
			_screwed('#addWordForm', _addWord, 'submit')
			// Remove a word from the words' array.
			_screwed('.removeWord', _removeWord);
			
		});
	};

	return DocumentFilter;
	
});