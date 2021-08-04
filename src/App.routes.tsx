import React from 'react';
import { Redirect, Route, Switch, useHistory, withRouter } from 'react-router-dom';
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
import UserRoutes from './pages/User/User.routes';
import ReportRoutes from './pages/Report/Report.routes';
import RVToolsRoutes from './pages/RVTools/RVTools.routes';
import AzureRoutes from './pages/Azure/Azure.routes';
import O365Routes from './pages/O365/O365.routes';
import { UnauthorizedPage } from './pages/Unauthorized';
import { InternalServerError } from './pages/InternalServerError';
import { AccessDeniedPage } from './pages/AccessDenied';
import HwCiscoRoutes from './pages/HW Cisco/HwCisco.routes';
import { setResponseError } from './utils/request';

function AppRoutes() {
  const history = useHistory();

  React.useEffect(() => {
    setResponseError(history);
  }, []);

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
          <LayoutRoute path="/sql-server" layout={MainLayout} component={SqlServerRoutes} />
          <LayoutRoute path="/ad" layout={MainLayout} component={AdRoutes} />
          <LayoutRoute path="/data-input" layout={MainLayout} component={DataInputRoutes} />
          <LayoutRoute path="/windows-server" layout={MainLayout} component={WindowsServerRoutes} />
          <LayoutRoute path="/user" layout={MainLayout} component={UserRoutes} />
          <LayoutRoute path="/report" layout={MainLayout} component={ReportRoutes} />
          <LayoutRoute path="/rv-tools" layout={MainLayout} component={RVToolsRoutes} />
          <LayoutRoute path="/azure" layout={MainLayout} component={AzureRoutes} />
          <LayoutRoute path="/o365" layout={MainLayout} component={O365Routes} />
          <LayoutRoute path="/hw-cisco" layout={MainLayout} component={HwCiscoRoutes} />

          {/* Dummy routes for designers */}
          <LayoutRoute exact path="/home" layout={MainLayout} component={Home} />
          <LayoutRoute exact path="/add-event" layout={MainLayout} component={AddEvent} />
          <LayoutRoute path="/upload-excel" layout={MainLayout} component={UploadExcel} />

          {/* keep least always */}
          <Route exact path="/401" component={UnauthorizedPage} />
          <Route exact path="/500" component={InternalServerError} />
          <Route exact path="/403" component={AccessDeniedPage} />
          <LayoutRoute exact path="*" layout={MainLayout} component={PageNotFound} />
        </Switch>
      </AuthenticatedTemplate>
    </React.Suspense>
  );
}

export default withRouter(AppRoutes);
