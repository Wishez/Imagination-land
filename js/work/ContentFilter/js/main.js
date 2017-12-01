import 'jquery';
import DocumentFilter from './libs/DocumentFilter.js';

const filter = new DocumentFilter({
	root: document.body,
	backendServerUrl: 'https://filipp-zhuravlev.ru',
	userWordsUrl: '/words/api/document_data_user/'
});
