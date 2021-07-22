import { combineReducers } from 'redux';
import adDevicesReducer from './ad/adDevices/adDevices.reducer';
import adDevicesExclusionsReducer from './ad/adDevicesExclusions/adDevicesExclusions.reducer';
import adUsersReducer from './ad/adUsers/adUsers.reducer';
import bulkImportReducer from './bulkImport/bulkImport.reducer';
import commonReducer from './common/common.reducer';
import errorLogReducer from './errorLog/errorLog.reducer';
import sqlServerInventoryReducer from './sqlServer/sqlServerInventory/sqlServerInventory.reducer';
import sqlServerEntitlementsReducer from './sqlServer/sqlServerEntitlements/sqlServerEntitlements.reducer';
import sqlServerExclusionsReducer from './sqlServer/sqlServerExclusions/sqlServerExclusions.reducer';
import sqlServerLicenseReducer from './sqlServer/sqlServerLicense/sqlServerLicense.reducer';
import sqlServerLicenseDetailReducer from './sqlServer/sqlServerLicenseDetail/sqlServerLicenseDetail.reducer';
import sqlServerOverridesReducer from './sqlServer/sqlServerOverrides/sqlServerOverrides.reducer';
import sqlServerPricingReducer from './sqlServer/sqlServerPricing/sqlServerPricing.reducer';
import userReducer from './user/user.reducer';
import windowsServerEntitlementsReducer from './windowsServer/windowsServerEntitlements/windowsServerEntitlements.reducer';
import windowsServerExclusionsReducer from './windowsServer/windowsServerExclusions/windowsServerExclusions.reducer';
import windowsServerInventoryReducer from './windowsServer/windowsServerInventory/windowsServerInventory.reducer';
import windowsServerOverridesReducer from './windowsServer/windowsServerOverrides/windowsServerOverrides.reducer';
import windowsServerPricingReducer from './windowsServer/windowsServerPricing/windowsServerPricing.reducer';
import windowsServerLicenseReducer from './windowsServer/windowsServerLicense/windowsServerLicense.reducer';
import windowsServerLicenseDetailReducer from './windowsServer/windowsServerLicenseDetail/windowsServerLicenseDetail.reducer';
import menuReducer from './user/menu/menu.reducer';
import tenantReducer from './master/tenant/tenant.reducer';
import companyReducer from './master/company/company.reducer';
import buReducer from './master/bu/bu.reducer';
import globalSearchReducer from './globalSearch/globalSearch.reducer';
import globalTableColumnSelectionReducer from './user/globalTableColumnSelection/globalTableColumnSelection.reducer';
import tabVClusterReducer from './rvTools/tabVCluster/tabVCluster.reducer';
import tabVHostReducer from './rvTools/tabVHost/tabVHost.reducer';
import tabVInfoReducer from './rvTools/tabVInfo/tabVInfo.reducer';
import currencyReducer from './master/currency/currency.reducer';
import azureDailyUsageReducer from './azure/azureDailyUsage/azureDailyUsage.reducer';

export const rootReducer = combineReducers({
  errorLog: errorLogReducer,
  common: commonReducer,
  user: userReducer,
  globalSearch: globalSearchReducer,
  globalTableColumnSelection: globalTableColumnSelectionReducer,

  // Sql Server
  sqlServerInventory: sqlServerInventoryReducer,
  sqlServerEntitlements: sqlServerEntitlementsReducer,
  sqlServerOverrides: sqlServerOverridesReducer,
  sqlServerPricing: sqlServerPricingReducer,
  sqlServerLicense: sqlServerLicenseReducer,
  sqlServerLicenseDetail: sqlServerLicenseDetailReducer,
  sqlServerExclusions: sqlServerExclusionsReducer,

  // Windows Server
  windowsServerInventory: windowsServerInventoryReducer,
  windowsServerEntitlements: windowsServerEntitlementsReducer,
  windowsServerOverrides: windowsServerOverridesReducer,
  windowsServerPricing: windowsServerPricingReducer,
  windowsServerExclusions: windowsServerExclusionsReducer,
  windowsServerLicense: windowsServerLicenseReducer,
  windowsServerLicenseDetail: windowsServerLicenseDetailReducer,

  // AD
  adDevices: adDevicesReducer,
  adDevicesExclusions: adDevicesExclusionsReducer,
  adUsers: adUsersReducer,

  // Data Input
  bulkImport: bulkImportReducer,

  // Menu-rights
  menu: menuReducer,

  // Master tables
  tenant: tenantReducer,
  company: companyReducer,
  bu: buReducer,
  currency: currencyReducer,

  // RV Tools
  tabVCluster: tabVClusterReducer,
  tabVHost: tabVHostReducer,
  tabVInfo: tabVInfoReducer,

  // Azure
  azureDailyUsage: azureDailyUsageReducer,
});
