// browser-sync start --server  --directory --files "**/*"
let MetaClassToggleButton = Object.create( HTMLElement.prototype );

MetaClassToggleButton.sayHello = () => {
	console.log('Hello');
}

document.registerElement("toggle-button", {
	prototype: MetaClassToggleButton,
	extends: 'button'
});

document.querySelector('.tb').sayHello();