import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ISlim360O365UserLicenses } from '../../../services/slim360/o365UserLicenses/o365UserLicenses.model';

export interface ISlim360O365UserLicensesState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ISlim360O365UserLicenses[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ISlim360O365UserLicenses;
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
