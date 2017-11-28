import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TweenLite } from 'gsap';
import { change } from 'redux-form';

import './App.css';
import Loader from './components/Loader';
import WordsList from './components/WordsList';
import AddWordForm  from './components/AddWordForm';
import LogInForm from './components/LogInForm';
import RegistrationContainer from './containers/RegistrationContainer.js';
import { 
  tryLogin, 
  logOut, 
  tryChangeUserAvatar
} from './actions/accountActions.js'
import { cookiesHandler } from './constants/pureFunctions.js';
import { 
  tryAddWord, 
  tryRemoveWord,
  getUserData
} from './actions/userActions.js';

class App extends Component {
  state = {
    isShownWordsList: false,
    isShownLogInForm: true,
    isShownRegistrationForm: false,
    didFadeIn: false
  }

  componentDidMount() { 
    const { userId, dispatch } = this.props;
    
    this.loginInIfMay();
    
    dispatch(getUserData(userId));
  }
  componentDidUpdate() {
    let node;
    const { 
      isShownRegistrationForm,
      isShownWordsList,
      isShownLogInForm
    } = this.state;
    
    if (isShownWordsList) 
      node = document.getElementById('wordsList');
    else if (isShownLogInForm) 
      node = document.getElementById('logInForm');
    else if (isShownRegistrationForm) 
      node = document.getElementById('registrationForm');

    // console.log(node);
    if (!this.state.didFadeIn && node) {
      TweenLite.to(
        node,
        1.2, 
        {
          opacity: 1
        }
      );
      this.setState({
        didFadeIn: true
      })
    }
  }

  addWordFormSubmit = (values, dispatch) => {
    const { words, userId } = this.props;
    
    dispatch(tryAddWord(words, values.word, userId));
  }

  removeWord = word => {
      const { words, userId, dispatch } = this.props;
      // Clousure for preparing to remove word from user account.
      return () => {
        dispatch(tryRemoveWord(words, word, userId));
      };
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

  logOut = () => {
    const { dispatch } = this.props;

    dispatch(logOut());
    
  }

  submitChangeAvatar = avatars => {
    const { username, dispatch, userData} = this.props; 
    const data = {
      "username": username,
      "oldAvatar": userData.avatar,
      "newAvatar": avatars[0]
    };

    dispatch(tryChangeUserAvatar(data));
  }

  switchView = firstView => () => {
    let secondView;
    let thirdView;

    switch (firstView) {
      case 'isShownWordsList':
        secondView = 'isShownLogInForm';
        thirdView = 'isShownRegistrationForm';
        break;
      case 'isShownRegistrationForm':
        secondView = 'isShownLogInForm';
        thirdView = 'isShownWordsList';
        break;
      case 'isShownLogInForm':
        secondView = 'isShownRegistrationForm';
        thirdView = 'isShownWordsList';
        break;
    }

    this.setState({
      [firstView]: true, 
      [secondView]: false, 
      didFadeIn: false, 
      [thirdView]: false
    });
  }



  render() {
    const { 
      words,
      is_requesting,
      isLogged
    } = this.props;
    console.log(isLogged);
    const { 
      isShownRegistrationForm,
      isShownWordsList,
      isShownLogInForm
    } = this.state;
    
    return (
        <div className="workPlaceContainer">
          <h3 className="mainTitle">
            Which a noise do you want to drown out?
          </h3>

          {/* begin mainInfo */}
          <div className="mainInfo">
            {/* begin mainInforHeader */}
            <header id="header" className="mainInfoHeader">
              <h4 className="mainInfoHeader__title">Unwished words</h4>
              <div className="mainInfoHeaderContent">
                Found&nbsp;
                <span id='quantityBadContent' className='mainInfoHeaderContent__quantityWords'></span>
                unwhished content on &nbsp;
                <strong id='domainName' className='mainInfoHeaderContent__domain'>{document.domain}</strong>
              </div>
            </header>
            {/* end mainInforHeader */}
            {/* begin mainContent */}
            <main className="mainContent">
              {isLogged  ? <AddWordForm onSubmit={this.addWordFormSubmit}/> : ''}

              {isLogged ?
                !is_requesting  ? 
                    <WordsList words={words} 
                      removeWord={this.removeWord} 
                      showLogInForm={this.switchView('isShownLogInForm')} /> :
                    <Loader className='wordsLoading' /> : 
                ''
              }
              {isShownRegistrationForm && !isLogged ? 
                <RegistrationContainer 
                  showLogInForm={this.switchView('isShownLogInForm')} /> :
                   ''
              }
              {isShownLogInForm && !isLogged ? 
                <LogInForm 
                  submitLogInForm={this.submitLogInForm}
                  showRegistrationForm={this.switchView('isShownRegistrationForm')}
                  {...this.props}
                /> : ''}
              
            </main>
            {/* end mainContent */}
          </div>
          {/* end mainInfo */}
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
      userId,
      words,
      is_requesting
    } = user;

    const {
      userData,
      username,
      password,
      isLogged,
      isLogining,
      registered,
      message
    } = account;

    return {
      userId,
      words,
      is_requesting,
      isLogining,
      username,
      password,
      message,
      isLogged
    };
};

export default connect(mapStateToProps)(App);
