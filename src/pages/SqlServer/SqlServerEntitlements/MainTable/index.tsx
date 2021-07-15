import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  clearSqlServerEntitlementsMessages,
  sqlServerEntitlementsSelector,
} from '../../../../store/sqlServer/sqlServerEntitlements/sqlServerEntitlements.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  deleteSqlServerEntitlements,
  searchSqlServerEntitlements,
} from '../../../../store/sqlServer/sqlServerEntitlements/sqlServerEntitlements.action';
import { IMainTable } from './mainTable.model';
import moment from 'moment';
import { Common } from '../../../../common/constants/common';
import _ from 'lodash';
import sqlServerEntitlementsService from '../../../../services/sqlServer/sqlServerEntitlements/sqlServerEntitlements.service';
import {
  FilterByDate,
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import DataTable from '../../../../common/components/DataTable';
import { setTableColumnSelection } from '../../../../store/sqlServer/sqlServerEntitlements/sqlServerEntitlements.reducer';
import { Action, Page } from '../../../../common/constants/pageAction';
import ability, { Can } from '../../../../common/ability';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const { setSelectedId } = props;
  const sqlServerEntitlements = useAppSelector(sqlServerEntitlementsSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const exportExcelFile = (searchData: ISearch) => {
    return sqlServerEntitlementsService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(dataIndex, sqlServerEntitlements.search.tableName, form);
  };

  const getTableColumns = (form) => {
    return [
      {
        title: 'Tenant Name',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('tenant_id', sqlServerEntitlements.search.lookups?.tenants),
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
            title: FilterByDropdown('company_id', sqlServerEntitlements.search.lookups?.companies),
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
            title: FilterByDropdown('bu_id', sqlServerEntitlements.search.lookups?.bus),
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
              sqlServerEntitlements.search.lookups?.sqlServerLicenses
            ),
            dataIndex: 'product_name',
            key: 'product_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Qty 01',
        sorter: true,
        children: [
          {
            title: FilterBySwap('qty_01', form),
            dataIndex: 'qty_01',
            key: 'qty_01',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Qty 02',
        sorter: true,
        children: [
          {
            title: FilterBySwap('qty_02', form),
            dataIndex: 'qty_02',
            key: 'qty_02',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Qty 03',
        sorter: true,
        children: [
          {
            title: FilterBySwap('qty_03', form),
            dataIndex: 'qty_03',
            key: 'qty_03',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeSqlServerEntitlements = (id: number) => {
    dispatch(deleteSqlServerEntitlements(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.SqlServerEntitlement}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/sql-server/entitlements/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.SqlServerEntitlement}>
        <Popconfirm title="Sure to delete?" onConfirm={() => removeSqlServerEntitlements(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.SqlServerEntitlement)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={sqlServerEntitlementsSelector}
        searchTableData={searchSqlServerEntitlements}
        clearTableDataMessages={clearSqlServerEntitlementsMessages}
        setTableColumnSelection={setTableColumnSelection}
      />
    </>
  );
};

export default forwardRef(MainTable);
