import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import ability from '../../common/ability';
import { Action, Page } from '../../common/constants/pageAction';
import BU from './BU';
import Company from './Company';
import Currency from './Currency';
import MenuAccessRights from './MenuRights/AddRemoveMenuRights';
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
        {ability.can(Action.View, Page.Bu) && (
          <Route exact path={`${match.path}/bu`} component={BU} />
        )}
        {ability.can(Action.View, Page.Bu) && (
          <Route exact path={`${match.path}/bu/:id`} component={BU} />
        )}

        {/* Tenant */}
        {ability.can(Action.View, Page.Tenant) && (
          <Route exact path={`${match.path}/tenant`} component={Tenant} />
        )}
        {ability.can(Action.View, Page.Tenant) && (
          <Route exact path={`${match.path}/tenant/:id`} component={Tenant} />
        )}

        {/* Company */}
        {ability.can(Action.View, Page.Company) && (
          <Route exact path={`${match.path}/company`} component={Company} />
        )}
        {ability.can(Action.View, Page.Company) && (
          <Route exact path={`${match.path}/company/:id`} component={Company} />
        )}

        {/* Currency */}
        {ability.can(Action.View, Page.Currency) && (
          <Route exact path={`${match.path}/currency`} component={Currency} />
        )}
        {ability.can(Action.View, Page.Currency) && (
          <Route exact path={`${match.path}/currency/:id`} component={Currency} />
        )}

        {/* Menu Rights */}
        {ability.can(Action.View, Page.RoleMenuRights) && (
          <Route exact path={`${match.path}/menu-rights/role`} component={RoleBaseMenuRights} />
        )}
        {ability.can(Action.View, Page.CompanyMenuRights) && (
          <Route
            exact
            path={`${match.path}/menu-rights/company`}
            component={CompanyBaseMenuRights}
          />
        )}
        {ability.can(Action.View, Page.GlobalTableColumnSelection) && (
          <Route
            exact
            path={`${match.path}/table-column-selection`}
            component={TableColumnSelection}
          />
        )}
        {ability.can(Action.View, Page.MenuAccessRights) && (
          <Route exact path={`${match.path}/menu-access-rights`} component={MenuAccessRights} />
        )}

        {/* keep least always */}
        <Route path={`${match.path}/*`}>
          <Redirect to={`/404`} />
        </Route>
      </Switch>
    </div>
  );
};

export default UserRoutes;
