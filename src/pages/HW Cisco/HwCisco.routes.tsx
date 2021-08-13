import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import ability from '../../common/ability';
import { Action, Page } from '../../common/constants/pageAction';
import CiscoSiteMatrix from './CiscoSiteMatrix';
import CiscoHost from './CiscoHost';
import CiscoIB from './CiscoIB';
import CiscoPolicy from './CiscoPolicy';

const HwCiscoRoutes: React.FC = () => {
  const match = useRouteMatch();

  return (
    <div className="sqlServer">
      <Switch>
        {/* Site Matrix */}
        {ability.can(Action.View, Page.HwCiscoSiteMatrix) && (
          <Route exact path={`${match.path}/cisco-site-matrix/:id`} component={CiscoSiteMatrix} />
        )}
        {ability.can(Action.View, Page.HwCiscoSiteMatrix) && (
          <Route exact path={`${match.path}/cisco-site-matrix`} component={CiscoSiteMatrix} />
        )}

        {/* Host */}
        {ability.can(Action.View, Page.HwCiscoHost) && (
          <Route exact path={`${match.path}/cisco-host/:id`} component={CiscoHost} />
        )}
        {ability.can(Action.View, Page.HwCiscoHost) && (
          <Route exact path={`${match.path}/cisco-host`} component={CiscoHost} />
        )}
        {/* IB */}
        {ability.can(Action.View, Page.HwCiscoIB) && (
          <Route exact path={`${match.path}/cisco-ib/:id`} component={CiscoIB} />
        )}
        {ability.can(Action.View, Page.HwCiscoIB) && (
          <Route exact path={`${match.path}/cisco-ib`} component={CiscoIB} />
        )}

        {/* Policy */}
        {ability.can(Action.View, Page.HwCiscoPolicy) && (
          <Route exact path={`${match.path}/cisco-policy/:id`} component={CiscoPolicy} />
        )}
        {ability.can(Action.View, Page.HwCiscoPolicy) && (
          <Route exact path={`${match.path}/cisco-policy`} component={CiscoPolicy} />
        )}

        {/* keep least always */}
        <Route path={`${match.path}/*`}>
          <Redirect to={`/404`} />
        </Route>
      </Switch>
    </div>
  );
};

export default HwCiscoRoutes;
