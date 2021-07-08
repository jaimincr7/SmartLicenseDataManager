import { combineReducers } from 'redux';
import adDevicesReducer from './adDevices/adDevices.reducer';
import adDevicesExclusionsReducer from './adDevicesExclusions/adDevicesExclusions.reducer';
import adUsersReducer from './adUsers/adUsers.reducer';
import bulkImportReducer from './bulkImport/bulkImport.reducer';
import commonReducer from './common/common.reducer';
import errorLogReducer from './errorLog/errorLog.reducer';
import sqlServerInventoryReducer from './sqlServerInventory/sqlServerInventory.reducer';
import sqlServerEntitlementsReducer from './sqlServerEntitlements/sqlServerEntitlements.reducer';
import sqlServerExclusionsReducer from './sqlServerExclusions/sqlServerExclusions.reducer';
import sqlServerLicenseReducer from './sqlServerLicense/sqlServerLicense.reducer';
import sqlServerLicenseDetailReducer from './sqlServerLicenseDetail/sqlServerLicenseDetail.reducer';
import sqlServerOverridesReducer from './sqlServerOverrides/sqlServerOverrides.reducer';
import sqlServerPricingReducer from './sqlServerPricing/sqlServerPricing.reducer';
import userReducer from './user/user.reducer';
import windowsServerEntitlementsReducer from './windowsServer/windowsServerEntitlements/windowsServerEntitlements.reducer';
import windowsServerExclusionsReducer from './windowsServer/windowsServerExclusions/windowsServerExclusions.reducer';
import windowsServerInventoryReducer from './windowsServer/windowsServerInventory/windowsServerInventory.reducer';
import windowsServerOverridesReducer from './windowsServer/windowsServerOverrides/windowsServerOverrides.reducer';
import windowsServerPricingReducer from './windowsServer/windowsServerPricing/windowsServerPricing.reducer';

export const rootReducer = combineReducers({
  errorLog: errorLogReducer,
  sqlServerInventory: sqlServerInventoryReducer,
  common: commonReducer,
  sqlServerEntitlements: sqlServerEntitlementsReducer,
  adDevices: adDevicesReducer,
  adDevicesExclusions: adDevicesExclusionsReducer,
  adUsers: adUsersReducer,
  sqlServerOverrides: sqlServerOverridesReducer,
  sqlServerPricing: sqlServerPricingReducer,
  bulkImport: bulkImportReducer,
  sqlServerLicense: sqlServerLicenseReducer,
  windowsServerInventory: windowsServerInventoryReducer,
  user: userReducer,
  windowsServerEntitlements: windowsServerEntitlementsReducer,
  windowsServerOverrides: windowsServerOverridesReducer,
  sqlServerLicenseDetail: sqlServerLicenseDetailReducer,
  windowsServerPricing: windowsServerPricingReducer,
  sqlServerExclusions: sqlServerExclusionsReducer,
  windowsServerExclusions: windowsServerExclusionsReducer,
});
