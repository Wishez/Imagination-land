import React from 'react';

const WordsList = ({
	words,
	removeWord
}) => (
    <ul className="wordsList" id='wordsList'>
        {
        	words.map((word, index) => (
	        	<li key={index} 
	        		className='word'>
	        		{word}
	        		{/*<span className='allowOnThisSiteButton'>Allow on this site</span>*/}
	        		<span className='removeWord' 
	        			onClick={removeWord(word)}>Delete</span>
	        	</li>
        	))
    	}
    </ul>
);

export default WordsList;