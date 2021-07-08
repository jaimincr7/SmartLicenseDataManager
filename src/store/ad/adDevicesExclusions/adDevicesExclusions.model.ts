import { IDropDownOption } from '../../../common/models/common';
import { IAdDevicesExclusions } from '../../../services/ad/adDevicesExclusions/adDevicesExclusions.model';

export interface IAdDevicesExclusionsState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IAdDevicesExclusions[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
    tableName: string;
  };
  getById: {
    loading: boolean;
    hasErrors: boolean;
    data: IAdDevicesExclusions;
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
