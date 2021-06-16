import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import SqlServer from './SqlServer';

const SqlServerRoutes: React.FC = () => {
  const match = useRouteMatch();

  return (
    <div className="sqlServer">
      <Switch>
        <Route exact path={`${match.path}`} component={SqlServer} />
      </Switch>
    </div>
  );
};

export default SqlServerRoutes;
