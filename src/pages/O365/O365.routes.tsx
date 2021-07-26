import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import ability from '../../common/ability';
import { Action, Page } from '../../common/constants/pageAction';
import O365ActivationsUserDetail from './O365ActivationsUserDetail';
import O365ActiveUserDetail from './O365ActiveUserDetail';

const O365Routes: React.FC = () => {
  const match = useRouteMatch();

  return (
    <div className="o365">
      <Switch>
        {/* Active User Detail */}
        {ability.can(Action.View, Page.O365ActiveUserDetail) && <Route
          exact
          path={`${match.path}/o365-active-user-detail/:id`}
          component={O365ActiveUserDetail}
        />}
        {ability.can(Action.View, Page.O365ActiveUserDetail) && <Route
          exact
          path={`${match.path}/o365-active-user-detail`}
          component={O365ActiveUserDetail}
        />}

        {/* Activations User Detail */}
        {ability.can(Action.View, Page.O365ActivationsUserDetail) && <Route
          exact
          path={`${match.path}/o365-activations-user-detail/:id`}
          component={O365ActivationsUserDetail}
        />}
        {ability.can(Action.View, Page.O365ActivationsUserDetail) && <Route
          exact
          path={`${match.path}/o365-activations-user-detail`}
          component={O365ActivationsUserDetail}
        />}

        {/* keep least always */}
        <Route path={`${match.path}/*`}>
          <Redirect to={`/404`} />
        </Route>
      </Switch>
    </div>
  );
};

export default O365Routes;
