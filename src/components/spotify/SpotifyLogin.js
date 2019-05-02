import React, { Component } from 'react';
import * as SpotifyFunctions from './SpotifyFunctions';
import * as $ from "jquery";

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


class SpotifyLogin extends Component{
    constructor() {
        super();
        this.state = {
            token: null,
            total: 0,
            playlists: []
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
                    total: data.total,
                    playlists: data.items
                });
            }
        });
    }

    render() {
        return (
            <span>
                {!this.state.token && (
                    <a id="spotify-link-component"
                       href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}
                       &response_type=token&show_dialog=true`}>spotify</a>
                )}

                {this.state.token && (
                    <p>{this.state.total}</p>
                )}
            </span>
        );
    }
}

export default SpotifyLogin;