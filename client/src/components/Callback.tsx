import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Backdrop, CircularProgress } from '@mui/material';

export function Callback() {
  const { isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        navigate('/');
      } else {
        navigate('/login');
      }
    }
  }, [isLoading, isAuthenticated, navigate]);

  return (
    <Backdrop open={true} style={{ zIndex: 1000 }}>
      <CircularProgress color='inherit' />
    </Backdrop>
  );
}
