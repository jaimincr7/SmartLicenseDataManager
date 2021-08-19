import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ICmsCategoryExtended } from '../../../services/cms/categoryExtended/categoryExtended.model';

export interface ICmsCategoryExtendedState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ICmsCategoryExtended[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ICmsCategoryExtended;
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
