import { IAdDevices } from '../../../services/ad/adDevices/adDevices.model';
import { IDropDownOption, ITableColumnSelection } from '../../../common/models/common';

export interface IAdDevicesState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IAdDevices[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  tableColumnSelection?: ITableColumnSelection;
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IAdDevices;
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
