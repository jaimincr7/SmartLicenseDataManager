import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import WindowsServerEntitlements from './WindowsServerEntitlements';
import WindowsServerExclusions from './WindowsServerExclusions';
import WindowsServerInventory from './WindowsServerInventory';
import WindowsServerOverrides from './WindowsServerOverrides';
import WindowsServerPricing from './WindowsServerPricing';

const WindowsServerRoutes: React.FC = () => {
  const match = useRouteMatch();

  return (
    <div className="windowsServer">
      <Switch>
        {/* Exclusions */}
        <Route exact path={`${match.path}/exclusions`} component={WindowsServerExclusions} />
        <Route exact path={`${match.path}/exclusions/:id`} component={WindowsServerExclusions} />

        {/* Pricing */}
        <Route exact path={`${match.path}/pricing`} component={WindowsServerPricing} />
        <Route exact path={`${match.path}/pricing/:id`} component={WindowsServerPricing} />

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
