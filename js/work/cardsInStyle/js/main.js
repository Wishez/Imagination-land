import 'jquery';
import cards from './cards.js';
import ScrewDriver from './ScrewDriver.js';

ScrewDriver.mount('cards', cards);
ScrewDriver.init('cards');

$(document).ready(function() {
	ScrewDriver.cards.run();
});