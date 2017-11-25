import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
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
    );
  }
}
      // { end workPlaceContainer }

export default App;
