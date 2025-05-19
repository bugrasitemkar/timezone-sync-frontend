import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useParams, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Button, Box } from '@mui/material';
import { Signup } from './components/Signup';
import { Login } from './components/Login';
import Profile from './components/Profile';
import TimezoneView from './components/TimezoneView';

// Wrapper component for TimezoneView
const TimezoneViewWrapper: React.FC<{ isSignedIn: boolean; signedInUsername: string | null }> = ({ 
  isSignedIn, 
  signedInUsername 
}) => {
  const { username } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn && signedInUsername && username && signedInUsername === username) {
      console.log('Redirecting to profile...');
      navigate(`/profile/${username}`, { replace: true });
    }
  }, [isSignedIn, signedInUsername, username, navigate]);

  if (isSignedIn && signedInUsername && username && signedInUsername === username) {
    return null;
  }

  return (
    <TimezoneView 
      isSignedIn={isSignedIn} 
      signedInUsername={signedInUsername} 
    />
  );
};

function App() {
  const [isSignedIn, setIsSignedIn] = useState(() => {
    const savedIsSignedIn = localStorage.getItem('isSignedIn');
    return savedIsSignedIn === 'true';
  });
  const [signedInUsername, setSignedInUsername] = useState(() => {
    return localStorage.getItem('signedInUsername');
  });

  const handleSignIn = (username: string) => {
    console.log('Handling sign in for user:', username);
    setIsSignedIn(true);
    setSignedInUsername(username);
    localStorage.setItem('isSignedIn', 'true');
    localStorage.setItem('signedInUsername', username);
  };

  const handleSignOut = () => {
    console.log('Handling sign out');
    setIsSignedIn(false);
    setSignedInUsername(null);
    localStorage.removeItem('isSignedIn');
    localStorage.removeItem('signedInUsername');
  };

  useEffect(() => {
    console.log('App state updated: isSignedIn=', isSignedIn, ' signedInUsername=', signedInUsername);
  }, [isSignedIn, signedInUsername]);

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            TimezoneSync
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          
          {isSignedIn ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body1" sx={{ color: 'inherit' }}>
                  Welcome, {signedInUsername}
                </Typography>
                <Button color="inherit" component={Link} to="/profile">
                  Profile
                </Button>
                <Button color="inherit" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                Sign Up
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Container>
        <Routes>
          <Route path="/signup" element={<Signup onSignIn={handleSignIn} />} />
          <Route path="/login" element={<Login onSignIn={handleSignIn} />} />
          
          {/* Protected Profile Routes */}
          <Route 
            path="/profile" 
            element={
              isSignedIn && signedInUsername ? (
                <Navigate to={`/profile/${signedInUsername}`} replace />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/profile/:username" 
            element={
              isSignedIn ? (
                <Profile 
                  isSignedIn={isSignedIn} 
                  currentUsername={signedInUsername} 
                />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />

          {/* Public Timezone View Route */}
          <Route 
            path="/:username" 
            element={
              <TimezoneViewWrapper 
                isSignedIn={isSignedIn} 
                signedInUsername={signedInUsername} 
              />
            } 
          />
          
          <Route path="/" element={
            <Container maxWidth="sm" sx={{ mt: 4 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                Welcome to TimezoneSync
              </Typography>
              <Typography variant="body1" paragraph>
                {isSignedIn 
                  ? `Welcome back, ${signedInUsername}! You can view your profile or check other users' timezones.`
                  : 'Sign up or login to create your profile and share your timezone with others.'}
              </Typography>
              {!isSignedIn && (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to="/login"
                    sx={{ mr: 2 }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to="/signup"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Container>
          } />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
