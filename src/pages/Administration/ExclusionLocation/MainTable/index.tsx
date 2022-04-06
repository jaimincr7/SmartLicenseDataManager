import { Checkbox, Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  FilterByBooleanDropDown,
  FilterByDropdown,
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
  clearConfigExclusionLocationMessages,
  configExclusionLocationSelector,
  setTableColumnSelection,
} from '../../../../store/master/exclusionLocation/exclusionLocation.reducer';
import {
  deleteConfigExclusionLocation,
  searchConfigExclusionLocation,
} from '../../../../store/master/exclusionLocation/exclusionLocation.action';
import configExclusionLocationService from '../../../../services/master/exclusionLocation/exclusionLocation.service';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const {
    setSelectedId,
    setShowSelectedListModal,
    setValuesForSelection,
    isMultiple,
    tableButtons,
  } = props;
  const configExclusionLocation = useAppSelector(configExclusionLocationSelector);
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
    return configExclusionLocationService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(
      dataIndex,
      configExclusionLocation.search.tableName,
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
        title: <span className="dragHandler">Component Table Column</span>,
        column: 'ComponentTableColumnId',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'component_table_column_id',
              configExclusionLocation.search.lookups?.table_columns
            ),
            dataIndex: 'table_column_name',
            key: 'table_column_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Is Excludable</span>,
        column: 'IsExcludable',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_excludable',
              configExclusionLocation.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_excludable',
            key: 'is_excludable',
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

  const removeConfigExclusionLocation = (id: number) => {
    dispatch(deleteConfigExclusionLocation(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.ConfigExclusionLocation}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/administration/config-exclusion-location/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.ConfigExclusionLocation}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeConfigExclusionLocation(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.ConfigExclusionLocation)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={configExclusionLocationSelector}
        searchTableData={searchConfigExclusionLocation}
        clearTableDataMessages={clearConfigExclusionLocationMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.ConfigExclusionLocation)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        globalSearchExist={false}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
