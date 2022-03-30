import { ITableColumnSelection } from './../../models/common';
import { AsyncThunkAction } from '@reduxjs/toolkit';
import { FormInstance } from 'antd';
import { ISearch, ISearchResponse } from '../../../common/models/common';
import { RootState } from '../../../store/app.model';

export interface IDataTable {
  defaultOrderBy?: string;
  showAddButton?: boolean;
  showBulkUpdate?: boolean;
  setShowSelectedListModal?: (show: boolean) => void;
  globalSearchExist?: boolean;
  extraSearchData?: { [key: string]: any };
  setSelectedId?: (id: number) => void;
  setNumberOfRecords?: (id: number) => void;
  getTableColumns: (form: FormInstance<any>) => any[];
  reduxSelector: (state: RootState) => any;
  tableAction?: (_: any, data: any) => JSX.Element;
  tableButtons?: () => JSX.Element;
  searchTableData: (arg: ISearch) => AsyncThunkAction<ISearchResponse<any>, any, {}>;
  clearTableDataMessages?: () => { payload: undefined; type: string };
  exportExcelFile?: (arg: ISearch) => Promise<any>;
  setTableColumnSelection: (arg: ITableColumnSelection) => {
    payload: { [key: string]: boolean };
    type: string;
  };
  hideExportButton?: boolean;
  showCallApiBtn?: boolean;
  onCallAllApi?: (tableFilter: any) => void;
  setValuesForSelection?: (val: any) => void;
  disableRowSelection?: boolean;
  setObjectForColumnFilter?: (val: {}) => void;
  isCronJobApiButton?: boolean;
  isStartSchedulaAllApi?: boolean;
  hideShowHideButton?: boolean;

  //For SPS API CALL MODAL[TO PASS TYPE ID FOR SPS API OAUTH]
  type_id?: number;

  //For Excel Column Mapping Filter Keys
  isExcelColumnMapping?: boolean;

  //Is From SPS API Jobs Id ?
  isSpsApiJobsId?: boolean;

  //For Schedule API week day drop down
  setDropDownFlag?: (val: boolean) => void;
  dropDownFlag?: boolean;
  filterKeysDD?: any;
  filterRecordsForLocalSearch?: any[];

  //Show Delete Button
  showDelete?: boolean;
}
