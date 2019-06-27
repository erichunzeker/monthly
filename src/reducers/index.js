import {combineReducers} from "redux";
import {RECEIVE_AUTH, REQUEST_AUTH} from "../actions/authActions";
import {RECEIVE_PLAYLISTS, REQUEST_PLAYLISTS} from "../actions/getMusicActions";

const authToken = (state = {
    isFetching: false,
    items: []
}, action) => {
    switch (action.type) {
        case REQUEST_AUTH:
            return {
                // copy state but only change is fetching for auth
                ...state,
                isFetching: true,
            };
        case RECEIVE_AUTH:
            return {
                // copy state but change auth fields when it's received
                ...state,
                isFetching: false,
                items: action.token,
                lastUpdated: action.receivedAt
            };
        default:
            return state
    }
};

const playlistData = (state = {
    isFetching: false,
    items: []
}, action) => {
    switch (action.type) {
        case REQUEST_PLAYLISTS:
            return {
                // copy state but only change is fetching for auth
                ...state,
                isFetching: true,
            };
        case RECEIVE_PLAYLISTS:
            return {
                // copy state but change auth fields when it's received
                ...state,
                isFetching: false,
                items: action.items,
                lastUpdated: action.receivedAt
            };
        default:
            return state
    }
};

const rootReducer = combineReducers({
    authToken,
    playlistData
});

export default rootReducer
