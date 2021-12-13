import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import ability from '../../common/ability';
import { Action, Page } from '../../common/constants/pageAction';
import RenderReport from './RenderReport';
import Configuration from './Configuration';

const PowerBiReportsRoutes: React.FC = () => {
  const match = useRouteMatch();
  return (
    <div className="windowsServer">
      <Switch>
        {/*Configuration*/}
        {ability.can(Action.View, Page.PowerBIConfig) && (
          <Route exact path={`${match.path}/config`} component={Configuration} />
        )}
        {ability.can(Action.View, Page.PowerBIConfig) && (
          <Route exact path={`${match.path}/config/:id`} component={Configuration} />
        )}
        <Route exact path={`${match.path}/:name`} component={RenderReport} />

        {/* keep least always */}
        <Route path={`${match.path}/*`}>
          <Redirect to={`/404`} />
        </Route>
      </Switch>
    </div>
  );
};

export default PowerBiReportsRoutes;
