import { Button, Row, Spin } from 'antd';
import React from 'react';

import { AzureAD, AuthenticationState } from 'react-aad-msal';
import { azureAuthProvider } from '../../utils/azureProvider';

export const Login: React.FC = () => {
  return (
    <>
      <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', backgroundColor: '#00274d', padding: '100px' }}>
          <h1 style={{ color: '#fff' }}>Welcome to MetrixData 360</h1>
          <br />
          <br />
          <AzureAD provider={azureAuthProvider}>
            {({ login, authenticationState }) => {
              switch (authenticationState) {
                case AuthenticationState.Unauthenticated:
                  return (
                    <Button type="primary" onClick={login}>
                      Login with Microsoft
                    </Button>
                  );
                case AuthenticationState.InProgress:
                  return <Spin />;
              }
            }}
          </AzureAD>
        </div>
      </Row>
    </>
  );
};
