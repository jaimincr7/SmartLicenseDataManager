import { Button, Row } from 'antd';
import React from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../../utils/authConfig';
import { toast } from 'react-toastify';

export const Login: React.FC = () => {
  const { instance } = useMsal();

  function handleLogin(instance) {
    instance.loginRedirect(loginRequest).catch((e: Error) => {
      toast.error(e.message);
    });
  }

  return (
    <>
      <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', backgroundColor: '#00274d', padding: '100px' }}>
          <h1 style={{ color: '#fff' }}>Welcome to MetrixData 360</h1>
          <br />
          <br />
          <Button type="primary" onClick={() => handleLogin(instance)}>
            Login with Microsoft
          </Button>
        </div>
      </Row>
    </>
  );
};
