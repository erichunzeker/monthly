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
import SpotifyLogin from './SpotifyLogin';
import * as SpotifyFunctions from './SpotifyFunctions';


class SpotifyPlaylistGenerator extends Component {

    // take in all a dict of 12 arr
    // token
    // buncha axios or ajax calls to create and alter playlists

    constructor(props) {
        super(props);
        this.state = {

        }
        this.organizePlaylists = SpotifyFunctions.organizeData.bind(this);
        console.log(this.props);
    }

    render() {
        var userPlaylists = this.organizePlaylists(this.props.playlists, this.props.username);

        return (
            <header className="App-header">
                <p>{userPlaylists.map(playlist => playlist.name + ", ")}</p>
            </header>
        );
    }
}

export default SpotifyPlaylistGenerator