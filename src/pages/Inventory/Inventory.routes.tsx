import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import ability from '../../common/ability';
import { Action, Page } from '../../common/constants/pageAction';
import Inventory from './Inventory';

const InventoryRoutes: React.FC = () => {
  const match = useRouteMatch();

  return (
    <div className="sqlServer">
      <Switch>
        {/* Exclusions */}
        {ability.can(Action.View, Page.Inventory) && (
          <Route exact path={`${match.path}/inventory`} component={Inventory} />
        )}
        {ability.can(Action.View, Page.Inventory) && (
          <Route exact path={`${match.path}/inventory/:id`} component={Inventory} />
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
