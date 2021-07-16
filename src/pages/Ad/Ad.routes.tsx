import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import AdDevices from './AdDevices';
import AdDevicesExclusions from './AdDevicesExclusions';
import AdUsers from './AdUsers';

const AdRoutes: React.FC = () => {
  const match = useRouteMatch();

  return (
    <div className="ad">
      <Switch>
        {/* Ad Users */}
        <Route exact path={`${match.path}/ad-users/:id`} component={AdUsers} />
        <Route exact path={`${match.path}/ad-users`} component={AdUsers} />

        {/* Device Exclusions */}
        <Route
          exact
          path={`${match.path}/ad-devices-exclusions/:id`}
          component={AdDevicesExclusions}
        />
        <Route exact path={`${match.path}/ad-devices-exclusions`} component={AdDevicesExclusions} />

        {/* Ad Devices */}
        <Route exact path={`${match.path}/ad-devices/:id`} component={AdDevices} />
        <Route exact path={`${match.path}/ad-devices`} component={AdDevices} />

        {/* keep least always */}
        <Route path={`${match.path}/*`}>
          <Redirect to={`${match.path}/ad-devices`} />
        </Route>
      </Switch>
    </div>
  );
};

export default AdRoutes;
