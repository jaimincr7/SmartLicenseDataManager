import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  clearAdUsersMessages,
  adUsersSelector,
} from '../../../../store/ad/adUsers/adUsers.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import { deleteAdUser, searchAdUsers } from '../../../../store/ad/adUsers/adUsers.action';
import { IMainTable } from './mainTable.model';
import moment from 'moment';
import { Common } from '../../../../common/constants/common';
import _ from 'lodash';
import adUsersService from '../../../../services/ad/adUsers/adUsers.service';
import {
  FilterByDate,
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import DataTable from '../../../../common/components/DataTable';
import { setTableColumnSelection } from '../../../../store/ad/adUsers/adUsers.reducer';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const { setSelectedId } = props;
  const adUsers = useAppSelector(adUsersSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const exportExcelFile = (searchData: ISearch) => {
    return adUsersService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(dataIndex, adUsers.search.tableName, form);
  };

  const getTableColumns = (form) => {
    return [
      {
        title: 'Display Name',
        sorter: true,
        children: [
          {
            title: FilterBySwap('display_name', form),
            dataIndex: 'display_name',
            key: 'display_name',
            ellipsis: true,
          },
        ],
      },
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
        title: 'Surname',
        sorter: true,
        children: [
          {
            title: FilterBySwap('surname', form),
            dataIndex: 'surname',
            key: 'surname',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Tenant Name',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('tenant_id', adUsers.search.lookups?.tenants),
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
            title: FilterByDropdown('company_id', adUsers.search.lookups?.companies),
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
            title: FilterByDropdown('bu_id', adUsers.search.lookups?.bus),
            dataIndex: 'bu_name',
            key: 'bu_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Enabled',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('enabled', adUsers.search.lookups?.booleanLookup),
            dataIndex: 'enabled',
            key: 'enabled',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Given Name',
        sorter: true,
        children: [
          {
            title: FilterBySwap('given_name', form),
            dataIndex: 'given_name',
            key: 'given_name',
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
        title: 'Object GUId',
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
        title: 'Locked Out',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('locked_out', adUsers.search.lookups?.booleanLookup),
            dataIndex: 'locked_out',
            key: 'locked_out',
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
        children: [
          {
            title: FilterByDropdown(
              'password_never_expires',
              adUsers.search.lookups?.booleanLookup
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
        title: 'When Changed',
        sorter: true,
        children: [
          {
            title: FilterByDate('whenChanged'),
            dataIndex: 'whenChanged',
            key: 'whenChanged',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
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
            title: FilterBySwap('exclusion', form), //FilterByDropdown('exclusion_id', adUsers.search.lookups?.exclusion),
            dataIndex: 'exclusion',
            key: 'exclusion',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Exclusion Id',
        sorter: true,
        children: [
          {
            title: FilterBySwap('exclusion_id', form), //FilterByDropdown('exclusion_id', adUsers.search.lookups?.exclusion),
            dataIndex: 'exclusion_id',
            key: 'exclusion_id',
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
        title: 'Password Not Required',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('password_not_required', adUsers.search.lookups?.booleanLookup),
            dataIndex: 'password_not_required',
            key: 'password_not_required',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Inventoried',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('inventoried', adUsers.search.lookups?.booleanLookup),
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
            title: FilterByDropdown('active', adUsers.search.lookups?.booleanLookup),
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
            title: FilterByDropdown('qualified', adUsers.search.lookups?.booleanLookup),
            dataIndex: 'qualified',
            key: 'qualified',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'o365 Licensed',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('o365_licensed', adUsers.search.lookups?.booleanLookup),
            dataIndex: 'o365_licensed',
            key: 'o365_licensed',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'o365 Licenses',
        sorter: true,
        children: [
          {
            title: FilterBySwap('o365_licenses', form),
            dataIndex: 'o365_licenses',
            key: 'o365_licenses',
            ellipsis: true,
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
        title: 'Exchange Active Mailbox',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('exchangeActiveMailbox', adUsers.search.lookups?.booleanLookup),
            dataIndex: 'exchangeActiveMailbox',
            key: 'exchangeActiveMailbox',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
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

  const removeAdUsers = (id: number) => {
    dispatch(deleteAdUser(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <a
        className="action-btn"
        onClick={() => {
          setSelectedId(data.id);
          history.push(`/ad/ad-users/${data.id}`);
        }}
      >
        <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
      </a>
      <Popconfirm title="Sure to delete?" onConfirm={() => removeAdUsers(data.id)}>
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
        reduxSelector={adUsersSelector}
        searchTableData={searchAdUsers}
        clearTableDataMessages={clearAdUsersMessages}
        setTableColumnSelection={setTableColumnSelection}
      />
    </>
  );
};

export default forwardRef(MainTable);
