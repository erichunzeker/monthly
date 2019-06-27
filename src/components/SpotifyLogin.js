import React, { Component } from 'react';
import {getToken, storeToken} from "../actions/authActions";
import {connect} from "react-redux";
import {fetchPlaylists} from "../actions/getMusicActions";


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
    constructor(props) {
        super(props)
        this.listPlaylists = this.listPlaylists.bind(this);
    }
    componentDidMount() {
        this.props.storeToken(hash.access_token);
    }
    listPlaylists() {
        this.props.fetchPlaylists();
        console.log('test')
    }

    render() {
        return (
            <span>
                <button onClick={this.listPlaylists}>click here to list playlists</button>
            </span>
        );
    }
}

const mapStateToProps = state => {
    console.log(state);
    const { authToken } = state;
    const {
        lastUpdated,
    } = {
        token: state.token,
        lastUpdated: state.lastUpdated,
    };

    return {
        lastUpdated
    }
};
const mapDispatchToProps = dispatch => {
    return {
        storeToken: (token) => {
            dispatch(storeToken(token))
        },
        fetchPlaylists: () => {
            dispatch(fetchPlaylists())
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SpotifyLogin)