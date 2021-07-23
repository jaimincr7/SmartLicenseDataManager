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

  Menu = 'menu',
  Tenant = 'tenant',
  Company = 'company',
  Bu = 'bu',
  Currency = 'currency',
  RoleMenuRights = 'role-menu-access-right',
  CompanyMenuRights = 'company-menu-access-right',
  GlobalTableColumnSelection = 'global-table-column-selection',

  TabVCluster = 'tab-v-cluster',
  TabVHost = 'tab-v-host',
  TabVInfo = 'tab-v-info',

  AzureDailyUsage = 'azure-daily-usage',
  AzureRateCard = 'azure-rate-card',
  AzureAPIVmSizes = 'azure-api-vm-sizes',

  BulkImport = 'bulk-import',
  O365ActivationsUserDetail = 'o365-activations-user-detail',

  // Global search dropdown
  TenantDropdown = 'tenant-drop-down',
  CompanyDropdown = 'company-drop-down',
  BUDropdown = 'bu-drop-down',
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
}
