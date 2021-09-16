import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ISlim360O365Licenses } from '../../../services/slim360/o365Licenses/o365Licenses.model';

export interface ISlim360O365LicensesState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ISlim360O365Licenses[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ISlim360O365Licenses;
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
