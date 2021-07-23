import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  setTableColumnSelection,
  clearSqlServerPricingMessages,
  sqlServerPricingSelector,
} from '../../../../store/sqlServer/sqlServerPricing/sqlServerPricing.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  deleteSqlServerPricing,
  searchSqlServerPricing,
} from '../../../../store/sqlServer/sqlServerPricing/sqlServerPricing.action';
import { IMainTable } from './mainTable.model';
import moment from 'moment';
import { Common } from '../../../../common/constants/common';
import _ from 'lodash';
import sqlServerPricingService from '../../../../services/sqlServer/sqlServerPricing/sqlServerPricing.service';
import {
  FilterByDate,
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import DataTable from '../../../../common/components/DataTable';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const { setSelectedId } = props;
  const sqlServerPricing = useAppSelector(sqlServerPricingSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const exportExcelFile = (searchData: ISearch) => {
    return sqlServerPricingService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(dataIndex, sqlServerPricing.search.tableName, form);
  };

  const getTableColumns = (form) => {
    return [
      {
        title: 'Tenant Name',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('tenant_id', sqlServerPricing.search.lookups?.tenants),
            dataIndex: 'tenant_name',
            key: 'tenant_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Company Name',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('company_id', sqlServerPricing.search.lookups?.companies),
            dataIndex: 'company_name',
            key: 'company_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Bu Name',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('bu_id', sqlServerPricing.search.lookups?.bus),
            dataIndex: 'bu_name',
            key: 'bu_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Date Added',
        sorter: true,
        children: [
          {
            title: FilterByDate('date_added'),
            dataIndex: 'date_added',
            key: 'date_added',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: 'Product Name',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'license_id',
              sqlServerPricing.search.lookups?.sqlServerLicenses
            ),
            dataIndex: 'product_name',
            key: 'product_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Agreement Type',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'agreement_type_id',
              sqlServerPricing.search.lookups?.agreementTypes
            ),
            dataIndex: 'agreement_type',
            key: 'agreement_type',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Currency Name',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('currency_id', sqlServerPricing.search.lookups?.currency),
            dataIndex: 'currency',
            key: 'currency',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Price',
        sorter: true,
        children: [
          {
            title: FilterBySwap('price', form),
            dataIndex: 'price',
            key: 'price',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeSqlServerPricing = (id: number) => {
    dispatch(deleteSqlServerPricing(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.SqlServerPricing}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/sql-server/pricing/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.SqlServerPricing}>
        <Popconfirm title="Sure to delete?" onConfirm={() => removeSqlServerPricing(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.SqlServerPricing)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={sqlServerPricingSelector}
        searchTableData={searchSqlServerPricing}
        clearTableDataMessages={clearSqlServerPricingMessages}
        setTableColumnSelection={setTableColumnSelection}
      />
    </>
  );
};

export default forwardRef(MainTable);
