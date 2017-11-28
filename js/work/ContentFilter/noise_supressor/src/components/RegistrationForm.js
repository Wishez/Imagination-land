import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Button, Checkbox } from 'semantic-ui-react';
import RenderController from './RenderController';

import { 
	required,
 	login,
 	loginLength,
 	passwordLength,
 	password,
 	email
} from './../constants/validation.js';


const RegistrationForm = ({
	submitRegistrationForm,
	handleSubmit,
	allowRegister,
	knowRules,
	isRegistering,
	registerMessage,
	showLogInForm
}) => (
	<form id='registrationForm'
		onSubmit={handleSubmit(submitRegistrationForm.bind(this))}
		className='registrationForm'>
		<Field component={RenderController}
			name='username'
			type='text'
			block='registrationFormController'
			validate={[required, login, loginLength]}
			placeholder='Логин/Login'
			maxLength='24'
		 />
		 <Field component={RenderController}
		 	name='password'
		 	type='password'
		 	block='registrationFormController'
			validate={[required, passwordLength, password]}
			placeholder='Пароль/Password'
			maxLength='30'
		 />
		 <Field component={RenderController}
		 	name='repeatedPassword'
		 	type='password'
		 	block='registrationFormController'
			validate={[required]}
			placeholder='Повторить пароль/Repeat password'
			maxLength='30'
		 />
		 <Field component={RenderController}
		 	name='email'
		 	type='email'
		 	block='registrationFormController'
			validate={[required, email]}
			placeholder='Email'
			maxLength='100'
		 />
		 
		 <div className='registrationFormController'>
			 <Checkbox onClick={allowRegister}
			 	className='registrationFormController__check'
			    label='You are agree for using your data?'
			    default={true} />
		 </div>
		 <div className='registrationFormButtons'>
			{registerMessage ? <strong className='formError'>{registerMessage}</strong> : ''}
			<br />
		 	<Button disabled={!knowRules}
		 		loading={isRegistering}
		 		className='registrationFormButtons__submitButton  submit' 
		 	   	content='Sign up'
		 	   	size='medium'
		 	/>
		 	<Button className='registrationFormButtons__button'
		 		size='medium'
		 		onClick={showLogInForm}
		 		content='Sign in' />
		 </div>
	</form>
);


export default reduxForm({
	form: 'registrationForm'
})(RegistrationForm);
 
