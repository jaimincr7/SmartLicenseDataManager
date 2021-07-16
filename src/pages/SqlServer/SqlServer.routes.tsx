import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import SqlServerInventory from './SqlServerInventory';
import SqlServerEntitlements from './SqlServerEntitlements';
import SqlServerExclusions from './SqlServerExclusions';
import SqlServerLicense from './SqlServerLicense';
import EditSqlServerLicense from './SqlServerLicense/EditSqlServerLicense';
import SqlServerOverrides from './SqlServerOverrides';
import SqlServerPricing from './SqlServerPricing';

const SqlServerRoutes: React.FC = () => {
  const match = useRouteMatch();

  return (
    <div className="sqlServer">
      <Switch>
        {/* Exclusions */}
        <Route exact path={`${match.path}/exclusions`} component={SqlServerExclusions} />
        <Route exact path={`${match.path}/exclusions/:id`} component={SqlServerExclusions} />

        {/* License */}
        <Route exact path={`${match.path}/license/edit/:id`} component={EditSqlServerLicense} />
        <Route exact path={`${match.path}/license`} component={SqlServerLicense} />
        <Route exact path={`${match.path}/license/:id`} component={SqlServerLicense} />

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
        <Route exact path={`${match.path}/inventory/:id`} component={SqlServerInventory} />
        <Route exact path={`${match.path}/inventory`} component={SqlServerInventory} />

        {/* keep least always */}
        <Route path={`${match.path}/*`}>
          <Redirect to={`${match.path}/inventory`} />
        </Route>
      </Switch>
    </div>
  );
};

export default SqlServerRoutes;
