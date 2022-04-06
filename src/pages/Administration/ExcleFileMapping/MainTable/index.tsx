import { Checkbox, Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import {
  setTableColumnSelection,
  clearExcelFileMappingMessages,
  excelFileMappingSelector,
} from '../../../../store/master/excelFileMapping/excelFileMapping.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import { AlignType } from 'rc-table/lib/interface';
import {
  deleteExcelFileMapping,
  searchExcelFileMapping,
} from '../../../../store/master/excelFileMapping/excelFileMapping.action';
import _ from 'lodash';
import excelFileMappingService from '../../../../services/master/excelFileMapping/excelFileMapping.service';
import {
  FilterByBooleanDropDown,
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { IMainTable, ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import DataTable from '../../../../common/components/DataTable';
import { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import { globalSearchSelector } from '../../../../store/globalSearch/globalSearch.reducer';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const {
    setSelectedId,
    setShowSelectedListModal,
    setValuesForSelection,
    isMultiple,
    tableButtons,
  } = props;
  const excelFileMapping = useAppSelector(excelFileMappingSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();
  const globalFilters = useAppSelector(globalSearchSelector);
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
    return excelFileMappingService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(
      dataIndex,
      excelFileMapping.search.tableName,
      form,
      null,
      ObjectForColumnFilter
    );
  };

  const FilterByBoolean = (dataIndex: string) => {
    return FilterByBooleanDropDown(
      dataIndex,
      excelFileMapping.search.tableName,
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
        column: 'TenantId',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'tenant_id',
              excelFileMapping.search.lookups?.tenants?.length > 0
                ? excelFileMapping.search.lookups?.tenants
                : globalFilters?.globalTenantLookup?.data
            ),
            dataIndex: 'tenant_name',
            key: 'tenant_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Company Name</span>,
        column: 'CompanyId',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'company_id',
              excelFileMapping.search.lookups?.companies?.length > 0
                ? excelFileMapping.search.lookups?.companies
                : globalFilters?.globalCompanyLookup?.data
            ),
            dataIndex: 'company_name',
            key: 'company_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Bu Name</span>,
        column: 'BU_Id',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'bu_id',
              excelFileMapping.search.lookups?.bus?.length > 0
                ? excelFileMapping.search.lookups?.bus
                : globalFilters?.globalBULookup?.data
            ),
            dataIndex: 'bu_name',
            key: 'bu_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Key Word</span>,
        column: 'KeyWord',
        sorter: true,
        children: [
          {
            title: FilterBySwap('key_word', form),
            dataIndex: 'key_word',
            key: 'key_word',
            ellipsis: true,
          },
        ],
      },
      // {
      //   title: <span className="dragHandler">Created By</span>,
      //   column: 'CreatedBy',
      //   sorter: true,
      //   children: [
      //     {
      //       title: FilterBySwap('created_by', form),
      //       dataIndex: 'created_by',
      //       key: 'created_by',
      //       ellipsis: true,
      //     },
      //   ],
      // },
      {
        title: <span className="dragHandler">File Type</span>,
        column: 'FileType',
        sorter: true,
        children: [
          {
            title: FilterBySwap('file_type', form),
            dataIndex: 'file_type',
            key: 'file_type',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Delimiter</span>,
        column: 'Delimiter',
        sorter: true,
        children: [
          {
            title: FilterBySwap('delimiter', form),
            dataIndex: 'delimiter',
            key: 'delimiter',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Is Public</span>,
        column: 'IsPublic',
        sorter: true,
        children: [
          {
            title: FilterByBoolean('is_public'),
            dataIndex: 'is_public',
            key: 'is_public',
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

  const removeExcelFileMapping = (id: number) => {
    dispatch(deleteExcelFileMapping(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.View} a={Page.ExcelColumnMapping}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/administration/config-excel-column-mapping/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-eye.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.ExcelFileMapping}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeExcelFileMapping(data.id)}>
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
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        showAddButton={false}
        hideExportButton={true}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={excelFileMappingSelector}
        searchTableData={searchExcelFileMapping}
        clearTableDataMessages={clearExcelFileMappingMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={false}
        setObjectForColumnFilter={setObjectForColumnFilter}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
