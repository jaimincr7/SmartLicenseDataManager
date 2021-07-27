import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  setTableColumnSelection,
  clearO365OneDriveUsageMessages,
  o365OneDriveUsageSelector,
} from '../../../../store/o365/o365OneDriveUsage/o365OneDriveUsage.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  deleteO365OneDriveUsage,
  searchO365OneDriveUsage,
} from '../../../../store/o365/o365OneDriveUsage/o365OneDriveUsage.action';
import { IMainTable } from './mainTable.model';
import _ from 'lodash';
import o365OneDriveUsageService from '../../../../services/o365/o365OneDriveUsage/o365OneDriveUsage.service';
import {
  FilterByDate,
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import DataTable from '../../../../common/components/DataTable';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import moment from 'moment';
import { Common } from '../../../../common/constants/common';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const { setSelectedId } = props;
  const o365OneDriveUsage = useAppSelector(o365OneDriveUsageSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const exportExcelFile = (searchData: ISearch) => {
    return o365OneDriveUsageService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(dataIndex, o365OneDriveUsage.search.tableName, form);
  };

  const getTableColumns = (form) => {
    return [
      {
        title: 'Tenant Name',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('tenant_id', o365OneDriveUsage.search.lookups?.tenants),
            dataIndex: 'tenant_name',
            key: 'tenant_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Company Name',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('company_id', o365OneDriveUsage.search.lookups?.companies),
            dataIndex: 'company_name',
            key: 'company_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Bu Name',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('bu_id', o365OneDriveUsage.search.lookups?.bus),
            dataIndex: 'bu_name',
            key: 'bu_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Date Added',
        sorter: true,
        children: [
          {
            title: FilterByDate('date_added'),
            dataIndex: 'date_added',
            key: 'date_added',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: 'Report Refresh Date',
        sorter: true,
        children: [
          {
            title: FilterByDate('report_refresh_date'),
            dataIndex: 'report_refresh_date',
            key: 'report_refresh_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: 'Owner Principal Name',
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
        title: 'Owner Display Name',
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
        title: 'Last Activity Date',
        sorter: true,
        children: [
          {
            title: FilterByDate('last_activity_date'),
            dataIndex: 'last_activity_date',
            key: 'last_activity_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: 'Site URL',
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
        title: 'File Count',
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
        title: 'Active File Count',
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
        title: 'Storage Allocated (Byte)',
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
        title: 'Storage Used (Byte)',
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
        title: 'Report Period',
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
        title: 'Is Deleted',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('is_deleted', o365OneDriveUsage.search.lookups?.booleanLookup),
            dataIndex: 'is_deleted',
            key: 'is_deleted',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
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
        <Popconfirm title="Sure to delete?" onConfirm={() => removeO365OneDriveUsage(data.id)}>
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
      />
    </>
  );
};

export default forwardRef(MainTable);
