import { IDataTableForImport } from '../../services/bulkImport/bulkImport.model';
import { IDatabaseTable, IGetExcelColumns, ITableColumn } from '../../services/common/common.model';

export interface IBulkImportState {
  getTablesForImport: {
    loading: boolean;
    hasErrors: boolean;
    data: IDataTableForImport[];
  };
  getTables: {
    loading: boolean;
    hasErrors: boolean;
    data: IDatabaseTable[];
  };
  saveTableForImport: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
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
