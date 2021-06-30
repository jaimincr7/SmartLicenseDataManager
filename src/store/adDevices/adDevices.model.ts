import { IAdDevices } from './../../services/adDevices/adDevices.model';
import { IGetExcelColumns } from './../../services/sqlServer/sqlServer.model';
import { IDropDownOption } from '../../common/models/common';
import { ISqlServer } from '../../services/sqlServer/sqlServer.model';

export interface IAdDevicesState {
  search: {
    loading: boolean;
    hasErrors: boolean;
    data: IAdDevices[];
    count: number;
    lookups?: { [key: string]: IDropDownOption[] };
  };
  // getById: {
  //   loading: boolean;
  //   hasErrors: boolean;
  //   data: ISqlServer;
  // };
  // save: {
  //   loading: boolean;
  //   hasErrors: boolean;
  //   messages: string[];
  // };
  delete: {
    loading: boolean;
    hasErrors: boolean;
    messages: string[];
  };
  // deleteDataset: {
  //   loading: boolean;
  //   hasErrors: boolean;
  //   messages: string[];
  // };
  // processData: {
  //   loading: boolean;
  //   hasErrors: boolean;
  //   messages: string[];
  // };
  // getExcelColumns: {
  //   loading: boolean;
  //   hasErrors: boolean;
  //   data: IGetExcelColumns;
  // };
  // bulkInsert: {
  //   loading: boolean;
  //   hasErrors: boolean;
  //   messages: string[];
  // };
}
