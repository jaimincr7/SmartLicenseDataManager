import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import AdDevices from './AdDevices';

const AdRoutes: React.FC = () => {
  const match = useRouteMatch();

  return (
    <div className="sqlServer">
      <Switch>
        {/* <Route exact path={`${match.path}/entitlements`} component={SqlServerEntitlements} />
        <Route exact path={`${match.path}/entitlements/:id`} component={SqlServerEntitlements} />
        <Route exact path={`${match.path}/update-from-excel`} component={ImportExcel} />
        <Route exact path={`${match.path}/:id`} component={SqlServer} /> */}

        {/* keep least always */}
        <Route exact path={`${match.path}`} component={AdDevices} />
      </Switch>
    </div>
  );
};

export default AdRoutes;
