import React from 'react';
import { Route } from 'react-router-dom';
import { useMsal, useAccount } from '@azure/msal-react';
import { loginRequest } from '../../../utils/authConfig';
import { InteractionRequiredAuthError } from '@azure/msal-browser';

const LayoutRoute: React.FC<any> = ({ component: Component, layout: Layout, ...rest }) => {
  const { instance, accounts, inProgress } = useMsal();
  const [accessToken, setAccessToken] = React.useState(null);
  const account = useAccount(accounts[0] || {});

  function RequestAccessToken() {
    const request = {
      ...loginRequest,
      account: accounts[0],
    } as any;

    // Silently acquires an access token which is then attached to a request for Microsoft Graph data
    instance
      .acquireTokenSilent(request)
      .then((response) => {
        setAccessToken(response.accessToken);
      })
      .catch((e) => {
        if (e instanceof InteractionRequiredAuthError) {
          if (account && inProgress === 'none') {
            instance.acquireTokenPopup(request).then((response) => {
              setAccessToken(response.accessToken);
            });
          }
        }
      });
  }

  React.useEffect(() => {
    RequestAccessToken();
  }, [account, instance]);

  React.useEffect(() => {
    localStorage.setItem('accessToken', accessToken);
  }, [accessToken]);

  return (
    <Route
      {...rest}
      render={(props) => <Layout>{accessToken && <Component {...props} />}</Layout>}
    />
  );
};

export default LayoutRoute;
