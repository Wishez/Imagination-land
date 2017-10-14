(function(factory) {
	if ( typeof define === 'function' && define.amd ) {
       // AMD. Регистрирует как анонимный модуль.
        define(factory);
	} else if ( typeof exports === 'object' ) {
	    module.exports = factory();
	} else {
  		window.ScrewDriver = factory();
	}
})(function() {
	let that = {};

	const subscribe = function(name, fn) {
		if (!that.channels[name]) {
			that.channels[name] = {};
		} else {
			// Во избежание конфликта пространства имён.
			return false;
		}
		
		that.channels[name] = { 
			context: this,
			callback: fn
		};
		
		return this;
	};
	const unsubscribe = function(name) {
		if (!that.channels[name]) return false;

		delete that.channels[name];



		return this;
	};

	const publish = function(name) {
		if (!that.channels[name]) return false;

		let subscribtion = that.channels[name];
		const args = [...arguments].slice(1);


		subscribtion.callback.apply(subscribtion.context, ...args);
		
		return this;
	};

	const remove = function(name) {
		if (!that.channels[name]) return false;

		for (const key in that.channels[name]) {
			if (that.hasOwnProperty(key))
				delete that[key]
		}

		return this;

	}

	const installTo = obj => {
		obj.cannels = {};
		obj.mount = subscribe;
		obj.unmount = unsubscribe;
		obj.init = publish;
	};

	// Фасад, принадлежащий медиатору.
	return that = {
		...that,
		channels: {},
		mount: subscribe,
		unmount: unsubscribe,
		init: publish,
		remove: remove,
		installTo: installTo
	};
});