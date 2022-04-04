import { Checkbox, Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  FilterByBooleanDropDown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { AlignType } from 'rc-table/lib/interface';
import { IMainTable, ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import _ from 'lodash';
import DataTable from '../../../../common/components/DataTable';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import {
  clearConfigExclusionOperationMessages,
  configExclusionOperationSelector,
  setTableColumnSelection,
} from '../../../../store/master/exclusionOperation/exclusionOperation.reducer';
import {
  deleteConfigExclusionOperation,
  searchConfigExclusionOperation,
} from '../../../../store/master/exclusionOperation/exclusionOperation.action';
import configExclusionOperationService from '../../../../services/master/exclusionOperation/exclusionOperation.service';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const {
    setSelectedId,
    setShowSelectedListModal,
    setValuesForSelection,
    isMultiple,
    tableButtons,
  } = props;
  const configExclusionOperation = useAppSelector(configExclusionOperationSelector);
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
    return configExclusionOperationService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(
      dataIndex,
      configExclusionOperation.search.tableName,
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
        title: <span className="dragHandler">Logical Operation</span>,
        column: 'Logical Operation',
        sorter: true,
        children: [
          {
            title: FilterBySwap('logical_operation', form),
            dataIndex: 'logical_operation',
            key: 'logical_operation',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">SQL Operation</span>,
        column: 'SQL Operation',
        sorter: true,
        children: [
          {
            title: FilterBySwap('sql_operation', form),
            dataIndex: 'sql_operation',
            key: 'sql_operation',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Is Enabled</span>,
        column: 'IsEnabled',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_enabled',
              configExclusionOperation.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_enabled',
            key: 'is_enabled',
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

  const removeConfigExclusionOperation = (id: number) => {
    dispatch(deleteConfigExclusionOperation(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.ConfigExclusionOperation}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/administration/config-exclusion-operation/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.ConfigExclusionOperation}>
        <Popconfirm
          title="Delete Record?"
          onConfirm={() => removeConfigExclusionOperation(data.id)}
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
        showAddButton={ability.can(Action.Add, Page.ConfigExclusionOperation)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={configExclusionOperationSelector}
        searchTableData={searchConfigExclusionOperation}
        clearTableDataMessages={clearConfigExclusionOperationMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.ConfigExclusionOperation)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        globalSearchExist={false}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
