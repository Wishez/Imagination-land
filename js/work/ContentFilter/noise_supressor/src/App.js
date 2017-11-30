import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TweenLite } from 'gsap';
import { change } from 'redux-form';

import './App.css';
import Loader from './components/Loader';
import WordsList from './components/WordsList';
import AddWordForm  from './components/AddWordForm';
import LogInContainer from './containers/LogInContainer';
import RegistrationContainer from './containers/RegistrationContainer.js';
import { tryChangeUserAvatar } from './actions/accountActions.js';
import { 
  tryAddWord, 
  tryRemoveWord,
  getUserData
} from './actions/userActions.js';
import { 
  tryLogOut
} from './actions/accountActions.js';

class App extends Component {
  state = {
    isShownWordsList: false,
    isShownLogInForm: true,
    isShownRegistrationForm: false,
    didFadeIn: false
  }

  componentDidMount() { 
    // this.loginInIfMay();
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
    const { words, uuid } = this.props;
    
    dispatch(tryAddWord(words, values.word, uuid));
  }

  removeWord = word => {
      const { words, uuid, dispatch } = this.props;
      // Clousure for preparing to remove word from user account.
      return () => {
        dispatch(tryRemoveWord(words, word, uuid));
      };
  }

   logOut = () => {
    const { dispatch } = this.props;

    dispatch(tryLogOut());
    
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
      isLogged,
      uuid
    } = this.props;
    
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
              <h4 className="mainInfoHeader__title">Noise<br/>supressor</h4>
              <div className="mainInfoHeaderContent">
                { isLogged ? <span className='mainInfoHeaderContent__button' 
                  onClick={this.logOut}>Sign out</span> : '' }
                {isShownRegistrationForm ? 
                      <span className='mainInfoHeaderContent__button'
                          onClick={this.switchView('isShownLogInForm')}>Sing in</span> :
                          '' 
                    }
                { isShownLogInForm && !isLogged ? <span className='mainInfoHeaderContent__button'
                  onClick={this.switchView('isShownRegistrationForm')}>Sing up</span> : '' }
              </div>
            </header>
            {/* end mainInforHeader */}
            {/* begin mainContent */}
            <main className="mainContent">
              {isLogged  ? <AddWordForm onSubmit={this.addWordFormSubmit}/> : ''}
              {isLogged ?
                !is_requesting  ? 
                    <div className='main'>
                        <WordsList words={words} 
                          removeWord={this.removeWord} 
                          showLogInForm={this.switchView('isShownLogInForm')} />
                    </div> :
                    <Loader className='wordsLoading' /> : 
                ''
              }
              {isShownRegistrationForm && !isLogged ? 
                <RegistrationContainer /> :
                   ''
              }
              {isShownLogInForm && !isLogged ? 
                <LogInContainer showRegistrationForm={this.switchView('isShownRegistrationForm')} /> : ''}
              
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
      words,
      is_requesting
    } = user;

    const {
      userData,
      uuid,
      username,
      password,
      isLogged,
      isLogining,
      registered,
      message
    } = account;

    
    return {
      uuid,
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
