import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IConfigExclusionType } from '../../../services/master/exclusionType/exclusionType.model';

export interface IConfigExclusionTypeState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IConfigExclusionType[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IConfigExclusionType;
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
