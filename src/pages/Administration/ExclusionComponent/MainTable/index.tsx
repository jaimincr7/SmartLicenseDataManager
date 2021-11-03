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
  clearConfigExclusionComponentMessages,
  configExclusionComponentSelector,
  setTableColumnSelection,
} from '../../../../store/master/exclusionComponent/exclusionComponent.reducer';
import {
  deleteConfigExclusionComponent,
  searchConfigExclusionComponent,
} from '../../../../store/master/exclusionComponent/exclusionComponent.action';
import configExclusionComponentService from '../../../../services/master/exclusionComponent/exclusionComponent.service';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const {
    setSelectedId,
    setShowSelectedListModal,
    setValuesForSelection,
    isMultiple,
    tableButtons,
  } = props;
  const configExclusionComponent = useAppSelector(configExclusionComponentSelector);
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
    return configExclusionComponentService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(
      dataIndex,
      configExclusionComponent.search.tableName,
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
        title: <span className="dragHandler">Component</span>,
        column: 'ComponentId',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'component_id',
              configExclusionComponent.search.lookups?.components
            ),
            dataIndex: 'component_name',
            key: 'component_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Exclusion Component Table Column</span>,
        column: 'ExclusionId_ComponentTableColumnId',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'exclusion_id_component_table_column_id',
              configExclusionComponent.search.lookups?.component_table_column_ids
            ),
            dataIndex: 'component_table_column_id_name',
            key: 'component_table_column_id_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Exclusion Description Component Table Column</span>,
        column: 'ExclusionDesc_ComponentTableColumnId',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'exclusion_desc_component_table_column_id',
              configExclusionComponent.search.lookups?.component_table_column_description
            ),
            dataIndex: 'component_table_column_desc_name',
            key: 'component_table_column_desc_name',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeConfigExclusionComponent = (id: number) => {
    dispatch(deleteConfigExclusionComponent(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.ConfigExclusionComponent}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/administration/config-exclusion-component/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.ConfigExclusionComponent}>
        <Popconfirm
          title="Delete Record?"
          onConfirm={() => removeConfigExclusionComponent(data.id)}
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
        showAddButton={ability.can(Action.Add, Page.ConfigExclusionComponent)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={configExclusionComponentSelector}
        searchTableData={searchConfigExclusionComponent}
        clearTableDataMessages={clearConfigExclusionComponentMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.ConfigExclusionComponent)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        globalSearchExist={false}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
