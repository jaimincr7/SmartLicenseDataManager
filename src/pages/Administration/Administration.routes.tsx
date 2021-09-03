import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import ability from '../../common/ability';
import { Action, Page } from '../../common/constants/pageAction';
import APIColumnMappings from './APIMapping';
import AddAPIMapping from './APIMapping/AddApiColMapping';
import BU from './BU';
import Company from './Company';
import Currency from './Currency';
import Component from './Component';
import MenuAccessRights from './MenuRights/AddRemoveMenuRights';
import CompanyBaseMenuRights from './MenuRights/CompanyBaseMenuRights';
import RoleBaseMenuRights from './MenuRights/RoleBaseMenuRights';
import Role from './Role';
import TableColumnSelection from './TableColumnsSelection';
import Tenant from './Tenant';
import User from './User';

const AdministrationRoutes: React.FC = () => {
  const match = useRouteMatch();

  return (
    <div className="windowsServer">
      <Switch>
        {/* User */}
        {/* {ability.can(Action.View, Page.User) && (
          <Route exact path={`${match.path}/user`} component={User} />
        )}
        {ability.can(Action.View, Page.User) && (
          <Route exact path={`${match.path}/user/:id`} component={User} />
        )} */}
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

        {/* User */}
        {ability.can(Action.View, Page.User) && (
          <Route exact path={`${match.path}/user`} component={User} />
        )}
        {ability.can(Action.View, Page.User) && (
          <Route exact path={`${match.path}/user/:id`} component={User} />
        )}

        {/* Role */}
        {ability.can(Action.View, Page.Role) && (
          <Route exact path={`${match.path}/role`} component={Role} />
        )}
        {ability.can(Action.View, Page.Role) && (
          <Route exact path={`${match.path}/role/:id`} component={Role} />
        )}

        {/* SPS Api Colum Mapping */}
        {ability.can(Action.View, Page.ConfigSPSColMapping) && (
          <Route
            exact
            path={`${match.path}/config-sps-api-column-mapping`}
            component={APIColumnMappings}
          />
        )}
        {ability.can(Action.View, Page.ConfigSPSColMapping) && (
          <Route
            exact
            path={`${match.path}/config-sps-api-column-mapping/add`}
            component={AddAPIMapping}
          />
        )}
        {ability.can(Action.View, Page.ConfigSPSColMapping) && (
          <Route
            exact
            path={`${match.path}/config-sps-api-column-mapping/add/:id`}
            component={AddAPIMapping}
          />
        )}

        {/* Component */}
        {ability.can(Action.View, Page.ConfigComponent) && (
          <Route exact path={`${match.path}/config-component/:id`} component={Component} />
        )}
        {ability.can(Action.View, Page.ConfigComponent) && (
          <Route exact path={`${match.path}/config-component`} component={Component} />
        )}

        {/* keep least always */}
        <Route path={`${match.path}/*`}>
          <Redirect to={`/404`} />
        </Route>
      </Switch>
    </div>
  );
};

export default AdministrationRoutes;
