import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import ability from '../../common/ability';
import { Action, Page } from '../../common/constants/pageAction';
import OperatingSystem from './OperatingSystem';
import Processor from './Processor';
import Virtualization from './Virtualization';

const CmdbRoutes: React.FC = () => {
  const match = useRouteMatch();

  return (
    <div className="sqlServer">
      <Switch>
        {/* Operating System */}
        {ability.can(Action.View, Page.CmdbOperatingSystem) && (
          <Route
            exact
            path={`${match.path}/cmdb-operating-system/:id`}
            component={OperatingSystem}
          />
        )}
        {ability.can(Action.View, Page.CmdbOperatingSystem) && (
          <Route exact path={`${match.path}/cmdb-operating-system`} component={OperatingSystem} />
        )}

        {/* Processor */}
        {ability.can(Action.View, Page.CmdbProcessor) && (
          <Route exact path={`${match.path}/cmdb-processor/:id`} component={Processor} />
        )}
        {ability.can(Action.View, Page.CmdbProcessor) && (
          <Route exact path={`${match.path}/cmdb-processor`} component={Processor} />
        )}

        {/* Virtualization */}
        {ability.can(Action.View, Page.CmdbVirtualization) && (
          <Route exact path={`${match.path}/cmdb-virtualization/:id`} component={Virtualization} />
        )}
        {ability.can(Action.View, Page.CmdbVirtualization) && (
          <Route exact path={`${match.path}/cmdb-virtualization`} component={Virtualization} />
        )}
        {/* keep least always */}
        <Route path={`${match.path}/*`}>
          <Redirect to={`/404`} />
        </Route>
      </Switch>
    </div>
  );
};

export default CmdbRoutes;
