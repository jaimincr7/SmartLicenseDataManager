import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import WindowsServerEntitlements from './WindowsServerEntitlements';
import WindowsServerInventory from './WindowsServerInventory';
import WindowsServerOverrides from './WindowsServerOverrides';

const WindowsServerRoutes: React.FC = () => {
  const match = useRouteMatch();

  return (
    <div className="sqlServer">
      <Switch>
        {/* Overrides */}
        <Route exact path={`${match.path}/overrides`} component={WindowsServerOverrides} />
        <Route exact path={`${match.path}/overrides/:id`} component={WindowsServerOverrides} />

        {/* Entitlements */}
        <Route exact path={`${match.path}/entitlements`} component={WindowsServerEntitlements} />
        <Route
          exact
          path={`${match.path}/entitlements/:id`}
          component={WindowsServerEntitlements}
        />

        {/* Inventory */}
        <Route exact path={`${match.path}/inventory/:id`} component={WindowsServerInventory} />

        {/* keep least always */}
        <Route exact path={`${match.path}/inventory`} component={WindowsServerInventory} />
      </Switch>
    </div>
  );
};

export default WindowsServerRoutes;
