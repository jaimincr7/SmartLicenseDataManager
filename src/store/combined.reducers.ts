import { combineReducers } from 'redux';
import commonReducer from './common/common.reducer';
import errorLogReducer from './errorLog/errorLog.reducer';
import sqlServerReducer from './sqlServer/sqlServer.reducer';

export const rootReducer = combineReducers({
  errorLog: errorLogReducer,
  sqlServer: sqlServerReducer,
  common: commonReducer,
});
