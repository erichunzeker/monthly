export function organizeData(playlistData, username) {
    console.log(playlistData);
    playlistData = playlistData.filter(playlist => playlist.owner.id === username);


    playlistData = playlistData.map(playlist => [playlist.name, playlist.tracks.total]);
    console.log(playlistData);
}

//https://api.spotify.com/v1/users/ehunzeker37/playlists?offset=0&limit=50