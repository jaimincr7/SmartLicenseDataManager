import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { ICmdbDevice } from '../../../services/cmdb/device/device.model';

export interface ICmdbDeviceState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: ICmdbDevice[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: ICmdbDevice;
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
