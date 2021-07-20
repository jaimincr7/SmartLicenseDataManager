import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import TabVCluster from './TabVCluster';
import TabVHost from './TabVHost';
import TabVInfo from './TabVInfo';

const RVToolsRoutes: React.FC = () => {
  const match = useRouteMatch();

  return (
    <div className="sqlServer">
      <Switch>
        {/* Tab-V-Cluster */}
        <Route exact path={`${match.path}/tab-v-cluster/:id`} component={TabVCluster} />
        <Route exact path={`${match.path}/tab-v-cluster`} component={TabVCluster} />

        {/* Tab-V-Host */}
        <Route exact path={`${match.path}/tab-v-host/:id`} component={TabVHost} />
        <Route exact path={`${match.path}/tab-v-host`} component={TabVHost} />

        {/* Tab-V-Info */}
        <Route exact path={`${match.path}/tab-v-info/:id`} component={TabVInfo} />
        <Route exact path={`${match.path}/tab-v-info`} component={TabVInfo} />

        {/* keep least always */}
        <Route path={`${match.path}/*`}>
          <Redirect to={`${match.path}/tab-v-cluster`} />
        </Route>
      </Switch>
    </div>
  );
};

export default RVToolsRoutes;
