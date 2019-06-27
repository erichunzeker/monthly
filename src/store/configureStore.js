import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './../reducers/index';

// take in root reducer, persisted state, and middleware to create store

var persistedState = {};

const configureStore = () => createStore(
    rootReducer,
    persistedState,
    applyMiddleware(thunk)
);

export default configureStore;