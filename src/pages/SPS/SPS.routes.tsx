import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import ability from '../../common/ability';
import { Action, Page } from '../../common/constants/pageAction';
import SPSAPI from './APIs/index';

const SPSRoutes: React.FC = () => {
  const match = useRouteMatch();

  return (
    <div className="sqlServer">
      <Switch>
        {/* APIs */}
        {ability.can(Action.View, Page.SPSApi) && (
          <Route exact path={`${match.path}/sps-api`} component={SPSAPI} />
        )}

        {/* keep least always */}
        <Route path={`${match.path}/*`}>
          <Redirect to={`/404`} />
        </Route>
      </Switch>
    </div>
  );
};

export default SPSRoutes;
