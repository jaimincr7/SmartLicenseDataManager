import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import {
  setTableColumnSelection,
  clearHardwareMessages,
  hardwareSelector,
} from '../../../../store/inventory/hardware/hardware.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  deleteHardware,
  searchHardware,
} from '../../../../store/inventory/hardware/hardware.action';
import _ from 'lodash';
import hardwareService from '../../../../services/inventory/hardware/hardware.service';
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
  const hardware = useAppSelector(hardwareSelector);
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
    return hardwareService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    setFilterKeys(ObjectForColumnFilter);
    return FilterWithSwapOption(
      dataIndex,
      hardware.search.tableName,
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
              hardware.search.lookups?.tenants?.length > 0
                ? hardware.search.lookups?.tenants
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
              hardware.search.lookups?.companies?.length > 0
                ? hardware.search.lookups?.companies
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
              hardware.search.lookups?.bus?.length > 0
                ? hardware.search.lookups?.bus
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
        title: <span className="dragHandler">Date Added</span>,
        column: 'Date Added',
        sorter: true,
        children: [
          {
            title: FilterByDateSwapTable('date_added', hardware.search.tableName, form),
            dataIndex: 'date_added',
            key: 'date_added',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
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
        title: <span className="dragHandler">Processor Type</span>,
        column: 'Processor Type',
        sorter: true,
        children: [
          {
            title: FilterBySwap('processor_type', form),
            dataIndex: 'processor_type',
            key: 'processor_type',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Number of Processors</span>,
        column: 'Number of Processors',
        sorter: true,
        children: [
          {
            title: FilterBySwap('number_of_processors', form),
            dataIndex: 'number_of_processors',
            key: 'number_of_processors',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Cores per Processor</span>,
        column: 'Cores per Processor',
        sorter: true,
        children: [
          {
            title: FilterBySwap('cores_per_processor', form),
            dataIndex: 'cores_per_processor',
            key: 'cores_per_processor',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Last Scan Date</span>,
        column: 'Last Scan Date',
        sorter: true,
        children: [
          {
            title: FilterBySwap('last_scan_date', form),
            dataIndex: 'last_scan_date',
            key: 'last_scan_date',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Last Logged On User</span>,
        column: 'Last Logged On User',
        sorter: true,
        children: [
          {
            title: FilterBySwap('last_logged_on_user', form),
            dataIndex: 'last_logged_on_user',
            key: 'last_logged_on_user',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Location</span>,
        column: 'Location',
        sorter: true,
        children: [
          {
            title: FilterBySwap('location', form),
            dataIndex: 'location',
            key: 'location',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Is Virtual</span>,
        column: 'Is Virtual',
        sorter: true,
        children: [
          {
            title: FilterBySwap('is_virtual', form),
            dataIndex: 'is_virtual',
            key: 'is_virtual',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeHardware = (id: number) => {
    dispatch(deleteHardware(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.Hardware}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/inventory-module/inventory-hardware/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.Hardware}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeHardware(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.Hardware)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={hardwareSelector}
        searchTableData={searchHardware}
        clearTableDataMessages={clearHardwareMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.Hardware)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
