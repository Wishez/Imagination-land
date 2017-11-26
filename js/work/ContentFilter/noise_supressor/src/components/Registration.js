import React from 'react';
import RegistrationForm from './RegistrationForm';

const Registration = ({
	registered,
	...rest
}) => (
	<section className='registration'>
		{registered ?
			<p className='registration__message registration__message--succes'>
				{rest.registerMessage}
			</p> :
 			<RegistrationForm
 				{...rest} />
		}
	</section>
);

export default Registration;