import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Registration from './../components/Registration';
import { tryRegister } from './../actions/registrationActions.js';

class RegistrationContainer extends Component {
	static PropTypes = {
		registered: PropTypes.bool.isRequired,
		isRegistering: PropTypes.bool.isRequired,
		dispatch: PropTypes.func.isRequired
	}
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
			<main className='main'>
				<Registration {...this.props}
					{...this.state}
					submitRegistrationForm={this.submitRegistrationForm} 
					allowRegister={this.allowRegister}
				/>
			</main>
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
	console.log(state);

	return {
		isRegistering,
		registered,
		message: registerMessage
	};
}

export default connect(mapStateToProps)(RegistrationContainer);