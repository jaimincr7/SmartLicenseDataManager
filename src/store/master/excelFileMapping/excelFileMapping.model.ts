import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ILookup } from '../../../services/common/common.model';
import { IExcelFileMapping } from '../../../services/master/excelFileMapping/excelFileMapping.model';

export interface IExcelFileMappingState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IExcelFileMapping[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IExcelFileMapping;
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
