import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import {
  setTableColumnSelection,
  clearCiscoHostMessages,
  ciscoHostSelector,
} from '../../../../store/hwCisco/ciscoHost/ciscoHost.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  deleteCiscoHost,
  searchCiscoHost,
} from '../../../../store/hwCisco/ciscoHost/ciscoHost.action';
import _ from 'lodash';
import ciscoHostService from '../../../../services/hwCisco/ciscoHost/ciscoHost.service';
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
  const ciscoHost = useAppSelector(ciscoHostSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const globalFilters = useAppSelector(globalSearchSelector);
  const history = useHistory();
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
    return ciscoHostService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    setFilterKeys(ObjectForColumnFilter);
    return FilterWithSwapOption(
      dataIndex,
      ciscoHost.search.tableName,
      form,
      null,
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
        title: <span className="dragHandler">Tenant Name</span>,
        column: 'TenantId',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'tenant_id',
              ciscoHost.search.lookups?.tenants?.length > 0
                ? ciscoHost.search.lookups?.tenants
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
              ciscoHost.search.lookups?.companies?.length > 0
                ? ciscoHost.search.lookups?.companies
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
              ciscoHost.search.lookups?.bus?.length > 0
                ? ciscoHost.search.lookups?.bus
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
            title: FilterByDateSwapTable('date_added', ciscoHost.search.tableName, form),
            dataIndex: 'date_added',
            key: 'date_added',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
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
        title: <span className="dragHandler">Child Relationship</span>,
        column: 'Child Relationship',
        sorter: true,
        children: [
          {
            title: FilterBySwap('child_relationship', form),
            dataIndex: 'child_relationship',
            key: 'child_relationship',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Product ID</span>,
        column: 'Product ID',
        sorter: true,
        children: [
          {
            title: FilterBySwap('product_id', form),
            dataIndex: 'product_id',
            key: 'product_id',
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
        title: <span className="dragHandler">Instance ID</span>,
        column: 'Instance ID',
        sorter: true,
        children: [
          {
            title: FilterBySwap('instance_id', form),
            dataIndex: 'instance_id',
            key: 'instance_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Parent SN</span>,
        column: 'Parent SN',
        sorter: true,
        children: [
          {
            title: FilterBySwap('parent_sn', form),
            dataIndex: 'parent_sn',
            key: 'parent_sn',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Parent Instance ID</span>,
        column: 'Parent Instance ID',
        sorter: true,
        children: [
          {
            title: FilterBySwap('parent_instance_id', form),
            dataIndex: 'parent_instance_id',
            key: 'parent_instance_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Parent / Child Relationship</span>,
        column: 'Parent / Child Relationship',
        sorter: true,
        children: [
          {
            title: FilterBySwap('parent_child_relationship', form),
            dataIndex: 'parent_child_relationship',
            key: 'parent_child_relationship',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">UID</span>,
        column: 'UID',
        sorter: true,
        children: [
          {
            title: FilterBySwap('uid', form),
            dataIndex: 'uid',
            key: 'uid',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Parent Child Indicator</span>,
        column: 'Parent Child Indicator',
        sorter: true,
        children: [
          {
            title: FilterBySwap('parent_child_indicator', form),
            dataIndex: 'parent_child_indicator',
            key: 'parent_child_indicator',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Hosp Code</span>,
        column: 'Hosp Code',
        sorter: true,
        children: [
          {
            title: FilterBySwap('hosp_code', form),
            dataIndex: 'hosp_code',
            key: 'hosp_code',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Status</span>,
        column: 'Status',
        sorter: true,
        children: [
          {
            title: FilterBySwap('status', form),
            dataIndex: 'status',
            key: 'status',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Host Name</span>,
        column: 'HostName',
        sorter: true,
        children: [
          {
            title: FilterBySwap('host_name', form),
            dataIndex: 'host_name',
            key: 'host_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">IP</span>,
        column: 'IP',
        sorter: true,
        children: [
          {
            title: FilterBySwap('ip', form),
            dataIndex: 'ip',
            key: 'ip',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">SNMP</span>,
        column: 'SNMP',
        sorter: true,
        children: [
          {
            title: FilterBySwap('snmp', form),
            dataIndex: 'snmp',
            key: 'snmp',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Stack</span>,
        column: 'Stack',
        sorter: true,
        children: [
          {
            title: FilterBySwap('stack', form),
            dataIndex: 'stack',
            key: 'stack',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Previous Host Name</span>,
        column: 'Previous HostName',
        sorter: true,
        children: [
          {
            title: FilterBySwap('previous_host_name', form),
            dataIndex: 'previous_host_name',
            key: 'previous_host_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Network Device Type</span>,
        column: 'Network Device Type',
        sorter: true,
        children: [
          {
            title: FilterBySwap('network_device_type', form),
            dataIndex: 'network_device_type',
            key: 'network_device_type',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeCiscoHost = (id: number) => {
    dispatch(deleteCiscoHost(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.HwCiscoHost}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/hw-cisco/cisco-host/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.HwCiscoHost}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeCiscoHost(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.HwCiscoHost)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={ciscoHostSelector}
        searchTableData={searchCiscoHost}
        clearTableDataMessages={clearCiscoHostMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.HwCiscoHost)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
