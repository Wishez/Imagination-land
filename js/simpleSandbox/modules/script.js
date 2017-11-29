// const MODULE = (function() {
	
// }(MODULE || {}));


// (function(define) {
// 	define(["dep1", "dep2"], 
// 	function(dep1, dep2) {

// 		return {
// 			someExportedFunction: () => {}
// 		}

// 	});
// })(typeof define == 'function' ? define:function(factory){module.exports=factory.apply(this, deps.map(require));});
// 

// (function(define) {
// 	define(function(require, exports) {

// 			const dep1 = require("dep1");
// 			exports.someExportedFunction = () => {};

// 	});
// })(typeof define == 'function' ? define:function(factory){factory(require, exports);});
 
(function(name, factory) {
	typeof require == "undefined" ?
		(typeof dojo != "undefined" && dojo.provide(name)) & // in original was "&"
			// direct script
			factory(this[name]) :
		typeof exports == "undefined" ?
			// browser transport/C loader or RequireJS
			define(name, ["exports"], factory) :
			// CommonJS environment
			factory(exports)
})("style", function(exports) {
	let that = {};
	const _setStyles = (element, styles) => {
		let elementStyles = element.style;
		for (const style in styles) {
			if (elementStyles.hasOwnProperty(style)) {
				elementStyles[style] = styles[style];
			} else {
				throw Error(`There is no such a prop ${style} in a element.`);
			}
		}
	};
	// Facade pattern
	that.dom = {
		sel: (selector) => document.querySelector(selector),
		setStyle: function(styles, selectors) {
			if (typeof selectors == 'string') {
				_setStyles(this.sel(selectors), styles);
			} else if (selectors instanceof Array) {
				selectors.forEach((selector) => {
					_setStyles(this.sel(selector), styles);
				});
			} else {
				throw Error('The second argument must be a string or an array.');
			}
		}
	}
	
	that.event = {
		getEvent: e => e || window.evenet,
		getTarget: e => e.target || e.srcElement,
		stopPropagation: e => {
			if (e.stopPropagation)
				e.stopPropagation()
			else
				e.cancelBubble = true;
		},
		preventDefault: e => {
			if (e.preventDefault)
				e.preventDefault
			else
				e.returnValue = false;
		},
		stopEvent: function(e) {
			this.stopPropagation(e);
			this.preventDefault(e);
		},
		addEvent: (el, type, fn) => {
			if (window.addEventListener)
				el.addEventListener(type, fn, false);
			else if (window.attachEvent)
				el.attachEvent(`on${type}`, fn);
			else
				el[`on${type}`] = fn;
		}
	};
	// Change Styles module
	window.CHASTY = that;
});

window.addEventListener('load', () => {
	CHASTY.dom.setStyle({
		width: '20%',
		margin: '0 auto',
		backgroundColor: '#7E2843',
		padding: '5px 0',
		textAlign: 'center',
		borderRadius: '5px',
		marginTop: '1em',
		cursor: 'pointer',
		transition: 'top 1s',
		position: 'relative'
	}, '#first');

	CHASTY.dom.setStyle({
		backgroundColor: '#212121',
		color: '#f2f2f2',
		padding: '0 15%'
	}, 'body');
	CHASTY.dom.setStyle({
		backgroundColor: '#F0C74D',
		color: '#212121',
		marginTop: '1em',
		padding: '1% 2%',
		borderRadius: '2px'
	}, ['#second', '#third']);
	let $first = CHASTY.dom.sel('#first');
	CHASTY.event.addEvent($first, 'mousedown', e => {
		CHASTY.dom.setStyle({
			top: "2px"
		}, '#first');
	});
	CHASTY.event.addEvent($first, 'mouseup', e => {
		CHASTY.dom.setStyle({
			top: "0"
		}, '#first');
	});
})

