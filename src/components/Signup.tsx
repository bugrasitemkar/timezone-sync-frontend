import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container, MenuItem } from '@mui/material';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import * as moment from 'moment-timezone';

// Get timezones using a different approach
const timezones = moment.tz.names();

interface SignupProps {
    onSignIn: (username: string) => void;
}

export const Signup: React.FC<SignupProps> = ({ onSignIn }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        timezone: moment.tz.guess(),
        password: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newUser = await api.signup(formData);
            onSignIn(newUser.username);
            navigate(`/profile/${newUser.username}`);
        } catch (err: any) {
            setError(err.response?.data?.error || 'An error occurred');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Sign Up
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        select
                        label="Timezone"
                        name="timezone"
                        value={formData.timezone}
                        onChange={handleChange}
                        margin="normal"
                        required
                    >
                        {timezones.map((timezone: string) => (
                            <MenuItem key={timezone} value={timezone}>
                                {timezone}
                            </MenuItem>
                        ))}
                    </TextField>
                    {error && (
                        <Typography color="error" sx={{ mt: 2 }}>
                            {error}
                        </Typography>
                    )}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 3 }}
                    >
                        Sign Up
                    </Button>
                </form>
            </Box>
        </Container>
    );
}; 