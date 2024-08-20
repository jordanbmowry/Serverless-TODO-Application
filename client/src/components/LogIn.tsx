import { useAuth0 } from '@auth0/auth0-react';
import { Button, Typography, Box } from '@mui/material';

export const LogIn = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Box textAlign='center'>
      <Typography variant='h4'>Please log in</Typography>
      <Button
        onClick={() => loginWithRedirect()}
        size='large'
        variant='contained'
        color='primary'
        sx={{ mt: 4 }}
      >
        Log in
      </Button>
    </Box>
  );
};
