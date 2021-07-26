import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import ReportCoverage from './Coverage';

const ReportRoutes: React.FC = () => {
  const match = useRouteMatch();

  return (
    <div className="sqlServer">
      <Switch>
        <Route exact path={`${match.path}/coverage`} component={ReportCoverage} />
        {/* keep least always */}
      </Switch>
    </div>
  );
};

export default ReportRoutes;
