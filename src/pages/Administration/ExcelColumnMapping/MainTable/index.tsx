import { Popconfirm } from 'antd';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import {
  setTableColumnSelection,
  clearExcelColumnMappingMessages,
  excelColumnMappingSelector,
} from '../../../../store/master/excelColumnMapping/excelColumnMapping.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  deleteExcelColumnMapping,
  searchExcelColumnMapping,
} from '../../../../store/master/excelColumnMapping/excelColumnMapping.action';
import excelColumnMappingService from '../../../../services/master/excelColumnMapping/excelColumnMapping.service';
import { FilterWithSwapOption } from '../../../../common/components/DataTable/DataTableFilters';
import { ISearch } from '../../../../common/models/common';
import DataTable from '../../../../common/components/DataTable';
import { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import { IMainTable } from './mainTable.model';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const { id } = props;
  const excelColumnMapping = useAppSelector(excelColumnMappingSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const [ObjectForColumnFilter, setObjectForColumnFilter] = useState({});

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  useEffect(() => {
    setObjectForColumnFilter({ excel_file_mapping_id: id });
  }, []);

  const extraSearchData = {
    excel_file_mapping_id: id,
  };

  const exportExcelFile = (searchData: ISearch) => {
    return excelColumnMappingService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(
      dataIndex,
      excelColumnMapping.search.tableName,
      form,
      null,
      ObjectForColumnFilter
    );
  };

  const getTableColumns = (form) => {
    return [
      {
        title: <span className="dragHandler">Excel File Mapping Id</span>,
        column: 'ExcelFileMappingId',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('excel_file_mapping_id', form),
            dataIndex: 'excel_file_mapping_id',
            key: 'excel_file_mapping_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Sheet Name</span>,
        column: 'SheetName',
        sorter: true,
        children: [
          {
            title: FilterBySwap('sheet_name', form),
            dataIndex: 'sheet_name',
            key: 'sheet_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Header Row</span>,
        column: 'HeaderRow',
        sorter: true,
        children: [
          {
            title: FilterBySwap('header_row', form),
            dataIndex: 'header_row',
            key: 'header_row',
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
      // {
      //   title: <span className="dragHandler">Mapping</span>,
      //   column: 'Mapping',
      //   sorter: true,
      //   children: [
      //     {
      //       title: FilterBySwap('mapping', form),
      //       dataIndex: 'mapping',
      //       key: 'mapping',
      //       ellipsis: true,
      //     },
      //   ],
      // },
    ];
  };

  const removeExcelColumnMapping = (id: number) => {
    dispatch(deleteExcelColumnMapping(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Delete} a={Page.ExcelColumnMapping}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeExcelColumnMapping(data.id)}>
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
        tableAction={tableAction}
        globalSearchExist={false}
        hideExportButton={true}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={excelColumnMappingSelector}
        searchTableData={searchExcelColumnMapping}
        clearTableDataMessages={clearExcelColumnMappingMessages}
        setTableColumnSelection={setTableColumnSelection}
        disableRowSelection={true}
        showAddButton={false}
        extraSearchData={extraSearchData}
        showBulkUpdate={false}
        setObjectForColumnFilter={setObjectForColumnFilter}
        isExcelColumnMapping={true}
      />
    </>
  );
};

export default forwardRef(MainTable);
