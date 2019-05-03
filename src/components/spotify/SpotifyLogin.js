import React, { Component } from 'react';
import * as SpotifyFunctions from './SpotifyFunctions';
import * as $ from "jquery";
import ReactDOM from "react-dom";
import App from "../../index";
import SpotifyPlaylistGenerator from './SpotifyPlaylistGenerator';

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
    numPlaylists = 0;
    constructor() {
        super();
        this.state = {
            token: null,
            total: 0,
            playlists: [],
            username: null,
        };
        this.getPlaylists = this.getPlaylists.bind(this);
        this.organizePlaylists = SpotifyFunctions.organizeData.bind(this);
    }

    componentDidMount() {
        // Set token
        let _token = hash.access_token;

        if (_token) {
            // Set token
            this.setState({
                token: _token
            });

            var offset = 0;
            this.getPlaylists(_token, offset);

            offset += 50;
            console.log(this.numPlaylists);
            console.log(offset);
            while(offset < this.state.total) {
                this.getPlaylists(_token, offset);
                offset += 50;
            }
        }
    }

    getPlaylists(token, offset) {
        // Make a call using the token
        $.ajax({
            url: "https://api.spotify.com/v1/me/playlists?limit=50&offset=" + offset,
            type: "GET",
            beforeSend: (xhr) => {
                xhr.setRequestHeader("Authorization", "Bearer " + token);
            },
            success: (data) => {
                console.log("data", data);
                this.setState({
                    total: data.total,
                    playlists: this.state.playlists.concat(data.items),
                    username: data.href
                });
                this.numPlaylists = data.total;

                this.organizePlaylists(data.items, );
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
                    <SpotifyPlaylistGenerator/>
                    )}
            </span>
        );
    }
}

export default SpotifyLogin;