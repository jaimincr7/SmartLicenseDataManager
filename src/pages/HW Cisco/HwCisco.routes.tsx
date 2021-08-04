import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
// import CiscoSiteMatrix from './CiscoSiteMatrix';
// import ability from '../../common/ability';
// import { Action, Page } from '../../common/constants/pageAction';

const HwCiscoRoutes: React.FC = () => {
  const match = useRouteMatch();

  return (
    <div className="sqlServer">
      <Switch>
        {/* Site Matrix */}
        {/* {ability.can(Action.View, Page.HwCiscoSiteMatrix) && (
          <Route exact path={`${match.path}/cisco-site-matrix/:id`} component={CiscoSiteMatrix} />
        )}
        {ability.can(Action.View, Page.HwCiscoSiteMatrix) && (
          <Route exact path={`${match.path}/cisco-site-matrix`} component={CiscoSiteMatrix} />
        )} */}

        {/* keep least always */}
        <Route path={`${match.path}/*`}>
          <Redirect to={`/404`} />
        </Route>
      </Switch>
    </div>
  );
};

export default HwCiscoRoutes;
