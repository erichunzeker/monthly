import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import SpotifyLogin from './spotify/SpotifyLogin.js';
import * as SpotifyFunctions from './spotify/SpotifyFunctions';


class App extends Component{

    render() {
        return (
            <Router>
                <div className="App">
                    <header className="App-header">
                        <table id="streaming-options">
                            <th id="spotify-link">
                                <SpotifyLogin/>
                            </th>
                            <th id="apple-music-link">apple music</th>
                        </table>
                        <p id="app-description">login to either platform and monthly will automatically create 12 playlists
                            - each containing every song you've
                            ever saved or added to a playlist, organized by month</p>

                        <Route path="/spotify/" component={SpotifyLogin}/>

                    </header>
                </div>

            </Router>
        );
    }
}

export default App;