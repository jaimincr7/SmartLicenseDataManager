import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import BulkImport from './BulkImport';

const DataInputRoutes: React.FC = () => {
  const match = useRouteMatch();

  return (
    <div className="bulkImport">
      <Switch>
        <Route exact path={`${match.path}/bulk-import`} component={BulkImport} />
        <Route exact path={`${match.path}/bulk-import/:table`} component={BulkImport} />

        {/* keep least always */}
        <Route path="{`${match.path}/*`}">
          <Redirect to={`${match.path}/bulk-import`} />
        </Route>
      </Switch>
    </div>
  );
};

export default DataInputRoutes;
