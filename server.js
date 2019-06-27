require('dotenv').config();
const express = require('express');
const path = require('path');
const axios = require('axios/index');

const app = express();

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'build')));


app.get('/spotify-auth', async (req, res) => {


    const url = "https://accounts.spotify.com/authorize?client_id=" + process.env.REACT_APP_SPOTIFY_ID +
        "&redirect_uri=" + process.env.REACT_APP_SPOTIFY_DEVELOPMENT_REDIRECT_URI + "&scope=playlist-read-private";
    try {
        axios.get(url).then(data =>
            res.send((data.responseUrl))
        )
    } catch (error) {
        console.error(error)
    }

});

app.get('/user-playlists?:token', (req, res) => {
    let offset = 0;
    const url = "https://api.spotify.com/v1/me/playlists?limit=50&offset=" + offset;
    console.log(req.query.token);
    var allPlaylists = {};
    axios.get(url, {
        headers: {
            "Authorization": "Bearer " + req.query.token
        }
    })
    .then(response => {
        console.log('\n\n\n');
        console.log(response.data);
        console.log('\n\n\n');
        allPlaylists = response.data.items;
        var promises = [];
        var next = response.data.next;
        if (response.data.total > 50) {
            var numCalls = Math.ceil(response.data.total / 50);

            for (let i = 1; i < numCalls; i++) {
                axios.get(next, {
                    headers: {
                        "Authorization": "Bearer " + req.query.token
                    }
                }).then(result => {
                    next = result.data.next;
                    console.log(result.data.items);
                    allPlaylists = allPlaylists.concat(result.data.items)
                    if(i === numCalls - 1)
                        res.send(JSON.stringify(allPlaylists))
                }).catch(err =>
                    console.log(err));
            }
        }
    })
    .catch(err => console.log(err))
});


const port = process.env.PORT || 5000;

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));
