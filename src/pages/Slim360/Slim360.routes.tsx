import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import ability from '../../common/ability';
import { Action, Page } from '../../common/constants/pageAction';
import O365Licenses from './O365Licenses';
import O365UserLicenses from './O365UserLicenses';
import O365UserPlans from './O365UserPlans';

const Slim360Routes: React.FC = () => {
  const match = useRouteMatch();

  return (
    <div className="slim360">
      <Switch>
        {/* o365Licenses */}
        {ability.can(Action.View, Page.Slim360O365Licenses) && (
          <Route exact path={`${match.path}/slim360-o365-licenses/:id`} component={O365Licenses} />
        )}
        {ability.can(Action.View, Page.Slim360O365Licenses) && (
          <Route exact path={`${match.path}/slim360-o365-licenses`} component={O365Licenses} />
        )}

        {/* o365UserLicenses */}
        {ability.can(Action.View, Page.Slim360O365UserLicenses) && (
          <Route
            exact
            path={`${match.path}/slim360-o365-user-licenses/:id`}
            component={O365UserLicenses}
          />
        )}
        {ability.can(Action.View, Page.Slim360O365UserLicenses) && (
          <Route
            exact
            path={`${match.path}/slim360-o365-user-licenses`}
            component={O365UserLicenses}
          />
        )}

        {/* o365UserPlans */}
        {ability.can(Action.View, Page.Slim360O365UserPlans) && (
          <Route
            exact
            path={`${match.path}/slim360-o365-user-plans/:id`}
            component={O365UserPlans}
          />
        )}
        {ability.can(Action.View, Page.Slim360O365UserPlans) && (
          <Route exact path={`${match.path}/slim360-o365-user-plans`} component={O365UserPlans} />
        )}

        {/* keep least always */}
        <Route path={`${match.path}/*`}>
          <Redirect to={`/404`} />
        </Route>
      </Switch>
    </div>
  );
};

export default Slim360Routes;
