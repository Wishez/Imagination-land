import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TweenLite } from 'gsap';

import './App.css';
import Loader from './components/Loader';
import WordsList from './components/WordsList';
import AddWordForm  from './components/AddWordForm';
import LogInContainer from './containers/LogInContainer';
import RegistrationContainer from './containers/RegistrationContainer.js';
import { tryChangeUserAvatar } from './actions/accountActions.js';
import { 
  tryAddWord, 
  tryRemoveWord
} from './actions/userActions.js';
import { 
  tryLogOut
} from './actions/accountActions.js';
import { 
  showLogInForm ,
  showRegistrationForm,
  setSomthingShown
} from './actions/viewActions.js';

class App extends Component {
  componentDidMount() { 
    const { dispatch } = this.props;

    dispatch(showLogInForm());
  }
  componentDidUpdate() {
    const { 
      didFadeIn,
      dispatch
    } = this.props;
        
    let node = document.querySelector('.main');
    
    if (!didFadeIn && node) {
    
      TweenLite.to(
        node,
        1.2, 
        {
          opacity: 1
        }
      );

      dispatch(setSomthingShown());
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

  switchView = actionCreator => () => {
    const { dispatch } = this.props;

    dispatch(actionCreator());
  }
  


  render() {
    const { 
      words,
      is_requesting,
      isLogged,
      isShownRegistrationForm,
      isShownLogInForm
    } = this.props;
    
 
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
                {/* Start Switch buttons */}

                { isLogged ? <span className='mainInfoHeaderContent__button' 
                  onClick={this.logOut}>Sign out</span> : '' }

                {isShownRegistrationForm ? 
                      <span className='mainInfoHeaderContent__button'
                          onClick={this.switchView(showLogInForm)}>Sing in</span> :
                          '' 
                    }
                { isShownLogInForm && !isLogged ? <span className='mainInfoHeaderContent__button'
                  onClick={this.switchView(showRegistrationForm)}>Sing up</span> : '' }

                {/* End switch buttons */}
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
                        />
                    </div> :
                    <Loader className='wordsLoading' /> : 
                ''
              }
              {isShownRegistrationForm && !isLogged ? 
                <RegistrationContainer /> :
                   ''
              }
              {isShownLogInForm && !isLogged ? 
                <LogInContainer /> : ''}
              
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
      account,
      view
    } = state;

    const {
      words,
      is_requesting
    } = user;

    const {
      uuid,
      isLogged,
    } = account;

    const {
      isShownRegistrationForm,
      isShownWordsList,
      isShownLogInForm,
      didFadeIn
    } = view;
    
    return {
      uuid,
      words,
      is_requesting,
      isLogged,
      isShownRegistrationForm,
      isShownWordsList,
      isShownLogInForm,
      didFadeIn
    };
};

export default connect(mapStateToProps)(App);
