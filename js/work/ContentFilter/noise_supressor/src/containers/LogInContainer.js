import React, {Component} from 'react';
import { connect } from 'react-redux';

import Title from './../components/Title';
import LogInForm from './../components/LogInForm';
import { 
  tryLogin
} from './../actions/accountActions.js';
import { cookiesHandler } from './../constants/pureFunctions.js';

class LogInContainer extends Component {

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
			<div className='main main_signIn'>
				<Title block='main' text='Sign in to Noise Supressor' />
				<LogInForm 
                  submitLogInForm={this.submitLogInForm}                  
                  {...this.props} />
			</div>
		);
	}
}

const mapStateToProps = state => {
	const {
      account
    } = state;

	const {
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