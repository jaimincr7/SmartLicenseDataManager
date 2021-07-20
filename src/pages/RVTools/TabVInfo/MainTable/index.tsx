import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  clearTabVInfoMessages,
  tabVInfoSelector,
} from '../../../../store/rvTools/tabVInfo/tabVInfo.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import { deleteTabVInfo, searchTabVInfo } from '../../../../store/rvTools/tabVInfo/tabVInfo.action';
import { IMainTable } from './mainTable.model';
import _ from 'lodash';
import tabVInfoService from '../../../../services/rvTools/tabVInfo/tabVInfo.service';
import {
  FilterByDate,
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import DataTable from '../../../../common/components/DataTable';
import { setTableColumnSelection } from '../../../../store/rvTools/tabVInfo/tabVInfo.reducer';
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
        title: 'Tenant Name',
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
        title: 'Company Name',
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
        title: 'Bu Name',
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
        title: 'CPUs',
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
        title: 'CPU Size Recommendation',
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
        title: 'Customer Id',
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
        title: 'DNS Name',
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
        title: 'Guest State',
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
        title: 'OS',
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
        title: 'OS according to the configuration file',
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
        title: 'OS according to the VMware Tools',
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
        title: 'Power State',
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
        title: 'sId',
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
        title: 'VM',
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
        title: 'VM UUID',
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
        title: 'VMC',
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
        <Popconfirm title="Sure to delete?" onConfirm={() => removeTabVInfo(data.id)}>
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
