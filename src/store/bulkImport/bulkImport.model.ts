import { IDatabaseTable, IGetExcelColumns, ITableColumn } from '../../services/common/common.model';

export interface IBulkImportState {
  getDatabaseTables: {
    loading: boolean;
    hasErrors: boolean;
    data: IDatabaseTable[];
  };
  getTableColumns: {
    loading: boolean;
    hasErrors: boolean;
    data: ITableColumn[];
  };
  getExcelColumns: {
    loading: boolean;
    hasErrors: boolean;
    data?: IGetExcelColumns;
  };
  bulkInsert: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
  };
}
