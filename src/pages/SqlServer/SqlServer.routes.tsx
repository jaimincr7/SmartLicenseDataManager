import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import SqlServer from './SqlServer';
import ImportExcel from './SqlServer/ImportExcel';
import SqlServerEntitlements from './SqlServerEntitlements';
import SqlServerOverrides from './SqlServerOverrides';

const SqlServerRoutes: React.FC = () => {
  const match = useRouteMatch();

  return (
    <div className="sqlServer">
      <Switch>
        {/* <Route exact path={`${match.path}/overrides/update-from-excel`} component={ImportExcelOverrides} /> */}
        <Route exact path={`${match.path}/overrides`} component={SqlServerOverrides} />
        <Route exact path={`${match.path}/overrides/:id`} component={SqlServerOverrides} />
        <Route exact path={`${match.path}/entitlements`} component={SqlServerEntitlements} />
        <Route exact path={`${match.path}/entitlements/:id`} component={SqlServerEntitlements} />
        <Route exact path={`${match.path}/update-from-excel`} component={ImportExcel} />
        <Route exact path={`${match.path}/:id`} component={SqlServer} />

        {/* keep least always */}
        <Route exact path={`${match.path}`} component={SqlServer} />
      </Switch>
    </div>
  );
};

export default SqlServerRoutes;
