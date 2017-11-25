import React, { Component } from 'react';
import { Provider }  from 'react-redux';
import wordsStore from './store/wordsStore.js';
import './App.css';

class App extends Component {
  render() {
    return (
      <Provider store={wordsStore}>
      <div className="workPlaceContainer">
        <h3 className="mainTitle">
          Which a noise do you want to drown out?
        </h3>

        {/* begin mainInfo */}
        <div className="mainInfo">
          {/* begin mainInforHeader */}
          <header id="header" classNameName="mainInfoHeader">
            <h4 className="mainInfoHeader__title">Unwished words</h4>
            <div className="mainInfoHeaderContent">
              Found&nbsp;
              <span id='quantityBadContent' className='mainInfoHeaderContent__quantityWords'></span>
              unwhished content on &nbsp;
              <strong id='domainName' className='mainInfoHeaderContent__domain'></strong>
            </div>
          </header>
          {/* end mainInforHeader */}
          {/* begin mainContent */}
          <main className="mainContent">
            {/* begin addWordForm */}
            <form id="addWordForm"
              className='addWordForm' 
              method='post'>
              {/* begin controller */}
              <div className="controller">
                <input name='word' 
                  id='addWordField'
                  className='controller__input' type='text' maxlength="100" minlength="1" placeholder="Type a word" />
              </div>
              {/* end controller */}
            </form>
            {/* end addWordForm */}

            {/* begin wordsList */}
            <ul id='wordsList' className="wordsList">
              
            </ul>
            {/* end wordsList */}
          </main>
          {/* end mainContent */}
          
        </div>
        {/* end mainInfo */}
      </div>
      </Provider>
    );
  }
}


export default App;
