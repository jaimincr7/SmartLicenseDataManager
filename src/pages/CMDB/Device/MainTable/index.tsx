import { Checkbox, Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import _ from 'lodash';
import {
  FilterByBooleanDropDown,
  FilterByDateSwap,
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { IMainTable, ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import { AlignType } from 'rc-table/lib/interface';
import DataTable from '../../../../common/components/DataTable';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import { deleteCmdbDevice, searchCmdbDevice } from '../../../../store/cmdb/device/device.action';
import {
  clearCmdbDeviceMessages,
  cmdbDeviceSelector,
  setTableColumnSelection,
} from '../../../../store/cmdb/device/device.reducer';
import deviceService from '../../../../services/cmdb/device/device.service';
import { showDateFromApi } from '../../../../common/helperFunction';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const {
    setSelectedId,
    setShowSelectedListModal,
    setValuesForSelection,
    isMultiple,
    tableButtons,
  } = props;
  const cmdbDevice = useAppSelector(cmdbDeviceSelector);
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
    return deviceService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(
      dataIndex,
      cmdbDevice.search.tableName,
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
        title: <span className="dragHandler">Tenant</span>,
        column: 'TenantID',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('tenant_id', cmdbDevice.search.lookups?.tenants),
            dataIndex: 'tenant_name',
            key: 'tenant_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Operating System</span>,
        column: 'OperatingSystemID',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'operating_system_id',
              cmdbDevice.search.lookups?.operating_systems
            ),
            dataIndex: 'operating_system_name',
            key: 'operating_system_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Processor</span>,
        column: 'ProcessorID',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('processor_id', cmdbDevice.search.lookups?.processors),
            dataIndex: 'processor_name',
            key: 'processor_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Virtualization</span>,
        column: 'VirtualizationID',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'virtualization_id',
              cmdbDevice.search.lookups?.virtualizations
            ),
            dataIndex: 'virtualization_name',
            key: 'virtualization_name',
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
        title: <span className="dragHandler">Computer Name</span>,
        column: 'ComputerName',
        sorter: true,
        children: [
          {
            title: FilterBySwap('computer_name', form),
            dataIndex: 'computer_name',
            key: 'computer_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Type</span>,
        column: 'Type',
        sorter: true,
        children: [
          {
            title: FilterBySwap('type', form),
            dataIndex: 'type',
            key: 'type',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Last Updated</span>,
        column: 'LastUpdated',
        sorter: true,
        children: [
          {
            title: FilterByDateSwapTable('last_updated', cmdbDevice.search.tableName, form),
            dataIndex: 'last_updated',
            key: 'last_updated',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Manufacturer</span>,
        column: 'Manufacturer',
        sorter: true,
        children: [
          {
            title: FilterBySwap('manufacturer', form),
            dataIndex: 'manufacturer',
            key: 'manufacturer',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Model</span>,
        column: 'Model',
        sorter: true,
        children: [
          {
            title: FilterBySwap('model', form),
            dataIndex: 'model',
            key: 'model',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Architecture</span>,
        column: 'Architecture',
        sorter: true,
        children: [
          {
            title: FilterBySwap('architecture', form),
            dataIndex: 'architecture',
            key: 'architecture',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Bios Manufacturer</span>,
        column: 'BiosManufacturer',
        sorter: true,
        children: [
          {
            title: FilterBySwap('bios_manufacturer', form),
            dataIndex: 'bios_manufacturer',
            key: 'bios_manufacturer',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Bios Serial</span>,
        column: 'BiosSerial',
        sorter: true,
        children: [
          {
            title: FilterBySwap('bios_serial', form),
            dataIndex: 'bios_serial',
            key: 'bios_serial',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Bios Version</span>,
        column: 'BiosVersion',
        sorter: true,
        children: [
          {
            title: FilterBySwap('bios_version', form),
            dataIndex: 'bios_version',
            key: 'bios_version',
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
        title: <span className="dragHandler">Hypervisor Name</span>,
        column: 'HypervisorName',
        sorter: true,
        children: [
          {
            title: FilterBySwap('bios_manufacturer', form),
            dataIndex: 'bios_manufacturer',
            key: 'bios_manufacturer',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Is Virtual</span>,
        column: 'IsVirtual',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_virtual',
              cmdbDevice.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_virtual',
            key: 'is_virtual',
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
        title: <span className="dragHandler">Is VDI</span>,
        column: 'IsVDI',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_vdi',
              cmdbDevice.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_vdi',
            key: 'is_vdi',
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
        title: <span className="dragHandler">Is Server</span>,
        column: 'IsServer',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_server',
              cmdbDevice.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_server',
            key: 'is_server',
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
        title: <span className="dragHandler">Is Host</span>,
        column: 'IsHost',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_host',
              cmdbDevice.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_host',
            key: 'is_host',
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
        title: <span className="dragHandler">Is Tablet</span>,
        column: 'IsTablet',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_tablet',
              cmdbDevice.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_tablet',
            key: 'is_tablet',
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
        title: <span className="dragHandler">Is Portable</span>,
        column: 'IsPortable',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_portable',
              cmdbDevice.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_portable',
            key: 'is_portable',
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

  const removeCmdbDevice = (id: number) => {
    dispatch(deleteCmdbDevice(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.CmdbDevice}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/cmdb/cmdb-device/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.CmdbDevice}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeCmdbDevice(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.CmdbDevice)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={cmdbDeviceSelector}
        searchTableData={searchCmdbDevice}
        clearTableDataMessages={clearCmdbDeviceMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.CmdbDevice)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        showDelete={false}
        globalSearchExist={false}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
