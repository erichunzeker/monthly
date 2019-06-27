import axios from 'axios';
import {receiveAuth} from "./authActions";

export const REQUEST_PLAYLISTS = 'REQUEST_PLAYLISTS';
export function requestPlaylists() {
    return {
        type: REQUEST_PLAYLISTS
    }
}

export const RECEIVE_PLAYLISTS = 'RECEIVE_PLAYLISTS';
export function receivePlaylists(data) {
    return {
        type: RECEIVE_PLAYLISTS,
        items: data,
        receivedAt: Date.now()
    }
}

export const fetchPlaylists = () => (dispatch, getState) => {
    dispatch(requestPlaylists());
    const state = getState();
    console.log(state);
    axios.get('/user-playlists', {
        params: {
            "token": state.authToken.items
        }
    }).then(res => {
        console.log(res.data);

        dispatch(receivePlaylists(res.data));
    }).catch(err => {
        console.log(err);
    })
};