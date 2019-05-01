import React, { Component } from 'react';
import * as SpotifyFunctions from './SpotifyFunctions';

class SpotifyLogin extends Component{
    constructor(props) {
        super(props)
        this.state = {
            loggedInToSpotify: false,
            accessToken: null
        }
    }
    componentDidMount() {
        const accessToken = SpotifyFunctions.checkUrlForSpotifyAccessToken();
        accessToken ? this.setState({loggedInToSpotify: true, accessToken: accessToken}) : this.setState({loggedInToSpotify: false, accessToken: null});
    }

    render() {
        return (
            <span>
                <p id="login-button">token: {this.state.accessToken}</p>
                <a href={SpotifyFunctions.spotifyLogin()}>login</a>
            </span>
        );
    }
}

export default SpotifyLogin;