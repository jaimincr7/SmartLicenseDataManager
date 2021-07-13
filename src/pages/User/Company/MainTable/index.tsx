import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import { IMainTable } from './mainTable.model';
import moment from 'moment';
import { Common } from '../../../../common/constants/common';
import _ from 'lodash';
import {
  FilterByDate,
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import DataTable from '../../../../common/components/DataTable';
import {
  clearCompanyMessages,
  setTableColumnSelection,
  companySelector,
} from '../../../../store/master/company/company.reducer';
import companyService from '../../../../services/master/company/company.service';
import { deleteCompany, searchCompany } from '../../../../store/master/company/company.action';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const { setSelectedId } = props;
  const company = useAppSelector(companySelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const exportExcelFile = (searchData: ISearch) => {
    return companyService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(dataIndex, company.search.tableName, form);
  };

  const getTableColumns = (form) => {
    return [
      {
        title: 'Tenant Name',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown('tenant_id', company.search.lookups?.tenants),
            dataIndex: 'tenant_name',
            key: 'tenant_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Currency',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown('currency_id', company.search.lookups?.currency),
            dataIndex: 'currency',
            key: 'currency',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Company Name',
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
        title: 'Joined Date',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDate('joined_date'),
            dataIndex: 'joined_date',
            key: 'joined_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: 'Address',
        sorter: true,
        children: [
          {
            title: FilterBySwap('address', form),
            dataIndex: 'address',
            key: 'address',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'City',
        sorter: true,
        children: [
          {
            title: FilterBySwap('city', form),
            dataIndex: 'city',
            key: 'city',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Province',
        sorter: true,
        children: [
          {
            title: FilterBySwap('province', form),
            dataIndex: 'province',
            key: 'province',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Email',
        sorter: true,
        children: [
          {
            title: FilterBySwap('email', form),
            dataIndex: 'email',
            key: 'email',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Fax',
        sorter: true,
        children: [
          {
            title: FilterBySwap('fax', form),
            dataIndex: 'fax',
            key: 'fax',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Phone',
        sorter: true,
        children: [
          {
            title: FilterBySwap('phone', form),
            dataIndex: 'phone',
            key: 'phone',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Postal Code',
        sorter: true,
        children: [
          {
            title: FilterBySwap('postal_code', form),
            dataIndex: 'postal_code',
            key: 'postal_code',
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
            title: FilterByDropdown('active', company.search.lookups?.booleanLookup),
            dataIndex: 'active',
            key: 'active',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
    ];
  };

  const removeCompany = (id: number) => {
    dispatch(deleteCompany(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <a
        className="action-btn"
        onClick={() => {
          setSelectedId(data.id);
          history.push(`/user/company/${data.id}`);
        }}
      >
        <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
      </a>
      <Popconfirm title="Sure to delete?" onConfirm={() => removeCompany(data.id)}>
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
        reduxSelector={companySelector}
        searchTableData={searchCompany}
        clearTableDataMessages={clearCompanyMessages}
        setTableColumnSelection={setTableColumnSelection}
      />
    </>
  );
};

export default forwardRef(MainTable);
