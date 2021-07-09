import { ITableColumnSelection } from './../../models/common';
import { AsyncThunkAction } from '@reduxjs/toolkit';
import { FormInstance } from 'antd';
import { ISearch, ISearchResponse } from '../../../common/models/common';
import { RootState } from '../../../store/app.model';

export interface IDataTable {
  showAddButton?: boolean;
  setSelectedId: (id: number) => void;
  getTableColumns: (form: FormInstance<any>) => any[];
  reduxSelector: (state: RootState) => any;
  tableAction: (_: any, data: any) => JSX.Element;
  searchTableData: (arg: ISearch) => AsyncThunkAction<ISearchResponse<any>, any, {}>;
  clearTableDataMessages: () => { payload: undefined; type: string };
  exportExcelFile?: (arg: ISearch) => Promise<any>;
  setTableColumnSelection: (arg: ITableColumnSelection) => {
    payload: { [key: string]: boolean };
    type: string;
  };
}
