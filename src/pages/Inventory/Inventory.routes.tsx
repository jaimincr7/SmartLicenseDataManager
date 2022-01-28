import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import ability from '../../common/ability';
import { Action, Page } from '../../common/constants/pageAction';
import Device from './Device';
import DeviceState from './DeviceState';
import Hardware from './Hardware';
import Inventory from './Inventory';
import Software from './Software';

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

        {/* Software */}
        {ability.can(Action.View, Page.Software) && (
          <Route exact path={`${match.path}/inventory-software`} component={Software} />
        )}
        {ability.can(Action.View, Page.Software) && (
          <Route exact path={`${match.path}/inventory-software/:id`} component={Software} />
        )}

        {/* Hardware */}
        {ability.can(Action.View, Page.Hardware) && (
          <Route exact path={`${match.path}/inventory-hardware`} component={Hardware} />
        )}
        {ability.can(Action.View, Page.Hardware) && (
          <Route exact path={`${match.path}/inventory-hardware/:id`} component={Hardware} />
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
