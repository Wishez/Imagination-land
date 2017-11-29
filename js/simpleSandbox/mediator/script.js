// browser-sync start --server --directory --files "**/*"

let mediator = ( function () {
	
	const subscribe = function( channel, fn ) {
		if ( typeof mediator.channels[ channel ] === 'undefined' ){
			mediator.channels[ channel ] = [];
		}
		mediator.channels[ channel ].push({ 
			context: this, 
			callback: fn
		});
		console.log( fn, 'fn this' );
		return this;
	},

	publish = function( channel ) {
		if ( !mediator.channels[channel] ) return false;

		let args = [ ...arguments ].slice( 1 );
		// Sandbox - это фасад со своим собственным имененем, обратным выховом и контекстом.
		// Контекстом явлюяется объект, подписанный на изменение 
		let sandbox = mediator.channels[ channel ];
		for ( let i = 0, l = sandbox.length; i < l; i++ ) {
			
			console.log('sandbox', sandbox);
			let subscription = sandbox[ i ];
			console.log('subscription', subscription);
			// Метод текущего модуля, применяется к контексту медиатора.
			subscription.callback.apply( subscription.context, args );
		}

		return this;
	};
	
	return {
		channels: {},
		publish: publish,
		subscribe: subscribe,
		installTo:  obj => {
			obj.subscribe = subscribe;
			obj.publish = publish;
		}
	};
})();


const test = function( arg ) {
	console.log( `First arg: ${arg}` );
	console.log( arguments );
	console.log( [ ...arguments ] );
	console.log( Object.keys( arguments ) );
}

mediator.name = 'tim';

mediator.subscribe('nameChange', function(arg) {
	console.log('Name before:', this.name);
	this.name = arg;
	console.log('Name after:', this.name);
});

mediator.publish('nameChange', 'default');

let obj = {
	name: 'sam'
};

mediator.installTo( obj );
obj.subscribe('nameChange', function(arg) {
    console.log('Name before:', this.name);
    this.name = arg;
   	console.log('Name after:', this.name);
});

obj.publish('nameChange', 'john'); //sam, john

