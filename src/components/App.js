import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Wizard, Steps, Step } from 'react-albus/lib';

import Homepage from "./Homepage";
import SpotifyLogin from "./SpotifyLogin";

class App extends Component {
  render() {
    return (
        <BrowserRouter>
              <Route
                  render={({ history }) => (
                      <Wizard history={history}>
                        <Steps>
                          <Step id="">
                            <Homepage />
                          </Step>
                          <Step id="spotify-login/">
                            <SpotifyLogin/>
                          </Step>
                        </Steps>
                      </Wizard>
                  )}/>
        </BrowserRouter>
    );
  }
}

export default App
