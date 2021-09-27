import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import {
  setTableColumnSelection,
  clearAdUsersMessages,
  adUsersSelector,
} from '../../../../store/ad/adUsers/adUsers.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import { deleteAdUser, searchAdUsers } from '../../../../store/ad/adUsers/adUsers.action';
import moment from 'moment';
import { Common } from '../../../../common/constants/common';
import _ from 'lodash';
import adUsersService from '../../../../services/ad/adUsers/adUsers.service';
import {
  FilterByDateSwap,
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { IMainTable, ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import DataTable from '../../../../common/components/DataTable';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const { setSelectedId, setShowSelectedListModal, setValuesForSelection, isMultiple } = props;
  const adUsers = useAppSelector(adUsersSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

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
    return adUsersService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(dataIndex, adUsers.search.tableName, form);
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
        title: <span className="dragHandler">Display Name</span>,
        column: 'DisplayName',
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
        title: <span className="dragHandler">Name</span>,
        column: 'Name',
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
        title: <span className="dragHandler">Surname</span>,
        column: 'Surname',
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
        title: <span className="dragHandler">Tenant Name</span>,
        column: 'TenantId',
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
        title: <span className="dragHandler">Company Name</span>,
        column: 'CompanyName',
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
        title: <span className="dragHandler">Bu Name</span>,
        column: 'Bu_Id',
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
        title: <span className="dragHandler">Date Added</span>,
        column: 'Date Added',
        sorter: true,
        children: [
          {
            title: FilterByDateSwap('date_added', adUsers.search.tableName, form),
            dataIndex: 'date_added',
            key: 'date_added',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Enabled</span>,
        column: 'Enabled',
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
        title: <span className="dragHandler">Given Name</span>,
        column: 'GivenName',
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
        title: <span className="dragHandler">Last Logon</span>,
        column: 'lastLogon',
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
        title: <span className="dragHandler">Last Logon Date</span>,
        column: 'LastLogonDate',
        sorter: true,
        children: [
          {
            title: FilterByDateSwap('last_logon_date', adUsers.search.tableName, form),
            dataIndex: 'last_logon_date',
            key: 'last_logon_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Last Logon Timestamp</span>,
        column: 'lastLogonTimestamp',
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
        title: <span className="dragHandler">Object Class</span>,
        column: 'ObjectClass',
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
        title: <span className="dragHandler">Object GUId</span>,
        column: 'ObjectGUId',
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
        title: <span className="dragHandler">Locked Out</span>,
        column: 'LockedOut',
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
        title: <span className="dragHandler">Source</span>,
        column: 'Source',
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
        title: <span className="dragHandler">Password Last Set</span>,
        column: 'PasswordLastSet',
        sorter: true,
        children: [
          {
            title: FilterByDateSwap('password_last_set', adUsers.search.tableName, form),
            dataIndex: 'password_last_set',
            key: 'password_last_set',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Password Never Expires</span>,
        column: 'PasswordNeverExpires',
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
        title: <span className="dragHandler">Sam Account Name</span>,
        column: 'SamAccountName',
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
        title: <span className="dragHandler">SId</span>,
        column: 'SId',
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
        title: <span className="dragHandler">User Principal Name</span>,
        column: 'UserPrincipalName',
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
        title: <span className="dragHandler">When Changed</span>,
        column: 'WhenChanged',
        sorter: true,
        children: [
          {
            title: FilterByDateSwap('whenChanged', adUsers.search.tableName, form),
            dataIndex: 'whenChanged',
            key: 'whenChanged',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">When Created</span>,
        column: 'WhenCreated',
        sorter: true,
        children: [
          {
            title: FilterByDateSwap('when_created', adUsers.search.tableName, form),
            dataIndex: 'when_created',
            key: 'when_created',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Exclusion Id</span>,
        column: 'ExclusionId',
        sorter: true,
        children: [
          {
            title: FilterBySwap('exclusion_id', form),
            dataIndex: 'exclusion_id',
            key: 'exclusion_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Exclusion</span>,
        column: 'Exclusion',
        sorter: true,
        children: [
          {
            title: FilterBySwap('exclusion', form),
            dataIndex: 'exclusion',
            key: 'exclusion',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Distinguished Name</span>,
        column: 'DistinguishedName',
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
        title: <span className="dragHandler">Password Not Required</span>,
        column: 'PasswordNotRequired',
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
        title: <span className="dragHandler">Active</span>,
        column: 'Active',
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
        title: <span className="dragHandler">Qualified</span>,
        column: 'Qualified',
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
        title: <span className="dragHandler">o365 Licensed</span>,
        column: 'o365 Licensed',
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
        title: <span className="dragHandler">o365 Licenses</span>,
        column: 'o365 Licenses',
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
        title: <span className="dragHandler">Domain</span>,
        column: 'Domain',
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
        title: <span className="dragHandler">Exchange Active Mailbox</span>,
        column: 'ExchangeActiveMailbox',
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
        title: <span className="dragHandler">Description</span>,
        column: 'Description',
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
      <Can I={Action.Update} a={Page.ADUsers}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/ad/ad-users/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.ADUsers}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeAdUsers(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.ADUsers)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={adUsersSelector}
        searchTableData={searchAdUsers}
        clearTableDataMessages={clearAdUsersMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        showBulkUpdate={ability.can(Action.Update, Page.Bu)}
        setValuesForSelection={setValuesForSelection}
      />
    </>
  );
};

export default forwardRef(MainTable);
