import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Term } from '@/types/mainTypes';

// Thunk to sync term data with backend
export const syncTermDataChanges = createAsyncThunk(
    'data/syncTermData', // This is the action type
    async (termData: Term[], { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_SITE_URL}/api/term-database/update-term-data`,  // Replace with actual endpoint
                { termData },
                { withCredentials: true }  // Ensures cookies are sent with the request
            );
            if (response.data.exists) {
                return response.data;  // Return response data if successful
            } 
        
            return rejectWithValue('Error syncing data');

        } catch (error) {
            // Handle errors and return a rejected value
            console.error('Error syncing term data:', error);
            return rejectWithValue('Error syncing data');
        }
    }
);