import { ITableColumnSelection } from '../../../common/models/common';
import { IDatabaseTable, ITableColumn } from '../../../services/common/common.model';

export interface IGlobalTableColumnSelectionState {
  getDatabaseTables: {
    loading: boolean;
    hasErrors: boolean;
    data: IDatabaseTable[];
  };
  getGlobalTableColumns: {
    loading: boolean;
    hasErrors: boolean;
    data: ITableColumnSelection;
  };
  getTableColumns: {
    loading: boolean;
    hasErrors: boolean;
    data: ITableColumn[];
  };
  saveGlobalTableColumnSelection: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
  };
}
