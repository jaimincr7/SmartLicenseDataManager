import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  clearSqlServerOverridesMessages,
  sqlServerOverridesSelector,
} from '../../../../store/sqlServer/sqlServerOverrides/sqlServerOverrides.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  deleteSqlServerOverrides,
  searchSqlServerOverrides,
} from '../../../../store/sqlServer/sqlServerOverrides/sqlServerOverrides.action';
import { IMainTable } from './mainTable.model';
import _ from 'lodash';
import sqlServerOverridesService from '../../../../services/sqlServer/sqlServerOverrides/sqlServerOverrides.service';
import {
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import DataTable from '../../../../common/components/DataTable';
import { setTableColumnSelection } from '../../../../store/sqlServer/sqlServerOverrides/sqlServerOverrides.reducer';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const { setSelectedId } = props;
  const sqlServerOverrides = useAppSelector(sqlServerOverridesSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const exportExcelFile = (searchData: ISearch) => {
    return sqlServerOverridesService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(dataIndex, sqlServerOverrides.search.tableName, form);
  };

  const getTableColumns = (form) => {
    return [
      {
        title: 'Tenant Name',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('tenant_id', sqlServerOverrides.search.lookups?.tenants),
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
            title: FilterByDropdown('company_id', sqlServerOverrides.search.lookups?.companies),
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
            title: FilterByDropdown('bu_id', sqlServerOverrides.search.lookups?.bus),
            dataIndex: 'bu_name',
            key: 'bu_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Device Name',
        sorter: true,
        children: [
          {
            title: FilterBySwap('device_name', form),
            dataIndex: 'device_name',
            key: 'device_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Override Field',
        sorter: true,
        children: [
          {
            title: FilterBySwap('override_field', form),
            dataIndex: 'override_field',
            key: 'override_field',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Override Value',
        sorter: true,
        children: [
          {
            title: FilterBySwap('override_value', form),
            dataIndex: 'override_value',
            key: 'override_value',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Enabled',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('enabled', sqlServerOverrides.search.lookups?.booleanLookup),
            dataIndex: 'enabled',
            key: 'enabled',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Version',
        sorter: true,
        children: [
          {
            title: FilterBySwap('version', form),
            dataIndex: 'version',
            key: 'version',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Edition',
        sorter: true,
        children: [
          {
            title: FilterBySwap('edition', form),
            dataIndex: 'edition',
            key: 'edition',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Source',
        sorter: true,
        children: [
          {
            title: FilterBySwap('source', form),
            dataIndex: 'source',
            key: 'source',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Notes',
        sorter: true,
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

  const removeSqlServerOverrides = (id: number) => {
    dispatch(deleteSqlServerOverrides(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <a
        className="action-btn"
        onClick={() => {
          setSelectedId(data.id);
          history.push(`/sql-server/overrides/${data.id}`);
        }}
      >
        <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
      </a>
      <Popconfirm title="Sure to delete?" onConfirm={() => removeSqlServerOverrides(data.id)}>
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
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={sqlServerOverridesSelector}
        searchTableData={searchSqlServerOverrides}
        clearTableDataMessages={clearSqlServerOverridesMessages}
        setTableColumnSelection={setTableColumnSelection}
      />
    </>
  );
};

export default forwardRef(MainTable);
