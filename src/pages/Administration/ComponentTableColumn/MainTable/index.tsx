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
  clearConfigComponentTableColumnMessages,
  configComponentTableColumnSelector,
  setTableColumnSelection,
} from '../../../../store/master/componentTableColumn/componentTableColumn.reducer';
import {
  deleteConfigComponentTableColumn,
  searchConfigComponentTableColumn,
} from '../../../../store/master/componentTableColumn/componentTableColumn.action';
import configComponentTableColumnService from '../../../../services/master/componentTableColumn/componentTableColumn.service';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const {
    setSelectedId,
    setShowSelectedListModal,
    setValuesForSelection,
    isMultiple,
    tableButtons,
  } = props;
  const configComponentTableColumn = useAppSelector(configComponentTableColumnSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();
  const [ObjectForColumnFilter, setObjectForColumnFilter] = useState({});

  useEffect(() => {
    if (isMultiple) {
      dataTableRef?.current.getValuesForSelection();
    }
  }, [isMultiple]);

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const exportExcelFile = (searchData: ISearch) => {
    return configComponentTableColumnService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(
      dataIndex,
      configComponentTableColumn.search.tableName,
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
        title: <span className="dragHandler">Column Name</span>,
        column: 'ColumnName',
        sorter: true,
        children: [
          {
            title: FilterBySwap('column_name', form),
            dataIndex: 'column_name',
            key: 'column_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Component</span>,
        column: 'ComponentId',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'component_id',
              configComponentTableColumn.search.lookups?.components
            ),
            dataIndex: 'component_name',
            key: 'component_name',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeConfigComponentTableColumn = (id: number) => {
    dispatch(deleteConfigComponentTableColumn(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.ConfigComponentTableColumn}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/administration/config-component-table-column/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.ConfigComponentTableColumn}>
        <Popconfirm
          title="Delete Record?"
          onConfirm={() => removeConfigComponentTableColumn(data.id)}
        >
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
        showAddButton={ability.can(Action.Add, Page.ConfigComponentTableColumn)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={configComponentTableColumnSelector}
        searchTableData={searchConfigComponentTableColumn}
        clearTableDataMessages={clearConfigComponentTableColumnMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.ConfigComponentTableColumn)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        globalSearchExist={false}
        showDelete={false}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
