import { IMainTable } from '../../../../common/models/common';

export interface IMainTableCron extends IMainTable {
  dropDownFlag?: boolean;
  setDropDownFlag?: (val: boolean) => void;
}
