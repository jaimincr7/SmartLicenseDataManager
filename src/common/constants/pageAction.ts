export enum Page {
  SqlServerInventory = 'sql-server-inventory',
  SqlServerEntitlement = 'sql-server-entitlements',
  SqlServerOverrides = 'sql-server-overrides',
  SqlServerPricing = 'sql-server-pricing',
  SqlServerExclusions = 'sql-server-exclusions',
  SqlServerLicense = 'sql-server-license',
  SqlServerLicenseDetail = 'sql-server-license-detail',

  WindowsServerInventory = 'windows-server-inventory',
  WindowsServerEntitlement = 'windows-server-entitlements',
  WindowsServerOverrides = 'windows-server-overrides',
  WindowsServerPricing = 'windows-server-pricing',
  WindowsServerExclusions = 'windows-server-exclusions',
  WindowsServerLicense = 'windows-server-license',
  WindowsServerLicenseDetail = 'windows-server-license-detail',

  ADDevices = 'ad-devices',
  ADExclusions = 'ad-devices-exclusions',
  ADUsers = 'ad-users',
  AdUsersExclusions = 'ad-users-exclusions',

  Menu = 'menu',
  Tenant = 'tenant',
  Company = 'company',
  Bu = 'bu',
  Currency = 'currency',
  RoleMenuRights = 'role-menu-access-right',
  CompanyMenuRights = 'company-menu-access-right',
  GlobalTableColumnSelection = 'global-table-column-selection',
  MenuAccessRights = 'menu-access-rights',
  User = 'user',
  Role = 'role',

  TabVCluster = 'tab-v-cluster',
  TabVHost = 'tab-v-host',
  TabVInfo = 'tab-v-info',

  AzureDailyUsage = 'azure-daily-usage',
  AzureRateCard = 'azure-rate-card',
  AzureAPIVmSizes = 'azure-api-vm-sizes',

  BulkImport = 'bulk-import',
  ConfigExcelFileMapping = 'config-excel-file-mapping',

  O365ActivationsUserDetail = 'o365-activations-user-detail',
  O365ActiveUserDetail = 'o365-active-user-detail',
  O365M365AppsUsageUserDetail = 'o365-m365-apps-usage-user-detail',
  O365MailboxUsage = 'o365-mailbox-usage',
  O365OneDriveUsage = 'o365-one-drive-usage',
  O365ProductList = 'o365-product-list',
  O365Reservations = 'o365-reservations',
  O365Users = 'o365-users',
  O365Subscriptions = 'o365-subscriptions',

  HwCiscoSiteMatrix = 'hw-cisco-cisco-site-matrix',
  HwCiscoHost = 'hw-cisco-host',
  HwCiscoIB = 'hw-cisco-ib',
  HwCiscoPolicy = 'hw-cisco-policy',
  HwCiscoProduct = 'hw-cisco-product',
  HwCiscoProductAttributes = 'hw-cisco-product-attributes',
  HwCiscoReady = 'hw-cisco-ready',
  HwCiscoSNTC = 'hw-cisco-sntc',
  HwCiscoSpectrum = 'hw-cisco-spectrum',

  CmsCategory = 'cms-category',
  CmsContact = 'cms-contact',
  CmsContractAgreement = 'cms-contract-agreement',
  CmsContractAgreementAttachment = 'cms-contract-agreement-attachment',
  CmsPurchase = 'cms-purchase',
  CmsVendor = 'cms-vendor',
  CmsPurchaseLineItem = 'cms-purchase-line-item',
  CmsCategoryExtended = 'cms-category-extended',
  CmsTriggerType = 'cms-trigger-type',

  CmdbOperatingSystem = 'cmdb-operating-system',
  CmdbProcessor = 'cmdb-processor',
  CmdbVirtualization = 'cmdb-virtualization',
  CmdbApplication = 'cmdb-application',
  CmdbDevice = 'cmdb-device',
  CmdbLicenseModel = 'cmdb-license-model',
  CmdbSoftware = 'cmdb-software',
  CmdbUser = 'cmdb-user',
  CmdbUserMap = 'cmdb-user-map',
  CmdbExclusion = 'cmdb-exclusion',
  
  ConfigComponent = 'config-component',
  ConfigComponentTableColumn = 'config-component-table-column',
  ConfigExclusionComponent = 'config-exclusion-component',
  ConfigExclusionLocation = 'config-exclusion-location',
  ConfigExclusionType = 'config-exclusion-type',
  ConfigExclusionOperation = 'config-exclusion-operation',
  ConfigFileCategories = 'config-file-categories',

  PowerBIConfig = 'power-bi-report-config',

  // Global search dropdown
  TenantDropdown = 'tenant-drop-down',
  CompanyDropdown = 'company-drop-down',
  BUDropdown = 'bu-drop-down',

  SPSApi = 'sps-api',
  ConfigSPSColMapping = 'config-sps-api-column-mapping',
}

export enum Action {
  View = 'view',
  Add = 'add',
  Update = 'update',
  Delete = 'delete',
  ImportToExcel = 'import_to_excel',
  ProcessData = 'process_data',
  DeleteData = 'delete_data',
  RunAllLicenseScenario = 'run_all_license_scenario',
  Select = 'select',
  Call = 'call',
}
