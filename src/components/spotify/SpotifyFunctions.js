import React from 'react';
import * as $ from "jquery";


export function organizeData(playlistData, username) {
    console.log(playlistData);
    playlistData = playlistData.filter(playlist => playlist.owner.id === username);
    return playlistData;
}

export function getTrackList(token, userPlaylists) {
    for(var i = 0; i < userPlaylists.length; i++) {
        getPlaylists(token, userPlaylists[i].tracks.href)
    }
    var bigTrackList = [];

}

function getPlaylists(token, _url) {
    // Make a call using the token
    $.ajax({
        url: _url + "?limit=100&offset=0",
        type: "GET",
        beforeSend: (xhr) => {
            xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
        success: (data) => {
            console.log("data", data);
            // this.setState({
            //     playlists: this.state.playlists.concat(data.items),
            // });
            //
            // if(data.next)
            //     this.getPlaylists(this.state.token, 50);
            //
            // var reg = /users\/(.*)\/playlists/;
            // var name = data.href.match(reg);
            // console.log(name);
            // this.setState({
            //     username: name[1]
            // });

            // call spotify functions and set it to state
        }
    });

}

