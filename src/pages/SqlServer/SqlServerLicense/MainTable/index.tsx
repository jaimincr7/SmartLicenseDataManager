import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  clearSqlServerLicenseMessages,
  sqlServerLicenseSelector,
} from '../../../../store/sqlServer/sqlServerLicense/sqlServerLicense.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  deleteSqlServerLicense,
  searchSqlServerLicense,
} from '../../../../store/sqlServer/sqlServerLicense/sqlServerLicense.action';
import { IMainTable } from './mainTable.model';
import moment from 'moment';
import { Common } from '../../../../common/constants/common';
import _ from 'lodash';
import sqlServerLicenseService from '../../../../services/sqlServer/sqlServerLicense/sqlServerLicense.service';
import {
  FilterByDate,
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import DataTable from '../../../../common/components/DataTable';
import { setTableColumnSelection } from '../../../../store/sqlServer/sqlServerLicense/sqlServerLicense.reducer';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const { setSelectedId } = props;
  const sqlServerLicense = useAppSelector(sqlServerLicenseSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const exportExcelFile = (searchData: ISearch) => {
    return sqlServerLicenseService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(dataIndex, sqlServerLicense.search.tableName, form);
  };

  const getTableColumns = (form) => {
    return [
      {
        title: 'Tenant Name',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown('tenant_id', sqlServerLicense.search.lookups?.tenants),
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
            title: FilterByDropdown('company_id', sqlServerLicense.search.lookups?.companies),
            dataIndex: 'company_name',
            key: 'company_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Bu Name',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown('bu_id', sqlServerLicense.search.lookups?.bus),
            dataIndex: 'bu_name',
            key: 'bu_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Date Added',
        sorter: true,
        ellipsis: true,
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
        title: 'Agreement Type',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown(
              'opt_agreement_type',
              sqlServerLicense.search.lookups?.agreementTypes
            ),
            dataIndex: 'agreement_type',
            key: 'agreement_type',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Default to Enterprise on Hosts',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown(
              'opt_default_to_enterprise_on_hosts',
              sqlServerLicense.search.lookups?.booleanLookup
            ),
            dataIndex: 'opt_default_to_enterprise_on_hosts',
            key: 'opt_default_to_enterprise_on_hosts',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Cluster Logic',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown(
              'opt_cluster_logic',
              sqlServerLicense.search.lookups?.booleanLookup
            ),
            dataIndex: 'opt_cluster_logic',
            key: 'opt_cluster_logic',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Entitlements',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown(
              'opt_entitlements',
              sqlServerLicense.search.lookups?.booleanLookup
            ),
            dataIndex: 'opt_entitlements',
            key: 'opt_entitlements',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Exclude Non-Prod',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown(
              'opt_exclude_non_prod',
              sqlServerLicense.search.lookups?.booleanLookup
            ),
            dataIndex: 'opt_exclude_non_prod',
            key: 'opt_exclude_non_prod',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Notes',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('notes', form),
            dataIndex: 'notes',
            key: 'notes',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeSqlServerLicense = (id: number) => {
    dispatch(deleteSqlServerLicense(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <a
        title=""
        className="action-btn"
        onClick={() => {
          setSelectedId(data.id);
          history.push(`/sql-server/license/edit/${data.id}`);
        }}
      >
        <img src={`${process.env.PUBLIC_URL}/assets/images/ic-eye.svg`} alt="" />
      </a>
      <a
        hidden
        className="action-btn"
        onClick={() => {
          setSelectedId(data.id);
          history.push(`/sql-server/license/${data.id}`);
        }}
      >
        <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
      </a>
      <Popconfirm title="Sure to delete?" onConfirm={() => removeSqlServerLicense(data.id)}>
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
        showAddButton={false}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={sqlServerLicenseSelector}
        searchTableData={searchSqlServerLicense}
        clearTableDataMessages={clearSqlServerLicenseMessages}
        setTableColumnSelection={setTableColumnSelection}
      />
    </>
  );
};

export default forwardRef(MainTable);
