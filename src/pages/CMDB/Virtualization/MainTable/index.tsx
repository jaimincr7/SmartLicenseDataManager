import { Checkbox, Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import _ from 'lodash';
import {
  FilterByBooleanDropDown,
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { IMainTable, ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import DataTable from '../../../../common/components/DataTable';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import {
  deleteCmdbVirtualization,
  searchCmdbVirtualization,
} from '../../../../store/cmdb/virtualization/virtualization.action';
import { AlignType } from 'rc-table/lib/interface';
import {
  clearCmdbVirtualizationMessages,
  cmdbVirtualizationSelector,
  setTableColumnSelection,
} from '../../../../store/cmdb/virtualization/virtualization.reducer';
import virtualizationService from '../../../../services/cmdb/virtualization/virtualization.service';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const {
    setSelectedId,
    setShowSelectedListModal,
    setValuesForSelection,
    isMultiple,
    tableButtons,
  } = props;
  const cmdbVirtualization = useAppSelector(cmdbVirtualizationSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
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
    return virtualizationService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(
      dataIndex,
      cmdbVirtualization.search.tableName,
      form,
      null,
      ObjectForColumnFilter
    );
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
        title: <span className="dragHandler">Tenant</span>,
        column: 'TenantID',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('tenant_id', cmdbVirtualization.search.lookups?.tenants),
            dataIndex: 'tenant_name',
            key: 'tenant_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Cluster Name</span>,
        column: 'ClusterName',
        sorter: true,
        children: [
          {
            title: FilterBySwap('cluster_name', form),
            dataIndex: 'cluster_name',
            key: 'cluster_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Cluster ID</span>,
        column: 'ClusterID',
        sorter: true,
        children: [
          {
            title: FilterBySwap('cluster_id', form),
            dataIndex: 'cluster_id',
            key: 'cluster_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Datacenter Name</span>,
        column: 'DataCenterName',
        sorter: true,
        children: [
          {
            title: FilterBySwap('data_center_name', form),
            dataIndex: 'data_center_name',
            key: 'data_center_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Datacenter Id</span>,
        column: 'DataCenterId',
        sorter: true,
        children: [
          {
            title: FilterBySwap('data_center_id', form),
            dataIndex: 'data_center_id',
            key: 'data_center_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Hypervisor Type</span>,
        column: 'HypervisorType',
        sorter: true,
        children: [
          {
            title: FilterBySwap('hypervisor_type', form),
            dataIndex: 'hypervisor_type',
            key: 'hypervisor_type',
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
        title: <span className="dragHandler">Is DRS Enabled</span>,
        column: 'IsDRSEnabled',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_drs_enabled',
              cmdbVirtualization.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_drs_enabled',
            key: 'is_drs_enabled',
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
        title: <span className="dragHandler">Is HA Enabled</span>,
        column: 'IsHAEnabled',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_ha_enabled',
              cmdbVirtualization.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_ha_enabled',
            key: 'is_ha_enabled',
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
    ];
  };

  const removeCmdbVirtualization = (id: number) => {
    dispatch(deleteCmdbVirtualization(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.CmdbVirtualization}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/cmdb/cmdb-virtualization/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.CmdbVirtualization}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeCmdbVirtualization(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.CmdbVirtualization)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={cmdbVirtualizationSelector}
        searchTableData={searchCmdbVirtualization}
        clearTableDataMessages={clearCmdbVirtualizationMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.CmdbVirtualization)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        globalSearchExist={false}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
