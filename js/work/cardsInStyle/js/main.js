import 'jquery';
import fashionableCards from './fashionableCards.js';
import orderForm from './orderForm.js';
import ScrewDriver from './ScrewDriver.js';

ScrewDriver.mount('fashionableCards', fashionableCards);
ScrewDriver.mount('orderForm', orderForm);

ScrewDriver.init('fashionableCards');
ScrewDriver.init('orderForm');

$(document).ready(function() {
	ScrewDriver.FC.run();
	ScrewDriver.orderForm.run();
});