import { Checkbox, Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import _ from 'lodash';
import { AlignType } from 'rc-table/lib/interface';
import {
  FilterByBooleanDropDown,
  FilterByDateSwap,
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { IMainTable, ISearch } from '../../../../common/models/common';
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
import { showDateFromApi } from '../../../../common/helperFunction';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const {
    setSelectedId,
    setShowSelectedListModal,
    setValuesForSelection,
    isMultiple,
    tableButtons,
  } = props;
  const company = useAppSelector(companySelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();
  const [ObjectForColumnFilter, setObjectForColumnFilter] = useState({});

  useEffect(() => {
    if (isMultiple) {
      dataTableRef?.current.getValuesForSelection();
    }
  }, [isMultiple]);

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const exportExcelFile = (searchData: ISearch) => {
    return companyService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(
      dataIndex,
      company.search.tableName,
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
            title: FilterByDateSwap(
              'joined_date',
              company.search.tableName,
              form,
              null,
              ObjectForColumnFilter,
              true
            ),
            dataIndex: 'joined_date',
            key: 'joined_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
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
            title: FilterByBooleanDropDown(
              'active',
              company.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'active',
            key: 'active',
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
            history.push(`/administration/company/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.Company}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeCompany(data.id)}>
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
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.Company)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        showDelete={false}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
