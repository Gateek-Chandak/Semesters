// middlewares/syncMiddleware.ts
import { Action, Dispatch, Store, } from 'redux';
import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { syncTermDataChanges } from '../actions/termDataActions'; // Your action to update user data on the server

const termDataSyncMiddleware: Middleware = (store: Store) => (next: Dispatch) => async (action: Action) => {
  const result = next(action); // Pass the action to the next middleware or reducer
  // Check if the action is one that updates the data (you can add more actions as needed)
  if (
    action.type === 'data/setData' ||
    action.type === 'data/addTerms' ||
    action.type === 'data/addTerm' ||
    action.type === 'data/updateTerm' ||
    action.type === 'data/addCourse' ||
    action.type === 'data/updateCourse' ||
    action.type === 'data/deleteCourse'
  ) {
    const state: RootState = store.getState();
    const data = state.data.data; // Access the terms data in the Redux state

    if (data.length > 0) {

      // Trigger an API call to sync the updated terms data with the backend
      store.dispatch(syncTermDataChanges(data) as any);  // Make sure you have an action to update user data on the server
    }
  }

  return result;
};

export default termDataSyncMiddleware;
