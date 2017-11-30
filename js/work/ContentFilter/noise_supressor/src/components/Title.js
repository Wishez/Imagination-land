import React from 'react';
// import ReactHtmlParser from 'react-html-parser';

const Title = ({
	text,
	block
}) => (	
	<h3 className={`${block}__title title`}>
		{text}
	</h3>
);

export default Title;