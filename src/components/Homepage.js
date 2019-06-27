import React, { Component } from 'react';
import './App.css'
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {getToken} from "../actions/authActions";


class HomePage extends Component{

    constructor(props) {
        super(props);
        this.getSpotifyAuth = this.getSpotifyAuth.bind(this);
    }

    getSpotifyAuth() {
        this.props.getToken();
    }

    render() {
        const authEndpoint = 'https://accounts.spotify.com/authorize';
        const clientId = process.env.REACT_APP_SPOTIFY_ID;
        const redirectUri = "http://localhost:3000/spotify-login/";
        const scopes = [
            "user-library-read",
            "playlist-read-private",
            "playlist-modify-public",
            "playlist-modify-private"
        ];
        return (
            <header className="App-header">
                <table id="streaming-options">
                    <th id="spotify-link">
                        <a href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}
                       &response_type=token&show_dialog=true`}>spotify</a>
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

const mapStateToProps = state => {
    console.log(state);
    const { authToken } = state;
    const {
        lastUpdated,
    } = {
        token: state.items,
        lastUpdated: state.lastUpdated,
    };

    return {
        lastUpdated
    }
};
const mapDispatchToProps = dispatch => {
    return {
        getToken: () => {
            dispatch(getToken())
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage)