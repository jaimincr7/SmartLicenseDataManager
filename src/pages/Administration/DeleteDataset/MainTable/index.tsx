import { Checkbox, Popconfirm } from 'antd';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import _ from 'lodash';
import {
  FilterByBooleanDropDown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { IMainTable, ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import { AlignType } from 'rc-table/lib/interface';
import DataTable from '../../../../common/components/DataTable';
import {
  clearDeleteDatasetMessages,
  setTableColumnSelection,
  deleteDatasetSelector,
} from '../../../../store/master/deleteDataset/deleteDataset.reducer';
import deleteDatasetService from '../../../../services/master/deleteDataset/deleteDataset.service';
import {
  deleteDeleteDataset,
  searchDeleteDataset,
} from '../../../../store/master/deleteDataset/deleteDataset.action';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const {
    setSelectedId,
    setShowSelectedListModal,
    setValuesForSelection,
    isMultiple,
    tableButtons,
  } = props;
  const deleteDataset = useAppSelector(deleteDatasetSelector);
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
    return deleteDatasetService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(
      dataIndex,
      deleteDataset.search.tableName,
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
        title: <span className="dragHandler">Stored Procedure Name</span>,
        column: 'StoreProcedureName',
        sorter: true,
        children: [
          {
            title: FilterBySwap('store_procedure_name', form),
            dataIndex: 'store_procedure_name',
            key: 'store_procedure_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Is Date Available</span>,
        column: 'ISDateAvailable',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_date_available',
              deleteDataset.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_date_available',
            key: 'is_date_available',
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

  const removeDeleteDataset = (id: number) => {
    dispatch(deleteDeleteDataset(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.DeleteDataset}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/administration/config-delete-data-set/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.DeleteDataset}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeDeleteDataset(data.id)}>
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
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showAddButton={ability.can(Action.Add, Page.DeleteDataset)}
        showBulkUpdate={ability.can(Action.Update, Page.DeleteDataset)}
        globalSearchExist={false}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={deleteDatasetSelector}
        searchTableData={searchDeleteDataset}
        clearTableDataMessages={clearDeleteDatasetMessages}
        setTableColumnSelection={setTableColumnSelection}
        setObjectForColumnFilter={setObjectForColumnFilter}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
