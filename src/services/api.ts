import axios from 'axios';
import { User, TimezoneDiff, SignupData, LoginData } from '../types';

const API_URL = 'http://localhost:3001/api';

export const api = {
    signup: async (data: SignupData): Promise<User> => {
        const response = await axios.post(`${API_URL}/signup`, data);
        return response.data;
    },

    login: async (data: LoginData): Promise<User> => {
        const response = await axios.post(`${API_URL}/login`, data);
        return response.data;
    },

    getProfile: async (username: string): Promise<User> => {
        const response = await axios.get(`${API_URL}/profile/${username}`);
        return response.data;
    },

    getTimezoneDiff: async (username: string, isSignedIn: boolean): Promise<TimezoneDiff> => {
        const response = await axios.get(`${API_URL}/timezone-diff/${username}`, {
            params: { isSignedIn }
        });
        return response.data;
    }
}; 