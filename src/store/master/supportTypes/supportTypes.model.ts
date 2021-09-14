import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IConfigSupportTypes } from '../../../services/master/supportTypes/supportTypes.model';

export interface IConfigSupportTypesState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IConfigSupportTypes[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IConfigSupportTypes;
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
