import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import MenuRights from './MenuRights';

const WindowsServerRoutes: React.FC = () => {
  const match = useRouteMatch();

  return (
    <div className="windowsServer">
      <Switch>
        {/* Exclusions */}
        <Route exact path={`${match.path}/menu-rights`} component={MenuRights} />

        {/* keep least always */}
        <Route exact path={`${match.path}/menu-rights`} component={MenuRights} />
      </Switch>
    </div>
  );
};

export default WindowsServerRoutes;
