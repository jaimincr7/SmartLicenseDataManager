import { Checkbox, Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import {
  setTableColumnSelection,
  clearO365M365AppsUsageUserDetailMessages,
  o365M365AppsUsageUserDetailSelector,
} from '../../../../store/o365/o365M365AppsUsageUserDetail/o365M365AppsUsageUserDetail.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  deleteO365M365AppsUsageUserDetail,
  searchO365M365AppsUsageUserDetail,
} from '../../../../store/o365/o365M365AppsUsageUserDetail/o365M365AppsUsageUserDetail.action';
import _ from 'lodash';
import o365M365AppsUsageUserDetailService from '../../../../services/o365/o365M365AppsUsageUserDetail/o365M365AppsUsageUserDetail.service';
import {
  FilterByBooleanDropDown,
  FilterByDateSwap,
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { IMainTable, ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import DataTable from '../../../../common/components/DataTable';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import { AlignType } from 'rc-table/lib/interface';
import { globalSearchSelector } from '../../../../store/globalSearch/globalSearch.reducer';
import { showDateFromApi } from '../../../../common/helperFunction';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const {
    setSelectedId,
    setShowSelectedListModal,
    setValuesForSelection,
    isMultiple,
    setFilterKeys,
    tableButtons,
  } = props;
  const o365M365AppsUsageUserDetail = useAppSelector(o365M365AppsUsageUserDetailSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();
  const globalFilters = useAppSelector(globalSearchSelector);
  const [ObjectForColumnFilter, setObjectForColumnFilter] = useState({});

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  useEffect(() => {
    if (isMultiple) {
      dataTableRef?.current.getValuesForSelection();
    }
  }, [isMultiple]);

  const exportExcelFile = (searchData: ISearch) => {
    return o365M365AppsUsageUserDetailService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    setFilterKeys(ObjectForColumnFilter);
    return FilterWithSwapOption(
      dataIndex,
      o365M365AppsUsageUserDetail.search.tableName,
      form,
      null,
      ObjectForColumnFilter
    );
  };

  const FilterByDateSwapTable = (dataIndex: string, tableName: string, form: any) => {
    return FilterByDateSwap(dataIndex, tableName, form, null, ObjectForColumnFilter);
  };

  const getTableColumns = (form) => {
    return [
      {
        title: <span className="dragHandler">ID</span>,
        column: 'id',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('id', form),
            dataIndex: 'id',
            key: 'id',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Tenant Name</span>,
        column: 'TenantId',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'tenant_id',
              o365M365AppsUsageUserDetail.search.lookups?.tenants?.length > 0
                ? o365M365AppsUsageUserDetail.search.lookups?.tenants
                : globalFilters?.globalTenantLookup?.data
            ),
            dataIndex: 'tenant_name',
            key: 'tenant_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Company Name</span>,
        column: 'CompanyId',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'company_id',
              o365M365AppsUsageUserDetail.search.lookups?.companies?.length > 0
                ? o365M365AppsUsageUserDetail.search.lookups?.companies
                : globalFilters?.globalCompanyLookup?.data
            ),
            dataIndex: 'company_name',
            key: 'company_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Bu Name</span>,
        column: 'BU_Id',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'bu_id',
              o365M365AppsUsageUserDetail.search.lookups?.bus?.length > 0
                ? o365M365AppsUsageUserDetail.search.lookups?.bus
                : globalFilters?.globalBULookup?.data
            ),
            dataIndex: 'bu_name',
            key: 'bu_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Date Added</span>,
        column: 'Date Added',
        sorter: true,
        children: [
          {
            title: FilterByDateSwapTable(
              'date_added',
              o365M365AppsUsageUserDetail.search.tableName,
              form
            ),
            dataIndex: 'date_added',
            key: 'date_added',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Report Refresh Date</span>,
        column: 'Report Refresh Date',
        sorter: true,
        children: [
          {
            title: FilterByDateSwap(
              'report_refresh_date',
              o365M365AppsUsageUserDetail.search.tableName,
              form,
              null,
              ObjectForColumnFilter,
              true
            ),
            dataIndex: 'report_refresh_date',
            key: 'report_refresh_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">User Principal Name</span>,
        column: 'User Principal Name',
        sorter: true,
        children: [
          {
            title: FilterBySwap('user_principal_name', form),
            dataIndex: 'user_principal_name',
            key: 'user_principal_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Last Activation Date</span>,
        column: 'Last Activation Date',
        sorter: true,
        children: [
          {
            title: FilterByDateSwapTable(
              'last_activation_date',
              o365M365AppsUsageUserDetail.search.tableName,
              form
            ),
            dataIndex: 'last_activation_date',
            key: 'last_activation_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Last Activity Date</span>,
        column: 'Last Activity Date',
        sorter: true,
        children: [
          {
            title: FilterByDateSwapTable(
              'last_activity_date',
              o365M365AppsUsageUserDetail.search.tableName,
              form
            ),
            dataIndex: 'last_activity_date',
            key: 'last_activity_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Report Period</span>,
        column: 'Report Period',
        sorter: true,
        children: [
          {
            title: FilterBySwap('report_period', form),
            dataIndex: 'report_period',
            key: 'report_period',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Is Active on Windows</span>,
        column: 'Is Active on Windows',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_active_on_windows',
              o365M365AppsUsageUserDetail.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_active_on_windows',
            key: 'is_active_on_windows',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">Is Active on Mac</span>,
        column: 'Is Active on Mac',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_active_on_mac',
              o365M365AppsUsageUserDetail.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_active_on_mac',
            key: 'is_active_on_mac',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">Is Active on Mobile</span>,
        column: 'Is Active on Mobile',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_active_on_mobile',
              o365M365AppsUsageUserDetail.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_active_on_mobile',
            key: 'is_active_on_mobile',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">Is Active on Web</span>,
        column: 'Is Active on Web',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_active_on_web',
              o365M365AppsUsageUserDetail.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_active_on_web',
            key: 'is_active_on_web',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">Is Active on Outlook</span>,
        column: 'Is Active on Outlook',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_active_on_outlook',
              o365M365AppsUsageUserDetail.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_active_on_outlook',
            key: 'is_active_on_outlook',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">Is Active on Word</span>,
        column: 'Is Active on Word',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_active_on_word',
              o365M365AppsUsageUserDetail.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_active_on_word',
            key: 'is_active_on_word',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">Is Active on Excel</span>,
        column: 'Is Active on Excel',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_active_on_excel',
              o365M365AppsUsageUserDetail.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_active_on_excel',
            key: 'is_active_on_excel',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">Is Active on PowerPoint</span>,
        column: 'Is Active on PowerPoint',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_active_on_power_point',
              o365M365AppsUsageUserDetail.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_active_on_power_point',
            key: 'is_active_on_power_point',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">Is Active on OneNote</span>,
        column: 'Is Active on OneNote',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_active_on_one_note',
              o365M365AppsUsageUserDetail.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_active_on_one_note',
            key: 'is_active_on_one_note',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">Is Active on Teams</span>,
        column: 'Is Active on Teams',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_active_on_teams',
              o365M365AppsUsageUserDetail.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_active_on_teams',
            key: 'is_active_on_teams',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">Is Active on Outlook (Windows)</span>,
        column: 'Is Active on Outlook (Windows)',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_active_on_outlook_windows',
              o365M365AppsUsageUserDetail.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_active_on_outlook_windows',
            key: 'is_active_on_outlook_windows',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">Is Active on Word (Windows)</span>,
        column: 'Is Active on Word (Windows)',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_active_on_word_windows',
              o365M365AppsUsageUserDetail.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_active_on_word_windows',
            key: 'is_active_on_word_windows',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">Is Active on Excel (Windows)</span>,
        column: 'Is Active on Excel (Windows)',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_active_on_excel_windows',
              o365M365AppsUsageUserDetail.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_active_on_excel_windows',
            key: 'is_active_on_excel_windows',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">Is Active on PowerPoint (Windows)</span>,
        column: 'Is Active on PowerPoint (Windows)',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_active_on_power_point_windows',
              o365M365AppsUsageUserDetail.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_active_on_power_point_windows',
            key: 'is_active_on_power_point_windows',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">Is Active on OneNote (Windows)</span>,
        column: 'Is Active on OneNote (Windows)',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_active_on_one_note_windows',
              o365M365AppsUsageUserDetail.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_active_on_one_note_windows',
            key: 'is_active_on_one_note_windows',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">Is Active on Teams (Windows)</span>,
        column: 'Is Active on Teams (Windows)',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_active_on_teams_windows',
              o365M365AppsUsageUserDetail.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_active_on_teams_windows',
            key: 'is_active_on_teams_windows',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">Is Active on Outlook (Mac)</span>,
        column: 'Is Active on Outlook (Mac)',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_active_on_outlook_mac',
              o365M365AppsUsageUserDetail.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_active_on_outlook_mac',
            key: 'is_active_on_outlook_mac',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">Is Active on Word (Mac)</span>,
        column: 'Is Active on Word (Mac)',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_active_on_word_mac',
              o365M365AppsUsageUserDetail.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_active_on_word_mac',
            key: 'is_active_on_word_mac',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">Is Active on Excel (Mac)</span>,
        column: 'Is Active on Excel (Mac)',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_active_on_excel_mac',
              o365M365AppsUsageUserDetail.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_active_on_excel_mac',
            key: 'is_active_on_excel_mac',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">Is Active on PowerPoint (Mac)</span>,
        column: 'Is Active on PowerPoint (Mac)',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_active_on_power_point_mac',
              o365M365AppsUsageUserDetail.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_active_on_power_point_mac',
            key: 'is_active_on_power_point_mac',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">Is Active on OneNote (Mac)</span>,
        column: 'Is Active on OneNote (Mac)',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_active_on_one_note_mac',
              o365M365AppsUsageUserDetail.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_active_on_one_note_mac',
            key: 'is_active_on_one_note_mac',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">Is Active on Teams (Mac)</span>,
        column: 'Is Active on Teams (Mac)',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_active_on_teams_mac',
              o365M365AppsUsageUserDetail.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_active_on_teams_mac',
            key: 'is_active_on_teams_mac',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">Is Active on Outlook (Mobile)</span>,
        column: 'Is Active on Outlook (Mobile)',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_active_on_outlook_mobile',
              o365M365AppsUsageUserDetail.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_active_on_outlook_mobile',
            key: 'is_active_on_outlook_mobile',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">Is Active on Word (Mobile)</span>,
        column: 'Is Active on Word (Mobile)',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_active_on_word_mobile',
              o365M365AppsUsageUserDetail.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_active_on_word_mobile',
            key: 'is_active_on_word_mobile',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">Is Active on Excel (Mobile)</span>,
        column: 'Is Active on Excel (Mobile)',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_active_on_excel_mobile',
              o365M365AppsUsageUserDetail.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_active_on_excel_mobile',
            key: 'is_active_on_excel_mobile',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">Is Active on PowerPoint (Mobile)</span>,
        column: 'Is Active on PowerPoint (Mobile)',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_active_on_power_point_mobile',
              o365M365AppsUsageUserDetail.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_active_on_power_point_mobile',
            key: 'is_active_on_power_point_mobile',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">Is Active on OneNote (Mobile)</span>,
        column: 'Is Active on OneNote (Mobile)',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_active_on_one_note_mobile',
              o365M365AppsUsageUserDetail.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_active_on_one_note_mobile',
            key: 'is_active_on_one_note_mobile',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">Is Active on Teams (Mobile)</span>,
        column: 'Is Active on Teams (Mobile)',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_active_on_teams_mobile',
              o365M365AppsUsageUserDetail.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_active_on_teams_mobile',
            key: 'is_active_on_teams_mobile',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">Is Active on Outlook (Web)</span>,
        column: 'Is Active on Outlook (Web)',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_active_on_outlook_web',
              o365M365AppsUsageUserDetail.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_active_on_outlook_web',
            key: 'is_active_on_outlook_web',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">Is Active on Word (Web)</span>,
        column: 'Is Active on Word (Web)',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_active_on_word_web',
              o365M365AppsUsageUserDetail.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_active_on_word_web',
            key: 'is_active_on_word_web',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">Is Active on Excel (Web)</span>,
        column: 'Is Active on Excel (Web)',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_active_on_excel_web',
              o365M365AppsUsageUserDetail.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_active_on_excel_web',
            key: 'is_active_on_excel_web',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">Is Active on PowerPoint (Web)</span>,
        column: 'Is Active on PowerPoint (Web)',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_active_on_power_point_web',
              o365M365AppsUsageUserDetail.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_active_on_power_point_web',
            key: 'is_active_on_power_point_web',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">Is Active on OneNote (Web)</span>,
        column: 'Is Active on OneNote (Web)',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_active_on_one_note_web',
              o365M365AppsUsageUserDetail.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_active_on_one_note_web',
            key: 'is_active_on_one_note_web',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">Is Active on Teams (Web)</span>,
        column: 'Is Active on Teams (Web)',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_active_on_teams_web',
              o365M365AppsUsageUserDetail.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_active_on_teams_web',
            key: 'is_active_on_teams_web',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
    ];
  };

  const removeO365M365AppsUsageUserDetail = (id: number) => {
    dispatch(deleteO365M365AppsUsageUserDetail(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.O365M365AppsUsageUserDetail}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/o365/o365-m365-apps-usage-user-detail/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.O365M365AppsUsageUserDetail}>
        <Popconfirm
          title="Delete Record?"
          onConfirm={() => removeO365M365AppsUsageUserDetail(data.id)}
        >
          <a href="#" title="" className="action-btn">
            <img src={`${process.env.PUBLIC_URL}/assets/images/ic-delete.svg`} alt="" />
          </a>
        </Popconfirm>
      </Can>
    </div>
  );

  return (
    <>
      <DataTable
        ref={dataTableRef}
        showAddButton={ability.can(Action.Add, Page.O365M365AppsUsageUserDetail)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={o365M365AppsUsageUserDetailSelector}
        searchTableData={searchO365M365AppsUsageUserDetail}
        clearTableDataMessages={clearO365M365AppsUsageUserDetailMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.O365M365AppsUsageUserDetail)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
