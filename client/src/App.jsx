import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Button,
  Container,
  Box,
  CircularProgress,
} from '@mui/material';
import { Callback } from './components/Callback';
import { LogIn } from './components/LogIn';
import { NotFound } from './components/NotFound';
import { Todos } from './components/Todos';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LogInLogOutButton } from './components/LogInLogOutButton';

export default function App() {
  const { isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0();

  const handleLogout = () =>
    logout({
      returnTo: window.location.origin,
    });

  if (isLoading) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        height='100vh'
      >
        <CircularProgress />
      </Box>
    );
  }

  const logInLogOutButton = isAuthenticated ? (
    <Button color='inherit' onClick={handleLogout}>
      Log Out
    </Button>
  ) : (
    <Button color='inherit' onClick={() => loginWithRedirect()}>
      Log In
    </Button>
  );

  return (
    <BrowserRouter>
      <Container>
        <AppBar position='static'>
          <Toolbar>
            <Button component={Link} to='/' color='inherit'>
              Home
            </Button>
            <Box ml='auto'>
              <Box ml='auto'>
                <LogInLogOutButton
                  isAuthenticated={isAuthenticated}
                  handleLogout={handleLogout}
                  loginWithRedirect={loginWithRedirect}
                />
              </Box>
            </Box>
          </Toolbar>
        </AppBar>
        <Routes>
          <Route
            path='/'
            exact
            element={isAuthenticated ? <Todos /> : <LogIn />}
          />
          <Route path='/callback' element={<Callback />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
        <ToastContainer position='top-right' autoClose={5000} hideProgressBar />
      </Container>
    </BrowserRouter>
  );
}
