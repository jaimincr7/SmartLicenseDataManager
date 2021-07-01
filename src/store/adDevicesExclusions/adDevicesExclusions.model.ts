import { IGetExcelColumns } from '../../services/adDevicesExclusions/adDevicesExclusions.model';
import { IDropDownOption } from '../../common/models/common';
import { IAdDevicesExclusions } from '../../services/adDevicesExclusions/adDevicesExclusions.model';

export interface IAdDevicesExclusionsState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IAdDevicesExclusions[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
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
  deleteDataset: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
  };
  processData: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
  };
  getExcelColumns: {
    loading: boolean;
    hasErrors: boolean;
    data: IGetExcelColumns;
  };
  bulkInsert: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
  };
}
