/*

    HOW TO READ AND WRITE PLAYLISTS
* - obtain token through implicit grant authorization
* - call /v1/me/playlists - Get a List of Current User's Playlists
* - for each playlist, 	/v1/playlists/{playlist_id}/tracks - Get a Playlist's Tracks
* - map all songs to month playlist
* - for each month, /v1/playlists - Create a Playlist
* - for each song, map /v1/playlists/{playlist_id}/tracks - Add Tracks to a Playlist
* - make playlist cool /v1/playlists/{playlist_id} - Change a Playlist's Details
*/

import React, { Component } from 'react';
import './App.css';
import SpotifyLogin from './spotify/SpotifyLogin.js';


class SpotifyPlaylistGenerator extends Component{

    render() {
        return (
            <header className="App-header">
                <p>stider dog</p>
            </header>
        );
    }
}

export default SpotifyPlaylistGenerator