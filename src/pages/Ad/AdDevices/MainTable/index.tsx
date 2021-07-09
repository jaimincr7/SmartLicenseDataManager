import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  clearAdDeviceMessages,
  adDevicesSelector,
} from '../../../../store/ad/adDevices/adDevices.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import { deleteAdDevice, searchAdDevices } from '../../../../store/ad/adDevices/adDevices.action';
import { IMainTable } from './mainTable.model';
import moment from 'moment';
import { Common } from '../../../../common/constants/common';
import _ from 'lodash';
import adDevicesService from '../../../../services/ad/adDevices/adDevices.service';
import {
  FilterByDate,
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import DataTable from '../../../../common/components/DataTable';
import { setTableColumnSelection } from '../../../../store/ad/adDevices/adDevices.reducer';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const { setSelectedId } = props;
  const adDevices = useAppSelector(adDevicesSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const exportExcelFile = (searchData: ISearch) => {
    return adDevicesService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(dataIndex, adDevices.search.tableName, form);
  };

  const getTableColumns = (form) => {
    return [
      {
        title: 'Name',
        sorter: true,
        children: [
          {
            title: FilterBySwap('name', form),
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Device Type',
        sorter: true,
        children: [
          {
            title: FilterBySwap('device_type', form),
            dataIndex: 'device_type',
            key: 'device_type',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Tenant Name',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('tenant_id', adDevices.search.lookups?.tenants),
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
            title: FilterByDropdown('company_id', adDevices.search.lookups?.companies),
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
            title: FilterByDropdown('bu_id', adDevices.search.lookups?.bus),
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
        title: 'Enabled',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('enabled', adDevices.search.lookups?.booleanLookup),
            dataIndex: 'enabled',
            key: 'enabled',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'iPv4 Address',
        sorter: true,
        children: [
          {
            title: FilterBySwap('iPv4_address', form),
            dataIndex: 'iPv4_address',
            key: 'iPv4_address',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Last Logon',
        sorter: true,
        children: [
          {
            title: FilterBySwap('last_logon', form),
            dataIndex: 'last_logon',
            key: 'last_logon',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Last Logon Date',
        sorter: true,
        children: [
          {
            title: FilterByDate('last_logon_date'),
            dataIndex: 'last_logon_date',
            key: 'last_logon_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: 'Last Logon Timestamp',
        sorter: true,
        children: [
          {
            title: FilterBySwap('last_logon_timestamp', form),
            dataIndex: 'last_logon_timestamp',
            key: 'last_logon_timestamp',
            ellipsis: true,
          },
        ],
      },

      {
        title: 'Object Class',
        sorter: true,
        children: [
          {
            title: FilterBySwap('object_class', form),
            dataIndex: 'object_class',
            key: 'object_class',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Object Guid',
        sorter: true,
        children: [
          {
            title: FilterBySwap('object_guid', form),
            dataIndex: 'object_guid',
            key: 'object_guid',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Operating  System',
        sorter: true,
        children: [
          {
            title: FilterBySwap('operating_system', form),
            dataIndex: 'operating_system',
            key: 'operating_system',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Password Expired',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('password_expired', adDevices.search.lookups?.booleanLookup),
            dataIndex: 'password_expired',
            key: 'password_expired',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Source',
        sorter: true,
        children: [
          {
            title: FilterBySwap('source', form),
            dataIndex: 'source',
            key: 'source',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Password Last Set',
        sorter: true,
        children: [
          {
            title: FilterByDate('password_last_set'),
            dataIndex: 'password_last_set',
            key: 'password_last_set',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: 'Password Never Expires',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown(
              'password_never_expires',
              adDevices.search.lookups?.booleanLookup
            ),
            dataIndex: 'password_never_expires',
            key: 'password_never_expires',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Sam Account Name',
        sorter: true,
        children: [
          {
            title: FilterBySwap('sam_account_name', form),
            dataIndex: 'sam_account_name',
            key: 'sam_account_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'SId',
        sorter: true,
        children: [
          {
            title: FilterBySwap('sid', form),
            dataIndex: 'sid',
            key: 'sid',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'User Principal Name',
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
        title: 'When Created',
        sorter: true,
        children: [
          {
            title: FilterByDate('when_created'),
            dataIndex: 'when_created',
            key: 'when_created',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: 'Exclusion',
        sorter: true,
        children: [
          {
            title: FilterBySwap('exclusion', form), //FilterByDropdown('exclusion_id', adDevices.search.lookups?.exclusion),
            dataIndex: 'exclusion',
            key: 'exclusion',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Distinguished Name',
        sorter: true,
        children: [
          {
            title: FilterBySwap('distinguished_name', form),
            dataIndex: 'distinguished_name',
            key: 'distinguished_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'DNS Host Name',
        sorter: true,
        children: [
          {
            title: FilterBySwap('dns_host_name', form),
            dataIndex: 'dns_host_name',
            key: 'dns_host_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Inventoried',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('inventoried', adDevices.search.lookups?.booleanLookup),
            dataIndex: 'inventoried',
            key: 'inventoried',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Active',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('active', adDevices.search.lookups?.booleanLookup),
            dataIndex: 'active',
            key: 'active',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Qualified',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('qualified', adDevices.search.lookups?.booleanLookup),
            dataIndex: 'qualified',
            key: 'qualified',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Domain',
        sorter: true,
        children: [
          {
            title: FilterBySwap('domain', form),
            dataIndex: 'domain',
            key: 'domain',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Description',
        sorter: true,
        children: [
          {
            title: FilterBySwap('description', form),
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeAdDevice = (id: number) => {
    dispatch(deleteAdDevice(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <a
        className="action-btn"
        onClick={() => {
          setSelectedId(data.id);
          history.push(`/ad/ad-devices/${data.id}`);
        }}
      >
        <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
      </a>
      <Popconfirm title="Sure to delete?" onConfirm={() => removeAdDevice(data.id)}>
        <a href="#" title="" className="action-btn">
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-delete.svg`} alt="" />
        </a>
      </Popconfirm>
    </div>
  );

  return (
    <>
      <DataTable
        ref={dataTableRef}
        showAddButton={true}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={adDevicesSelector}
        searchTableData={searchAdDevices}
        clearTableDataMessages={clearAdDeviceMessages}
        setTableColumnSelection={setTableColumnSelection}
      />
    </>
  );
};

export default forwardRef(MainTable);
