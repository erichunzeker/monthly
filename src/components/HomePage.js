import React, { Component } from 'react';
import './App.css';
import SpotifyLogin from './spotify/SpotifyLogin.js';


class HomePage extends Component{

    render() {
        return (
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
                </header>
        );
    }
}

export default HomePage;