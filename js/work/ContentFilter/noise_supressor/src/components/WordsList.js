import React from 'react';

const WordsList = ({
	words
}) => (
    <ul className="wordsList">
        {
        	words.map((word, index) => (
	        	<li key={index} 
	        		className='word'>
	        		{word}
	        		<span className='allowOnThisSiteButton'>Allow on this site</span>
	        		<span className='removeWord'>Delete</span>
	        	</li>
        	))
    	}
    </ul>
);

export default WordsList;