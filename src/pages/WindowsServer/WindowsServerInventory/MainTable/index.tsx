import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  setTableColumnSelection,
  clearWindowsServerInventoryMessages,
  windowsServerInventorySelector,
} from '../../../../store/windowsServer/windowsServerInventory/windowsServerInventory.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  deleteWindowsServerInventory,
  searchWindowsServerInventory,
} from '../../../../store/windowsServer/windowsServerInventory/windowsServerInventory.action';
import { IMainTable } from './mainTable.model';
import moment from 'moment';
import { Common } from '../../../../common/constants/common';
import _ from 'lodash';
import windowsServerInventoryService from '../../../../services/windowsServer/windowsServerInventory/windowsServerInventory.service';
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
  const windowsServerInventory = useAppSelector(windowsServerInventorySelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const exportExcelFile = (searchData: ISearch) => {
    return windowsServerInventoryService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(dataIndex, windowsServerInventory.search.tableName, form);
  };

  const getTableColumns = (form) => {
    return [
      {
        title: 'Operating System',
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
        title: 'Tenant Name',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('tenant_id', windowsServerInventory.search.lookups?.tenants),
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
            title: FilterByDropdown('company_id', windowsServerInventory.search.lookups?.companies),
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
            title: FilterByDropdown('bu_id', windowsServerInventory.search.lookups?.bus),
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
        title: 'Host',
        sorter: true,
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
        title: 'Device Type',
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
        title: 'Product Family',
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
        title: 'Device State',
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
        title: 'Software State',
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
        title: 'Cluster',
        sorter: true,
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
        title: 'FQDN',
        sorter: true,
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
        title: 'Cost Code',
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
        title: 'Line of Business',
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
        title: 'Market',
        sorter: true,
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
        title: 'Application',
        sorter: true,
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
        title: 'Data Center',
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
        title: 'Serial Number',
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
        title: 'SC Version',
        sorter: true,
        children: [
          {
            title: FilterBySwap('sc_version', form),
            dataIndex: 'sc_version',
            key: 'sc_version',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Procs',
        sorter: true,
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
        title: 'Cores',
        sorter: true,
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
        title: 'vCPU',
        sorter: true,
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
        title: 'Azure Hosted',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'azure_hosted',
              windowsServerInventory.search.lookups?.booleanLookup
            ),
            dataIndex: 'azure_hosted',
            key: 'azure_hosted',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'HA Enabled',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'ha_enabled',
              windowsServerInventory.search.lookups?.booleanLookup
            ),
            dataIndex: 'ha_enabled',
            key: 'ha_enabled',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'DRS Enabled',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'drs_enabled',
              windowsServerInventory.search.lookups?.booleanLookup
            ),
            dataIndex: 'drs_enabled',
            key: 'drs_enabled',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Exempt',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('exempt', windowsServerInventory.search.lookups?.booleanLookup),
            dataIndex: 'exempt',
            key: 'exempt',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'SC Agent',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'sc_agent',
              windowsServerInventory.search.lookups?.booleanLookup
            ),
            dataIndex: 'sc_agent',
            key: 'sc_agent',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'SC Exempt',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'sc_exempt',
              windowsServerInventory.search.lookups?.booleanLookup
            ),
            dataIndex: 'sc_exempt',
            key: 'sc_exempt',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'SC Server',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'sc_server',
              windowsServerInventory.search.lookups?.booleanLookup
            ),
            dataIndex: 'sc_server',
            key: 'sc_server',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
    ];
  };

  const removeWindowsServerInventory = (id: number) => {
    dispatch(deleteWindowsServerInventory(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.WindowsServerInventory}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/windows-server/inventory/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.WindowsServerInventory}>
        <Popconfirm title="Sure to delete?" onConfirm={() => removeWindowsServerInventory(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.WindowsServerInventory)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={windowsServerInventorySelector}
        searchTableData={searchWindowsServerInventory}
        clearTableDataMessages={clearWindowsServerInventoryMessages}
        setTableColumnSelection={setTableColumnSelection}
      />
    </>
  );
};

export default forwardRef(MainTable);
