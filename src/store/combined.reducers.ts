import { combineReducers } from 'redux';
import azureAuthReducer from './auth/azureAuth.reducer';
import commonReducer from './common/common.reducer';
import errorLogReducer from './errorLog/errorLog.reducer';
import sqlServerReducer from './sqlServer/sqlServer.reducer';
import sqlServerEntitlementsReducer from './sqlServerEntitlements/sqlServerEntitlements.reducer';

export const rootReducer = combineReducers({
  errorLog: errorLogReducer,
  sqlServer: sqlServerReducer,
  common: commonReducer,
  sqlServerEntitlements: sqlServerEntitlementsReducer,
  azureAuth: azureAuthReducer,
});
