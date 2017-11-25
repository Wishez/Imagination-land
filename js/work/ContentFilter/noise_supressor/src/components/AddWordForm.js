import React from 'react';
import { Field, reduxForm } from 'redux-form';
import RenderController from './RenderController';

let AddWordForm = ({
	onSubmit,
	handleSubmit
}) => (
    <form id="addWordForm"
        className='addWordForm'
        onSubmit={handleSubmit(onSubmit.bind(this))}
    >
      <Field component={RenderController}
      	block='controller'
      	type='text' 
      	name='word'
     	maxLength="100" 
        minLength="1" 
        placeholder="Type a word"
       />
	      
    </form>
);


export default reduxForm({
	form: 'addWordForm'
})(AddWordForm);
