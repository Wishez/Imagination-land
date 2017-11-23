import 'jquery';
import DocumentFilter from './libs/DocumentFilter.js';

const filter = new DocumentFilter({
	root: document.body
});


filter.init(document.domain);