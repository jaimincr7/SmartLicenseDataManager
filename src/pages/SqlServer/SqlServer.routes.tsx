import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import SqlServer from './SqlServer';
import ImportExcel from './SqlServer/ImportExcel';
import SqlServerEntitlements from './SqlServerEntitlements';
import SqlServerOverrides from './SqlServerOverrides';
import SqlServerPricing from './SqlServerPricing';

const SqlServerRoutes: React.FC = () => {
  const match = useRouteMatch();

  return (
    <div className="sqlServer">
      <Switch>
        {/* Pricing */}
        <Route exact path={`${match.path}/pricing`} component={SqlServerPricing} />
        <Route exact path={`${match.path}/pricing/:id`} component={SqlServerPricing} />

        {/* Overrides */}
        <Route exact path={`${match.path}/overrides`} component={SqlServerOverrides} />
        <Route exact path={`${match.path}/overrides/:id`} component={SqlServerOverrides} />

        {/* Entitlements */}
        <Route exact path={`${match.path}/entitlements`} component={SqlServerEntitlements} />
        <Route exact path={`${match.path}/entitlements/:id`} component={SqlServerEntitlements} />

        {/* Sql Server */}
        <Route exact path={`${match.path}/update-from-excel`} component={ImportExcel} />
        <Route exact path={`${match.path}/:id`} component={SqlServer} />

        {/* keep least always */}
        <Route exact path={`${match.path}`} component={SqlServer} />
      </Switch>
    </div>
  );
};

export default SqlServerRoutes;
