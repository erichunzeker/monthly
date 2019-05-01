import Spotify from 'spotify-web-api-js';

export function spotifyLogin() {
    const CLIENT_ID = process.env.REACT_APP_SPOTIFY_ID;
    const REDIRECT_URI =
        process.env.NODE_ENV === "production"
            ? process.env.REACT_APP_SPOTIFY_PRODUCTION_REDIRECT_URI
            : process.env.REACT_APP_SPOTIFY_DEVELOPMENT_REDIRECT_URI;

    // const scopes = [
    //     "user-library-read",
    //     "playlist-read-private",
    //     "playlist-modify-public",
    //     "playlist-modify-private"
    // ];

    return (
        "https://accounts.spotify.com/authorize?response_type=token&client_id=" +
        encodeURIComponent(CLIENT_ID) +
        "&redirect_uri=" +
        encodeURIComponent(REDIRECT_URI) +
        "&scope=playlist-read-private"
    );
}

export function checkUrlForSpotifyAccessToken(){
    console.log("TRTETRETRTRET");
    const params = getHashParams();
    const accessToken = params.access_token;
    if (!accessToken) {
        return false
    }
    else {
        return accessToken
    }
}

function getHashParams() {
    //helper function to parse the query string that spotify sends back when you log in
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    // eslint-disable-next-line
    while ( e = r.exec(q)) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
}
