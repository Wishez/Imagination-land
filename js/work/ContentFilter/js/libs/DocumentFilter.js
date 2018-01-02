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

		// if (!node.tagName)
		// 	node.textContent = message;
		// else
		// 	node.innerHTML = message;

		// if (node.style)
		// 	node.style.border = '3px solid #471B13';
		node.remove()
	};

	const _screwed = (selector, callback, event='click') =>  {
		$(document).on(event, selector, callback);
	};

	const _findAndRemoveImage = (node, reqursion=1) => {
		// if ( !node || /body|script/ig.test(node.tagName)) return false;
		if ( !node || /body/ig.test(node.tagName)) return false;
		// Блокирует поиск изображений, если узел с элемтом изображением предком 
		// был найден внутри него.
		const parent = node.parentNode;
		
		if (!parent) return false;

		const text = parent.innerHTML;
		const textLength = text.length;
		const max = 14000;
		const maxReqursion = 2;
			
		if (text && textLength > max) {
			return false;
		} else if ( _regexp.test(text) ) {
			console.log('Will remove:', parent);
			// parent.remove();
		
			_showBlock( node, '<img src="http://i2.kym-cdn.com/photos/images/newsfeed/000/406/325/b31.jpg" style="width:100%;max-width:190px;margin: 0 auto;" />' );
			if (reqursion < maxReqursion) {
				_findAndRemoveImage(parent.parentNode, reqursion + 1);
			}
		} else {

			_findAndRemoveImage(parent.parentNode);
		}

		return false;
	};

	/*
	 * 
	 * 
	 */
	const DocumentFilter = function(props) {	

		this.uuid = localStorage.getItem('user_uuid');
		if (!this.uuid)
			return false;
		this.root = props.root;
		console.log(props.root, this.root, 'inited root');
		// The base value of blocking content by matched words in a node.
		this.baseLength = props.baseLength ? 
			props.baseLength : 0;
		this.foundWords = 0;
		this.domain = window.origin;
		this.words = [];
		this.userDataUrl = `${props.backendServerUrl}${props.userWordsUrl}${this.uuid}/`;
		this.isWorking = false;
		this.requestWords();	
	};

	DocumentFilter.prototype.requestWords = function() {
		return fetch(this.userDataUrl)
			.then(resp => resp.json())
			.then(data => {
				this.words = data.words;
				console.log('start parsing');
				this.init();
			})
			.catch(err => {
				console.log(err);
			});
	};

	DocumentFilter.prototype.filterTextInNode = function(node, baseLength=0) {
		// if (/script/ig.test(node.tagName)) return false;

		const text = node.textContent;
		// Count words.
		if (text)
			this.words.forEach( word => {
				const regexp = new RegExp( word, 'gi' );
				const matchedWords = text.match( regexp );
				const amountWords = matchedWords ? matchedWords.length : false;
				
				if ( amountWords && (amountWords >= baseLength)) {
					_findAndRemoveImage( node );

					// node.remove();
					_showBlock( node, '<img src="http://i2.kym-cdn.com/photos/images/newsfeed/000/406/325/b31.jpg" style="width:100%;max-width:190px;margin: 0 auto;" />' );
					// Exit
					return false;
				}
			}); // end this.words.forEach
		// Exit
		this.isWorking = false;
		return false;
	};	
	/*
	 * The function filter DOM taking unwhised words.
	 * 
	 */
	DocumentFilter.prototype.filterDOM = function(root, isChildrenInNode=false) {
		this.isWorking = true;

		const children = !root ? 
			this.root.childNodes : 
			root.childNodes;
		const length = children.length;
		
		if (isChildrenInNode || length > 1) {
			// Go throught children nodes, but it isn't a place for searching bad content.
			for (let i = children.length - 1; i >= 0; i--) {
				const nextNode = children[i];
				const nextNodeChildren = nextNode.childNodes;
				const nextNodeChildrenLength = nextNodeChildren.length;
				const isManyChildren = nextNodeChildrenLength > 1;

				setTimeout(() => {
					if (isManyChildren) {
						this.filterDOM(nextNode, isManyChildren);
					} else if (nextNodeChildrenLength === 1) {
						const nextNodeChild = nextNodeChildren[0];
						const nextNodeChildChildren = nextNodeChild.childNodes;
						const nextNodeChildChildrenLength = nextNodeChildChildren.length;
						const isNextNodeChildHasManyChildren = nextNodeChildChildrenLength > 1;

						if (isNextNodeChildHasManyChildren) {
							this.filterDOM(nextNodeChild, isNextNodeChildHasManyChildren);
						} else {
							this.filterTextInNode(nextNodeChild);
						}
					}
				 }, 50); // end setTimeout
			} // end for 
		} else if ( length === 1 ) {
			// If found one node in node, then a text will be
			setTimeout(() => {
				this.filterTextInNode(children[0], 0, 'Single');
			}, 50);
		} 
		this.isWorking = false;

		return false;

	};

	DocumentFilter.prototype.lazyFilter = function(time=2000) {
		const that = this;

		return new Promise(resolve => {
			setTimeout(() => {
				resolve(that);
			}, time);
		})
	};

	DocumentFilter.prototype.init = function() {
		const that = this;
		
		$(function () {
			that.filterDOM();

			_screwed('a, button', () => {
				if (!that.isWorking) {
					that.lazyFilter(6000)
						.then(gogo => {
							gogo.filterDOM();
						})
						.catch(err => {
							console.log('Not gogo.', err);
						});
				}
			});
			
			_screwed('body', (e) => {
				const key = e.key.toUpperCase();

				if (key === 'ENTER' || key === 'CONTROL') {
					if (!that.isWorking) {
						that.lazyFilter(4000)
							.then(gogo => {
								gogo.filterDOM();
							})
							.catch(err => {
								console.log('Not gogo.', err);
							});
					}
				}
			}, 'keydown');
		});
	};

	return DocumentFilter;
	
});
