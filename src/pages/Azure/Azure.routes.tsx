import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import AzureDailyUsage from './AzureDailyUsage';

const AzureRoutes: React.FC = () => {
  const match = useRouteMatch();

  return (
    <div className="azure">
      <Switch>
        {/* Azure daily usage */}
        <Route exact path={`${match.path}/azure-daily-usage/:id`} component={AzureDailyUsage} />
        <Route exact path={`${match.path}/azure-daily-usage`} component={AzureDailyUsage} />

        {/* keep least always */}
        <Route path={`${match.path}/*`}>
          <Redirect to={`${match.path}/inventory`} />
        </Route>
      </Switch>
    </div>
  );
};

export default AzureRoutes;
