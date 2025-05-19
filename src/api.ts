import { UserProfile, TimezoneDiff, SignupData, LoginData } from './types';

const API_BASE_URL = 'http://localhost:3001/api';

export const getUserProfile = async (username: string): Promise<UserProfile> => {
    const response = await fetch(`${API_BASE_URL}/profile/${username}`);
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch profile');
    }
    return response.json();
};

export const getTimezoneDiff = async (username: string, isSignedIn: boolean, currentUsername: string | null = null, testTimezone: string | null = null): Promise<TimezoneDiff> => {
    const params = new URLSearchParams({
        isSignedIn: String(isSignedIn),
    });

    if (isSignedIn && currentUsername) {
        params.append('currentUsername', currentUsername);
    }

    if (!isSignedIn && testTimezone) {
        params.append('testTimezone', testTimezone);
    }

    const url = `${API_BASE_URL}/timezone-diff/${username}?${params.toString()}`;
    console.log('getTimezoneDiff: Fetching URL:', url);

    const response = await fetch(url);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch timezone difference');
    }
    return response.json();
};

export const signup = async (data: SignupData): Promise<UserProfile> => {
    const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to sign up');
    }
    return response.json();
};

export const login = async (data: LoginData): Promise<UserProfile> => {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to log in');
    }
    return response.json();
}; 