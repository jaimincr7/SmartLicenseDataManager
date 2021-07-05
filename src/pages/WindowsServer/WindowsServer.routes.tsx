import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import WindowsServerInventory from './WindowsServerInventory';

const WindowsServerRoutes: React.FC = () => {
  const match = useRouteMatch();

  return (
    <div className="sqlServer">
      <Switch>
        {/* Inventory */}
        <Route exact path={`${match.path}/inventory/:id`} component={WindowsServerInventory} />

        {/* keep least always */}
        <Route exact path={`${match.path}/inventory`} component={WindowsServerInventory} />
      </Switch>
    </div>
  );
};

export default WindowsServerRoutes;
