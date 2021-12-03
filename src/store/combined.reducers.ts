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
import ciscoProductReducer from './hwCisco/ciscoProduct/ciscoProduct.reducer';
import ciscoProductAttributesReducer from './hwCisco/ciscoProductAttributes/ciscoProductAttributes.reducer';
import ciscoReadyReducer from './hwCisco/ciscoReady/ciscoReady.reducer';
import ciscoSNTCReducer from './hwCisco/ciscoSNTC/ciscoSNTC.reducer';
import ciscoSpectrumReducer from './hwCisco/ciscoSpectrum/ciscoSpectrum.reducer';
import cmsContactReducer from './cms/contact/contact.reducer';
import cmsContractAgreementReducer from './cms/contractAgreement/contractAgreement.reducer';
import cmsContractAgreementAttachmentReducer from './cms/contractAgreementAttachment/contractAgreementAttachment.reducer';
import cmsPurchaseReducer from './cms/purchase/purchase.reducer';
import cmsPurchaseLineItemReducer from './cms/purchaseLineItem/purchaseLineItem.reducer';
import cmsTriggerTypeReducer from './cms/triggerType/triggerType.reducer';
import cmsVendorReducer from './cms/vendor/vendor.reducer';
import cmsCategoryExtendedReducer from './cms/categoryExtended/categoryExtended.reducer';
import spsApiReducer from './sps/spsAPI/spsApi.reducer';
import cmdbOperatingSystemReducer from './cmdb/operatingSystem/operatingSystem.reducer';
import cmdbProcessorReducer from './cmdb/processor/processor.reducer';
import cmdbVirtualizationReducer from './cmdb/virtualization/virtualization.reducer';
import apiColMappingReducer from './sps/apiColumnMapping/apiColMapping.reducer';
import cmdbApplicationReducer from './cmdb/application/application.reducer';
import cmdbDeviceReducer from './cmdb/device/device.reducer';
import cmdbLicenseModelReducer from './cmdb/licenseModel/licenseModel.reducer';
import cmdbSoftwareReducer from './cmdb/software/software.reducer';
import cmdbUserReducer from './cmdb/user/user.reducer';
import cmdbUserMapReducer from './cmdb/userMap/userMap.reducer';
import cmdbExclusionReducer from './cmdb/exclusion/exclusion.reducer';
import configExclusionComponentReducer from './master/exclusionComponent/exclusionComponent.reducer';
import configExclusionLocationReducer from './master/exclusionLocation/exclusionLocation.reducer';
import configComponentReducer from './master/component/component.reducer';
import configComponentTableColumnReducer from './master/componentTableColumn/componentTableColumn.reducer';
import configExclusionTypeReducer from './master/exclusionType/exclusionType.reducer';
import configExclusionOperationReducer from './master/exclusionOperation/exclusionOperation.reducer';
import configFileTypeReducer from './master/fileTypes/fileTypes.reducer';
import configFileCategoriesReducer from './master/fileCategories/fileCategories.reducer';
import configLicenseUnitsReducer from './master/licenseUnits/licenseUnits.reducer';
import configOnlineProductsReducer from './master/onlineProducts/onlineProducts.reducer';
import configOnlineProductServicePlansReducer from './master/onlineProductServicePlans/onlineProductServicePlans.reducer';
import configOnlineServicePlansReducer from './master/onlineServicePlans/onlineServicePlans.reducer';
import configProcessorsReducer from './master/processors/processors.reducer';
import configSqlServerEditionsReducer from './master/sqlServerEditions/sqlServerEditions.reducer';
import configSqlServerServicesReducer from './master/sqlServerServices/sqlServerServices.reducer';
import configSqlServerVersionsReducer from './master/sqlServerVersions/sqlServerVersions.reducer';
import configSupportTypesReducer from './master/supportTypes/supportTypes.reducer';
import configWindowsServerEditionsReducer from './master/windowsServerEditions/windowsServerEditions.reducer';
import spsApiJobsReducer from './sps/spsApiJobs/spsApiJobs.reducer';
import spsApiJobsDataReducer from './sps/spsApiJobsData/spsApiJobsData.reducer';
import configSqlServerLicenseReducer from './master/sqlServerLicense/sqlServerLicense.reducer';
import agreementTypesReducer from './master/agreementTypes/agreementTypes.reducer';
import configWindowsServerVersionsReducer from './master/windowsServerVersions/windowsServerVersions.reducer';
import configWindowsServerLicenseReducer from './master/windowsServerLicense/windowsServerLicense.reducer';
import slim360O365LicensesReducer from './slim360/o365Licenses/o365Licenses.reducer';
import slim360O365UserLicensesReducer from './slim360/o365UserLicenses/o365UserLicenses.reducer';
import slim360O365UserPlansReducer from './slim360/o365UserPlans/o365UserPlans.reducer';
import spsApiGroupReducer from './sps/apiGroup/apiGroup.reducer';
import spsApiTypeReducer from './sps/apiType/apiType.reducer';
import spsApiOauthReducer from './sps/apiOauth/apiOauth.reducer';
import spsApiTokenConfigOptionsReducer from './sps/apiTokenConfigOptions/apiTokenConfigOptions.reducer';
import cronReducer from './master/cron/cron.reducer';
import cronViewLogReducer from './master/cronViewLog/cronViewLog.reducer';
import spsApiCallReducer from './sps/spsAPICall/spsApiCall.reducer';
import inventoryReducer from './inventory/inventory/inventory.reducer';
import spsApiBaseUrlReducer from './sps/apiBaseUrl/apiBaseUrl.reducer';
import spsApiOauthUrlInjectionSiteReducer from './sps/apiOauthUrlInjectionSite/apiOauthUrlInjectionSite.reducer';
import spsApiOauthIdUrlInjectionSiteReducer from './sps/apiOauthIdUrlInjectionSite/apiOauthIdUrlInjectionSite.reducer';

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
  agreementTypes: agreementTypesReducer,
  cron: cronReducer,
  cronViewLog: cronViewLogReducer,

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
  ciscoProduct: ciscoProductReducer,
  ciscoProductAttributes: ciscoProductAttributesReducer,
  ciscoReady: ciscoReadyReducer,
  ciscoSNTC: ciscoSNTCReducer,
  ciscoSpectrum: ciscoSpectrumReducer,

  //CMS
  cmsCategory: cmsCategoryReducer,
  cmsCategoryExtended: cmsCategoryExtendedReducer,
  cmsContact: cmsContactReducer,
  cmsContractAgreement: cmsContractAgreementReducer,
  cmsContractAgreementAttachment: cmsContractAgreementAttachmentReducer,
  cmsPurchase: cmsPurchaseReducer,
  cmsPurchaseLineItem: cmsPurchaseLineItemReducer,
  cmsTriggerType: cmsTriggerTypeReducer,
  cmsVendor: cmsVendorReducer,

  //CMDB
  cmdbOperatingSystem: cmdbOperatingSystemReducer,
  cmdbProcessor: cmdbProcessorReducer,
  cmdbVirtualization: cmdbVirtualizationReducer,
  cmdbApplication: cmdbApplicationReducer,
  cmdbDevice: cmdbDeviceReducer,
  cmdbLicenseModel: cmdbLicenseModelReducer,
  cmdbSoftware: cmdbSoftwareReducer,
  cmdbUser: cmdbUserReducer,
  cmdbUserMap: cmdbUserMapReducer,

  cmdbExclusion: cmdbExclusionReducer,

  users: usersReducer,

  //config
  configComponent: configComponentReducer,
  configComponentTableColumn: configComponentTableColumnReducer,
  configExclusionComponent: configExclusionComponentReducer,
  configExclusionLocation: configExclusionLocationReducer,
  configExclusionType: configExclusionTypeReducer,
  configExclusionOperation: configExclusionOperationReducer,
  configFileCategories: configFileCategoriesReducer,
  configFileType: configFileTypeReducer,
  configLicenseUnits: configLicenseUnitsReducer,
  configOnlineProducts: configOnlineProductsReducer,
  configOnlineProductServicePlans: configOnlineProductServicePlansReducer,
  configOnlineServicePlans: configOnlineServicePlansReducer,
  configProcessors: configProcessorsReducer,
  configSqlServerEditions: configSqlServerEditionsReducer,
  configSqlServerServices: configSqlServerServicesReducer,
  configSqlServerVersions: configSqlServerVersionsReducer,
  configSupportTypes: configSupportTypesReducer,
  configWindowsServerEditions: configWindowsServerEditionsReducer,
  configSqlServerLicense: configSqlServerLicenseReducer,
  configWindowsServerVersions: configWindowsServerVersionsReducer,
  configWindowsServerLicense: configWindowsServerLicenseReducer,

  //Slim360
  slim360O365Licenses: slim360O365LicensesReducer,
  slim360O365UserLicenses: slim360O365UserLicensesReducer,
  slim360O365UserPlans: slim360O365UserPlansReducer,

  //Power-BI Report
  configuration: configurationReducer,

  //Inventory
  inventory: inventoryReducer,

  //SPS
  spsApi: spsApiReducer,
  spsApiCall: spsApiCallReducer,
  spsApiJobs: spsApiJobsReducer,
  spsApiJobsData: spsApiJobsDataReducer,
  spsApiGroup: spsApiGroupReducer,
  spsApiType: spsApiTypeReducer,
  spsApiOauth: spsApiOauthReducer,
  spsApiTokenConfigOptions: spsApiTokenConfigOptionsReducer,
  spsApiBaseUrl: spsApiBaseUrlReducer,
  spsApiOauthUrlInjectionSite: spsApiOauthUrlInjectionSiteReducer,
  spsApiOauthIdUrlInjectionSite: spsApiOauthIdUrlInjectionSiteReducer,

  apiColumnMapping: apiColMappingReducer,
});
