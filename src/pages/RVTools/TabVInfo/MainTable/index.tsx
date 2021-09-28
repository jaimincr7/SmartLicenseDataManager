import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  setTableColumnSelection,
  clearTabVInfoMessages,
  tabVInfoSelector,
} from '../../../../store/rvTools/tabVInfo/tabVInfo.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import { deleteTabVInfo, searchTabVInfo } from '../../../../store/rvTools/tabVInfo/tabVInfo.action';
import _ from 'lodash';
import tabVInfoService from '../../../../services/rvTools/tabVInfo/tabVInfo.service';
import {
  FilterByDateSwap,
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { IMainTable, ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import DataTable from '../../../../common/components/DataTable';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import moment from 'moment';
import { Common } from '../../../../common/constants/common';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const { setSelectedId } = props;
  const tabVInfo = useAppSelector(tabVInfoSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const exportExcelFile = (searchData: ISearch) => {
    return tabVInfoService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(dataIndex, tabVInfo.search.tableName, form);
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
        children: [
          {
            title: FilterByDropdown('tenant_id', tabVInfo.search.lookups?.tenants),
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
            title: FilterByDropdown('company_id', tabVInfo.search.lookups?.companies),
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
            title: FilterByDropdown('bu_id', tabVInfo.search.lookups?.bus),
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
            title: FilterByDateSwap('date_added', tabVInfo.search.tableName, form),
            dataIndex: 'date_added',
            key: 'date_added',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Host</span>,
        column: 'Host',
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
        title: <span className="dragHandler">Cluster</span>,
        column: 'Cluster',
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
        title: <span className="dragHandler">CPUs</span>,
        column: 'CPUs',
        sorter: true,
        children: [
          {
            title: FilterBySwap('cpus', form),
            dataIndex: 'cpus',
            key: 'cpus',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">CPU Size Recommendation</span>,
        column: 'CPUSizeRecommendation',
        sorter: true,
        children: [
          {
            title: FilterBySwap('cpu_size_recommendation', form),
            dataIndex: 'cpu_size_recommendation',
            key: 'cpu_size_recommendation',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Customer Id</span>,
        column: 'Customer ID',
        sorter: true,
        children: [
          {
            title: FilterBySwap('customer_id', form),
            dataIndex: 'customer_id',
            key: 'customer_id',
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
        title: <span className="dragHandler">DNS Name</span>,
        column: 'DNS Name',
        sorter: true,
        children: [
          {
            title: FilterBySwap('dns_name', form),
            dataIndex: 'dns_name',
            key: 'dns_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Guest State</span>,
        column: 'Guest state',
        sorter: true,
        children: [
          {
            title: FilterBySwap('guest_state', form),
            dataIndex: 'guest_state',
            key: 'guest_state',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">OS</span>,
        column: 'OS',
        sorter: true,
        children: [
          {
            title: FilterBySwap('os', form),
            dataIndex: 'os',
            key: 'os',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">OS according to the configuration file</span>,
        column: 'OS according to the configuration file',
        sorter: true,
        children: [
          {
            title: FilterBySwap('os_according_to_the_configuration_file', form),
            dataIndex: 'os_according_to_the_configuration_file',
            key: 'os_according_to_the_configuration_file',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">OS according to the VMware Tools</span>,
        column: 'OS according to the VMware Tools',
        sorter: true,
        children: [
          {
            title: FilterBySwap('os_according_to_the_vm_ware_tools', form),
            dataIndex: 'os_according_to_the_vm_ware_tools',
            key: 'os_according_to_the_vm_ware_tools',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Power State</span>,
        column: 'Powerstate',
        sorter: true,
        children: [
          {
            title: FilterBySwap('power_state', form),
            dataIndex: 'power_state',
            key: 'power_state',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">sId</span>,
        column: 'SID',
        sorter: true,
        children: [
          {
            title: FilterBySwap('s_id', form),
            dataIndex: 's_id',
            key: 's_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">VM</span>,
        column: 'VM',
        sorter: true,
        children: [
          {
            title: FilterBySwap('vm', form),
            dataIndex: 'vm',
            key: 'vm',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">VM UUID</span>,
        column: 'VM UUID',
        sorter: true,
        children: [
          {
            title: FilterBySwap('vm_uuid', form),
            dataIndex: 'vm_uuid',
            key: 'vm_uuid',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">VMC</span>,
        column: 'VMC',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('vmc', tabVInfo.search.lookups?.booleanLookup),
            dataIndex: 'vmc',
            key: 'vmc',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
    ];
  };

  const removeTabVInfo = (id: number) => {
    dispatch(deleteTabVInfo(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.TabVInfo}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/rv-tools/tab-v-info/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.TabVInfo}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeTabVInfo(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.TabVInfo)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={tabVInfoSelector}
        searchTableData={searchTabVInfo}
        clearTableDataMessages={clearTabVInfoMessages}
        setTableColumnSelection={setTableColumnSelection}
      />
    </>
  );
};

export default forwardRef(MainTable);
