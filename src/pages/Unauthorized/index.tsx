import { AuthenticatedTemplate } from '@azure/msal-react';
import { Button, Result } from 'antd';
import React from 'react';
import { toast } from 'react-toastify';
import { useAppDispatch } from '../../store/app.hooks';
import { clearGlobalSearch } from '../../store/globalSearch/globalSearch.reducer';
import { msalInstance } from '../../utils/authConfig';

export const UnauthorizedPage: React.FC = () => {
  const instance = msalInstance;
  const dispatch = useAppDispatch();

  function handleLogout() {
    dispatch(clearGlobalSearch());
    instance.logoutRedirect().catch((e: Error) => {
      toast.error(e.message);
    });
  }

  return (
    <div>
      <Result
        status="warning"
        title="Unauthorized to access"
        extra={
          <AuthenticatedTemplate>
            <Button type="primary" onClick={() => handleLogout()}>
              {' '}
              Logout and continue
            </Button>
          </AuthenticatedTemplate>
        }
      />
    </div>
  );
};
