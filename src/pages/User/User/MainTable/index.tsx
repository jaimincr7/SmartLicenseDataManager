import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import { IMainTable } from './mainTable.model';
import moment from 'moment';
import { Common } from '../../../../common/constants/common';
import _ from 'lodash';
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
import {
  clearUserMessages,
  setTableColumnSelection,
  usersSelector,
} from '../../../../store/master/users/users.reducer';
import usersService from '../../../../services/master/user/users.service';
import { deleteUser, searchUser } from '../../../../store/master/users/users.action';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const { setSelectedId } = props;
  const users = useAppSelector(usersSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const exportExcelFile = (searchData: ISearch) => {
    return usersService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(dataIndex, users.search.tableName, form);
  };

  const getTableColumns = (form) => {
    return [
      {
        title: <span className="dragHandler">Tenant</span>,
        column:'TenantId',
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
        column:'CompanyId',
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
        column:'Username',
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
        title: <span className="dragHandler">DisplayName</span>,
        column:'DisplayName',
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
        title: <span className="dragHandler">Email</span>,
        column:'Email',
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
        column:'Source',
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
        title: <span className="dragHandler">LastDirectoryUpdate</span>,
        column:'LastDirectoryUpdate',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDate('last_directory_update'),
            dataIndex: 'last_directory_update',
            key: 'last_directory_update',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">InsertDate</span>,
        column:'InsertDate',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDate('insert_date'),
            dataIndex: 'insert_date',
            key: 'insert_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">InsertUserId</span>,
        column:'InsertUserId',
        sorter: true,
        children: [
          {
            title: FilterBySwap('insert_user_id', form),
            dataIndex: 'insert_user_id',
            key: 'insert_user_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">UpdateDate</span>,
        column:'UpdateDate',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDate('update_date'),
            dataIndex: 'update_date',
            key: 'update_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">UpdateUserId</span>,
        column:'UpdateUserId',
        sorter: true,
        children: [
          {
            title: FilterBySwap('update_user_id', form),
            dataIndex: 'update_user_id',
            key: 'update_user_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">IsActive</span>,
        column:'IsActive',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('is_active', form),
            dataIndex: 'is_active',
            key: 'is_active',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">MobilePhoneNumber</span>,
        column:'MobilePhoneNumber',
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
        title: <span className="dragHandler">MobilePhoneVerified</span>,
        column:'MobilePhoneVerified',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown('mobile_phone_verified', users.search.lookups?.booleanLookup),
            dataIndex: 'mobile_phone_verified',
            key: 'mobile_phone_verified',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
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
            history.push(`/user/user/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.User}>
        <Popconfirm title="Sure to delete?" onConfirm={() => removeUser(data.id)}>
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
        searchTableData={searchUser}
        clearTableDataMessages={clearUserMessages}
        setTableColumnSelection={setTableColumnSelection}
      />
    </>
  );
};

export default forwardRef(MainTable);
