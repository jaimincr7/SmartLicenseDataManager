import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  setTableColumnSelection,
  clearSqlServerExclusionsMessages,
  sqlServerExclusionsSelector,
} from '../../../../store/sqlServer/sqlServerExclusions/sqlServerExclusions.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  deleteSqlServerExclusions,
  searchSqlServerExclusions,
} from '../../../../store/sqlServer/sqlServerExclusions/sqlServerExclusions.action';
import { IMainTable } from './mainTable.model';
import _ from 'lodash';
import sqlServerExclusionsService from '../../../../services/sqlServer/sqlServerExclusions/sqlServerExclusions.service';
import {
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
  const sqlServerExclusions = useAppSelector(sqlServerExclusionsSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const exportExcelFile = (searchData: ISearch) => {
    return sqlServerExclusionsService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(dataIndex, sqlServerExclusions.search.tableName, form);
  };

  const getTableColumns = (form) => {
    return [
      {
        title: 'Tenant Name',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('tenant_id', sqlServerExclusions.search.lookups?.tenants),
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
            title: FilterByDropdown('company_id', sqlServerExclusions.search.lookups?.companies),
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
            title: FilterByDropdown('bu_id', sqlServerExclusions.search.lookups?.bus),
            dataIndex: 'bu_name',
            key: 'bu_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Field',
        sorter: true,
        children: [
          {
            title: FilterBySwap('field', form),
            dataIndex: 'field',
            key: 'field',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Condition',
        sorter: true,
        children: [
          {
            title: FilterBySwap('condition', form),
            dataIndex: 'condition',
            key: 'condition',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Value',
        sorter: true,
        children: [
          {
            title: FilterBySwap('value', form),
            dataIndex: 'value',
            key: 'value',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Enabled',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('enabled', sqlServerExclusions.search.lookups?.booleanLookup),
            dataIndex: 'enabled',
            key: 'enabled',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Instance Count',
        sorter: true,
        children: [
          {
            title: FilterBySwap('instance_count', form),
            dataIndex: 'instance_count',
            key: 'instance_count',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeSqlServerExclusions = (id: number) => {
    dispatch(deleteSqlServerExclusions(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.SqlServerExclusions}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/sql-server/exclusions/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.SqlServerExclusions}>
        <Popconfirm title="Sure to delete?" onConfirm={() => removeSqlServerExclusions(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.SqlServerExclusions)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={sqlServerExclusionsSelector}
        searchTableData={searchSqlServerExclusions}
        clearTableDataMessages={clearSqlServerExclusionsMessages}
        setTableColumnSelection={setTableColumnSelection}
      />
    </>
  );
};

export default forwardRef(MainTable);
