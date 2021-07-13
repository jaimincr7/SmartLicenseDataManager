import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import BU from './BU';
import Company from './Company';
import MenuRights from './MenuRights';
import Tenant from './Tenant';

const WindowsServerRoutes: React.FC = () => {
  const match = useRouteMatch();

  return (
    <div className="windowsServer">
      <Switch>
        {/* BU */}
        <Route exact path={`${match.path}/bu`} component={BU} />
        <Route exact path={`${match.path}/bu/:id`} component={BU} />

        {/* Tenant */}
        <Route exact path={`${match.path}/tenant`} component={Tenant} />
        <Route exact path={`${match.path}/tenant/:id`} component={Tenant} />

        {/* Company */}
        <Route exact path={`${match.path}/company`} component={Company} />
        <Route exact path={`${match.path}/company/:id`} component={Company} />

        {/* Exclusions */}
        <Route exact path={`${match.path}/menu-rights`} component={MenuRights} />

        {/* keep least always */}
        <Route exact path={`${match.path}/menu-rights`} component={MenuRights} />
      </Switch>
    </div>
  );
};

export default WindowsServerRoutes;
