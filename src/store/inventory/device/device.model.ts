import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IDevice } from '../../../services/inventory/device/device.model';

export interface IDeviceState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IDevice[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IDevice;
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
  processData: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
  };
}
