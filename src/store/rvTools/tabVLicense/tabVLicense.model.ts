import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ITabVLicense } from '../../../services/rvTools/tabVLicense/tabVLicense.model';

export interface ITabVLicenseState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ITabVLicense[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ITabVLicense;
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
