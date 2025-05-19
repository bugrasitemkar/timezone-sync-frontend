import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getUserProfile, getTimezoneDiff } from '../api';
import { UserProfile, TimezoneDiff } from '../types';
import moment from 'moment-timezone';

interface TimezoneViewProps {
    isSignedIn: boolean;
    signedInUsername: string | null;
}

const TimezoneView: React.FC<TimezoneViewProps> = ({ isSignedIn, signedInUsername }) => {
    const { username } = useParams<{ username: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [timezoneDiff, setTimezoneDiff] = useState<TimezoneDiff | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [targetTime, setTargetTime] = useState('');
    const [visitorTime, setVisitorTime] = useState('');
    const [targetAvatarUrl, setTargetAvatarUrl] = useState<string>('');
    const [visitorAvatarUrl, setVisitorAvatarUrl] = useState<string>('');

    // Helper function to get emoji based on time of day
    const getTimeOfDayEmoji = (time: moment.Moment): string => {
        const hour = time.hour();
        
        // Refined ranges to cover 24 hours sequentially:
        if (hour >= 0 && hour < 6) return '😴'; // Sleep (0-6)
        if (hour >= 6 && hour < 9) return '🌅'; // Morning (6-9)
        if (hour >= 9 && hour < 17) return '💻'; // Work/Daytime (9-17) - Changed to computer emoji
        if (hour >= 17 && hour < 21) return '🌆'; // Evening (17-21)
        if (hour >= 21 && hour < 24) return '🌙'; // Night (21-24)

        return ''; // Should not reach here
    };

    // Update times every second
    useEffect(() => {
        const updateTimes = () => {
            const now = moment();
            if (profile?.timezone) {
                setTargetTime(now.tz(profile.timezone).format('h:mm:ss A'));
            }
            if (timezoneDiff?.visitorTimezone) {
                setVisitorTime(now.tz(timezoneDiff.visitorTimezone).format('h:mm:ss A'));
            }
        };

        updateTimes();
        const interval = setInterval(updateTimes, 1000);

        return () => clearInterval(interval);
    }, [profile?.timezone, timezoneDiff?.visitorTimezone]);

    useEffect(() => {
        // Check for redirection when props or params change
        if (isSignedIn && signedInUsername && username && signedInUsername === username) {
            console.log('Redirecting to profile...'); // Debug log
            navigate(`/profile/${username}`, { replace: true });
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Get testTimezone from URL query parameters
                const params = new URLSearchParams(location.search);
                const testTimezone = params.get('testTimezone');

                // Fetch user profile
                const profileData = await getUserProfile(username!);
                setProfile(profileData);

                // Generate target user avatar URL
                setTargetAvatarUrl(`https://api.dicebear.com/7.x/initials/svg?seed=${username}`);

                // Generate visitor avatar URL if signed in
                if (isSignedIn && signedInUsername) {
                    setVisitorAvatarUrl(`https://api.dicebear.com/7.x/initials/svg?seed=${signedInUsername}`);
                } else {
                    setVisitorAvatarUrl(''); // Clear avatar if not signed in
                }

                // Fetch timezone difference, passing signedInUsername if signed in
                // and testTimezone if available and not signed in
                console.log('Calling getTimezoneDiff with:', {
                    username: username!,
                    isSignedIn: isSignedIn,
                    signedInUsername: signedInUsername,
                    testTimezone: testTimezone
                }); // Debug log
                const diffData = await getTimezoneDiff(username!, isSignedIn, signedInUsername, testTimezone);
                setTimezoneDiff(diffData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [username, isSignedIn, signedInUsername, navigate, location.search]);

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

    if (!profile || !timezoneDiff) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                    User not found
                </div>
            </div>
        );
    }

    // Format timezone names for display
    const formatTimezone = (tz: string) => {
        return tz.split('/').pop()?.replace('_', ' ') || tz;
    };

    // Get Moment objects for current times to determine emojis
    const visitorMomentTime = moment().tz(timezoneDiff.visitorTimezone);
    const targetMomentTime = moment().tz(profile.timezone);

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow rounded-lg p-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">
                        Timezone Comparison with {profile.username}
                    </h1>

                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-blue-50 rounded-lg flex items-center">
                                <div>
                                    <h2 className="text-lg font-medium text-gray-900 mb-2">Your Time {getTimeOfDayEmoji(visitorMomentTime)}</h2>
                                    <p className="text-2xl font-semibold text-gray-700 mb-2">{visitorTime}</p>
                                </div>
                            </div>

                            <div className="p-4 bg-green-50 rounded-lg flex items-center">
                                <div>
                                    <h2 className="text-lg font-medium text-gray-900 mb-2">{profile.username}'s Time {getTimeOfDayEmoji(targetMomentTime)}</h2>
                                    <p className="text-2xl font-semibold text-gray-700 mb-2">{targetTime}</p>
                                </div>
                            </div>
                        </div>

                         <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <h2 className="text-lg font-medium text-gray-900 mb-2">Your Timezone</h2>
                                 <p className="text-gray-600">{formatTimezone(timezoneDiff.visitorTimezone)}</p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg">
                                 <h2 className="text-lg font-medium text-gray-900 mb-2">{profile.username}'s Timezone</h2>
                                 <p className="text-gray-600">{formatTimezone(profile.timezone)}</p>
                            </div>
                         </div>

                        <div className="p-4 bg-purple-50 rounded-lg">
                            <h2 className="text-lg font-medium text-gray-900 mb-2">Time Difference</h2>
                            <p className="text-xl font-semibold text-gray-700">
                                {timezoneDiff.differenceHours > 0 ? '+' : ''}
                                {timezoneDiff.differenceHours} hours
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                {timezoneDiff.differenceHours > 0
                                    ? `${profile.username} is ahead of you`
                                    : timezoneDiff.differenceHours < 0
                                    ? `${profile.username} is behind you`
                                    : 'You are in the same timezone'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimezoneView; 