import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import ability from '../../common/ability';
import { Action, Page } from '../../common/constants/pageAction';
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
        {ability.can(Action.View, Page.WindowsServerExclusions) && (
          <Route exact path={`${match.path}/exclusions`} component={WindowsServerExclusions} />
        )}
        {ability.can(Action.View, Page.WindowsServerExclusions) && (
          <Route exact path={`${match.path}/exclusions/:id`} component={WindowsServerExclusions} />
        )}

        {/* License */}
        {ability.can(Action.View, Page.WindowsServerLicense) && (
          <Route
            exact
            path={`${match.path}/license/edit/:id`}
            component={EditWindowsServerLicense}
          />
        )}
        {ability.can(Action.View, Page.WindowsServerLicense) && (
          <Route exact path={`${match.path}/license`} component={WindowsServerLicense} />
        )}
        {ability.can(Action.View, Page.WindowsServerLicense) && (
          <Route exact path={`${match.path}/license/:id`} component={WindowsServerLicense} />
        )}

        {/* Pricing */}
        {ability.can(Action.View, Page.WindowsServerPricing) && (
          <Route exact path={`${match.path}/pricing`} component={WindowsServerPricing} />
        )}
        {ability.can(Action.View, Page.WindowsServerPricing) && (
          <Route exact path={`${match.path}/pricing/:id`} component={WindowsServerPricing} />
        )}

        {/* Overrides */}
        {ability.can(Action.View, Page.WindowsServerOverrides) && (
          <Route exact path={`${match.path}/overrides`} component={WindowsServerOverrides} />
        )}
        {ability.can(Action.View, Page.WindowsServerOverrides) && (
          <Route exact path={`${match.path}/overrides/:id`} component={WindowsServerOverrides} />
        )}

        {/* Entitlements */}
        {ability.can(Action.View, Page.WindowsServerEntitlement) && (
          <Route exact path={`${match.path}/entitlements`} component={WindowsServerEntitlements} />
        )}
        {ability.can(Action.View, Page.WindowsServerEntitlement) && (
          <Route
            exact
            path={`${match.path}/entitlements/:id`}
            component={WindowsServerEntitlements}
          />
        )}

        {/* Inventory */}
        {ability.can(Action.View, Page.WindowsServerInventory) && (
          <Route exact path={`${match.path}/inventory/:id`} component={WindowsServerInventory} />
        )}
        {ability.can(Action.View, Page.WindowsServerInventory) && (
          <Route exact path={`${match.path}/inventory`} component={WindowsServerInventory} />
        )}

        {/* keep least always */}
        <Route path={`${match.path}/*`}>
          <Redirect to={`/404`} />
        </Route>
      </Switch>
    </div>
  );
};

export default WindowsServerRoutes;
