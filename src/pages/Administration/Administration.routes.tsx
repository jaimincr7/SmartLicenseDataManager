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
import ComponentTableColumn from './ComponentTableColumn';
import ExclusionComponent from './ExclusionComponent';
import ExclusionLocation from './ExclusionLocation';
import ExclusionOperation from './ExclusionOperation';
import ExclusionType from './ExclusionType';
import FileType from './FileTypes';
import FileCategories from './FileCategories';
import LicenseUnits from './LicenseUnits';
import OnlineProducts from './OnlineProducts';
import OnlineProductServicePlans from './OnlineProductServicePlans';
import OnlineServicePlans from './OnlineServicePlans';
import Processors from './Processors';
import SqlServerEditions from './SqlServerEditions';
import SqlServerServices from './SqlServerServices';
import SqlServerVersions from './SqlServerVersions';
import SupportTypes from './SupportTypes';
import WindowsServerEditions from './WindowsServerEditions';
import SqlServerLicense from './SqlServerLicense';
import AgreementTypes from './AgreementTypes';
import WindowsServerVersions from './WindowsServerVersions';
import WindowsServerLicense from './WindowsServerLicense';
import Cron from './Cron';
import CronViewLog from './CronViewLog';
import DeleteDataset from './DeleteDataset';
import ConfigO365Products from './ConfigO365Products';
import ExcelFileMapping from './ExcleFileMapping';
import ExcelColumnMapping from './ExcelColumnMapping';
import BackgroundProcessess from '../BackgroundProcesses/AdDevicesExclusions';

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

        {/* ConfigO365Products */}
        {ability.can(Action.View, Page.ConfigO365Products) && (
          <Route exact path={`${match.path}/config-o365-products`} component={ConfigO365Products} />
        )}
        {ability.can(Action.View, Page.ConfigO365Products) && (
          <Route
            exact
            path={`${match.path}/config-o365-products/:id`}
            component={ConfigO365Products}
          />
        )}

        {/* DeleteDataset */}
        {ability.can(Action.View, Page.DeleteDataset) && (
          <Route exact path={`${match.path}/config-delete-data-set`} component={DeleteDataset} />
        )}
        {ability.can(Action.View, Page.DeleteDataset) && (
          <Route
            exact
            path={`${match.path}/config-delete-data-set/:id`}
            component={DeleteDataset}
          />
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

        {/* Cron */}
        {ability.can(Action.View, Page.Cron) && (
          <Route exact path={`${match.path}/sps-scheduler`} component={Cron} />
        )}
        {ability.can(Action.View, Page.User) && (
          <Route exact path={`${match.path}/sps-scheduler/:id`} component={Cron} />
        )}

        {/* {ability.can(Action.View, Page.Cron) && ( */}
        <Route exact path={`${match.path}/sps-scheduler-log/:id`} component={CronViewLog} />

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

        {/* Agreement Types */}
        {ability.can(Action.View, Page.AgreementTypes) && (
          <Route exact path={`${match.path}/agreement-types/:id`} component={AgreementTypes} />
        )}
        {ability.can(Action.View, Page.AgreementTypes) && (
          <Route exact path={`${match.path}/agreement-types`} component={AgreementTypes} />
        )}

        {/* Exclusion Component */}
        {ability.can(Action.View, Page.ConfigExclusionComponent) && (
          <Route
            exact
            path={`${match.path}/config-exclusion-component/:id`}
            component={ExclusionComponent}
          />
        )}
        {ability.can(Action.View, Page.ConfigExclusionComponent) && (
          <Route
            exact
            path={`${match.path}/config-exclusion-component`}
            component={ExclusionComponent}
          />
        )}

        {/* Exclusion Location */}
        {ability.can(Action.View, Page.ConfigExclusionLocation) && (
          <Route
            exact
            path={`${match.path}/config-exclusion-location/:id`}
            component={ExclusionLocation}
          />
        )}
        {ability.can(Action.View, Page.ConfigExclusionLocation) && (
          <Route
            exact
            path={`${match.path}/config-exclusion-location`}
            component={ExclusionLocation}
          />
        )}

        {/* Exclusion Operation */}
        {ability.can(Action.View, Page.ConfigExclusionOperation) && (
          <Route
            exact
            path={`${match.path}/config-exclusion-operation/:id`}
            component={ExclusionOperation}
          />
        )}
        {ability.can(Action.View, Page.ConfigExclusionOperation) && (
          <Route
            exact
            path={`${match.path}/config-exclusion-operation`}
            component={ExclusionOperation}
          />
        )}

        {/*Back Ground Processes*/}
        (
        <Route
          exact
          path={`${match.path}/back-ground-processes`}
          component={BackgroundProcessess}
        />
        )

        {/* Excel File Mapping */}
        {ability.can(Action.View, Page.ExcelFileMapping) && (
          <Route
            exact
            path={`${match.path}/config-excel-file-mapping/:id`}
            component={ExcelFileMapping}
          />
        )}
        {ability.can(Action.View, Page.ExcelFileMapping) && (
          <Route
            exact
            path={`${match.path}/config-excel-file-mapping`}
            component={ExcelFileMapping}
          />
        )}

        {/* Excel Column Mapping */}
        {ability.can(Action.View, Page.ExcelColumnMapping) && (
          <Route
            exact
            path={`${match.path}/config-excel-column-mapping/:id`}
            component={ExcelColumnMapping}
          />
        )}
        {ability.can(Action.View, Page.ExcelColumnMapping) && (
          <Route
            exact
            path={`${match.path}/config-excel-column-mapping`}
            component={ExcelColumnMapping}
          />
        )}

        {/* Sql Server Editions */}
        {ability.can(Action.View, Page.ConfigSqlServerEditions) && (
          <Route
            exact
            path={`${match.path}/config-sql-server-editions/:id`}
            component={SqlServerEditions}
          />
        )}
        {ability.can(Action.View, Page.ConfigSqlServerEditions) && (
          <Route
            exact
            path={`${match.path}/config-sql-server-editions`}
            component={SqlServerEditions}
          />
        )}

        {/* Sql Server License */}
        {ability.can(Action.View, Page.ConfigSqlServerLicense) && (
          <Route
            exact
            path={`${match.path}/config-sql-server-license/:id`}
            component={SqlServerLicense}
          />
        )}
        {ability.can(Action.View, Page.ConfigSqlServerLicense) && (
          <Route
            exact
            path={`${match.path}/config-sql-server-license`}
            component={SqlServerLicense}
          />
        )}

        {/* Sql Server Services */}
        {ability.can(Action.View, Page.ConfigSqlServerServices) && (
          <Route
            exact
            path={`${match.path}/config-sql-server-services/:id`}
            component={SqlServerServices}
          />
        )}
        {ability.can(Action.View, Page.ConfigSqlServerServices) && (
          <Route
            exact
            path={`${match.path}/config-sql-server-services`}
            component={SqlServerServices}
          />
        )}

        {/* Exclusion Type */}
        {ability.can(Action.View, Page.ConfigExclusionType) && (
          <Route exact path={`${match.path}/config-exclusion-type/:id`} component={ExclusionType} />
        )}
        {ability.can(Action.View, Page.ConfigExclusionType) && (
          <Route exact path={`${match.path}/config-exclusion-type`} component={ExclusionType} />
        )}

        {/* File Type */}
        {ability.can(Action.View, Page.ConfigFileType) && (
          <Route exact path={`${match.path}/config-file-types/:id`} component={FileType} />
        )}
        {ability.can(Action.View, Page.ConfigFileType) && (
          <Route exact path={`${match.path}/config-file-types`} component={FileType} />
        )}

        {/* WindowsServerVersions */}
        {ability.can(Action.View, Page.ConfigWindowsServerVersions) && (
          <Route
            exact
            path={`${match.path}/config-windows-server-versions/:id`}
            component={WindowsServerVersions}
          />
        )}
        {ability.can(Action.View, Page.ConfigWindowsServerVersions) && (
          <Route
            exact
            path={`${match.path}/config-windows-server-versions`}
            component={WindowsServerVersions}
          />
        )}

        {/* WindowsServerLicense */}
        {ability.can(Action.View, Page.ConfigWindowsServerLicense) && (
          <Route
            exact
            path={`${match.path}/config-windows-server-license/:id`}
            component={WindowsServerLicense}
          />
        )}
        {ability.can(Action.View, Page.ConfigWindowsServerLicense) && (
          <Route
            exact
            path={`${match.path}/config-windows-server-license`}
            component={WindowsServerLicense}
          />
        )}

        {/* File Categories */}
        {ability.can(Action.View, Page.ConfigFileCategories) && (
          <Route
            exact
            path={`${match.path}/config-file-categories/:id`}
            component={FileCategories}
          />
        )}
        {ability.can(Action.View, Page.ConfigFileCategories) && (
          <Route exact path={`${match.path}/config-file-categories`} component={FileCategories} />
        )}

        {/* License Units */}
        {ability.can(Action.View, Page.ConfigLicenseUnits) && (
          <Route exact path={`${match.path}/config-license-units/:id`} component={LicenseUnits} />
        )}
        {ability.can(Action.View, Page.ConfigLicenseUnits) && (
          <Route exact path={`${match.path}/config-license-units`} component={LicenseUnits} />
        )}

        {/* Sql Server Versions */}
        {ability.can(Action.View, Page.ConfigSqlServerVersions) && (
          <Route
            exact
            path={`${match.path}/config-sql-server-versions/:id`}
            component={SqlServerVersions}
          />
        )}
        {ability.can(Action.View, Page.ConfigSqlServerVersions) && (
          <Route
            exact
            path={`${match.path}/config-sql-server-versions`}
            component={SqlServerVersions}
          />
        )}

        {/* Component Table Column */}
        {ability.can(Action.View, Page.ConfigComponentTableColumn) && (
          <Route
            exact
            path={`${match.path}/config-component-table-column/:id`}
            component={ComponentTableColumn}
          />
        )}
        {ability.can(Action.View, Page.ConfigComponentTableColumn) && (
          <Route
            exact
            path={`${match.path}/config-component-table-column`}
            component={ComponentTableColumn}
          />
        )}

        {/* SupportTypes */}
        {ability.can(Action.View, Page.ConfigSupportTypes) && (
          <Route exact path={`${match.path}/config-support-types/:id`} component={SupportTypes} />
        )}
        {ability.can(Action.View, Page.ConfigSupportTypes) && (
          <Route exact path={`${match.path}/config-support-types`} component={SupportTypes} />
        )}

        {/* Online Products*/}
        {ability.can(Action.View, Page.ConfigOnlineProducts) && (
          <Route
            exact
            path={`${match.path}/config-online-products/:id`}
            component={OnlineProducts}
          />
        )}
        {ability.can(Action.View, Page.ConfigOnlineProducts) && (
          <Route exact path={`${match.path}/config-online-products`} component={OnlineProducts} />
        )}

        {/* WindowsServerEditions*/}
        {ability.can(Action.View, Page.ConfigWindowsServerEditions) && (
          <Route
            exact
            path={`${match.path}/config-windows-server-editions/:id`}
            component={WindowsServerEditions}
          />
        )}
        {ability.can(Action.View, Page.ConfigWindowsServerEditions) && (
          <Route
            exact
            path={`${match.path}/config-windows-server-editions`}
            component={WindowsServerEditions}
          />
        )}

        {/* Online Product Service Plans */}
        {ability.can(Action.View, Page.ConfigOnlineProductServicePlans) && (
          <Route
            exact
            path={`${match.path}/config-online-product-service-plans/:id`}
            component={OnlineProductServicePlans}
          />
        )}
        {ability.can(Action.View, Page.ConfigOnlineProductServicePlans) && (
          <Route
            exact
            path={`${match.path}/config-online-product-service-plans`}
            component={OnlineProductServicePlans}
          />
        )}

        {/* Online Service Plans */}
        {ability.can(Action.View, Page.ConfigOnlineServicePlans) && (
          <Route
            exact
            path={`${match.path}/config-online-service-plans/:id`}
            component={OnlineServicePlans}
          />
        )}
        {ability.can(Action.View, Page.ConfigOnlineServicePlans) && (
          <Route
            exact
            path={`${match.path}/config-online-service-plans`}
            component={OnlineServicePlans}
          />
        )}

        {/* Processors */}
        {ability.can(Action.View, Page.ConfigProcessors) && (
          <Route exact path={`${match.path}/config-processors/:id`} component={Processors} />
        )}
        {ability.can(Action.View, Page.ConfigProcessors) && (
          <Route exact path={`${match.path}/config-processors`} component={Processors} />
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
