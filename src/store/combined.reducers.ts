import { combineReducers } from 'redux';
import errorLogReducer from './errorLog/errorLog.reducer';
import sqlServerReducer from './sqlServer/sqlServer.reducer';

export const rootReducer = combineReducers({
  errorLog: errorLogReducer,
  sqlServer: sqlServerReducer,
});
