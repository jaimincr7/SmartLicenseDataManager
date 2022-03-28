import { Checkbox, Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import _ from 'lodash';
import {
  FilterByBooleanDropDown,
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { AlignType } from 'rc-table/lib/interface';
import { IMainTable, ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import DataTable from '../../../../common/components/DataTable';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import { deleteCmdbUser, searchCmdbUser } from '../../../../store/cmdb/user/user.action';
import {
  clearCmdbUserMessages,
  cmdbUserSelector,
  setTableColumnSelection,
} from '../../../../store/cmdb/user/user.reducer';
import userService from '../../../../services/cmdb/user/user.service';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const {
    setSelectedId,
    setShowSelectedListModal,
    setValuesForSelection,
    isMultiple,
    tableButtons,
  } = props;
  const cmdbUser = useAppSelector(cmdbUserSelector);
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
    return userService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(
      dataIndex,
      cmdbUser.search.tableName,
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
        title: <span className="dragHandler">Tenant Name</span>,
        column: 'TenantID',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('tenant_id', cmdbUser.search.lookups?.tenants),
            dataIndex: 'tenant_name',
            key: 'tenant_name',
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
        title: <span className="dragHandler">First Name</span>,
        column: 'FirstName',
        sorter: true,
        children: [
          {
            title: FilterBySwap('first_name', form),
            dataIndex: 'first_name',
            key: 'first_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Last Name</span>,
        column: 'LastName',
        sorter: true,
        children: [
          {
            title: FilterBySwap('last_name', form),
            dataIndex: 'last_name',
            key: 'last_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Is Service Account</span>,
        column: 'IsServiceAccount',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_service_account',
              cmdbUser.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_service_account',
            key: 'is_service_account',
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
        title: <span className="dragHandler">Is Resource</span>,
        column: 'IsResource',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_resource',
              cmdbUser.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_resource',
            key: 'is_resource',
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
        title: <span className="dragHandler">In Active Directory</span>,
        column: 'InActiveDirectory',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'in_active_directory',
              cmdbUser.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'in_active_directory',
            key: 'in_active_directory',
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
        title: <span className="dragHandler">Active Directory GUID</span>,
        column: 'ActiveDirectoryGUID',
        sorter: true,
        children: [
          {
            title: FilterBySwap('active_directory_guid', form),
            dataIndex: 'active_directory_guid',
            key: 'active_directory_guid',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeCmdbUser = (id: number) => {
    dispatch(deleteCmdbUser(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.CmdbUser}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/cmdb/cmdb-user/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.CmdbUser}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeCmdbUser(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.CmdbUser)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={cmdbUserSelector}
        searchTableData={searchCmdbUser}
        clearTableDataMessages={clearCmdbUserMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.CmdbUser)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        globalSearchExist={false}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
