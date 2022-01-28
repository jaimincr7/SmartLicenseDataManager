import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';
import { IHardware } from '../../../services/inventory/hardware/hardware.model';

export interface IHardwareState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IHardware[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IHardware;
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
