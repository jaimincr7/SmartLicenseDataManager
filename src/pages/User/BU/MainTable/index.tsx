import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import { IMainTable } from './mainTable.model';
import _ from 'lodash';
import {
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import DataTable from '../../../../common/components/DataTable';
import {
  clearBUMessages,
  setTableColumnSelection,
  buSelector,
} from '../../../../store/master/bu/bu.reducer';
import buService from '../../../../services/master/bu/bu.service';
import { deleteBU, searchBU } from '../../../../store/master/bu/bu.action';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const { setSelectedId } = props;
  const bu = useAppSelector(buSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const exportExcelFile = (searchData: ISearch) => {
    return buService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(dataIndex, bu.search.tableName, form);
  };

  const getTableColumns = (form) => {
    return [
      {
        title: 'Tenant Name',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown('tenant_id', bu.search.lookups?.tenants),
            dataIndex: 'tenant_name',
            key: 'tenant_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Company Name',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown('company_id', bu.search.lookups?.companies),
            dataIndex: 'company_name',
            key: 'company_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'BU Name',
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
        title: 'Active',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown('active', bu.search.lookups?.booleanLookup),
            dataIndex: 'active',
            key: 'active',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
    ];
  };

  const removeBU = (id: number) => {
    dispatch(deleteBU(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <a
        className="action-btn"
        onClick={() => {
          setSelectedId(data.id);
          history.push(`/user/bu/${data.id}`);
        }}
      >
        <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
      </a>
      <Popconfirm title="Sure to delete?" onConfirm={() => removeBU(data.id)}>
        <a href="#" title="" className="action-btn">
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-delete.svg`} alt="" />
        </a>
      </Popconfirm>
    </div>
  );

  return (
    <>
      <DataTable
        ref={dataTableRef}
        showAddButton={true}
        globalSearchExist={false}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={buSelector}
        searchTableData={searchBU}
        clearTableDataMessages={clearBUMessages}
        setTableColumnSelection={setTableColumnSelection}
      />
    </>
  );
};

export default forwardRef(MainTable);
