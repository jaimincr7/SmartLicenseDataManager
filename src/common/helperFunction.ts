import { toast } from 'react-toastify';
import { IScheduleDate } from '../services/common/common.model';

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
  tableName: string
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
  objectForSelection['selectedIds'] = rowList.selectedRowList;
  return objectForSelection;
};

export const getScheduleDateHelperLookup = (form: any,tableName: string) => {
  let process = {
    company_id: null,
    bu_id: null,
    tenant_id: null,
    table_name: '',
  };
  process = form.getFieldsValue();
  const getDataScheduleDate: IScheduleDate = {
    company_id: process.company_id,
    bu_id: process.bu_id,
    table_name: tableName,
  };
  return getDataScheduleDate;
}