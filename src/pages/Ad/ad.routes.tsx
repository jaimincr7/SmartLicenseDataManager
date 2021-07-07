import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import AdDevices from './AdDevices';
import AdDevicesExclusions from './AdDevicesExclusions';
import AdUsers from './AdUsers';

const AdRoutes: React.FC = () => {
  const match = useRouteMatch();

  return (
    <div className="ad">
      <Switch>
        <Route exact path={`${match.path}/ad-users/:id`} component={AdUsers} />
        <Route exact path={`${match.path}/ad-users`} component={AdUsers} />

        <Route
          exact
          path={`${match.path}/ad-devices-exclusions/:id`}
          component={AdDevicesExclusions}
        />
        <Route exact path={`${match.path}/ad-devices-exclusions`} component={AdDevicesExclusions} />

        <Route exact path={`${match.path}/ad-devices/:id`} component={AdDevices} />

        {/* keep least always */}
        <Route exact path={`${match.path}/ad-devices`} component={AdDevices} />
      </Switch>
    </div>
  );
};

export default AdRoutes;
