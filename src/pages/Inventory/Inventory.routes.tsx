import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import ability from '../../common/ability';
import { Action, Page } from '../../common/constants/pageAction';
import Device from './Device';
import DeviceState from './DeviceState';
import Inventory from './Inventory';

const InventoryRoutes: React.FC = () => {
  const match = useRouteMatch();

  return (
    <div className="sqlServer">
      <Switch>
        {/* Inventory */}
        {ability.can(Action.View, Page.Inventory) && (
          <Route exact path={`${match.path}/inventory`} component={Inventory} />
        )}
        {ability.can(Action.View, Page.Inventory) && (
          <Route exact path={`${match.path}/inventory/:id`} component={Inventory} />
        )}

        {/* Devices */}
        {ability.can(Action.View, Page.Device) && (
          <Route exact path={`${match.path}/device`} component={Device} />
        )}
        {ability.can(Action.View, Page.Device) && (
          <Route exact path={`${match.path}/device/:id`} component={Device} />
        )}

        {/* Devices State */}
        {ability.can(Action.View, Page.DeviceState) && (
          <Route exact path={`${match.path}/device-states`} component={DeviceState} />
        )}
        {ability.can(Action.View, Page.DeviceState) && (
          <Route exact path={`${match.path}/device-states/:id`} component={DeviceState} />
        )}

        {/* keep least always */}
        <Route path={`${match.path}/*`}>
          <Redirect to={`/404`} />
        </Route>
      </Switch>
    </div>
  );
};

export default InventoryRoutes;
