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
  deleteColumnMapping: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
  };
  deleteFileMapping: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
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
  getExcelFileMappingLookup: {
    loading: boolean;
    hasErrors: boolean;
    data: any[];
  };
  getExcelColumns: {
    loading: boolean;
    hasErrors: boolean;
    data?: IGetExcelColumns[];
    csvFiles?: any;
    progress?: number;
  };
  getCSVExcelColumns: {
    loading: boolean;
    hasErrors: boolean;
    data?: IGetExcelColumns[];
    csvFiles?: any;
  };
  bulkInsert: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
  };
  getExcelMappingColumns: {
    loading: boolean;
    messages: string[];
    data: any;
  };
  saveExcelFileMapping: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
    data: any;
  };
}
