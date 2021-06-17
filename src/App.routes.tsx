import React from 'react';
import { Switch, withRouter } from 'react-router-dom';
import LayoutRoute from './common/components/Layout';
import MainLayout from './common/components/Layout/MainLayout';
import Home from './pages/Home';
import { PageNotFound } from './pages/PageNotFound';
import PageSpinner from './common/components/PageSpinner';
import SqlServerRoutes from './pages/SqlServer/SqlServer.routes';
import AddEvent from './pages/Home/AddEvent';

function AppRoutes() {
  return (
    <React.Suspense fallback={<PageSpinner />}>
      <Switch>
        <LayoutRoute exact path="/" layout={MainLayout} component={Home} />
        <LayoutRoute exact path="/add-event" layout={MainLayout} component={AddEvent} />
        <LayoutRoute path="/sql-server" layout={MainLayout} component={SqlServerRoutes} />

        {/* keep least always */}
        <LayoutRoute exact path="*" layout={MainLayout} component={PageNotFound} />
      </Switch>
    </React.Suspense>
  );
}

export default withRouter(AppRoutes);
