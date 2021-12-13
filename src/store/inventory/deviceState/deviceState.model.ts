import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IDeviceState } from '../../../services/inventory/deviceState/deviceState.model';

export interface IDeviceStateState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IDeviceState[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IDeviceState;
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
