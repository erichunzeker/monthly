import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import SpotifyLogin from './spotify/SpotifyLogin.js';
import * as SpotifyFunctions from './spotify/SpotifyFunctions';
import HomePage from './HomePage';

class App extends Component{

    render() {
        return (
                <div className="App">
                    <HomePage/>
                </div>

        );
    }
}

export default App;