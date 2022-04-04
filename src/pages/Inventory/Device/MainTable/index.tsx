import { Checkbox, Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import {
  setTableColumnSelection,
  clearDeviceMessages,
  deviceSelector,
} from '../../../../store/inventory/device/device.reducer';
import { AlignType } from 'rc-table/lib/interface';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import { deleteDevice, searchDevice } from '../../../../store/inventory/device/device.action';
import _ from 'lodash';
import deviceService from '../../../../services/inventory/device/device.service';
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
  const device = useAppSelector(deviceSelector);
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
    return deviceService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    setFilterKeys(ObjectForColumnFilter);
    return FilterWithSwapOption(
      dataIndex,
      device.search.tableName,
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
              device.search.lookups?.tenants?.length > 0
                ? device.search.lookups?.tenants
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
              device.search.lookups?.companies?.length > 0
                ? device.search.lookups?.companies
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
              device.search.lookups?.bus?.length > 0
                ? device.search.lookups?.bus
                : globalFilters?.globalBULookup?.data
            ),
            dataIndex: 'bu_name',
            key: 'bu_name',
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
            title: FilterByDateSwapTable('date_added', device.search.tableName, form),
            dataIndex: 'date_added',
            key: 'date_added',
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
        sorter: true,
        column: 'Model',
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
        title: <span className="dragHandler">Total Cpu</span>,
        column: 'Total Cpu',
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
        title: <span className="dragHandler">Purchase Date</span>,
        sorter: true,
        column: 'Purchase Date',
        children: [
          {
            title: FilterBySwap('purchase_date', form),
            dataIndex: 'purchase_date',
            key: 'purchase_date',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">User Name</span>,
        sorter: true,
        column: 'User Name',
        children: [
          {
            title: FilterBySwap('user_name', form),
            dataIndex: 'user_name',
            key: 'user_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Device State</span>,
        sorter: true,
        column: 'Device State',
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
        title: <span className="dragHandler">Device Type</span>,
        sorter: true,
        column: 'Device Type',
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
        title: <span className="dragHandler">Domain</span>,
        sorter: true,
        column: 'Domain',
        children: [
          {
            title: FilterBySwap('domain', form),
            dataIndex: 'domain',
            key: 'domain',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Active in AD</span>,
        column: 'Active in AD',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'active_in_ad',
              device.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'active_in_ad',
            key: 'active_in_ad',
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
        title: <span className="dragHandler">Qualified in AD</span>,
        column: 'Qualified in AD',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'qualified_in_ad',
              device.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'qualified_in_ad',
            key: 'qualified_in_ad',
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
        title: <span className="dragHandler">In AD</span>,
        column: 'In AD',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown('in_ad', device.search.tableName, ObjectForColumnFilter),
            dataIndex: 'in_ad',
            key: 'in_ad',
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

  const removeDevice = (id: number) => {
    dispatch(deleteDevice(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.Device}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/inventory-module/device/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.Device}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeDevice(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.Device)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={deviceSelector}
        searchTableData={searchDevice}
        clearTableDataMessages={clearDeviceMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.Device)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
