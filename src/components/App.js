import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import SpotifyLogin from './spotify/SpotifyLogin.js';




function App() {
  return (
      <Router>
        <div className="App">
          <header className="App-header">
            <table id="streaming-options">
              <th id="spotify-link">
                <Link id="spotify-link-component" to="/spotify">spotify</Link>
              </th>
              <th id="apple-music-link">apple music</th>
            </table>
            <p id="app-description">login to either platform and monthly will automatically create 12 playlists - each containing every song you've
            ever saved or added to a playlist, organized by month</p>

          </header>
        </div>
        <Route path="/spotify" exact component={SpotifyLogin} />

      </Router>
  );
}

export default App;