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
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';

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
        title: <span className="dragHandler">Tenant Name</span>,
        column: 'TenantId',
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
        title: <span className="dragHandler">Currency</span>,
        column: 'CurrencyId',
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
        title: <span className="dragHandler">Company Name</span>,
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
        title: <span className="dragHandler">Joined Date</span>,
        column: 'JoinedDate',
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
        title: <span className="dragHandler">Address</span>,
        column: 'Address',
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
        title: <span className="dragHandler">City</span>,
        column: 'City',
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
        title: <span className="dragHandler">Province</span>,
        column: 'Province',
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
        title: <span className="dragHandler">Email</span>,
        column: 'Email',
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
        title: <span className="dragHandler">Fax</span>,
        column: 'Fax',
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
        title: <span className="dragHandler">Phone</span>,
        column: 'Phone',
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
        title: <span className="dragHandler">Postal Code</span>,
        column: 'PostalCode',
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
        title: <span className="dragHandler">Active</span>,
        column: 'Active',
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
      <Can I={Action.Update} a={Page.Company}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/user/company/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.Company}>
        <Popconfirm title="Sure to delete?" onConfirm={() => removeCompany(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.Company)}
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
