import React from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import LayoutRoute from './common/components/Layout';
import MainLayout from './common/components/Layout/MainLayout';
import Home from './pages/Home';
import { PageNotFound } from './pages/PageNotFound';
import PageSpinner from './common/components/PageSpinner';
import SqlServerRoutes from './pages/SqlServer/SqlServer.routes';
import AddEvent from './pages/Home/AddEvent';
import { Login } from './pages/Login';
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import UploadExcel from './pages/Home/UploadExcel';
import { Dashboard } from './pages/Dashboard';
import DataInputRoutes from './pages/DataInput/DataInput.routes';
import WindowsServerRoutes from './pages/WindowsServer/WindowsServer.routes';
import AdRoutes from './pages/Ad/Ad.routes';

function AppRoutes() {
  return (
    <React.Suspense fallback={<PageSpinner />}>
      <UnauthenticatedTemplate>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route path="*">
            <Redirect to="/login" />
          </Route>
        </Switch>
      </UnauthenticatedTemplate>
      <AuthenticatedTemplate>
        <Switch>
          <Route path="/login">
            <Redirect to="/" />
          </Route>
          <LayoutRoute exact path="/" layout={MainLayout} component={Dashboard} />
          <LayoutRoute exact path="/home" layout={MainLayout} component={Home} />
          <LayoutRoute exact path="/add-event" layout={MainLayout} component={AddEvent} />
          <LayoutRoute path="/sql-server" layout={MainLayout} component={SqlServerRoutes} />
          <LayoutRoute path="/ad" layout={MainLayout} component={AdRoutes} />
          <LayoutRoute path="/upload-excel" layout={MainLayout} component={UploadExcel} />
          <LayoutRoute path="/data-input" layout={MainLayout} component={DataInputRoutes} />
          <LayoutRoute path="/windows-server" layout={MainLayout} component={WindowsServerRoutes} />

          {/* keep least always */}
          <LayoutRoute exact path="*" layout={MainLayout} component={PageNotFound} />
        </Switch>
      </AuthenticatedTemplate>
    </React.Suspense>
  );
}

export default withRouter(AppRoutes);
