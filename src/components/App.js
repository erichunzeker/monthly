import React, { Component } from 'react';
import './App.css';
import * as $ from "jquery";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import SpotifyLogin from './spotify/SpotifyLogin.js';
import * as SpotifyFunctions from './spotify/SpotifyFunctions';

export const authEndpoint = 'https://accounts.spotify.com/authorize';
const clientId = process.env.REACT_APP_SPOTIFY_ID;
const redirectUri = "http://localhost:3000";
const scopes = [
    "user-library-read",
    "playlist-read-private",
    "playlist-modify-public",
    "playlist-modify-private"
];

const hash = window.location.hash
    .substring(1)
    .split("&")
    .reduce(function(initial, item) {
        if (item) {
            var parts = item.split("=");
            initial[parts[0]] = decodeURIComponent(parts[1]);
        }
        return initial;
    }, {});
window.location.hash = "";

class App extends Component{
    constructor() {
        super();
        this.state = {
            token: null,
        };
        this.getCurrentlyPlaying = this.getCurrentlyPlaying.bind(this);
    }

    componentDidMount() {
        // Set token
        let _token = hash.access_token;

        if (_token) {
            // Set token
            this.setState({
                token: _token
            });
            this.getCurrentlyPlaying(_token);
        }
    }

    getCurrentlyPlaying(token) {
        // Make a call using the token
        $.ajax({
            url: "https://api.spotify.com/v1/me/playlists",
            type: "GET",
            beforeSend: (xhr) => {
                xhr.setRequestHeader("Authorization", "Bearer " + token);
            },
            success: (data) => {
                console.log("data", data);
                this.setState({

                });
            }
        });
    }

    render() {
        return (
            <Router>
                <div className="App">
                    <header className="App-header">
                        <table id="streaming-options">
                            <th id="spotify-link">
                                {!this.state.token && (

                                <a id="spotify-link-component"
                                   href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20"
                                   )}&response_type=token&show_dialog=true`}>spotify</a>
                                )}

                                {this.state.token && (
                                    <p>test</p>
                                )}

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