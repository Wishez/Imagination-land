import 'jquery';
import DocumentFilter from './libs/DocumentFilter.js';

const filter = new DocumentFilter({
	root: 'body'
});

console.log(document.domain);
filter.init();