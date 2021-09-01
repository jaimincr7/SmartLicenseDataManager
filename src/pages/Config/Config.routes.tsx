import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import ability from '../../common/ability';
import { Action, Page } from '../../common/constants/pageAction';
import Component from './Component';

const ConfigRoutes: React.FC = () => {
  const match = useRouteMatch();

  return (
    <div className="sqlServer">
      <Switch>
        {/* Component */}
        {ability.can(Action.View, Page.ConfigComponent) && (
          <Route exact path={`${match.path}/config-component/:id`} component={Component} />
        )}
        {ability.can(Action.View, Page.ConfigComponent) && (
          <Route exact path={`${match.path}/config-component`} component={Component} />
        )}

        {/* keep least always */}
        <Route path={`${match.path}/*`}>
          <Redirect to={`/404`} />
        </Route>
      </Switch>
    </div>
  );
};

export default ConfigRoutes;
