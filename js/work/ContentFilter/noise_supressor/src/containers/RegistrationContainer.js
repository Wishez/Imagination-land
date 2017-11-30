import React, {Component} from 'react';

import { connect } from 'react-redux';

import Title from './../components/Title';
import Registration from './../components/Registration';
import { tryRegister } from './../actions/registrationActions.js';

class RegistrationContainer extends Component {
	// Переменная для чек-бокса.
	state = {
		knowRules: true
	}

	submitRegistrationForm = (values, dispatch) => {
		dispatch(tryRegister(values));
		
	}

	allowRegister = () => {
		this.setState({
			knowRules: !this.state.knowRules
		});
	}

	switchState = (key, callback) => e => {
		this.setState({
			[key]: !this.state[key]
		});

		if (callback) callback();
	}
	

	render() {
		return (
			<div className='main main_registration'>
				<Title block='main' text='Sign up to Noise Supressor' />
				<Registration {...this.props}
					{...this.state}
					submitRegistrationForm={this.submitRegistrationForm} 
					allowRegister={this.allowRegister}
				/>
			</div>
		);
	}
}

const mapStateToProps = state => {
	const { 
		registration
	} = state;

	const { 
		isRegistering,
		registered,
		registerMessage
	} = registration;
	console.log(registration);
	return {
		isRegistering,
		registered,
		registerMessage
	};
}

export default connect(mapStateToProps)(RegistrationContainer);