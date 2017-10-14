import 'jquery';
import fashionableCards from './fashionableCards.js';
import ScrewDriver from './ScrewDriver.js';

ScrewDriver.mount('fashionableCards', fashionableCards);
ScrewDriver.init('fashionableCards');

$(document).ready(function() {
	ScrewDriver.FC.run();
});