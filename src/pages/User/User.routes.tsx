import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import BU from './BU';
import Company from './Company';
import Currency from './Currency';
import CompanyBaseMenuRights from './MenuRights/CompanyBaseMenuRights';
import RoleBaseMenuRights from './MenuRights/RoleBaseMenuRights';
import TableColumnSelection from './TableColumnsSelection';
import Tenant from './Tenant';

const UserRoutes: React.FC = () => {
  const match = useRouteMatch();

  return (
    <div className="windowsServer">
      <Switch>
        {/* BU */}
        <Route exact path={`${match.path}/bu`} component={BU} />
        <Route exact path={`${match.path}/bu/:id`} component={BU} />

        {/* Tenant */}
        <Route exact path={`${match.path}/tenant`} component={Tenant} />
        <Route exact path={`${match.path}/tenant/:id`} component={Tenant} />

        {/* Company */}
        <Route exact path={`${match.path}/company`} component={Company} />
        <Route exact path={`${match.path}/company/:id`} component={Company} />

        {/* Currency */}
        <Route exact path={`${match.path}/currency`} component={Currency} />
        <Route exact path={`${match.path}/currency/:id`} component={Currency} />

        {/* Menu Rights */}
        <Route exact path={`${match.path}/menu-rights/role`} component={RoleBaseMenuRights} />
        <Route exact path={`${match.path}/menu-rights/company`} component={CompanyBaseMenuRights} />
        <Route
          exact
          path={`${match.path}/table-column-selection`}
          component={TableColumnSelection}
        />

        {/* keep least always */}
        <Route path={`${match.path}/*`}>
          <Redirect to={`${match.path}/menu-rights/role`} />
        </Route>
      </Switch>
    </div>
  );
};

export default UserRoutes;
