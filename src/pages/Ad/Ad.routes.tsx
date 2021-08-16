import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import ability from '../../common/ability';
import { Action, Page } from '../../common/constants/pageAction';
import AdDevices from './AdDevices';
import AdDevicesExclusions from './AdDevicesExclusions';
import AdUsers from './AdUsers';
import AdUsersExclusions from './AdUsersExclusions';

const AdRoutes: React.FC = () => {
  const match = useRouteMatch();

  return (
    <div className="ad">
      <Switch>
        {/* Ad Users */}
        {ability.can(Action.View, Page.ADUsers) && (
          <Route exact path={`${match.path}/ad-users/:id`} component={AdUsers} />
        )}
        {ability.can(Action.View, Page.ADUsers) && (
          <Route exact path={`${match.path}/ad-users`} component={AdUsers} />
        )}

        {/* Device Exclusions */}
        {ability.can(Action.View, Page.ADExclusions) && (
          <Route
            exact
            path={`${match.path}/ad-devices-exclusions/:id`}
            component={AdDevicesExclusions}
          />
        )}
        {ability.can(Action.View, Page.ADExclusions) && (
          <Route
            exact
            path={`${match.path}/ad-devices-exclusions`}
            component={AdDevicesExclusions}
          />
        )}

        {/* Ad Devices */}
        {ability.can(Action.View, Page.ADDevices) && (
          <Route exact path={`${match.path}/ad-devices/:id`} component={AdDevices} />
        )}
        {ability.can(Action.View, Page.ADDevices) && (
          <Route exact path={`${match.path}/ad-devices`} component={AdDevices} />
        )}

        {/* Ad UsersExclusions */}
        {ability.can(Action.View, Page.AdUsersExclusions) && (
          <Route
            exact
            path={`${match.path}/ad-users-exclusions/:id`}
            component={AdUsersExclusions}
          />
        )}
        {ability.can(Action.View, Page.AdUsersExclusions) && (
          <Route exact path={`${match.path}/ad-users-exclusions`} component={AdUsersExclusions} />
        )}
        {/* keep least always */}
        <Route path={`${match.path}/*`}>
          <Redirect to={`/404`} />
        </Route>
      </Switch>
    </div>
  );
};

export default AdRoutes;
