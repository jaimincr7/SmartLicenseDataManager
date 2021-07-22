import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import AzureAPIVmSizes from './AzureAPIVmSizes';
import AzureDailyUsage from './AzureDailyUsage';
import AzureRateCard from './AzureRateCard';

const AzureRoutes: React.FC = () => {
  const match = useRouteMatch();

  return (
    <div className="azure">
      <Switch>
        {/* Azure daily usage */}
        <Route exact path={`${match.path}/azure-daily-usage/:id`} component={AzureDailyUsage} />
        <Route exact path={`${match.path}/azure-daily-usage`} component={AzureDailyUsage} />

        {/* Azure rate card */}
        <Route exact path={`${match.path}/azure-rate-card/:id`} component={AzureRateCard} />
        <Route exact path={`${match.path}/azure-rate-card`} component={AzureRateCard} />

        {/* Azure api vm sizes */}
        <Route exact path={`${match.path}/azure-api-vm-sizes/:id`} component={AzureAPIVmSizes} />
        <Route exact path={`${match.path}/azure-api-vm-sizes`} component={AzureAPIVmSizes} />

        {/* keep least always */}
        <Route path={`${match.path}/*`}>
          <Redirect to={`${match.path}/azure-daily-usage`} />
        </Route>
      </Switch>
    </div>
  );
};

export default AzureRoutes;
