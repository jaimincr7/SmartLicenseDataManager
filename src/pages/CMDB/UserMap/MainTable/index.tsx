import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { IMainTable, ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import DataTable from '../../../../common/components/DataTable';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import {
  deleteCmdbUserMap,
  searchCmdbUserMap,
} from '../../../../store/cmdb/userMap/userMap.action';
import {
  clearCmdbUserMapMessages,
  cmdbUserMapSelector,
  setTableColumnSelection,
} from '../../../../store/cmdb/userMap/userMap.reducer';
import userMapService from '../../../../services/cmdb/userMap/userMap.service';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const {
    setSelectedId,
    setShowSelectedListModal,
    setValuesForSelection,
    isMultiple,
    tableButtons,
  } = props;
  const cmdbUserMap = useAppSelector(cmdbUserMapSelector);
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
    return userMapService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(
      dataIndex,
      cmdbUserMap.search.tableName,
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
            title: FilterByDropdown('tenant_id', cmdbUserMap.search.lookups?.tenants),
            dataIndex: 'tenant_name',
            key: 'tenant_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Device</span>,
        column: 'DeviceID',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('device_id', cmdbUserMap.search.lookups?.devices),
            dataIndex: 'device_name',
            key: 'device_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">User</span>,
        column: 'UserID',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('user_id', cmdbUserMap.search.lookups?.users),
            dataIndex: 'user_name',
            key: 'user_name',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeCmdbUserMap = (id: number) => {
    dispatch(deleteCmdbUserMap(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.CmdbUserMap}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/cmdb/cmdb-user-map/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.CmdbUserMap}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeCmdbUserMap(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.CmdbUserMap)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={cmdbUserMapSelector}
        searchTableData={searchCmdbUserMap}
        clearTableDataMessages={clearCmdbUserMapMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.CmdbUserMap)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        globalSearchExist={false}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
