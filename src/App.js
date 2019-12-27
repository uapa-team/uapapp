import React, { Component } from 'react';
import Routes from './js/routes'
import UnalCanvas from './js/UnalCanvas'

class App extends Component {
  render() {
    return (
        <UnalCanvas>
          <Routes />
        </UnalCanvas>
    );
  }
}

export default App;
