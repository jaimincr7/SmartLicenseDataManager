import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import { FilterWithSwapOption } from '../../../../common/components/DataTable/DataTableFilters';
import { IMainTable, ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import DataTable from '../../../../common/components/DataTable';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import {
  deleteCmdbProcessor,
  searchCmdbProcessor,
} from '../../../../store/cmdb/processor/processor.action';
import {
  clearCmdbProcessorMessages,
  cmdbProcessorSelector,
  setTableColumnSelection,
} from '../../../../store/cmdb/processor/processor.reducer';
import processorService from '../../../../services/cmdb/processor/processor.service';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const {
    setSelectedId,
    setShowSelectedListModal,
    setValuesForSelection,
    isMultiple,
    tableButtons,
  } = props;
  const cmdbProcessor = useAppSelector(cmdbProcessorSelector);
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
    return processorService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(
      dataIndex,
      cmdbProcessor.search.tableName,
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
        title: <span className="dragHandler">Manufacturer</span>,
        column: 'Manufacturer',
        sorter: true,
        children: [
          {
            title: FilterBySwap('manufacturer', form),
            dataIndex: 'manufacturer',
            key: 'manufacturer',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Model</span>,
        column: 'Model',
        sorter: true,
        children: [
          {
            title: FilterBySwap('model', form),
            dataIndex: 'model',
            key: 'model',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Family</span>,
        column: 'Family',
        sorter: true,
        children: [
          {
            title: FilterBySwap('family', form),
            dataIndex: 'family',
            key: 'family',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Number Of Processors</span>,
        column: 'NumberOfProcessors',
        sorter: true,
        children: [
          {
            title: FilterBySwap('number_of_processors', form),
            dataIndex: 'number_of_processors',
            key: 'number_of_processors',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Number Of Logical Processors</span>,
        column: 'NumberOfLogicalProcessors',
        sorter: true,
        children: [
          {
            title: FilterBySwap('number_of_logical_processors', form),
            dataIndex: 'number_of_logical_processors',
            key: 'number_of_logical_processors',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Number Of Cores</span>,
        column: 'NumberOfCores',
        sorter: true,
        children: [
          {
            title: FilterBySwap('number_of_cores', form),
            dataIndex: 'number_of_cores',
            key: 'number_of_cores',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Hyper Threading</span>,
        column: 'HyperThreading',
        sorter: true,
        children: [
          {
            title: FilterBySwap('hyper_threading', form),
            dataIndex: 'hyper_threading',
            key: 'hyper_threading',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeCmdbProcessor = (id: number) => {
    dispatch(deleteCmdbProcessor(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.CmdbProcessor}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/cmdb/cmdb-processor/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.CmdbProcessor}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeCmdbProcessor(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.CmdbProcessor)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={cmdbProcessorSelector}
        searchTableData={searchCmdbProcessor}
        clearTableDataMessages={clearCmdbProcessorMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.CmdbProcessor)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        globalSearchExist={false}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
