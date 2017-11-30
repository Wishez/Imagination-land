

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import LogInForm from './../components/LogInForm';
import { 
  tryLogin
} from './../actions/accountActions.js';
import { cookiesHandler } from './../constants/pureFunctions.js';

class LogInContainer extends Component {
	// static PropTypes = {
	// 	registered: PropTypes.bool.isRequired,
	// 	isRegistering: PropTypes.bool.isRequired,
	// 	dispatch: PropTypes.func.isRequired
	// }
	componentDidMount() { 
		this.loginInIfMay();
  	}
	loginInIfMay = () => {
      const { dispatch, isLogged } = this.props;
      // Функция, возвращающая кэшированные данные пользователя.
      const data = cookiesHandler.getUsernameAndPasswordFromCookies();
      // Проверка на уже залогинивщегося в свой аккаунт пользователя
      // и логинился ли он хоть раз на сайте.
      if (!isLogged && 
        (data.username && data.password)) {
        dispatch(tryLogin(data)); 
      }
  }
  submitLogInForm = (values, dispatch) => {  
    dispatch(tryLogin(values));
  }

  render() {
		return (
			<div className='main'>
				<LogInForm 
                  submitLogInForm={this.submitLogInForm}                  
                  {...this.props} />
			</div>
		);
	}
}

const mapStateToProps = state => {
	const {
      user,
      account
    } = state;

	const {
      userData,
      username,
      password,
      isLogged,
      isLogining,
      message
    } = account;

    
    return {
      isLogining,
      username,
      password,
      message,
      isLogged
    };
}

export default connect(mapStateToProps)(LogInContainer);