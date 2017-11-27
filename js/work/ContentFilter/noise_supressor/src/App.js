import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from './components/Loader.js';

import './App.css';
import WordsList from './components/WordsList';
import AddWordForm  from './components/AddWordForm.js';
import RegistrationContainer from './containers/RegistrationContainer.js';
import { 
  tryAddWord, 
  tryRemoveWord,
  getUserData
} from './actions/userActions.js';
import {TweenLite} from 'gsap';

class App extends Component {
  state = {
    didFadeIn: false
  }

  componentDidMount() { 
    const { userId, dispatch } = this.props;
    
    dispatch(getUserData(userId));
  }
  componentDidUpdate() {
    console.log(wordsList);
    const wordsList = document.getElementById('wordsList');
    if (!this.state.didFadeIn && wordsList) {
      TweenLite.to(
        wordsList,
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

  render() {
    const { words, is_requesting } = this.props;
    
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
              <AddWordForm onSubmit={this.addWordFormSubmit}/>
              {!is_requesting ? 
                  <WordsList words={words} removeWord={this.removeWord} /> :
                  <Loader className='wordsLoading' />
              }
            </main>
            {/* end mainContent */}
            <RegistrationContainer />
          </div>
          {/* end mainInfo */}
        </div>
    );
  }
}

const mapStateToProps = state => {
    const {
      user
    } = state;

    const {
      userId,
      words,
      is_requesting
    } = user;

    return {
      userId,
      words,
      is_requesting
    };
};

export default connect(mapStateToProps)(App);
