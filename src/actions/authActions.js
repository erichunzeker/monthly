import axios from 'axios';

export const REQUEST_AUTH = 'REQUEST_AUTH';
export function requestAuth() {
    return {
        type: REQUEST_AUTH
    }
}

export const RECEIVE_AUTH = 'RECEIVE_AUTH';
export function receiveAuth(data) {
    return {
        type: RECEIVE_AUTH,
        token: data,
        receivedAt: Date.now()
    }
}

export const storeToken = (token) => (dispatch) => {
    console.log(token)
    dispatch(receiveAuth(token))
};

export const getToken = () => (dispatch) => {
    dispatch(requestAuth());

    //let token = hash.access_token;
    //console.log(token);

    axios.get('/spotify-auth',
        {
            params: {
                "Authorization": "Bearer "
            }
        })
        .then(res => {
            console.log(res);
            dispatch(receiveAuth(res));
        });
};