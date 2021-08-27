import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IAPIColMapping } from '../../../services/sps/apiColumnMapping/apiColMapping.model';

export interface IAPiColMappingState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IAPIColMapping[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IAPIColMapping;
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
  columnLookups: {
    loading: boolean;
    hasErrors: boolean;
    data: IDropDownOption[];
  };
  apiColumn: {
    loading: boolean;
    hasErrors: boolean;
    data: string[];
  };
}
