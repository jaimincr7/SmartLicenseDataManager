import { Checkbox, Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import {
  setTableColumnSelection,
  clearSqlServerInventoryMessages,
  sqlServerInventorySelector,
} from '../../../../store/sqlServer/sqlServerInventory/sqlServerInventory.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import { AlignType } from 'rc-table/lib/interface';
import {
  deleteSqlServerInventory,
  searchSqlServerInventory,
} from '../../../../store/sqlServer/sqlServerInventory/sqlServerInventory.action';
import _ from 'lodash';
import sqlServerInventoryService from '../../../../services/sqlServer/sqlServerInventory/sqlServerInventory.service';
import {
  FilterByBooleanDropDown,
  FilterByDateSwap,
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { IMainTable, ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import DataTable from '../../../../common/components/DataTable';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import { globalSearchSelector } from '../../../../store/globalSearch/globalSearch.reducer';
import { showDateFromApi } from '../../../../common/helperFunction';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const {
    setSelectedId,
    setShowSelectedListModal,
    setValuesForSelection,
    isMultiple,
    setFilterKeys,
    tableButtons,
  } = props;
  const sqlServerInventory = useAppSelector(sqlServerInventorySelector);
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
    return sqlServerInventoryService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    setFilterKeys(ObjectForColumnFilter);
    return FilterWithSwapOption(
      dataIndex,
      sqlServerInventory.search.tableName,
      form,
      null,
      ObjectForColumnFilter
    );
  };

  const FilterByBoolean = (dataIndex: string) => {
    return FilterByBooleanDropDown(
      dataIndex,
      sqlServerInventory.search.tableName,
      ObjectForColumnFilter
    );
  };

  const FilterByDateSwapTable = (dataIndex: string, tableName: string, form: any) => {
    return FilterByDateSwap(dataIndex, tableName, form, null, ObjectForColumnFilter);
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
        title: <span className="dragHandler">Product Name</span>,
        column: 'Product Name',
        sorter: true,
        children: [
          {
            title: FilterBySwap('product_name', form),
            dataIndex: 'product_name',
            key: 'product_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Operating System</span>,
        column: 'Operating System',
        sorter: true,
        children: [
          {
            title: FilterBySwap('operating_system', form),
            dataIndex: 'operating_system',
            key: 'operating_system',
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
              sqlServerInventory.search.lookups?.tenants?.length > 0
                ? sqlServerInventory.search.lookups?.tenants
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
              sqlServerInventory.search.lookups?.companies?.length > 0
                ? sqlServerInventory.search.lookups?.companies
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
              sqlServerInventory.search.lookups?.bus?.length > 0
                ? sqlServerInventory.search.lookups?.bus
                : globalFilters?.globalBULookup?.data
            ),
            dataIndex: 'bu_name',
            key: 'bu_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Date Added</span>,
        column: 'Date Added',
        sorter: true,
        children: [
          {
            title: FilterByDateSwapTable('date_added', sqlServerInventory.search.tableName, form),
            dataIndex: 'date_added',
            key: 'date_added',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">SQL Cluster</span>,
        column: 'SQL Cluster',
        sorter: true,
        children: [
          {
            title: FilterBySwap('sql_cluster', form),
            dataIndex: 'sql_cluster',
            key: 'sql_cluster',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Host</span>,
        sorter: true,
        column: 'Host',
        children: [
          {
            title: FilterBySwap('host', form),
            dataIndex: 'host',
            key: 'host',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Device Name</span>,
        column: 'Device Name',
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
        title: <span className="dragHandler">Device Type</span>,
        column: 'Device Type',
        sorter: true,
        children: [
          {
            title: FilterBySwap('device_type', form),
            dataIndex: 'device_type',
            key: 'device_type',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Product Family</span>,
        column: 'Product Family',
        sorter: true,
        children: [
          {
            title: FilterBySwap('product_family', form),
            dataIndex: 'product_family',
            key: 'product_family',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Procs</span>,
        sorter: true,
        column: 'Procs',
        children: [
          {
            title: FilterBySwap('procs', form),
            dataIndex: 'procs',
            key: 'procs',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Cores</span>,
        sorter: true,
        column: 'Cores',
        children: [
          {
            title: FilterBySwap('cores', form),
            dataIndex: 'cores',
            key: 'cores',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">vCPU</span>,
        sorter: true,
        column: 'vCPU',
        children: [
          {
            title: FilterBySwap('vCPU', form),
            dataIndex: 'vCPU',
            key: 'vCPU',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Version</span>,
        sorter: true,
        column: 'Version',
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
        title: <span className="dragHandler">Edition</span>,
        sorter: true,
        column: 'Edition',
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
        title: <span className="dragHandler">Device State</span>,
        column: 'Device State',
        sorter: true,
        children: [
          {
            title: FilterBySwap('device_state', form),
            dataIndex: 'device_state',
            key: 'device_state',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Software State</span>,
        column: 'Software State',
        sorter: true,
        children: [
          {
            title: FilterBySwap('software_state', form),
            dataIndex: 'software_state',
            key: 'software_state',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Cluster</span>,
        sorter: true,
        column: 'Cluster',
        children: [
          {
            title: FilterBySwap('cluster', form),
            dataIndex: 'cluster',
            key: 'cluster',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Source</span>,
        sorter: true,
        column: 'Source',
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
        title: <span className="dragHandler">OS Type</span>,
        column: 'OS Type',
        sorter: true,
        children: [
          {
            title: FilterBySwap('os_type', form),
            dataIndex: 'os_type',
            key: 'os_type',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Raw Software Title</span>,
        column: 'Raw Software Title',
        sorter: true,
        children: [
          {
            title: FilterBySwap('raw_software_title', form),
            dataIndex: 'raw_software_title',
            key: 'raw_software_title',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">FQDN</span>,
        sorter: true,
        column: 'FQDN',
        children: [
          {
            title: FilterBySwap('fqdn', form),
            dataIndex: 'fqdn',
            key: 'fqdn',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Service</span>,
        sorter: true,
        column: 'Service',
        children: [
          {
            title: FilterBySwap('service', form),
            dataIndex: 'service',
            key: 'service',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Cost Code</span>,
        column: 'Cost Code',
        sorter: true,
        children: [
          {
            title: FilterBySwap('cost_code', form),
            dataIndex: 'cost_code',
            key: 'cost_code',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Line of Business</span>,
        column: 'Line of Business',
        sorter: true,
        children: [
          {
            title: FilterBySwap('line_of_business', form),
            dataIndex: 'line_of_business',
            key: 'line_of_business',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Market</span>,
        sorter: true,
        column: 'Market',
        children: [
          {
            title: FilterBySwap('market', form),
            dataIndex: 'market',
            key: 'market',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Application</span>,
        sorter: true,
        column: 'Application',
        children: [
          {
            title: FilterBySwap('application', form),
            dataIndex: 'application',
            key: 'application',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Azure Hosted</span>,
        column: 'Azure Hosted',
        sorter: true,
        children: [
          {
            title: FilterByBoolean('azure_hosted'),
            dataIndex: 'azure_hosted',
            key: 'azure_hosted',
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
      {
        title: <span className="dragHandler">HA Enabled</span>,
        column: 'HA Enabled',
        sorter: true,
        children: [
          {
            title: FilterByBoolean('ha_enabled'),
            dataIndex: 'ha_enabled',
            key: 'ha_enabled',
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
      {
        title: <span className="dragHandler">Datacenter</span>,
        column: 'Datacenter',
        sorter: true,
        children: [
          {
            title: FilterBySwap('data_center', form),
            dataIndex: 'data_center',
            key: 'data_center',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Serial Number</span>,
        column: 'Serial Number',
        sorter: true,
        children: [
          {
            title: FilterBySwap('serial_number', form),
            dataIndex: 'serial_number',
            key: 'serial_number',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">SQL Cluster Node Type</span>,
        column: 'SQL Cluster Node Type',
        sorter: true,
        children: [
          {
            title: FilterBySwap('sql_cluster_node_type', form),
            dataIndex: 'sql_cluster_node_type',
            key: 'sql_cluster_node_type',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeSqlServerInventory = (id: number) => {
    dispatch(deleteSqlServerInventory(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.SqlServerInventory}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/sql-server/inventory/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.SqlServerInventory}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeSqlServerInventory(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.SqlServerInventory)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={sqlServerInventorySelector}
        searchTableData={searchSqlServerInventory}
        clearTableDataMessages={clearSqlServerInventoryMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.SqlServerInventory)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
