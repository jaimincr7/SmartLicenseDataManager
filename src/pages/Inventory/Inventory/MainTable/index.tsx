import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import {
  setTableColumnSelection,
  clearInventoryMessages,
  inventorySelector,
} from '../../../../store/inventory/inventory/inventory.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  deleteInventory,
  searchInventory,
} from '../../../../store/inventory/inventory/inventory.action';
import moment from 'moment';
import { Common } from '../../../../common/constants/common';
import _ from 'lodash';
import inventoryService from '../../../../services/inventory/inventory/inventory.service';
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

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const {
    setSelectedId,
    setShowSelectedListModal,
    setValuesForSelection,
    isMultiple,
    setFilterKeys,
    tableButtons,
  } = props;
  const inventory = useAppSelector(inventorySelector);
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
    return inventoryService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    setFilterKeys(ObjectForColumnFilter);
    return FilterWithSwapOption(
      dataIndex,
      inventory.search.tableName,
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
              inventory.search.lookups?.tenants?.length > 0
                ? inventory.search.lookups?.tenants
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
              inventory.search.lookups?.companies?.length > 0
                ? inventory.search.lookups?.companies
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
              inventory.search.lookups?.bus?.length > 0
                ? inventory.search.lookups?.bus
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
        title: <span className="dragHandler">Publisher</span>,
        column: 'Publisher',
        sorter: true,
        children: [
          {
            title: FilterBySwap('publisher', form),
            dataIndex: 'publisher',
            key: 'publisher',
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
            title: FilterByDateSwapTable('date_added', inventory.search.tableName, form),
            dataIndex: 'date_added',
            key: 'date_added',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Date Installed</span>,
        column: 'Date Installed',
        sorter: true,
        children: [
          {
            title: FilterByDateSwapTable('date_installed', inventory.search.tableName, form),
            dataIndex: 'date_installed',
            key: 'date_installed',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Software Title</span>,
        column: 'Software Title',
        sorter: true,
        children: [
          {
            title: FilterBySwap('software_title', form),
            dataIndex: 'software_title',
            key: 'software_title',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Software Version</span>,
        sorter: true,
        column: 'Software Version',
        children: [
          {
            title: FilterBySwap('software_version', form),
            dataIndex: 'software_version',
            key: 'software_version',
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
        title: <span className="dragHandler">Domain Name</span>,
        column: 'Domain Name',
        sorter: true,
        children: [
          {
            title: FilterBySwap('domain_name', form),
            dataIndex: 'domain_name',
            key: 'domain_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Operating System</span>,
        sorter: true,
        column: 'Operating System',
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
        title: <span className="dragHandler">Manufacturer</span>,
        sorter: true,
        column: 'Manufacturer',
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
        title: <span className="dragHandler">Device Model</span>,
        sorter: true,
        column: 'Device Model',
        children: [
          {
            title: FilterBySwap('device_model', form),
            dataIndex: 'device_model',
            key: 'device_model',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Device Serial</span>,
        sorter: true,
        column: 'Device Serial',
        children: [
          {
            title: FilterBySwap('device_serial', form),
            dataIndex: 'device_serial',
            key: 'device_serial',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Processor Description</span>,
        sorter: true,
        column: 'Processor Description',
        children: [
          {
            title: FilterBySwap('processor_desc', form),
            dataIndex: 'processor_desc',
            key: 'processor_desc',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Processor Count</span>,
        column: 'Processor Count',
        sorter: true,
        children: [
          {
            title: FilterBySwap('processor_count', form),
            dataIndex: 'processor_count',
            key: 'processor_count',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Cores Per Processor</span>,
        column: 'Cores Per Processor',
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
        title: <span className="dragHandler">Core Count</span>,
        sorter: true,
        column: 'Core Count',
        children: [
          {
            title: FilterBySwap('core_count', form),
            dataIndex: 'core_count',
            key: 'core_count',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Username</span>,
        sorter: true,
        column: 'Username',
        children: [
          {
            title: FilterBySwap('username', form),
            dataIndex: 'username',
            key: 'username',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Last HW Scan</span>,
        column: 'Last HW Scan',
        sorter: true,
        children: [
          {
            title: FilterBySwap('last_hw_scan', form),
            dataIndex: 'last_hw_scan',
            key: 'last_hw_scan',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Last SW Scan</span>,
        column: 'Last SW Scan',
        sorter: true,
        children: [
          {
            title: FilterBySwap('last_sw_scan', form),
            dataIndex: 'last_sw_scan',
            key: 'last_sw_scan',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeInventory = (id: number) => {
    dispatch(deleteInventory(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.Inventory}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/inventory-module/inventory/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.Inventory}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeInventory(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.Inventory)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={inventorySelector}
        searchTableData={searchInventory}
        clearTableDataMessages={clearInventoryMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.Inventory)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);