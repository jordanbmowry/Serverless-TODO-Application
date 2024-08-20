import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export function NotFound() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Container maxWidth='sm'>
      <Box
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
        minHeight='100vh'
        textAlign='center'
      >
        <Typography variant='h1' gutterBottom>
          404
        </Typography>
        <Typography variant='h4' gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant='body1' paragraph>
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </Typography>
        <Button variant='contained' color='primary' onClick={handleGoHome}>
          Go to Homepage
        </Button>
      </Box>
    </Container>
  );
}
