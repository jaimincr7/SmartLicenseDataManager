import React from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import LayoutRoute from './common/components/Layout';
import MainLayout from './common/components/Layout/MainLayout';
import Home from './pages/Home';
import { PageNotFound } from './pages/PageNotFound';
import PageSpinner from './common/components/PageSpinner';
import SqlServerRoutes from './pages/SqlServer/SqlServer.routes';
import AddEvent from './pages/Home/AddEvent';

import { AzureAD, AuthenticationState } from 'react-aad-msal';
import { azureAuthProvider } from './utils/azureProvider';
import { Login } from './pages/Login';
import { toast } from 'react-toastify';
import { store } from './store';

function AppRoutes() {
  return (
    <AzureAD provider={azureAuthProvider} reduxStore={store}>
      {({ authenticationState, error }) => {
        if (error) {
          toast.error(error);
        }
        switch (authenticationState) {
          case AuthenticationState.Authenticated:
            return (
              <React.Suspense fallback={<PageSpinner />}>
                <Switch>
                  <Route path="/login">
                    <Redirect to="/" />
                  </Route>
                  <LayoutRoute exact path="/" layout={MainLayout} component={Home} />
                  <LayoutRoute exact path="/add-event" layout={MainLayout} component={AddEvent} />
                  <LayoutRoute path="/sql-server" layout={MainLayout} component={SqlServerRoutes} />

                  {/* keep least always */}
                  <LayoutRoute exact path="*" layout={MainLayout} component={PageNotFound} />
                </Switch>
              </React.Suspense>
            );
          case AuthenticationState.Unauthenticated:
          case AuthenticationState.InProgress:
            return (
              <>
                <React.Suspense fallback={<PageSpinner />}>
                  <Switch>
                    <Route exact path="/login" component={Login} />
                    {/* keep least always */}
                    <Route path="*">
                      <Redirect to="/login" />
                    </Route>
                  </Switch>
                </React.Suspense>
              </>
            );
        }
      }}
    </AzureAD>
  );
}

export default withRouter(AppRoutes);
