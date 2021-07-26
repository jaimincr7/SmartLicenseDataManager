import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import SqlServerInventory from './SqlServerInventory';
import SqlServerEntitlements from './SqlServerEntitlements';
import SqlServerExclusions from './SqlServerExclusions';
import SqlServerLicense from './SqlServerLicense';
import EditSqlServerLicense from './SqlServerLicense/EditSqlServerLicense';
import SqlServerOverrides from './SqlServerOverrides';
import SqlServerPricing from './SqlServerPricing';
import ability from '../../common/ability';
import { Action, Page } from '../../common/constants/pageAction';

const SqlServerRoutes: React.FC = () => {
  const match = useRouteMatch();

  return (
    <div className="sqlServer">
      <Switch>
        {/* Exclusions */}
        {ability.can(Action.View, Page.SqlServerExclusions) && (
          <Route exact path={`${match.path}/exclusions`} component={SqlServerExclusions} />
        )}
        {ability.can(Action.View, Page.SqlServerExclusions) && (
          <Route exact path={`${match.path}/exclusions/:id`} component={SqlServerExclusions} />
        )}

        {/* License */}
        {ability.can(Action.View, Page.SqlServerLicense) && (
          <Route exact path={`${match.path}/license/edit/:id`} component={EditSqlServerLicense} />
        )}
        {ability.can(Action.View, Page.SqlServerLicense) && (
          <Route exact path={`${match.path}/license`} component={SqlServerLicense} />
        )}
        {ability.can(Action.View, Page.SqlServerLicense) && (
          <Route exact path={`${match.path}/license/:id`} component={SqlServerLicense} />
        )}

        {/* Pricing */}
        {ability.can(Action.View, Page.SqlServerPricing) && (
          <Route exact path={`${match.path}/pricing`} component={SqlServerPricing} />
        )}
        {ability.can(Action.View, Page.SqlServerPricing) && (
          <Route exact path={`${match.path}/pricing/:id`} component={SqlServerPricing} />
        )}

        {/* Overrides */}
        {ability.can(Action.View, Page.SqlServerOverrides) && (
          <Route exact path={`${match.path}/overrides`} component={SqlServerOverrides} />
        )}
        {ability.can(Action.View, Page.SqlServerOverrides) && (
          <Route exact path={`${match.path}/overrides/:id`} component={SqlServerOverrides} />
        )}

        {/* Entitlements */}
        {ability.can(Action.View, Page.SqlServerEntitlement) && (
          <Route exact path={`${match.path}/entitlements`} component={SqlServerEntitlements} />
        )}
        {ability.can(Action.View, Page.SqlServerEntitlement) && (
          <Route exact path={`${match.path}/entitlements/:id`} component={SqlServerEntitlements} />
        )}

        {/* Sql Server */}
        {ability.can(Action.View, Page.SqlServerInventory) && (
          <Route exact path={`${match.path}/inventory/:id`} component={SqlServerInventory} />
        )}
        {ability.can(Action.View, Page.SqlServerInventory) && (
          <Route exact path={`${match.path}/inventory`} component={SqlServerInventory} />
        )}

        {/* keep least always */}
        <Route path={`${match.path}/*`}>
          <Redirect to={`/404`} />
        </Route>
      </Switch>
    </div>
  );
};

export default SqlServerRoutes;
