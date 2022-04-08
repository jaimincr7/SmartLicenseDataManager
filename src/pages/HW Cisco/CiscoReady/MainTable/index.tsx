import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import _ from 'lodash';
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
import {
  ciscoReadySelector,
  clearCiscoReadyMessages,
  setTableColumnSelection,
} from '../../../../store/hwCisco/ciscoReady/ciscoReady.reducer';
import ciscoReadyService from '../../../../services/hwCisco/ciscoReady/ciscoReady.service';
import {
  deleteCiscoReady,
  searchCiscoReady,
} from '../../../../store/hwCisco/ciscoReady/ciscoReady.action';
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
  const ciscoReady = useAppSelector(ciscoReadySelector);
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
    return ciscoReadyService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    setFilterKeys(ObjectForColumnFilter);
    return FilterWithSwapOption(
      dataIndex,
      ciscoReady.search.tableName,
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
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown(
              'tenant_id',
              ciscoReady.search.lookups?.tenants?.length > 0
                ? ciscoReady.search.lookups?.tenants
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
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown(
              'company_id',
              ciscoReady.search.lookups?.companies?.length > 0
                ? ciscoReady.search.lookups?.companies
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
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown(
              'bu_id',
              ciscoReady.search.lookups?.bus?.length > 0
                ? ciscoReady.search.lookups?.bus
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
        ellipsis: true,
        children: [
          {
            title: FilterByDateSwapTable('date_added', ciscoReady.search.tableName, form),
            dataIndex: 'date_added',
            key: 'date_added',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Covered Line Start Date</span>,
        column: 'Covered Line Start Date',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDateSwap(
              'covered_line_start_date',
              ciscoReady.search.tableName,
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
        column: 'Covered Line End Date',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDateSwap(
              'covered_line_end_date',
              ciscoReady.search.tableName,
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
        title: <span className="dragHandler">Ship Date</span>,
        column: 'Ship Date',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDateSwap(
              'ship_date',
              ciscoReady.search.tableName,
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
        title: <span className="dragHandler">Serial Number / PAK number</span>,
        column: 'Serial Number / PAK number',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('serial_number_pak_number', form),
            dataIndex: 'serial_number_pak_number',
            key: 'serial_number_pak_number',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Coverage</span>,
        column: 'Coverage',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('coverage', form),
            dataIndex: 'coverage',
            key: 'coverage',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Covered Line Status</span>,
        column: 'Covered Line Status',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Business Entity</span>,
        column: 'Business Entity',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('business_entity', form),
            dataIndex: 'business_entity',
            key: 'business_entity',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Sub Business Entity</span>,
        column: 'Sub Business Entity',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('sub_business_entity', form),
            dataIndex: 'sub_business_entity',
            key: 'sub_business_entity',
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
        title: <span className="dragHandler">Asset Type</span>,
        column: 'Asset Type',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('asset_type', form),
            dataIndex: 'asset_type',
            key: 'asset_type',
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
        title: <span className="dragHandler">Item Quantity</span>,
        column: 'Item Quantity',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('item_quantity', form),
            dataIndex: 'item_quantity',
            key: 'item_quantity',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Covered Line End Date FY-FQ</span>,
        column: 'Covered Line End Date FY-FQ',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('covered_line_end_date_fy_fq', form),
            dataIndex: 'covered_line_end_date_fy_fq',
            key: 'covered_line_end_date_fy_fq',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Contract Type</span>,
        column: 'Contract Type',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('contract_type', form),
            dataIndex: 'contract_type',
            key: 'contract_type',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Service Brand Code</span>,
        column: 'Service Brand Code',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('service_brand_code', form),
            dataIndex: 'service_brand_code',
            key: 'service_brand_code',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Contract Number</span>,
        column: 'Contract Number',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Subscription Reference ID</span>,
        column: 'Subscription Reference ID',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('subscription_reference_id', form),
            dataIndex: 'subscription_reference_id',
            key: 'subscription_reference_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">End of Product Sale Date</span>,
        column: 'End of Product Sale Date',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('end_of_product_sale_date', form),
            dataIndex: 'end_of_product_sale_date',
            key: 'end_of_product_sale_date',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">End of Software Maintenance Date</span>,
        column: 'End of Software Maintenance Date',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('end_of_software_maintenance_date', form),
            dataIndex: 'end_of_software_maintenance_date',
            key: 'end_of_software_maintenance_date',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Last Date of Support</span>,
        column: 'Last Date of Support',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('last_date_of_support', form),
            dataIndex: 'last_date_of_support',
            key: 'last_date_of_support',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">LDOS FY-FQ</span>,
        column: 'LDOS FY-FQ',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('ldos_fy_fq', form),
            dataIndex: 'ldos_fy_fq',
            key: 'ldos_fy_fq',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">End Of Life Product Bulletin</span>,
        column: 'End Of Life Product Bulletin',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('end_of_life_product_bulletin', form),
            dataIndex: 'end_of_life_product_bulletin',
            key: 'end_of_life_product_bulletin',
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
        title: <span className="dragHandler">Warranty End Date</span>,
        column: 'Warranty End Date',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Install Site Customer Registry GU Name</span>,
        column: 'Install Site Customer Registry GU Name',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('install_site_customer_registry_gu_name', form),
            dataIndex: 'install_site_customer_registry_gu_name',
            key: 'install_site_customer_registry_gu_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Install Site Customer Registry Party Name</span>,
        column: 'Install Site Customer Registry Party Name',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('install_site_customer_registry_party_name', form),
            dataIndex: 'install_site_customer_registry_party_name',
            key: 'install_site_customer_registry_party_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Install Site Customer Registry Party ID</span>,
        column: 'Install Site Customer Registry Party ID',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('install_site_customer_registry_party_id', form),
            dataIndex: 'install_site_customer_registry_party_id',
            key: 'install_site_customer_registry_party_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Install Site Name</span>,
        column: 'Install Site Name',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('install_site_name', form),
            dataIndex: 'install_site_name',
            key: 'install_site_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Install Site ID</span>,
        column: 'Install Site ID',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('install_site_id', form),
            dataIndex: 'install_site_id',
            key: 'install_site_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Install Site Address 1</span>,
        column: 'Install Site Address 1',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('install_site_address_1', form),
            dataIndex: 'install_site_address_1',
            key: 'install_site_address_1',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Install Site City</span>,
        column: 'Install Site City',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('install_site_city', form),
            dataIndex: 'install_site_city',
            key: 'install_site_city',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Install Site State</span>,
        column: 'Install Site State',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('install_site_state', form),
            dataIndex: 'install_site_state',
            key: 'install_site_state',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Install Site Country</span>,
        column: 'Install Site Country',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('install_site_country', form),
            dataIndex: 'install_site_country',
            key: 'install_site_country',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Install Site Postal Code</span>,
        column: 'Install Site Postal Code',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('install_site_postal_code', form),
            dataIndex: 'install_site_postal_code',
            key: 'install_site_postal_code',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Product Bill to ID</span>,
        column: 'Product Bill to ID',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('product_bill_to_id', form),
            dataIndex: 'product_bill_to_id',
            key: 'product_bill_to_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Product Bill to Partner Name</span>,
        column: 'Product Bill-to Partner Name',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('product_bill_to_partner_name', form),
            dataIndex: 'product_bill_to_partner_name',
            key: 'product_bill_to_partner_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Product Partner BE GEO ID</span>,
        column: 'Product Partner BE GEO ID',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('product_partner_be_geo_id', form),
            dataIndex: 'product_partner_be_geo_id',
            key: 'product_partner_be_geo_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">POS Partner BE GEO ID</span>,
        column: 'POS Partner BE GEO ID',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('pos_partner_be_geo_id', form),
            dataIndex: 'pos_partner_be_geo_id',
            key: 'pos_partner_be_geo_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">POS Partner BE GEO Name</span>,
        column: 'POS Partner BE GEO Name',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('pos_partner_be_geo_name', form),
            dataIndex: 'pos_partner_be_geo_name',
            key: 'pos_partner_be_geo_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Service Bill to ID</span>,
        column: 'Service Bill to ID',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('service_bill_to_id', form),
            dataIndex: 'service_bill_to_id',
            key: 'service_bill_to_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Service Bill to Partner Name</span>,
        column: 'Service Bill-to Partner Name',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('service_bill_to_partner_name', form),
            dataIndex: 'service_bill_to_partner_name',
            key: 'service_bill_to_partner_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Service Partner BE GEO ID</span>,
        column: 'Service Partner BE GEO ID',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('service_partner_be_geo_id', form),
            dataIndex: 'service_partner_be_geo_id',
            key: 'service_partner_be_geo_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Product List Price $</span>,
        column: 'Product List Price $',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('product_list_price', form),
            dataIndex: 'product_list_price',
            key: 'product_list_price',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Default Service List Price $</span>,
        column: 'Default Service List Price $',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('default_service_list_price', form),
            dataIndex: 'default_service_list_price',
            key: 'default_service_list_price',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Default Service Level</span>,
        column: 'Default Service Level',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('default_service_level', form),
            dataIndex: 'default_service_level',
            key: 'default_service_level',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Existing Coverage Level List Price $</span>,
        column: 'Existing Coverage Level List Price $',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('existing_coverage_level_list_price', form),
            dataIndex: 'existing_coverage_level_list_price',
            key: 'existing_coverage_level_list_price',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Instance ID</span>,
        column: 'Instance ID',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Product SO</span>,
        column: 'Product SO',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('product_so', form),
            dataIndex: 'product_so',
            key: 'product_so',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Product PO</span>,
        column: 'Product PO',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('product_po', form),
            dataIndex: 'product_po',
            key: 'product_po',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Service SO</span>,
        column: 'Service SO',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('service_so', form),
            dataIndex: 'service_so',
            key: 'service_so',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Service PO</span>,
        column: 'Service PO',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('service_po', form),
            dataIndex: 'service_po',
            key: 'service_po',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Web Order ID</span>,
        column: 'Web Order ID',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('web_order_id', form),
            dataIndex: 'web_order_id',
            key: 'web_order_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Mapped to SWSS (Y/N)</span>,
        column: 'Mapped to SWSS (Y/N)',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('mapped_to_swss', form),
            dataIndex: 'mapped_to_swss',
            key: 'mapped_to_swss',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Mapped to C1 (Y/N)</span>,
        column: 'Mapped to C1 (Y/N)',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('mapped_to_c1', form),
            dataIndex: 'mapped_to_c1',
            key: 'mapped_to_c1',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Auto Renewal Flag</span>,
        column: 'Auto-renewal flag',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('auto_renewal_flag', form),
            dataIndex: 'auto_renewal_flag',
            key: 'auto_renewal_flag',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Configuration</span>,
        column: 'Configuration',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('configuration', form),
            dataIndex: 'configuration',
            key: 'configuration',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeCiscoReady = (id: number) => {
    dispatch(deleteCiscoReady(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.HwCiscoReady}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/hw-cisco/cisco-ready/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.HwCiscoReady}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeCiscoReady(data.id)}>
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
        showAddButton={true}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={ciscoReadySelector}
        searchTableData={searchCiscoReady}
        clearTableDataMessages={clearCiscoReadyMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.HwCiscoReady)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
