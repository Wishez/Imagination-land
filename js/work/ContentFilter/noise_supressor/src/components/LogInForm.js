import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Button } from 'semantic-ui-react';
import RenderController from './RenderController';
import { required } from './../constants/validation.js';


const LogInForm = ({
	submitLogInForm,
	handleSubmit,
	message,
	isLogining
}) => (
	<form id='logInForm'
		onSubmit={handleSubmit(submitLogInForm.bind(this))}
		className='logInForm'>
			<Field component={RenderController}
				name='username'
				type='text'
				block='logInFormController'
				validate={[required]}
				placeholder='Login'
				maxLength='75'
			 />
			 <Field component={RenderController}
			 	name='password'
			 	type='password'
			 	block='logInFormController'
				validate={[required]}
				placeholder='Password'
				maxLength='75'
			 />
		 	{message ? <span className='logInFormController__error formErorr'>{message}</span> : ''}
			 <div className='logInFormButtons'>
			 	<Button className='logInFormButtons__submitButton submit' 
			 	   	content='Sign in'
			 	   	loading={isLogining}
			 	   	size='medium'
			 	/>
			 	<span className='logInFormButtons__button logInFormButtons__button_name-forgotPassword'>
			 		Forgot password?
			 	</span>
			 </div>
		</form>
);


export default reduxForm({
	form: 'logInForm'
})(LogInForm);
 
