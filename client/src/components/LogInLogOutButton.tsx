// @ts-nocheck

import { Button } from '@mui/material';

export function LogInLogOutButton({
  isAuthenticated,
  handleLogout,
  loginWithRedirect,
}) {
  return isAuthenticated ? (
    <Button color='inherit' onClick={handleLogout}>
      Log Out
    </Button>
  ) : (
    <Button color='inherit' onClick={() => loginWithRedirect()}>
      Log In
    </Button>
  );
}
