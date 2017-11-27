import React, { Component } from 'react';
import { connect } from 'react-redux';

import './App.css';
import WordsList from './components/WordsList';
import AddWordForm  from './components/AddWordForm.js';
import RegistrationContainer from './containers/RegistrationContainer.js';
import { 
  tryAddWord, 
  tryRemoveWord,
  getUserData
} from './actions/userActions.js';

class App extends Component {


  componentDidMount() { 
    const { userId, dispatch } = this.props;
    
    dispatch(getUserData(userId));
  }

  addWordFormSubmit = (values, dispatch) => {
    const { words, userId } = this.props;
    dispatch(tryAddWord(words, values.word, userId));
  }

  removeWord = word => {
      const { words, userId, dispatch } = this.props;
      console.log(word);
      // Clousure for preparing to remove word from user account.
      return () => {
        dispatch(tryRemoveWord(words, word, userId));
      };
  }

  render() {
    const { words } = this.props;
    console.log('From render live cycle:', words);
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
              <WordsList words={words} removeWord={this.removeWord} />
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
      words
    } = user;

    return {
      userId,
      words
    };
};

export default connect(mapStateToProps)(App);
