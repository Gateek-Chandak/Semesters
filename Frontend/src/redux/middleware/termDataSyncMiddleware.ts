// middlewares/syncMiddleware.ts
import { Action, Dispatch, Store, } from 'redux';
import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { syncTermDataChanges } from '../actions/termDataActions'; // Your action to update user data on the server

//@ts-expect-error no clue
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
    action.type === 'data/deleteCourse' ||
    action.type === 'data/updateAssessment' ||
    action.type === 'data/updateCourseName' ||
    action.type === 'data/updateCourseSubtitle' ||
    action.type === 'data/updateCompletedCourseGrade'  
  ) {
    const state: RootState = store.getState();
    const data = state.data.data; // Access the terms data in the Redux state

    if (data.length > 0) {

      // Trigger an API call to sync the updated terms data with the backend

      //@ts-expect-error no clue
      store.dispatch(syncTermDataChanges(data));  // Make sure you have an action to update user data on the server
    }
  }

  return result;
};

export default termDataSyncMiddleware;

