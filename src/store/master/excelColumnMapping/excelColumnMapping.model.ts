import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IExcelColumnMapping } from '../../../services/master/excelColumnMapping/excelColumnMapping.model';

export interface IExcelColumnMappingState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IExcelColumnMapping[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IExcelColumnMapping;
  };
  save: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
  };
  delete: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
  };
}
