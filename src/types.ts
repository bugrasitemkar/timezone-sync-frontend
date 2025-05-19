export interface User {
    id: number;
    username: string;
    email: string;
    timezone: string;
    created_at: string;
}

export interface UserProfile {
    id: number;
    username: string;
    email: string;
    timezone: string;
}

export interface TimezoneDiff {
    userTimezone: string;
    visitorTimezone: string;
    differenceHours: number;
}

export interface SignupData {
    username: string;
    email: string;
    timezone: string;
    password: string;
}

export interface LoginData {
    username: string;
    password: string;
} 