// import 	customAjaxRequest,
// { 
// 	make_request, 
// 	getUsernameAndPasswordFromCookies 
// } from './ajax.js';

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
	
	 
	/*
	 *
	 */
	const _showBlock = function(node, message='', i) {
		if (!node.tagName)
			node.textContent = message;
		else
			node.innerHTML = message;
		// node.remove()
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

		this.root = props.root;
		// The base value of blocking content by matched words in a node.
		this.baseLength = props.baseLength ? 
			props.baseLength : 0;
		this.foundWords = 0;
		this.domain = window.origin;
		this.words = [];
		console.log('When init uuid is', localStorage.getItem('user_uuid'));
		this.uuid = localStorage.getItem('user_uuid');
		
		this.userDataUrl = `${props.backendServerUrl}${props.userWordsUrl}${this.uuid}/`;
		this.requestWords();
		
	};

	DocumentFilter.prototype.requestWords = function() {
		return fetch(this.userDataUrl)
			.then(resp => resp.json())
			.then(data => {
				this.words = data.words;
				this.init();
			})
			.catch(err => {
				console.log(err);
			});
	};

	DocumentFilter.prototype.filterTextInNode = function(node, baseLength=0) {
		const text = node.textContent;
		// Count words.
		if (text)
			this.words.forEach( word => {
				const regexp = new RegExp( word, 'gi' );

				const matchedWords = text.match( regexp );
				const amountWords = matchedWords ? matchedWords.length : false;
				
				if ( amountWords && (amountWords >= baseLength)) {
					_showBlock( node, '<img src="http://i2.kym-cdn.com/photos/images/newsfeed/000/406/325/b31.jpg" style="width: 100%;max-width: 680px;"/>' );
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
	

	// const _injectScript = function(context) {
	// 	const actualCode = '(' + functuion() {
	// 		context.filterDOM();
	// 		console.log(document);
	// 		console.log(window);
	// 		window.alert('Parsed it!');
	// 	} + ')()';

	// 	let script = document.createElement('script');
	// 	script.textContent = actualCode;
	// 	(document.head||document.documentElement).appendChild(script);
	// };

	DocumentFilter.prototype.init = function() {
		const that = this;
		$(function () {
			// _injectScript(that);
			that.filterDOM();
		});
	};

	return DocumentFilter;
	
});
