import { Checkbox, Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import _ from 'lodash';
import { AlignType } from 'rc-table/lib/interface';
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
import {
  clearUserMessages,
  setTableColumnSelection,
  usersSelector,
} from '../../../../store/master/users/users.reducer';
import usersService from '../../../../services/master/user/users.service';
import { deleteUser, searchUser } from '../../../../store/master/users/users.action';
import { showDateFromApi } from '../../../../common/helperFunction';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const { setSelectedId, setShowSelectedListModal, setValuesForSelection, isMultiple } = props;
  const users = useAppSelector(usersSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();
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
    return usersService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(
      dataIndex,
      users.search.tableName,
      form,
      null,
      ObjectForColumnFilter
    );
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
        title: <span className="dragHandler">Tenant</span>,
        column: 'TenantId',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown('tenant_id', users.search.lookups?.tenants),
            dataIndex: 'tenant_name',
            key: 'tenant_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Company</span>,
        column: 'CompanyId',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown('company_id', users.search.lookups?.companies),
            dataIndex: 'company_name',
            key: 'company_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Username</span>,
        column: 'Username',
        sorter: true,
        children: [
          {
            title: FilterBySwap('username', form),
            dataIndex: 'username',
            key: 'username',
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
        title: <span className="dragHandler">Roles</span>,
        column: 'Roles',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown('role_ids', users.search.lookups?.roles),
            dataIndex: 'role_ids',
            key: 'role_ids',
            ellipsis: true,
            render: (roles: string[]) => (roles?.length > 0 ? roles.toString() : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Email</span>,
        column: 'Email',
        sorter: true,
        children: [
          {
            title: FilterBySwap('email', form),
            dataIndex: 'email',
            key: 'email',
            ellipsis: true,
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
        title: <span className="dragHandler">Last Directory Update</span>,
        column: 'LastDirectoryUpdate',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDateSwap('last_directory_update', users.search.tableName, form),
            dataIndex: 'last_directory_update',
            key: 'last_directory_update',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Insert Date</span>,
        column: 'InsertDate',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDateSwap(
              'insert_date',
              users.search.tableName,
              form,
              null,
              ObjectForColumnFilter,
              true
            ),
            dataIndex: 'insert_date',
            key: 'insert_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Insert User</span>,
        column: 'InsertUserId',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('insert_user_id', users.search.lookups?.users),
            dataIndex: 'insert_user_id',
            key: 'insert_user_id',
            ellipsis: true,
            render: (id: number) =>
              id > 0 ? users.search.lookups?.users?.find((x) => x.id === id)?.name : '',
          },
        ],
      },
      {
        title: <span className="dragHandler">Update Date</span>,
        column: 'UpdateDate',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDateSwap(
              'update_date',
              users.search.tableName,
              form,
              null,
              ObjectForColumnFilter,
              true
            ),
            dataIndex: 'update_date',
            key: 'update_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Update User</span>,
        column: 'UpdateUserId',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('update_user_id', users.search.lookups?.users),
            dataIndex: 'update_user_id',
            key: 'update_user_id',
            ellipsis: true,
            render: (id: number) =>
              id > 0 ? users.search.lookups?.users?.find((x) => x.id === id)?.name : '',
          },
        ],
      },
      {
        title: <span className="dragHandler">Is Active</span>,
        column: 'IsActive',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_active',
              users.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_active',
            key: 'is_active',
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
        title: <span className="dragHandler">Mobile Phone Number</span>,
        column: 'MobilePhoneNumber',
        sorter: true,
        children: [
          {
            title: FilterBySwap('mobile_phone_number', form),
            dataIndex: 'mobile_phone_number',
            key: 'mobile_phone_number',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Mobile Phone Verified</span>,
        column: 'MobilePhoneVerified',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'mobile_phone_verified',
              users.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'mobile_phone_verified',
            key: 'mobile_phone_verified',
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

  const removeUser = (id: number) => {
    dispatch(deleteUser(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.User}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/administration/user/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.User}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeUser(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.User)}
        globalSearchExist={false}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={usersSelector}
        showDelete={false}
        searchTableData={searchUser}
        clearTableDataMessages={clearUserMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.User)}
        setObjectForColumnFilter={setObjectForColumnFilter}
      />
    </>
  );
};

export default forwardRef(MainTable);
