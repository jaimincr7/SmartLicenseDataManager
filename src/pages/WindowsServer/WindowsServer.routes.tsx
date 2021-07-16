import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import WindowsServerEntitlements from './WindowsServerEntitlements';
import WindowsServerExclusions from './WindowsServerExclusions';
import WindowsServerInventory from './WindowsServerInventory';
import WindowsServerLicense from './WindowsServerLicense';
import EditWindowsServerLicense from './WindowsServerLicense/EditWindowsServerLicense';
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

        {/* License */}
        <Route exact path={`${match.path}/license/edit/:id`} component={EditWindowsServerLicense} />
        <Route exact path={`${match.path}/license`} component={WindowsServerLicense} />
        <Route exact path={`${match.path}/license/:id`} component={WindowsServerLicense} />

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
        <Route exact path={`${match.path}/inventory`} component={WindowsServerInventory} />

        {/* keep least always */}
        <Route path={`${match.path}/*`}>
          <Redirect to={`${match.path}/inventory`} />
        </Route>
      </Switch>
    </div>
  );
};

export default WindowsServerRoutes;
