

(function(factory) {
	if ( typeof define === 'function' && define.amd ) {
       // AMD. Регистрирует как анонимный модуль.
        define( factory );
	} else if ( typeof exports === 'object' ) {
	    module.exports = factory();
	} else {
  		window.DocumentFilter = factory();
  	}
})(function() {
	
	const _getEl = selector => document.querySelector(selector);
	const _assert = (condition, message, error=Error) => {
		if (condition) {
			throw error(message);
		}
	};
	const _insistenceOf = (obj, type) => typeof obj === type;
	const _filteredWords = 'filteredWords';
	const _createMessage = word => `About ${ word }. Go next!`;
	const _getWords = () => JSON.parse( localStorage.getItem( _filteredWords ) );

	/*
	 * @param {Array} words - The array words are filtering the page
	 */
	const _setWords = words => {
		localStorage.setItem( _filteredWords,  JSON.stringify( words ));
	};
	/*
	 * 
	 * 
	 */
	const DocumentFilter = function() {
		// Create array of words in localStorage.
		_setWords([]);
		this.root = _getEl('#testPlace');
		// The base value of blocking content by matched words in a node.
		this.baseLength = 0;
	};


	const _low = word => word.toLowerCase();  
	
	DocumentFilter.prototype.pushWord = function(word) {
		_assert(
			!_insistenceOf(word, 'string'),
			'First argument must be a string.',
			TypeError
		);

		const oldWords = _getWords();
		const lowerWord = _low(word);
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


	DocumentFilter.prototype.getWords = function() {

	};


	/*
	 *
	 */
	const _showBlock = function(node, message='', i) {
		if (!node.tagName)
			node.textContent = message;
		else
			node.innerHTML = message;
	};
	// Base regexp
	const _regexp = new RegExp('<img', 'ig');
	const _findAndRemoveImage = node => {
		if ( !node || node.tagName === 'BODY' ) return false
		// Блокирует поиск изображений, если узел с элемтом изображением предком 
		// был найден внутри него.
		const parent = node.parentNode;
		
		const text = parent.innerHTML;

		if (text.length > 5000) 
			return false;
		else if 
			(_regexp.test(text)) parent.remove();
		else 
			_findAndRemoveImage(parent.parentNode);

		return false;
	}
	DocumentFilter.prototype.filterTextInNode = function(node, baseLength=0) {
		const text = node.textContent;
		// Count words.
		let countedWords = 0;
		
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
		const children = !root ? this.root.childNodes : root.childNodes;
		const length = children.length;

		
		if (length > 1) {
			// Go throught children nodes, but it isn't a place for searching bad content.
			this.filterTextInNode(children, 0);
			for (let i = children.length - 1; i >= 0; i--) {
				this.filterDOM(children[i]);
			}

		} else if ( length === 0) {
			// Nothing to filter.
			return false;
		} else {
			// If found one node in node, then a text will be
			this.filterTextInNode(children[0]);
			let childrenLength = children[0].length;
			
			return false;
		}
	}




	return DocumentFilter;
	
});