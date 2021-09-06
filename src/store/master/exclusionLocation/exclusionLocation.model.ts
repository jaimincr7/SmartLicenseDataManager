import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IConfigExclusionLocation } from '../../../services/master/exclusionLocation/exclusionLocation.model';

export interface IConfigExclusionLocationState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IConfigExclusionLocation[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IConfigExclusionLocation;
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
