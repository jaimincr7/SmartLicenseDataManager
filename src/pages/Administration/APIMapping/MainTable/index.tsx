import { Popconfirm, Popover } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import { IMainTable } from './mainTable.model';
import {
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { ISearch } from '../../../../common/models/common';
import DataTable from '../../../../common/components/DataTable';
import { Action, Page } from '../../../../common/constants/pageAction';
import ability, { Can } from '../../../../common/ability';
import {
  apiColumnMappingSelector,
  clearApiColMappingMessages,
  setTableColumnSelection,
} from '../../../../store/sps/apiColumnMapping/apiColMapping.reducer';
import {
  deleteApiColMapping,
  searchApiColMapping,
} from '../../../../store/sps/apiColumnMapping/apiColMapping.action';
import apiColMappingService from '../../../../services/sps/apiColumnMapping/apiColMapping.service';
import { globalSearchSelector } from '../../../../store/globalSearch/globalSearch.reducer';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const { setSelectedId } = props;
  const apiColMapping = useAppSelector(apiColumnMappingSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const globalLookups = useAppSelector(globalSearchSelector);

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const exportExcelFile = (searchData: ISearch) => {
    return apiColMappingService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(dataIndex, apiColMapping.search.tableName, form);
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
        title: <span className="dragHandler">API</span>,
        column: 'ApiId',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('api_id', apiColMapping.search.lookups?.apis),
            dataIndex: 'api_name',
            key: 'api_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Table Name</span>,
        column: 'TableName',
        sorter: true,
        children: [
          {
            title: FilterBySwap('table_name', form),
            dataIndex: 'table_name',
            key: 'table_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Mapping</span>,
        column: 'Mapping',
        sorter: true,
        children: [
          {
            title: FilterBySwap('mapping', form),
            dataIndex: 'mapping',
            key: 'mapping',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const deleteApiColumnMapping = (id: number) => {
    dispatch(deleteApiColMapping(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.ConfigSPSColMapping}>
        <Popover content={<>Please select global filter first!</>} trigger="click">
          <a
            className="action-btn"
            onClick={() => {
              if (Object.values(globalLookups.search)?.filter((x) => x > 0)?.length === 3)
                setSelectedId(data.id);
            }}
          >
            <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
          </a>
        </Popover>
      </Can>
      <Can I={Action.Delete} a={Page.ConfigSPSColMapping}>
        <Popconfirm title="Delete Record?" onConfirm={() => deleteApiColumnMapping(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.ConfigSPSColMapping)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={apiColumnMappingSelector}
        searchTableData={searchApiColMapping}
        clearTableDataMessages={clearApiColMappingMessages}
        setTableColumnSelection={setTableColumnSelection}
        globalSearchExist={false}
        hideExportButton={true}
      />
    </>
  );
};

export default forwardRef(MainTable);
