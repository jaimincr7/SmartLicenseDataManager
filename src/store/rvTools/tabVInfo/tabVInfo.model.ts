import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ITabVInfo } from '../../../services/rvTools/tabVInfo/tabVInfo.model';

export interface ITabVInfoState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ITabVInfo[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ITabVInfo;
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
