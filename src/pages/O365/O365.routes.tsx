import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import O365ActivationsUserDetail from './O365ActivationsUserDetail';
import O365ActiveUserDetail from './O365ActiveUserDetail';

const O365Routes: React.FC = () => {
  const match = useRouteMatch();

  return (
    <div className="o365">
      <Switch>
        {/* Active User Detail */}
        <Route
          exact
          path={`${match.path}/o365-active-user-detail/:id`}
          component={O365ActiveUserDetail}
        />
        <Route
          exact
          path={`${match.path}/o365-active-user-detail`}
          component={O365ActiveUserDetail}
        />

        {/* Activations User Detail */}
        <Route
          exact
          path={`${match.path}/o365-activations-user-detail/:id`}
          component={O365ActivationsUserDetail}
        />
        <Route
          exact
          path={`${match.path}/o365-activations-user-detail`}
          component={O365ActivationsUserDetail}
        />

        {/* keep least always */}
        <Route path={`${match.path}/*`}>
          <Redirect to={`${match.path}/o365-activations-user-detail`} />
        </Route>
      </Switch>
    </div>
  );
};

export default O365Routes;
