import { combineReducers } from 'redux';
import adDevicesReducer from './adDevices/adDevices.reducer';
import adDevicesExclusionsReducer from './adDevicesExclusions/adDevicesExclusions.reducer';
import adUsersReducer from './adUsers/adUsers.reducer';
import bulkImportReducer from './bulkImport/bulkImport.reducer';
import commonReducer from './common/common.reducer';
import errorLogReducer from './errorLog/errorLog.reducer';
import sqlServerReducer from './sqlServer/sqlServer.reducer';
import sqlServerEntitlementsReducer from './sqlServerEntitlements/sqlServerEntitlements.reducer';
import sqlServerOverridesReducer from './sqlServerOverrides/sqlServerOverrides.reducer';
import sqlServerPricingReducer from './sqlServerPricing/sqlServerPricing.reducer';

export const rootReducer = combineReducers({
  errorLog: errorLogReducer,
  sqlServer: sqlServerReducer,
  common: commonReducer,
  sqlServerEntitlements: sqlServerEntitlementsReducer,
  adDevices: adDevicesReducer,
  adDevicesExclusions: adDevicesExclusionsReducer,
  adUsers: adUsersReducer,
  sqlServerOverrides: sqlServerOverridesReducer,
  sqlServerPricing: sqlServerPricingReducer,
  bulkImport: bulkImportReducer,
});
