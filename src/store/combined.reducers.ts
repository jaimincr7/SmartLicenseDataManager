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
import userReducer from './administration/administration.reducer';
import windowsServerEntitlementsReducer from './windowsServer/windowsServerEntitlements/windowsServerEntitlements.reducer';
import windowsServerExclusionsReducer from './windowsServer/windowsServerExclusions/windowsServerExclusions.reducer';
import windowsServerInventoryReducer from './windowsServer/windowsServerInventory/windowsServerInventory.reducer';
import windowsServerOverridesReducer from './windowsServer/windowsServerOverrides/windowsServerOverrides.reducer';
import windowsServerPricingReducer from './windowsServer/windowsServerPricing/windowsServerPricing.reducer';
import windowsServerLicenseReducer from './windowsServer/windowsServerLicense/windowsServerLicense.reducer';
import windowsServerLicenseDetailReducer from './windowsServer/windowsServerLicenseDetail/windowsServerLicenseDetail.reducer';
import menuReducer from './administration/menu/menu.reducer';
import tenantReducer from './master/tenant/tenant.reducer';
import companyReducer from './master/company/company.reducer';
import buReducer from './master/bu/bu.reducer';
import globalSearchReducer from './globalSearch/globalSearch.reducer';
import globalTableColumnSelectionReducer from './administration/globalTableColumnSelection/globalTableColumnSelection.reducer';
import tabVClusterReducer from './rvTools/tabVCluster/tabVCluster.reducer';
import tabVHostReducer from './rvTools/tabVHost/tabVHost.reducer';
import tabVInfoReducer from './rvTools/tabVInfo/tabVInfo.reducer';
import currencyReducer from './master/currency/currency.reducer';
import azureDailyUsageReducer from './azure/azureDailyUsage/azureDailyUsage.reducer';
import azureRateCardReducer from './azure/azureRateCard/azureRateCard.reducer';
import azureAPIVmSizesReducer from './azure/azureAPIVmSizes/azureAPIVmSizes.reducer';
import o365ActivationsUserDetailReducer from './o365/o365ActivationsUserDetail/o365ActivationsUserDetail.reducer';
import o365ActiveUserDetailReducer from './o365/o365ActiveUserDetail/o365ActiveUserDetail.reducer';
import o365M365AppsUsageUserDetailReducer from './o365/o365M365AppsUsageUserDetail/o365M365AppsUsageUserDetail.reducer';
import o365MailboxUsageReducer from './o365/o365MailboxUsage/o365MailboxUsage.reducer';
import o365OneDriveUsageReducer from './o365/o365OneDriveUsage/o365OneDriveUsage.reducer';
import o365ReservationsReducer from './o365/o365Reservations/o365Reservations.reducer';
import o365ProductListReducer from './o365/o365ProductList/o365ProductList.reducer';
import ciscoSiteMatrixReducer from './hwCisco/ciscoSiteMatrix/ciscoSiteMatrix.reducer';
import o365UsersReducer from './o365/o365Users/o365Users.reducer';
import usersReducer from './master/users/users.reducer';
import configurationReducer from './powerBiReports/configuration/configuration.reducer';
import roleReducer from './master/role/role.reducer';
import o365SubscriptionsReducer from './o365/o365Subscriptions/o365Subscriptions.reducer';
import ciscoHostReducer from './hwCisco/ciscoHost/ciscoHost.reducer';
import ciscoIBReducer from './hwCisco/ciscoIB/ciscoIB.reducer';
import ciscoPolicyReducer from './hwCisco/ciscoPolicy/ciscoPolicy.reducer';
import cmsCategoryReducer from './cms/cmsCategory/cmsCategory.reducer';
import adUsersExclusionsReducer from './ad/adUsersExclusions/adUsersExclusions.reducer';

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
  adUsersExclusions: adUsersExclusionsReducer,

  // Data Input
  bulkImport: bulkImportReducer,

  // Menu-rights
  menu: menuReducer,

  // Master tables
  tenant: tenantReducer,
  company: companyReducer,
  bu: buReducer,
  currency: currencyReducer,
  role: roleReducer,

  // RV Tools
  tabVCluster: tabVClusterReducer,
  tabVHost: tabVHostReducer,
  tabVInfo: tabVInfoReducer,

  // Azure
  azureDailyUsage: azureDailyUsageReducer,
  azureRateCard: azureRateCardReducer,
  azureAPIVmSizes: azureAPIVmSizesReducer,

  // O365
  o365ActivationsUserDetail: o365ActivationsUserDetailReducer,
  o365ActiveUserDetail: o365ActiveUserDetailReducer,
  o365M365AppsUsageUserDetail: o365M365AppsUsageUserDetailReducer,
  o365MailboxUsage: o365MailboxUsageReducer,
  o365OneDriveUsage: o365OneDriveUsageReducer,
  o365ProductList: o365ProductListReducer,
  o365Reservations: o365ReservationsReducer,
  o365Users: o365UsersReducer,
  o365Subscriptions: o365SubscriptionsReducer,

  //HW-Cisco
  ciscoSiteMatrix: ciscoSiteMatrixReducer,
  ciscoHost: ciscoHostReducer,
  ciscoIB: ciscoIBReducer,
  ciscoPolicy: ciscoPolicyReducer,
  //CMS
  cmsCategory: cmsCategoryReducer,
  users: usersReducer,

  //Power-BI Report
  configuration: configurationReducer,
});
