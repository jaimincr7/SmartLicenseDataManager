import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ICmsVendor } from '../../../services/cms/vendor/vendor.model';

export interface ICmsVendorState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ICmsVendor[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ICmsVendor;
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
