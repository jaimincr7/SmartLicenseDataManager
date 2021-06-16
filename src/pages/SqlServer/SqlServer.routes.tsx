import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import SqlServer from './SqlServer';
import AddSqlServer from './SqlServer/AddSqlServer';

const SqlServerRoutes: React.FC = () => {
  const match = useRouteMatch();

  return (
    <div className="sqlServer">
      <Switch>
        <Route exact path={`${match.path}`} component={SqlServer} />
        <Route exact path={`${match.path}/edit/:id`} component={AddSqlServer} />
        <Route exact path={`${match.path}/add`} component={AddSqlServer} />
      </Switch>
    </div>
  );
};

export default SqlServerRoutes;
