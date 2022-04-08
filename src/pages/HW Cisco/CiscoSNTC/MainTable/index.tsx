import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import {
  setTableColumnSelection,
  clearCiscoSNTCMessages,
  ciscoSNTCSelector,
} from '../../../../store/hwCisco/ciscoSNTC/ciscoSNTC.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  deleteCiscoSNTC,
  searchCiscoSNTC,
} from '../../../../store/hwCisco/ciscoSNTC/ciscoSNTC.action';
import _ from 'lodash';
import ciscoSNTCService from '../../../../services/hwCisco/ciscoSNTC/ciscoSNTC.service';
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
  const ciscoSNTC = useAppSelector(ciscoSNTCSelector);
  const dispatch = useAppDispatch();
  const globalFilters = useAppSelector(globalSearchSelector);
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
    return ciscoSNTCService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    setFilterKeys(ObjectForColumnFilter);
    return FilterWithSwapOption(
      dataIndex,
      ciscoSNTC.search.tableName,
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
              ciscoSNTC.search.lookups?.tenants?.length > 0
                ? ciscoSNTC.search.lookups?.tenants
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
              ciscoSNTC.search.lookups?.companies?.length > 0
                ? ciscoSNTC.search.lookups?.companies
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
              ciscoSNTC.search.lookups?.bus?.length > 0
                ? ciscoSNTC.search.lookups?.bus
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
            title: FilterByDateSwapTable('date_added', ciscoSNTC.search.tableName, form),
            dataIndex: 'date_added',
            key: 'date_added',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Warranty Start</span>,
        column: 'Warranty Start',
        sorter: true,
        children: [
          {
            title: FilterByDateSwap(
              'warranty_start',
              ciscoSNTC.search.tableName,
              form,
              null,
              ObjectForColumnFilter,
              true
            ),
            dataIndex: 'warranty_start',
            key: 'warranty_start',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Warranty End</span>,
        column: 'Warranty End',
        sorter: true,
        children: [
          {
            title: FilterByDateSwap(
              'warranty_end',
              ciscoSNTC.search.tableName,
              form,
              null,
              ObjectForColumnFilter,
              true
            ),
            dataIndex: 'warranty_end',
            key: 'warranty_end',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Ship Date</span>,
        column: 'Ship Date',
        sorter: true,
        children: [
          {
            title: FilterByDateSwap(
              'ship_date',
              ciscoSNTC.search.tableName,
              form,
              null,
              ObjectForColumnFilter,
              true
            ),
            dataIndex: 'ship_date',
            key: 'ship_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">HW LDoS</span>,
        column: 'HW LDoS',
        sorter: true,
        children: [
          {
            title: FilterByDateSwap(
              'hw_l_do_s',
              ciscoSNTC.search.tableName,
              form,
              null,
              ObjectForColumnFilter,
              true
            ),
            dataIndex: 'hw_l_do_s',
            key: 'hw_l_do_s',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Collection Date</span>,
        column: 'Collection Date',
        sorter: true,
        children: [
          {
            title: FilterByDateSwap(
              'collection_date',
              ciscoSNTC.search.tableName,
              form,
              null,
              ObjectForColumnFilter,
              true
            ),
            dataIndex: 'collection_date',
            key: 'collection_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Source</span>,
        column: 'Source',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Host Name</span>,
        column: 'Hostname',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('hostname', form),
            dataIndex: 'hostname',
            key: 'hostname',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">SNMP SYS Name</span>,
        column: 'SNMP sysName',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('snmp_sys_name', form),
            dataIndex: 'snmp_sys_name',
            key: 'snmp_sys_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">IP Address</span>,
        column: 'IP Address',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('ip_address', form),
            dataIndex: 'ip_address',
            key: 'ip_address',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Mac Address</span>,
        column: 'Mac Address',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('mac_address', form),
            dataIndex: 'mac_address',
            key: 'mac_address',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Serial Number</span>,
        column: 'Serial Number',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Collected SN</span>,
        column: 'Collected SN',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('collected_sn', form),
            dataIndex: 'collected_sn',
            key: 'collected_sn',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Parent SN</span>,
        column: 'Parent SN',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Instance No#</span>,
        column: 'Instance No#',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('instance_no', form),
            dataIndex: 'instance_no',
            key: 'instance_no',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">P/C/S</span>,
        column: 'P/C/S',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('p_c_s', form),
            dataIndex: 'p_c_s',
            key: 'p_c_s',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Parent Instance ID</span>,
        column: 'Parent Instance ID',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Product ID</span>,
        column: 'Product ID',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Product Name</span>,
        column: 'Product Name',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('product_name', form),
            dataIndex: 'product_name',
            key: 'product_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Product Description</span>,
        column: 'Product Description',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('product_description', form),
            dataIndex: 'product_description',
            key: 'product_description',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Product Family</span>,
        column: 'Product Family',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Product Sub Type</span>,
        column: 'Product Subtype',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('product_subtype', form),
            dataIndex: 'product_subtype',
            key: 'product_subtype',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Product Type</span>,
        column: 'Product Type',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('product_type', form),
            dataIndex: 'product_type',
            key: 'product_type',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Equipment Type</span>,
        column: 'Equipment Type',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('equipment_type', form),
            dataIndex: 'equipment_type',
            key: 'equipment_type',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Coverage Start</span>,
        column: 'Coverage Start',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('coverage_start', form),
            dataIndex: 'coverage_start',
            key: 'coverage_start',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Coverage End</span>,
        column: 'Coverage End',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('coverage_end', form),
            dataIndex: 'coverage_end',
            key: 'coverage_end',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Contract No#</span>,
        column: 'Contract No#',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('contract_no', form),
            dataIndex: 'contract_no',
            key: 'contract_no',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Contract Status</span>,
        column: 'Contract Status',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('contract_status', form),
            dataIndex: 'contract_status',
            key: 'contract_status',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Service Level</span>,
        column: 'Service Level',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('service_level', form),
            dataIndex: 'service_level',
            key: 'service_level',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Service Level Description</span>,
        column: 'Service Level Description',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('service_level_description', form),
            dataIndex: 'service_level_description',
            key: 'service_level_description',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Service Program</span>,
        column: 'Service Program',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('service_program', form),
            dataIndex: 'service_program',
            key: 'service_program',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Bill to Customer</span>,
        column: 'Bill-to Customer',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('bill_to_customer', form),
            dataIndex: 'bill_to_customer',
            key: 'bill_to_customer',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Warranty Type</span>,
        column: 'Warranty Type',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('warranty_type', form),
            dataIndex: 'warranty_type',
            key: 'warranty_type',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">SNMP SYS Location</span>,
        column: 'SNMP sysLocation',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('snmp_sys_location', form),
            dataIndex: 'snmp_sys_location',
            key: 'snmp_sys_location',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Installed at Site ID</span>,
        column: 'Installed-at Site ID',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('installed_at_site_id', form),
            dataIndex: 'installed_at_site_id',
            key: 'installed_at_site_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Installed at Site</span>,
        column: 'Installed-at Site',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('installed_at_site', form),
            dataIndex: 'installed_at_site',
            key: 'installed_at_site',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Installed at Address</span>,
        column: 'Installed-at Address',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('installed_at_address', form),
            dataIndex: 'installed_at_address',
            key: 'installed_at_address',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Installed at City</span>,
        column: 'Installed-at City',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('installed_at_city', form),
            dataIndex: 'installed_at_city',
            key: 'installed_at_city',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Installed at State</span>,
        column: 'Installed-at State',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('installed_at_state', form),
            dataIndex: 'installed_at_state',
            key: 'installed_at_state',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Installed at Province</span>,
        column: 'Installed-at Province',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('installed_at_province', form),
            dataIndex: 'installed_at_province',
            key: 'installed_at_province',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Installed at Postal Code</span>,
        column: 'Installed-at Postal Code',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('installed_at_postal_code', form),
            dataIndex: 'installed_at_postal_code',
            key: 'installed_at_postal_code',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Installed at Country</span>,
        column: 'Installed-at Country',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('installed_at_country', form),
            dataIndex: 'installed_at_country',
            key: 'installed_at_country',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Ship to Address</span>,
        column: 'Ship-to Address',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('ship_to_address', form),
            dataIndex: 'ship_to_address',
            key: 'ship_to_address',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">SW Type</span>,
        column: 'SW Type',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('sw_type', form),
            dataIndex: 'sw_type',
            key: 'sw_type',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">SW Version</span>,
        column: 'SW Version',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('sw_version', form),
            dataIndex: 'sw_version',
            key: 'sw_version',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Feature Set</span>,
        column: 'Feature Set',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('feature_set', form),
            dataIndex: 'feature_set',
            key: 'feature_set',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">HW Revision</span>,
        column: 'HW Revision',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('hw_revision', form),
            dataIndex: 'hw_revision',
            key: 'hw_revision',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Bootstrap Version</span>,
        column: 'Bootstrap Version',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('bootstrap_version', form),
            dataIndex: 'bootstrap_version',
            key: 'bootstrap_version',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Installed Memory</span>,
        column: 'Installed Memory',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('installed_memory', form),
            dataIndex: 'installed_memory',
            key: 'installed_memory',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Installed Flash</span>,
        column: 'Installed Flash',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('installed_flash', form),
            dataIndex: 'installed_flash',
            key: 'installed_flash',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Running Config</span>,
        column: 'Running Config',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('running_config', form),
            dataIndex: 'running_config',
            key: 'running_config',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Startup Config </span>,
        column: 'Startup Config',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('startup_config', form),
            dataIndex: 'startup_config',
            key: 'startup_config',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">HW Alerts</span>,
        column: 'HW Alerts',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('hw_alerts', form),
            dataIndex: 'hw_alerts',
            key: 'hw_alerts',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">SW Alerts</span>,
        column: 'SW Alerts',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('sw_alerts', form),
            dataIndex: 'sw_alerts',
            key: 'sw_alerts',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Security Advisory (PSIRT)</span>,
        column: 'Security Advisory (PSIRT)',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('security_advisory_psirt', form),
            dataIndex: 'security_advisory_psirt',
            key: 'security_advisory_psirt',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Field Notices</span>,
        column: 'Field Notices',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('field_notices', form),
            dataIndex: 'field_notices',
            key: 'field_notices',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Customer</span>,
        column: 'Customer',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('customer', form),
            dataIndex: 'customer',
            key: 'customer',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Inventory</span>,
        column: 'Inventory',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('inventory', form),
            dataIndex: 'inventory',
            key: 'inventory',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Segment</span>,
        column: 'Segment',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('segment', form),
            dataIndex: 'segment',
            key: 'segment',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Appliance ID</span>,
        column: 'Appliance ID',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('appliance_id', form),
            dataIndex: 'appliance_id',
            key: 'appliance_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Imported By</span>,
        column: 'Imported By',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('imported_by', form),
            dataIndex: 'imported_by',
            key: 'imported_by',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Imported File</span>,
        column: 'Imported File',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('imported_file', form),
            dataIndex: 'imported_file',
            key: 'imported_file',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">SN Recognized</span>,
        column: 'SN Recognized',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('sn_recognized', form),
            dataIndex: 'sn_recognized',
            key: 'sn_recognized',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Device Diagnostics Supported</span>,
        column: 'Device Diagnostics Supported',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('device_diagnostics_supported', form),
            dataIndex: 'device_diagnostics_supported',
            key: 'device_diagnostics_supported',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Relationship</span>,
        column: 'Relationship',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('relationship', form),
            dataIndex: 'relationship',
            key: 'relationship',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeCiscoSNTC = (id: number) => {
    dispatch(deleteCiscoSNTC(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.HwCiscoSNTC}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/hw-cisco/cisco-sntc/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.HwCiscoSNTC}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeCiscoSNTC(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.HwCiscoSNTC)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={ciscoSNTCSelector}
        searchTableData={searchCiscoSNTC}
        clearTableDataMessages={clearCiscoSNTCMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.HwCiscoSNTC)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
