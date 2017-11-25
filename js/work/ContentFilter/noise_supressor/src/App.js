import React, { Component } from 'react';
import './App.css';
import WordsList from './components/WordsList';
import AddWordForm  from './components/AddWordForm.js';
import { connect } from 'react-redux';

class App extends Component {

  addWordFormSubmit = (values, dispatch) => {

  }
  render() {
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
                <strong id='domainName' className='mainInfoHeaderContent__domain'></strong>
              </div>
            </header>
            {/* end mainInforHeader */}
            {/* begin mainContent */}
            <main className="mainContent">
              <AddWordForm onSubmit={this.addWordFormSubmit}/>
              <WordsList words={['test', 'word']} />
            </main>
            {/* end mainContent */}
            
          </div>
          {/* end mainInfo */}
        </div>
    );
  }
}

const mapStateToProps = state => ({});
export default connect(mapStateToProps)(App);
