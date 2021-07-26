import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import ability from '../../common/ability';
import { Action, Page } from '../../common/constants/pageAction';
import AzureAPIVmSizes from './AzureAPIVmSizes';
import AzureDailyUsage from './AzureDailyUsage';
import AzureRateCard from './AzureRateCard';

const AzureRoutes: React.FC = () => {
  const match = useRouteMatch();

  return (
    <div className="azure">
      <Switch>
        {/* Azure daily usage */}
        {ability.can(Action.View, Page.AzureDailyUsage) && (
          <Route exact path={`${match.path}/azure-daily-usage/:id`} component={AzureDailyUsage} />
        )}
        {ability.can(Action.View, Page.AzureDailyUsage) && (
          <Route exact path={`${match.path}/azure-daily-usage`} component={AzureDailyUsage} />
        )}

        {/* Azure rate card */}
        {ability.can(Action.View, Page.AzureRateCard) && (
          <Route exact path={`${match.path}/azure-rate-card/:id`} component={AzureRateCard} />
        )}
        {ability.can(Action.View, Page.AzureRateCard) && (
          <Route exact path={`${match.path}/azure-rate-card`} component={AzureRateCard} />
        )}

        {/* Azure api vm sizes */}
        {ability.can(Action.View, Page.AzureAPIVmSizes) && (
          <Route exact path={`${match.path}/azure-api-vm-sizes/:id`} component={AzureAPIVmSizes} />
        )}
        {ability.can(Action.View, Page.AzureAPIVmSizes) && (
          <Route exact path={`${match.path}/azure-api-vm-sizes`} component={AzureAPIVmSizes} />
        )}

        {/* keep least always */}
        <Route path={`${match.path}/*`}>
          <Redirect to={`/404`} />
        </Route>
      </Switch>
    </div>
  );
};

export default AzureRoutes;
