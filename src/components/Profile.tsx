import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserProfile, getTimezoneDiff } from '../api';
import { UserProfile, TimezoneDiff } from '../types';
import moment from 'moment-timezone';

interface ProfileProps {
    isSignedIn: boolean;
    currentUsername: string | null;
}

const Profile: React.FC<ProfileProps> = ({ isSignedIn, currentUsername }) => {
    const { username } = useParams<{ username: string }>();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [timezoneDiff, setTimezoneDiff] = useState<TimezoneDiff | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState('');

    // Update current time every second
    useEffect(() => {
        const updateTime = () => {
            if (profile?.timezone) {
                const time = moment().tz(profile.timezone).format('HH:mm:ss');
                setCurrentTime(time);
            }
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);

        return () => clearInterval(interval);
    }, [profile?.timezone]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch user profile
                const profileData = await getUserProfile(username!);
                setProfile(profileData);

                // Fetch timezone difference only if not viewing own profile
                if (!isSignedIn || username !== currentUsername) {
                    const diffData = await getTimezoneDiff(username!, isSignedIn, currentUsername);
                    setTimezoneDiff(diffData);
                } else {
                    setTimezoneDiff(null);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [username, isSignedIn, currentUsername, navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                    User not found
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {profile.username}'s Profile
                            </h1>
                            {currentTime && (
                                <div className="text-xl font-semibold text-gray-700">
                                    Current Time: {currentTime}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-lg font-medium text-gray-900">Email</h2>
                            <p className="mt-1 text-gray-600">{profile.email}</p>
                        </div>
                        
                        <div>
                            <h2 className="text-lg font-medium text-gray-900">Timezone</h2>
                            <p className="mt-1 text-gray-600">{profile.timezone}</p>
                        </div>

                        {timezoneDiff && (
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                <h2 className="text-lg font-medium text-gray-900 mb-2">Timezone Difference</h2>
                                <div className="space-y-2">
                                    <p className="text-gray-600">
                                        <span className="font-medium">Your timezone:</span> {timezoneDiff.visitorTimezone}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">{profile.username}'s timezone:</span> {timezoneDiff.userTimezone}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">Difference:</span>{' '}
                                        {timezoneDiff.differenceHours > 0 ? '+' : ''}
                                        {timezoneDiff.differenceHours} hours
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile; 