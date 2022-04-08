import moment from 'moment';
import { toast } from 'react-toastify';
import { IScheduleDate } from '../services/common/common.model';
import { Moment } from 'moment';
import { Common } from './constants/common';

export const getPageHeight = () => {
  const header = document.querySelector('.header')?.clientHeight;
  const title = document.querySelector('.title-block')?.clientHeight;
  const tableHeader = document.querySelector('thead')?.offsetHeight;
  const totalHeight = document.body.clientHeight;
  const finalHeight = totalHeight - header - 2 * title - tableHeader - 50;
  return finalHeight;
};

export const getObjectForUpdateMultiple = (
  valuesForSelection: any,
  inputValues: any,
  tableName: string,
  isDummyDropDown?: boolean
) => {
  const Obj: any = {
    ...valuesForSelection,
  };
  const rowList = {
    ...Obj.selectedIds,
  };
  const bu1 = {};
  for (const x in inputValues.checked) {
    if (inputValues.checked[x] === true) {
      bu1[x] = inputValues[x];
    }
  }
  if (Object.keys(bu1).length === 0) {
    toast.error('Please select at least 1 field to update');
    return;
  }
  if (isDummyDropDown !== true) {
    Object.keys(Obj.filterKeys)?.forEach((key) => {
      const val = Obj.filterKeys[key];
      if (val?.length === 2 && typeof val[0] === 'object' && moment(val[0]).isValid()) {
        Obj.filterKeys[key] = {
          start_date: val[0],
          end_date: val[1],
        };
      }
    });
  }
  const objectForSelection = {
    table_name: tableName,
    update_data: bu1,
    filter_keys: Obj.filterKeys,
    is_export_to_excel: false,
    keyword: Obj.keyword,
    limit: Obj.limit,
    offset: Obj.offset,
    order_by: Obj.order_by,
    current_user: {},
    order_direction: Obj.order_direction,
  };
  if (isDummyDropDown === true) {
    objectForSelection['selectedIds'] = Obj.selectedIds;
  } else {
    rowList.selectedRowList = rowList.selectedRowList?.map((data) => data = data.split('-')[0]);
    objectForSelection['selectedIds'] = rowList.selectedRowList;
  }
  return objectForSelection;
};

export const getScheduleDateHelperLookup = (form: any, tableName: string) => {
  let process = {
    company_id: null,
    bu_id: null,
    tenant_id: null,
  };
  process = form;
  const getDataScheduleDate: IScheduleDate = {
    tenant_id: process.tenant_id,
    company_id: process.company_id,
    bu_id: process.bu_id,
    table_name: tableName,
  };
  return getDataScheduleDate;
};

//The Helper Functions are for Date and related thing

export const passDateToApi = (date: Moment | string | Date, isTime?: boolean) => {
  if (date !== null) {
    if (isTime) {
      return moment(date).format(Common.DATETIMEFORMAT);
    } else {
      return moment(date).format(Common.DATEFORMAT);
    }
  } else {
    return null;
  }
};

export const showDateFromApi = (date: Moment | string | Date, isTime?: boolean) => {
  if (date?.toString().includes('T')) {
    if (isTime) {
      return moment(date).utc().format(Common.DATETIMEFORMAT);
    } else {
      return moment(date).utc().format(Common.DATEFORMAT);
    }
  } else {
    if (isTime) {
      return moment(date).local().format(Common.DATETIMEFORMAT);
    } else {
      return moment(date).local().format(Common.DATEFORMAT);
    }
  }
};

export const forEditModal = (date: Moment | string) => {
  if (date?.toString().includes('T')) {
    return moment(date).utc();
  } else {
    return moment(date).local();
  }
};

export const forDropDown = (date: Moment | string) => {
  if (date?.toString().includes('T')) {
    return moment(date).utc().format(Common.DATEFORMAT).toString();
  } else {
    return moment(date).local().format(Common.DATEFORMAT).toString();
  }
};

export const getSimpleDate = (isUTC?: boolean) => {
  if (isUTC === true) {
    return moment().utc();
  } else {
    return moment();
  }
};

export const forDisableDate = () => {
  return moment().endOf('day');
};

export const getOnlyTime = (date: any) => {
  return moment(date).format('HH:MM:SS').toString();
};

export const getandReturn = (date: any) => {
  return moment(date);
};
