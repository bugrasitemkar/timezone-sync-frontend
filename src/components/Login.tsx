import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container } from '@mui/material';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
    onSignIn: (username: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onSignIn }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '' // In a real app, you would handle password securely
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // In a real app, you would send username and password to a login endpoint
            // For now, we'll just simulate a successful login
            const response = await api.login(formData);
            onSignIn(response.username);
            navigate(`/profile/${response.username}`);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Invalid username or password');
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
                    Login
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
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
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
                        Login
                    </Button>
                </form>
            </Box>
        </Container>
    );
}; 