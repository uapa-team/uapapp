import React, { Component } from 'react';
import Routes from './routes'
import UnalCanvas from './UnalCanvas'

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
