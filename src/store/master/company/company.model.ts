import { ICompany } from '../../../services/master/company/company.model';
import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';

export interface ICompanyState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ICompany[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ICompany;
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
  purge: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
  };
}
