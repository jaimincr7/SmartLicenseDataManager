import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import ability from '../../common/ability';
import { Action, Page } from '../../common/constants/pageAction';
import BulkImport from './BulkImport';
import DeleteDataSet from './DeleteDataSet';

const DataInputRoutes: React.FC = () => {
  const match = useRouteMatch();

  return (
    <div className="bulkImport">
      <Switch>
        {ability.can(Action.View, Page.BulkImport) && (
          <Route exact path={`${match.path}/bulk-import`} component={BulkImport} />
        )}
        {ability.can(Action.View, Page.BulkImport) && (
          <Route exact path={`${match.path}/bulk-import/:table`} component={BulkImport} />
        )}

        {/*For Delete Data Set*/}
        <Route exact path={`${match.path}/delete-data-set`} component={DeleteDataSet} />

        {/* keep least always */}
        <Route path={`${match.path}/*`}>
          <Redirect to={`/404`} />
        </Route>
      </Switch>
    </div>
  );
};

export default DataInputRoutes;
