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
				placeholder='Логин/Login'
				maxLength='75'
			 />
			 <Field component={RenderController}
			 	name='password'
			 	type='password'
			 	block='logInFormController'
				validate={[required]}
				placeholder='Пароль/Password'
				maxLength='75'
			 />
		 	{message ? <strong className='logInFormController__error'>{message}</strong> : ''}
			 <div className='logInFormButtons'>
			 	<Button className='logInFormButtons__submitButton submit' 
			 	   	content='Войти'
			 	   	loading={isLogining}
			 	   	size='normal'
			 	/>
			 	<Button 
			 		className='logInFormButtons__button logInFormButtons__button_name-registration'
			 		content='Регистрация' 
			 		size='normal'
			 	/>
			 	<a href={`#`}
			 		className='logInFormButtons__button'>
			 		Забыли пароль?
			 	</a>
			 </div>
		</form>
);


export default reduxForm({
	form: 'logInForm'
})(LogInForm);
 
