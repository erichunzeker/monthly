import React from 'react';

export function organizeData(playlistData, username) {
    console.log(playlistData);
    playlistData = playlistData.filter(playlist => playlist.owner.id === username);


    return playlistData;
}

