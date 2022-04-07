import { Checkbox, Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import {
  setTableColumnSelection,
  clearO365OneDriveUsageMessages,
  o365OneDriveUsageSelector,
} from '../../../../store/o365/o365OneDriveUsage/o365OneDriveUsage.reducer';
import { AlignType } from 'rc-table/lib/interface';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  deleteO365OneDriveUsage,
  searchO365OneDriveUsage,
} from '../../../../store/o365/o365OneDriveUsage/o365OneDriveUsage.action';
import _ from 'lodash';
import o365OneDriveUsageService from '../../../../services/o365/o365OneDriveUsage/o365OneDriveUsage.service';
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
  const o365OneDriveUsage = useAppSelector(o365OneDriveUsageSelector);
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
    return o365OneDriveUsageService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    setFilterKeys(ObjectForColumnFilter);
    return FilterWithSwapOption(
      dataIndex,
      o365OneDriveUsage.search.tableName,
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
              o365OneDriveUsage.search.lookups?.tenants?.length > 0
                ? o365OneDriveUsage.search.lookups?.tenants
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
              o365OneDriveUsage.search.lookups?.companies?.length > 0
                ? o365OneDriveUsage.search.lookups?.companies
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
              o365OneDriveUsage.search.lookups?.bus?.length > 0
                ? o365OneDriveUsage.search.lookups?.bus
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
            title: FilterByDateSwapTable('date_added', o365OneDriveUsage.search.tableName, form),
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
              o365OneDriveUsage.search.tableName,
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
        title: <span className="dragHandler">Owner Principal Name</span>,
        column: 'Owner Principal Name',
        sorter: true,
        children: [
          {
            title: FilterBySwap('owner_principal_name', form),
            dataIndex: 'owner_principal_name',
            key: 'owner_principal_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Owner Display Name</span>,
        column: 'Owner Display Name',
        sorter: true,
        children: [
          {
            title: FilterBySwap('owner_display_name', form),
            dataIndex: 'owner_display_name',
            key: 'owner_display_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Last Activity Date</span>,
        column: 'Last Activity Date',
        sorter: true,
        children: [
          {
            title: FilterByDateSwap(
              'last_activity_date',
              o365OneDriveUsage.search.tableName,
              form,
              null,
              ObjectForColumnFilter,
              true
            ),
            dataIndex: 'last_activity_date',
            key: 'last_activity_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Site URL</span>,
        column: 'Site URL',
        sorter: true,
        children: [
          {
            title: FilterBySwap('site_url', form),
            dataIndex: 'site_url',
            key: 'site_url',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">File Count</span>,
        column: 'File Count',
        sorter: true,
        children: [
          {
            title: FilterBySwap('file_count', form),
            dataIndex: 'file_count',
            key: 'file_count',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Active File Count</span>,
        column: 'Active File Count',
        sorter: true,
        children: [
          {
            title: FilterBySwap('active_file_count', form),
            dataIndex: 'active_file_count',
            key: 'active_file_count',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Storage Allocated (Byte)</span>,
        column: 'Storage Allocated (Byte)',
        sorter: true,
        children: [
          {
            title: FilterBySwap('storage_allocated_byte', form),
            dataIndex: 'storage_allocated_byte',
            key: 'storage_allocated_byte',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Storage Used (Byte)</span>,
        column: 'Storage Used (Byte)',
        sorter: true,
        children: [
          {
            title: FilterBySwap('storage_used_byte', form),
            dataIndex: 'storage_used_byte',
            key: 'storage_used_byte',
            ellipsis: true,
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
        title: <span className="dragHandler">Is Deleted</span>,
        column: 'Is Deleted',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_deleted',
              o365OneDriveUsage.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_deleted',
            key: 'is_deleted',
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

  const removeO365OneDriveUsage = (id: number) => {
    dispatch(deleteO365OneDriveUsage(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.O365OneDriveUsage}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/o365/o365-one-drive-usage/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.O365OneDriveUsage}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeO365OneDriveUsage(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.O365OneDriveUsage)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={o365OneDriveUsageSelector}
        searchTableData={searchO365OneDriveUsage}
        clearTableDataMessages={clearO365OneDriveUsageMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.O365OneDriveUsage)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
