import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import {
  setTableColumnSelection,
  clearCiscoIBMessages,
  ciscoIBSelector,
} from '../../../../store/hwCisco/ciscoIB/ciscoIB.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import { deleteCiscoIB, searchCiscoIB } from '../../../../store/hwCisco/ciscoIB/ciscoIB.action';
import _ from 'lodash';
import ciscoIBService from '../../../../services/hwCisco/ciscoIB/ciscoIB.service';
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
  const ciscoIB = useAppSelector(ciscoIBSelector);
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
    return ciscoIBService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    setFilterKeys(ObjectForColumnFilter);
    return FilterWithSwapOption(
      dataIndex,
      ciscoIB.search.tableName,
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
              ciscoIB.search.lookups?.tenants?.length > 0
                ? ciscoIB.search.lookups?.tenants
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
              ciscoIB.search.lookups?.companies?.length > 0
                ? ciscoIB.search.lookups?.companies
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
              ciscoIB.search.lookups?.bus?.length > 0
                ? ciscoIB.search.lookups?.bus
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
            title: FilterByDateSwapTable('date_added', ciscoIB.search.tableName, form),
            dataIndex: 'date_added',
            key: 'date_added',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Best Available Ship Date</span>,
        column: 'Best AvailableShipDate',
        sorter: true,
        children: [
          {
            title: FilterByDateSwap(
              'best_available_ship_date',
              ciscoIB.search.tableName,
              form,
              null,
              ObjectForColumnFilter,
              true
            ),
            dataIndex: 'best_available_ship_date',
            key: 'best_available_ship_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Covered Line Start Date</span>,
        column: 'Covered Line StartDate',
        sorter: true,
        children: [
          {
            title: FilterByDateSwap(
              'covered_line_start_date',
              ciscoIB.search.tableName,
              form,
              null,
              ObjectForColumnFilter,
              true
            ),
            dataIndex: 'covered_line_start_date',
            key: 'covered_line_start_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Covered Line End Date</span>,
        column: 'Covered Line EndDate',
        sorter: true,
        children: [
          {
            title: FilterByDateSwap(
              'covered_line_end_date',
              ciscoIB.search.tableName,
              form,
              null,
              ObjectForColumnFilter,
              true
            ),
            dataIndex: 'covered_line_end_date',
            key: 'covered_line_end_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Last Date of Support</span>,
        column: 'Last DateofSupport',
        sorter: true,
        children: [
          {
            title: FilterByDateSwap(
              'last_date_of_support',
              ciscoIB.search.tableName,
              form,
              null,
              ObjectForColumnFilter,
              true
            ),
            dataIndex: 'last_date_of_support',
            key: 'last_date_of_support',
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
        title: <span className="dragHandler">Customer Name</span>,
        column: 'Customer Name',
        sorter: true,
        children: [
          {
            title: FilterBySwap('customer_name', form),
            dataIndex: 'customer_name',
            key: 'customer_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Asset ID</span>,
        column: 'AssetID',
        sorter: true,
        children: [
          {
            title: FilterBySwap('asset_id', form),
            dataIndex: 'asset_id',
            key: 'asset_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Unique Record</span>,
        column: 'Unique Record',
        sorter: true,
        children: [
          {
            title: FilterBySwap('unique_record', form),
            dataIndex: 'unique_record',
            key: 'unique_record',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Duplicate Record</span>,
        column: 'Duplicate Record',
        sorter: true,
        children: [
          {
            title: FilterBySwap('duplicate_record', form),
            dataIndex: 'duplicate_record',
            key: 'duplicate_record',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Duplicate Coverage</span>,
        column: 'Duplicate Coverage',
        sorter: true,
        children: [
          {
            title: FilterBySwap('duplicate_coverage', form),
            dataIndex: 'duplicate_coverage',
            key: 'duplicate_coverage',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Zone Assignment</span>,
        column: 'Zone Assignment',
        sorter: true,
        children: [
          {
            title: FilterBySwap('zone_assignment', form),
            dataIndex: 'zone_assignment',
            key: 'zone_assignment',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Zone Description</span>,
        column: 'Zone Description',
        sorter: true,
        children: [
          {
            title: FilterBySwap('zone_description', form),
            dataIndex: 'zone_description',
            key: 'zone_description',
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
        title: <span className="dragHandler">Instance Number</span>,
        column: 'Instance Number',
        sorter: true,
        children: [
          {
            title: FilterBySwap('instance_number', form),
            dataIndex: 'instance_number',
            key: 'instance_number',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Parent Serial Number</span>,
        column: 'Parent Serial Number',
        sorter: true,
        children: [
          {
            title: FilterBySwap('parent_serial_number', form),
            dataIndex: 'parent_serial_number',
            key: 'parent_serial_number',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Parent Instance Number</span>,
        column: 'Parent Instance Number',
        sorter: true,
        children: [
          {
            title: FilterBySwap('parent_instance_number', form),
            dataIndex: 'parent_instance_number',
            key: 'parent_instance_number',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Product Relationship</span>,
        column: 'Product Relationship',
        sorter: true,
        children: [
          {
            title: FilterBySwap('product_relationship', form),
            dataIndex: 'product_relationship',
            key: 'product_relationship',
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
        title: <span className="dragHandler">Product Description</span>,
        column: 'Product Description',
        sorter: true,
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
        title: <span className="dragHandler">Product Quantity</span>,
        column: 'Product Quantity',
        sorter: true,
        children: [
          {
            title: FilterBySwap('product_quantity', form),
            dataIndex: 'product_quantity',
            key: 'product_quantity',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Product Family</span>,
        column: 'Product Family',
        sorter: true,
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
        title: <span className="dragHandler">Architecture Group</span>,
        column: 'Architecture Group',
        sorter: true,
        children: [
          {
            title: FilterBySwap('architecture_group', form),
            dataIndex: 'architecture_group',
            key: 'architecture_group',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Architecture Sub Group</span>,
        column: 'Architecture Sub Group',
        sorter: true,
        children: [
          {
            title: FilterBySwap('architecture_sub_group', form),
            dataIndex: 'architecture_sub_group',
            key: 'architecture_sub_group',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Item Type</span>,
        column: 'Item Type',
        sorter: true,
        children: [
          {
            title: FilterBySwap('item_type', form),
            dataIndex: 'item_type',
            key: 'item_type',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Network</span>,
        column: 'Network',
        sorter: true,
        children: [
          {
            title: FilterBySwap('network', form),
            dataIndex: 'network',
            key: 'network',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Installed Base Status</span>,
        column: 'Installed Base Status',
        sorter: true,
        children: [
          {
            title: FilterBySwap('installed_base_status', form),
            dataIndex: 'installed_base_status',
            key: 'installed_base_status',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Serviceable</span>,
        column: 'Serviceable',
        sorter: true,
        children: [
          {
            title: FilterBySwap('serviceable', form),
            dataIndex: 'serviceable',
            key: 'serviceable',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Renewable</span>,
        column: 'Renewable',
        sorter: true,
        children: [
          {
            title: FilterBySwap('renewable', form),
            dataIndex: 'renewable',
            key: 'renewable',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Host Name</span>,
        column: 'Host Name',
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
        title: <span className="dragHandler">Hardware List Price</span>,
        column: 'Hardware List Price',
        sorter: true,
        children: [
          {
            title: FilterBySwap('hardware_list_price', form),
            dataIndex: 'hardware_list_price',
            key: 'hardware_list_price',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Maintenance List Price</span>,
        column: 'Maintenance List Price',
        sorter: true,
        children: [
          {
            title: FilterBySwap('maintenance_list_price', form),
            dataIndex: 'maintenance_list_price',
            key: 'maintenance_list_price',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Hardware Bill To Name</span>,
        column: 'Hardware Bill To Name',
        sorter: true,
        children: [
          {
            title: FilterBySwap('hardware_bill_to_name', form),
            dataIndex: 'hardware_bill_to_name',
            key: 'hardware_bill_to_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Ship-To Customer Name</span>,
        column: 'Ship-To Customer Name',
        sorter: true,
        children: [
          {
            title: FilterBySwap('ship_to_customer_name', form),
            dataIndex: 'ship_to_customer_name',
            key: 'ship_to_customer_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Shipped Within 5 Years</span>,
        column: 'Shipped Within 5 Years',
        sorter: true,
        children: [
          {
            title: FilterBySwap('shipped_within_5_years', form),
            dataIndex: 'shipped_within_5_years',
            key: 'shipped_within_5_years',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">GU ID</span>,
        column: 'GU ID',
        sorter: true,
        children: [
          {
            title: FilterBySwap('gu_id', form),
            dataIndex: 'gu_id',
            key: 'gu_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">GU Name</span>,
        column: 'GU Name',
        sorter: true,
        children: [
          {
            title: FilterBySwap('gu_name', form),
            dataIndex: 'gu_name',
            key: 'gu_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Region</span>,
        column: 'Region',
        sorter: true,
        children: [
          {
            title: FilterBySwap('region', form),
            dataIndex: 'region',
            key: 'region',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Business Unit</span>,
        column: 'Business Unit',
        sorter: true,
        children: [
          {
            title: FilterBySwap('business_unit', form),
            dataIndex: 'business_unit',
            key: 'business_unit',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Installed Site ID</span>,
        column: 'Installed Site ID',
        sorter: true,
        children: [
          {
            title: FilterBySwap('installed_site_id', form),
            dataIndex: 'installed_site_id',
            key: 'installed_site_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Installed Site Name</span>,
        column: 'Installed Site Name',
        sorter: true,
        children: [
          {
            title: FilterBySwap('installed_site_name', form),
            dataIndex: 'installed_site_name',
            key: 'installed_site_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Installed Site Address 1</span>,
        column: 'Installed Site Address 1',
        sorter: true,
        children: [
          {
            title: FilterBySwap('installed_site_address_1', form),
            dataIndex: 'installed_site_address_1',
            key: 'installed_site_address_1',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Installed Site City</span>,
        column: 'Installed Site City',
        sorter: true,
        children: [
          {
            title: FilterBySwap('installed_site_city', form),
            dataIndex: 'installed_site_city',
            key: 'installed_site_city',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Installed Site State</span>,
        column: 'Installed Site State',
        sorter: true,
        children: [
          {
            title: FilterBySwap('installed_site_state', form),
            dataIndex: 'installed_site_state',
            key: 'installed_site_state',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Installed Site Province</span>,
        column: 'Installed Site Province',
        sorter: true,
        children: [
          {
            title: FilterBySwap('installed_site_province', form),
            dataIndex: 'installed_site_province',
            key: 'installed_site_province',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Installed Site Postal Code</span>,
        column: 'Installed Site Postal Code',
        sorter: true,
        children: [
          {
            title: FilterBySwap('installed_site_postal_code', form),
            dataIndex: 'installed_site_postal_code',
            key: 'installed_site_postal_code',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Installed Site Country</span>,
        column: 'Installed Site Country',
        sorter: true,
        children: [
          {
            title: FilterBySwap('installed_site_country', form),
            dataIndex: 'installed_site_country',
            key: 'installed_site_country',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Covered Line Status</span>,
        column: 'Covered Line Status',
        sorter: true,
        children: [
          {
            title: FilterBySwap('covered_line_status', form),
            dataIndex: 'covered_line_status',
            key: 'covered_line_status',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Coverage Status</span>,
        column: 'Coverage Status',
        sorter: true,
        children: [
          {
            title: FilterBySwap('coverage_status', form),
            dataIndex: 'coverage_status',
            key: 'coverage_status',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Contract Number</span>,
        column: 'Contract Number',
        sorter: true,
        children: [
          {
            title: FilterBySwap('contract_number', form),
            dataIndex: 'contract_number',
            key: 'contract_number',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Contract Bill-To Name</span>,
        column: 'Contract Bill-to Name',
        sorter: true,
        children: [
          {
            title: FilterBySwap('contract_bill_to_name', form),
            dataIndex: 'contract_bill_to_name',
            key: 'contract_bill_to_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Contract Bill-To Country</span>,
        column: 'Contract Bill-To Country',
        sorter: true,
        children: [
          {
            title: FilterBySwap('contract_bill_to_country', form),
            dataIndex: 'contract_bill_to_country',
            key: 'contract_bill_to_country',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Service Level</span>,
        column: 'Service Level',
        sorter: true,
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
        title: <span className="dragHandler">Service Level Category</span>,
        column: 'Service Level Category',
        sorter: true,
        children: [
          {
            title: FilterBySwap('service_level_category', form),
            dataIndex: 'service_level_category',
            key: 'service_level_category',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Product Coverage Line Number</span>,
        column: 'Product Coverage Line Number',
        sorter: true,
        children: [
          {
            title: FilterBySwap('product_coverage_line_number', form),
            dataIndex: 'product_coverage_line_number',
            key: 'product_coverage_line_number',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Expiration Range</span>,
        column: 'Expiration Range',
        sorter: true,
        children: [
          {
            title: FilterBySwap('expiration_range', form),
            dataIndex: 'expiration_range',
            key: 'expiration_range',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Termination Date</span>,
        column: 'Termination Date',
        sorter: true,
        children: [
          {
            title: FilterBySwap('termination_date', form),
            dataIndex: 'termination_date',
            key: 'termination_date',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">LDOS Category</span>,
        column: 'LDoS Category',
        sorter: true,
        children: [
          {
            title: FilterBySwap('l_do_s_category', form),
            dataIndex: 'l_do_s_category',
            key: 'l_do_s_category',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Warranty Type</span>,
        column: 'Warranty Type',
        sorter: true,
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
        title: <span className="dragHandler">Warranty End Date</span>,
        column: 'Warranty End Date',
        sorter: true,
        children: [
          {
            title: FilterBySwap('warranty_end_date', form),
            dataIndex: 'warranty_end_date',
            key: 'warranty_end_date',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Hardware PO Number</span>,
        column: 'Hardware PO Number',
        sorter: true,
        children: [
          {
            title: FilterBySwap('hardware_po_number', form),
            dataIndex: 'hardware_po_number',
            key: 'hardware_po_number',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Hardware SO Number</span>,
        column: 'Hardware SO Number',
        sorter: true,
        children: [
          {
            title: FilterBySwap('hardware_so_number', form),
            dataIndex: 'hardware_so_number',
            key: 'hardware_so_number',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Maintenance PO Number</span>,
        column: 'Maintenance PO Number',
        sorter: true,
        children: [
          {
            title: FilterBySwap('maintenance_po_number', form),
            dataIndex: 'maintenance_po_number',
            key: 'maintenance_po_number',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Maintenance SO Number</span>,
        column: 'Maintenance SO Number',
        sorter: true,
        children: [
          {
            title: FilterBySwap('maintenance_so_number', form),
            dataIndex: 'maintenance_so_number',
            key: 'maintenance_so_number',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">End Of Sale Date</span>,
        column: 'End Of Sale Date',
        sorter: true,
        children: [
          {
            title: FilterBySwap('end_of_sale_date', form),
            dataIndex: 'end_of_sale_date',
            key: 'end_of_sale_date',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">End Of Routine Failure Analysis Date</span>,
        column: 'End Of Routine Failure Analysis Date',
        sorter: true,
        children: [
          {
            title: FilterBySwap('end_of_routine_failure_analysis_date', form),
            dataIndex: 'end_of_routine_failure_analysis_date',
            key: 'end_of_routine_failure_analysis_date',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">End of New Service Attachment Date</span>,
        column: 'End of New Service Attachment Date',
        sorter: true,
        children: [
          {
            title: FilterBySwap('end_of_new_service_attachment_date', form),
            dataIndex: 'end_of_new_service_attachment_date',
            key: 'end_of_new_service_attachment_date',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">End of Service Contract Renewal</span>,
        column: 'End of Service Contract Renewal',
        sorter: true,
        children: [
          {
            title: FilterBySwap('end_of_service_contract_renewal', form),
            dataIndex: 'end_of_service_contract_renewal',
            key: 'end_of_service_contract_renewal',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">End Of Sig Releases Date</span>,
        column: 'End Of Sig Releases Date',
        sorter: true,
        children: [
          {
            title: FilterBySwap('end_of_sig_releases_date', form),
            dataIndex: 'end_of_sig_releases_date',
            key: 'end_of_sig_releases_date',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">End Of Security Support Date</span>,
        column: 'End Of Security Support Date',
        sorter: true,
        children: [
          {
            title: FilterBySwap('end_of_security_support_date', form),
            dataIndex: 'end_of_security_support_date',
            key: 'end_of_security_support_date',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">End Of Software Availability Date</span>,
        column: 'End Of Software Availability Date',
        sorter: true,
        children: [
          {
            title: FilterBySwap('end_of_software_availability_date', form),
            dataIndex: 'end_of_software_availability_date',
            key: 'end_of_software_availability_date',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">End Of Software License Availability Date</span>,
        column: 'End Of Software License Availability Date',
        sorter: true,
        children: [
          {
            title: FilterBySwap('end_of_software_license_availability_date', form),
            dataIndex: 'end_of_software_license_availability_date',
            key: 'end_of_software_license_availability_date',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">End Of Software Date</span>,
        column: 'End Of Software Date',
        sorter: true,
        children: [
          {
            title: FilterBySwap('end_of_software_date', form),
            dataIndex: 'end_of_software_date',
            key: 'end_of_software_date',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeCiscoIB = (id: number) => {
    dispatch(deleteCiscoIB(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.HwCiscoIB}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/hw-cisco/cisco-ib/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.HwCiscoIB}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeCiscoIB(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.HwCiscoIB)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={ciscoIBSelector}
        searchTableData={searchCiscoIB}
        clearTableDataMessages={clearCiscoIBMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.HwCiscoIB)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
