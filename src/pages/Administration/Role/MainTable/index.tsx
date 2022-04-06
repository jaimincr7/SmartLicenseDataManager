import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { useHistory } from 'react-router-dom';
import DataTable from '../../../../common/components/DataTable';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import {
  clearRoleMessages,
  roleSelector,
  setTableColumnSelection,
} from '../../../../store/master/role/role.reducer';
import { deleteRole, searchRole } from '../../../../store/master/role/role.action';
import { IMainTable, ISearch } from '../../../../common/models/common';
import roleService from '../../../../services/master/role/role.service';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const { setSelectedId, setShowSelectedListModal, setValuesForSelection, isMultiple } = props;
  const role = useAppSelector(roleSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();
  const [ObjectForColumnFilter, setObjectForColumnFilter] = useState({});

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const exportExcelFile = (searchData: ISearch) => {
    return roleService.exportExcelFile(searchData);
  };

  useEffect(() => {
    if (isMultiple) {
      dataTableRef?.current.getValuesForSelection();
    }
  }, [isMultiple]);

  const FilterBySwap = (dataIndex: string, form, columnWidthOpt?: boolean) => {
    return FilterWithSwapOption(
      dataIndex,
      role.search.tableName,
      form,
      null,
      ObjectForColumnFilter,
      null,
      columnWidthOpt === undefined ? false : columnWidthOpt
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
            title: FilterBySwap('id', form, true),
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
            title: FilterByDropdown('tenant_id', role.search.lookups?.tenants),
            dataIndex: 'tenant_name',
            key: 'tenant_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Role Name</span>,
        column: 'RoleName',
        sorter: true,
        children: [
          {
            title: FilterBySwap('role_name', form),
            dataIndex: 'role_name',
            key: 'role_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Role Key</span>,
        column: 'RoleKey',
        sorter: true,
        children: [
          {
            title: FilterBySwap('role_key', form),
            dataIndex: 'role_key',
            key: 'role_key',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeRole = (id: number) => {
    dispatch(deleteRole(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.Role}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/administration/role/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.Role}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeRole(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.Role)}
        showDelete={false}
        globalSearchExist={false}
        exportExcelFile={exportExcelFile}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        getTableColumns={getTableColumns}
        reduxSelector={roleSelector}
        searchTableData={searchRole}
        clearTableDataMessages={clearRoleMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        showBulkUpdate={ability.can(Action.Update, Page.Role)}
        setValuesForSelection={setValuesForSelection}
        setObjectForColumnFilter={setObjectForColumnFilter}
      />
    </>
  );
};

export default forwardRef(MainTable);
