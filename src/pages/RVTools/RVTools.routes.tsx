import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import ability from '../../common/ability';
import { Action, Page } from '../../common/constants/pageAction';
import TabVCluster from './TabVCluster';
import TabVHost from './TabVHost';
import TabVInfo from './TabVInfo';
import TabVLicense from './TabVLicense';

const RVToolsRoutes: React.FC = () => {
  const match = useRouteMatch();

  return (
    <div className="sqlServer">
      <Switch>
        {/* Tab-V-Cluster */}
        {ability.can(Action.View, Page.TabVCluster) && (
          <Route exact path={`${match.path}/tab-v-cluster/:id`} component={TabVCluster} />
        )}
        {ability.can(Action.View, Page.TabVCluster) && (
          <Route exact path={`${match.path}/tab-v-cluster`} component={TabVCluster} />
        )}

        {/* Tab-V-Host */}
        {ability.can(Action.View, Page.TabVHost) && (
          <Route exact path={`${match.path}/tab-v-host/:id`} component={TabVHost} />
        )}
        {ability.can(Action.View, Page.TabVHost) && (
          <Route exact path={`${match.path}/tab-v-host`} component={TabVHost} />
        )}

        {/* Tab-V-Info */}
        {ability.can(Action.View, Page.TabVInfo) && (
          <Route exact path={`${match.path}/tab-v-info/:id`} component={TabVInfo} />
        )}
        {ability.can(Action.View, Page.TabVInfo) && (
          <Route exact path={`${match.path}/tab-v-info`} component={TabVInfo} />
        )}

        {/* Tab-V-License */}
        {ability.can(Action.View, Page.TabVLicense) && (
          <Route exact path={`${match.path}/v-license/:id`} component={TabVLicense} />
        )}
        {ability.can(Action.View, Page.TabVLicense) && (
          <Route exact path={`${match.path}/v-license`} component={TabVLicense} />
        )}

        {/* keep least always */}
        <Route path={`${match.path}/*`}>
          <Redirect to={`/404`} />
        </Route>
      </Switch>
    </div>
  );
};

export default RVToolsRoutes;
