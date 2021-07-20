import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import TabVCluster from './TabVCluster';

const RVToolsRoutes: React.FC = () => {
  const match = useRouteMatch();

  return (
    <div className="sqlServer">
      <Switch>
        {/* Tab-V-Cluster */}
        <Route exact path={`${match.path}/tab-v-cluster/:id`} component={TabVCluster} />
        <Route exact path={`${match.path}/tab-v-cluster`} component={TabVCluster} />

        {/* keep least always */}
        <Route path={`${match.path}/*`}>
          <Redirect to={`${match.path}/tab-v-cluster`} />
        </Route>
      </Switch>
    </div>
  );
};

export default RVToolsRoutes;
