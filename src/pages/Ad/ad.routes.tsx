import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import AdDevices from './AdDevices';
import ImportExcelExclusions from './AdDevicesExclusions/ImportExcel';
import ImportExcel from './AdDevices/ImportExcel';
import AdDevicesExclusions from './AdDevicesExclusions';

const AdRoutes: React.FC = () => {
  const match = useRouteMatch();

  return (
    <div className="sqlServer">
      <Switch>
        <Route
          exact
          path={`${match.path}/ad-devices-exclusions/update-from-excel`}
          component={ImportExcelExclusions}
        />
        <Route
          exact
          path={`${match.path}/ad-devices-exclusions/:id`}
          component={AdDevicesExclusions}
        />
        <Route exact path={`${match.path}/ad-devices-exclusions`} component={AdDevicesExclusions} />

        <Route exact path={`${match.path}/ad-devices/update-from-excel`} component={ImportExcel} />
        <Route exact path={`${match.path}/ad-devices/:id`} component={AdDevices} />

        {/* keep least always */}
        <Route exact path={`${match.path}/ad-devices`} component={AdDevices} />
      </Switch>
    </div>
  );
};

export default AdRoutes;
