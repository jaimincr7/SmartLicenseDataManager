import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  setTableColumnSelection,
  clearTabVClusterMessages,
  tabVClusterSelector,
} from '../../../../store/rvTools/tabVCluster/tabVCluster.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  deleteTabVCluster,
  searchTabVCluster,
} from '../../../../store/rvTools/tabVCluster/tabVCluster.action';
import { IMainTable } from './mainTable.model';
import _ from 'lodash';
import tabVClusterService from '../../../../services/rvTools/tabVCluster/tabVCluster.service';
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
import moment from 'moment';
import { Common } from '../../../../common/constants/common';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const { setSelectedId } = props;
  const tabVCluster = useAppSelector(tabVClusterSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const exportExcelFile = (searchData: ISearch) => {
    return tabVClusterService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(dataIndex, tabVCluster.search.tableName, form);
  };

  const getTableColumns = (form) => {
    return [
      {
        title: <span className="dragHandler">Tenant Name</span>,
        column: 'TenantId',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('tenant_id', tabVCluster.search.lookups?.tenants),
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
            title: FilterByDropdown('company_id', tabVCluster.search.lookups?.companies),
            dataIndex: 'company_name',
            key: 'company_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Bu Name</span>,
        column: 'Bu_Id',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('bu_id', tabVCluster.search.lookups?.bus),
            dataIndex: 'bu_name',
            key: 'bu_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Name</span>,
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
        title: <span className="dragHandler">Date Added</span>,
        column: 'Date Added',
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
        title: <span className="dragHandler">Overall Status</span>,
        column: 'OverallStatus',
        sorter: true,
        children: [
          {
            title: FilterBySwap('over_all_status', form),
            dataIndex: 'over_all_status',
            key: 'over_all_status',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Hosts</span>,
        column: 'NumHosts',
        sorter: true,
        children: [
          {
            title: FilterBySwap('num_hosts', form),
            dataIndex: 'num_hosts',
            key: 'num_hosts',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Effective Hosts</span>,
        column: 'numEffectiveHosts',
        sorter: true,
        children: [
          {
            title: FilterBySwap('num_effective_hosts', form),
            dataIndex: 'num_effective_hosts',
            key: 'num_effective_hosts',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Total CPU</span>,
        column: 'TotalCPU',
        sorter: true,
        children: [
          {
            title: FilterBySwap('total_cpu', form),
            dataIndex: 'total_cpu',
            key: 'total_cpu',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Source</span>,
        column: 'Source',
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
        title: <span className="dragHandler">CPU Cores</span>,
        column: 'NumCpuCores',
        sorter: true,
        children: [
          {
            title: FilterBySwap('num_cpu_cores', form),
            dataIndex: 'num_cpu_cores',
            key: 'num_cpu_cores',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">V Motions</span>,
        column: 'Num VMotions',
        sorter: true,
        children: [
          {
            title: FilterBySwap('num_v_motions', form),
            dataIndex: 'num_v_motions',
            key: 'num_v_motions',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">HA Enabled</span>,
        column: 'HA enabled',
        sorter: true,
        children: [
          {
            title: FilterBySwap('ha_enabled', form),
            dataIndex: 'ha_enabled',
            key: 'ha_enabled',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Fail Over Level</span>,
        column: 'Failover Level',
        sorter: true,
        children: [
          {
            title: FilterBySwap('failover_level', form),
            dataIndex: 'failover_level',
            key: 'failover_level',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">DRS Enabled</span>,
        column: 'DRS enabled',
        sorter: true,
        children: [
          {
            title: FilterBySwap('drs_enabled', form),
            dataIndex: 'drs_enabled',
            key: 'drs_enabled',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">DRS default VM behavior value</span>,
        column: 'DRS default VM behavior value',
        sorter: true,
        children: [
          {
            title: FilterBySwap('drs_default_vm_behavior_value', form),
            dataIndex: 'drs_default_vm_behavior_value',
            key: 'drs_default_vm_behavior_value',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">DRS V Motion Rate</span>,
        column: 'DRS vmotion rate',
        sorter: true,
        children: [
          {
            title: FilterBySwap('drs_v_motion_rate', form),
            dataIndex: 'drs_v_motion_rate',
            key: 'drs_v_motion_rate',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">DRS Default VM Behavior</span>,
        column: 'DRSDefaultVMBehavior',
        sorter: true,
        children: [
          {
            title: FilterBySwap('drs_default_vm_behavior', form),
            dataIndex: 'drs_default_vm_behavior',
            key: 'drs_default_vm_behavior',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Data Center</span>,
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
        title: <span className="dragHandler">VMs Per Host</span>,
        column: 'VMsPerHost',
        sorter: true,
        children: [
          {
            title: FilterBySwap('vm_sper_host', form),
            dataIndex: 'vm_sper_host',
            key: 'vm_sper_host',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">VMs</span>,
        column: 'VMs',
        sorter: true,
        children: [
          {
            title: FilterBySwap('vms', form),
            dataIndex: 'vms',
            key: 'vms',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Health</span>,
        column: 'Health',
        sorter: true,
        children: [
          {
            title: FilterBySwap('health', form),
            dataIndex: 'health',
            key: 'health',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeTabVCluster = (id: number) => {
    dispatch(deleteTabVCluster(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.TabVCluster}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/rv-tools/tab-v-cluster/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.TabVCluster}>
        <Popconfirm title="Sure to delete?" onConfirm={() => removeTabVCluster(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.TabVCluster)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={tabVClusterSelector}
        searchTableData={searchTabVCluster}
        clearTableDataMessages={clearTabVClusterMessages}
        setTableColumnSelection={setTableColumnSelection}
      />
    </>
  );
};

export default forwardRef(MainTable);
