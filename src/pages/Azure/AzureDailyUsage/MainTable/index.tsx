import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  setTableColumnSelection,
  clearAzureDailyUsageMessages,
  azureDailyUsageSelector,
} from '../../../../store/azure/azureDailyUsage/azureDailyUsage.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  deleteAzureDailyUsage,
  searchAzureDailyUsage,
} from '../../../../store/azure/azureDailyUsage/azureDailyUsage.action';
import { IMainTable } from './mainTable.model';
import moment from 'moment';
import { Common } from '../../../../common/constants/common';
import _ from 'lodash';
import azureDailyUsageService from '../../../../services/azure/azureDailyUsage/azureDailyUsage.service';
import {
  FilterByDate,
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import DataTable from '../../../../common/components/DataTable';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const { setSelectedId } = props;
  const azureDailyUsage = useAppSelector(azureDailyUsageSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const exportExcelFile = (searchData: ISearch) => {
    return azureDailyUsageService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(dataIndex, azureDailyUsage.search.tableName, form);
  };

  const getTableColumns = (form) => {
    return [
      {
        title: 'Tenant Name',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('tenant_id', azureDailyUsage.search.lookups?.tenants),
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
            title: FilterByDropdown('company_id', azureDailyUsage.search.lookups?.companies),
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
            title: FilterByDropdown('bu_id', azureDailyUsage.search.lookups?.bus),
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
        title: 'Account Name',
        sorter: true,
        children: [
          {
            title: FilterBySwap('account_name', form),
            dataIndex: 'account_name',
            key: 'account_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Account Owner Id',
        sorter: true,
        children: [
          {
            title: FilterBySwap('account_owner_id', form),
            dataIndex: 'account_owner_id',
            key: 'account_owner_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Additional Info',
        sorter: true,
        children: [
          {
            title: FilterBySwap('additional_info', form),
            dataIndex: 'additional_info',
            key: 'additional_info',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'AHB - Applied',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('ahb_applied', azureDailyUsage.search.lookups?.booleanLookup),
            dataIndex: 'ahb_applied',
            key: 'ahb_applied',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'AHB - Est Savings',
        sorter: true,
        children: [
          {
            title: FilterBySwap('ahb_est_savings', form),
            dataIndex: 'ahb_est_savings',
            key: 'ahb_est_savings',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'AHB - Suggested',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('ahb_suggested', azureDailyUsage.search.lookups?.booleanLookup),
            dataIndex: 'ahb_suggested',
            key: 'ahb_suggested',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'RI - Applied',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('ri_applied', azureDailyUsage.search.lookups?.booleanLookup),
            dataIndex: 'ri_applied',
            key: 'ri_applied',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'RI - Est Savings',
        sorter: true,
        children: [
          {
            title: FilterBySwap('ri_est_savings', form),
            dataIndex: 'ri_est_savings',
            key: 'ri_est_savings',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'RI - Suggested',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('ri_suggested', azureDailyUsage.search.lookups?.booleanLookup),
            dataIndex: 'ri_suggested',
            key: 'ri_suggested',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Availability Zone',
        sorter: true,
        children: [
          {
            title: FilterBySwap('availability_zone', form),
            dataIndex: 'availability_zone',
            key: 'availability_zone',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Billing Account Id',
        sorter: true,
        children: [
          {
            title: FilterBySwap('billing_account_id', form),
            dataIndex: 'billing_account_id',
            key: 'billing_account_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Billing Account Name',
        sorter: true,
        children: [
          {
            title: FilterBySwap('billing_account_name', form),
            dataIndex: 'billing_account_name',
            key: 'billing_account_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Billing Currency',
        sorter: true,
        children: [
          {
            title: FilterBySwap('billing_currency', form),
            dataIndex: 'billing_currency',
            key: 'billing_currency',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Billing Period StartDate',
        sorter: true,
        children: [
          {
            title: FilterByDate('billing_period_start_date'),
            dataIndex: 'billing_period_start_date',
            key: 'billing_period_start_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: 'Billing Period EndDate',
        sorter: true,
        children: [
          {
            title: FilterByDate('billing_period_end_date'),
            dataIndex: 'billing_period_end_date',
            key: 'billing_period_end_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: 'Billing Profile Id',
        sorter: true,
        children: [
          {
            title: FilterBySwap('billing_profile_id', form),
            dataIndex: 'billing_profile_id',
            key: 'billing_profile_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Billing Profile Name',
        sorter: true,
        children: [
          {
            title: FilterBySwap('billing_profile_name', form),
            dataIndex: 'billing_profile_name',
            key: 'billing_profile_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Charge Type',
        sorter: true,
        children: [
          {
            title: FilterBySwap('charge_type', form),
            dataIndex: 'charge_type',
            key: 'charge_type',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Charges Billed Separately',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'charges_billed_separately',
              azureDailyUsage.search.lookups?.booleanLookup
            ),
            dataIndex: 'charges_billed_separately',
            key: 'charges_billed_separately',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Consumed Quantity',
        sorter: true,
        children: [
          {
            title: FilterBySwap('consumed_quantity', form),
            dataIndex: 'consumed_quantity',
            key: 'consumed_quantity',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Consumed Service',
        sorter: true,
        children: [
          {
            title: FilterBySwap('consumed_service', form),
            dataIndex: 'consumed_service',
            key: 'consumed_service',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Cost Center',
        sorter: true,
        children: [
          {
            title: FilterBySwap('cost_center', form),
            dataIndex: 'cost_center',
            key: 'cost_center',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Date',
        sorter: true,
        children: [
          {
            title: FilterByDate('date'),
            dataIndex: 'date',
            key: 'date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: 'Day',
        sorter: true,
        children: [
          {
            title: FilterBySwap('day', form),
            dataIndex: 'day',
            key: 'day',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Month',
        sorter: true,
        children: [
          {
            title: FilterBySwap('month', form),
            dataIndex: 'month',
            key: 'month',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Month Name',
        sorter: true,
        children: [
          {
            title: FilterBySwap('month_name', form),
            dataIndex: 'month_name',
            key: 'month_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Year',
        sorter: true,
        children: [
          {
            title: FilterBySwap('year', form),
            dataIndex: 'year',
            key: 'year',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Department Name',
        sorter: true,
        children: [
          {
            title: FilterBySwap('department_name', form),
            dataIndex: 'department_name',
            key: 'department_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'DevTest - Applied',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'dev_test_applied',
              azureDailyUsage.search.lookups?.booleanLookup
            ),
            dataIndex: 'dev_test_applied',
            key: 'dev_test_applied',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'DevTest - Est Savings',
        sorter: true,
        children: [
          {
            title: FilterBySwap('dev_test_est_savings', form),
            dataIndex: 'dev_test_est_savings',
            key: 'dev_test_est_savings',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'DevTest - Suggested',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'dev_test_suggested',
              azureDailyUsage.search.lookups?.booleanLookup
            ),
            dataIndex: 'dev_test_suggested',
            key: 'dev_test_suggested',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Service Administrator Id',
        sorter: true,
        children: [
          {
            title: FilterBySwap('service_administrator_id', form),
            dataIndex: 'service_administrator_id',
            key: 'service_administrator_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'SubscriptionId',
        sorter: true,
        children: [
          {
            title: FilterBySwap('subscription_id', form),
            dataIndex: 'subscription_id',
            key: 'subscription_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Subscription_GUId',
        sorter: true,
        children: [
          {
            title: FilterBySwap('subscription_guid', form),
            dataIndex: 'subscription_guid',
            key: 'subscription_guid',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Subscription Name',
        sorter: true,
        children: [
          {
            title: FilterBySwap('subscription_name', form),
            dataIndex: 'subscription_name',
            key: 'subscription_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Product',
        sorter: true,
        children: [
          {
            title: FilterBySwap('product', form),
            dataIndex: 'product',
            key: 'product',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'MeterId',
        sorter: true,
        children: [
          {
            title: FilterBySwap('meter_id', form),
            dataIndex: 'meter_id',
            key: 'meter_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Meter Category',
        sorter: true,
        children: [
          {
            title: FilterBySwap('meter_category', form),
            dataIndex: 'meter_category',
            key: 'meter_category',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Meter Sub-Category',
        sorter: true,
        children: [
          {
            title: FilterBySwap('meter_sub_category', form),
            dataIndex: 'meter_sub_category',
            key: 'meter_sub_category',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Meter Region',
        sorter: true,
        children: [
          {
            title: FilterBySwap('meter_region', form),
            dataIndex: 'meter_region',
            key: 'meter_region',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Meter Name',
        sorter: true,
        children: [
          {
            title: FilterBySwap('meter_name', form),
            dataIndex: 'meter_name',
            key: 'meter_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Resource Rate',
        sorter: true,
        children: [
          {
            title: FilterBySwap('resource_rate', form),
            dataIndex: 'resource_rate',
            key: 'resource_rate',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Extended Cost',
        sorter: true,
        children: [
          {
            title: FilterBySwap('extended_cost', form),
            dataIndex: 'extended_cost',
            key: 'extended_cost',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Resource Location',
        sorter: true,
        children: [
          {
            title: FilterBySwap('resource_location', form),
            dataIndex: 'resource_location',
            key: 'resource_location',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'InstanceId',
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
        title: 'Service Info1',
        sorter: true,
        children: [
          {
            title: FilterBySwap('service_info1', form),
            dataIndex: 'service_info1',
            key: 'service_info1',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Service Info2',
        sorter: true,
        children: [
          {
            title: FilterBySwap('service_info2', form),
            dataIndex: 'service_info2',
            key: 'service_info2',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Tags',
        sorter: true,
        children: [
          {
            title: FilterBySwap('tags', form),
            dataIndex: 'tags',
            key: 'tags',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Store Service Identifier',
        sorter: true,
        children: [
          {
            title: FilterBySwap('store_service_identifier', form),
            dataIndex: 'store_service_identifier',
            key: 'store_service_identifier',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Unit Of Measure',
        sorter: true,
        children: [
          {
            title: FilterBySwap('unit_of_measure', form),
            dataIndex: 'unit_of_measure',
            key: 'unit_of_measure',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Resource Group',
        sorter: true,
        children: [
          {
            title: FilterBySwap('resource_group', form),
            dataIndex: 'resource_group',
            key: 'resource_group',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'OfferId',
        sorter: true,
        children: [
          {
            title: FilterBySwap('offer_id', form),
            dataIndex: 'offer_id',
            key: 'offer_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Is Azure Credit Eligible',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'is_azure_credit_eligible',
              azureDailyUsage.search.lookups?.booleanLookup
            ),
            dataIndex: 'is_azure_credit_eligible',
            key: 'is_azure_credit_eligible',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Part Number',
        sorter: true,
        children: [
          {
            title: FilterBySwap('part_number', form),
            dataIndex: 'part_number',
            key: 'part_number',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Service Family',
        sorter: true,
        children: [
          {
            title: FilterBySwap('service_family', form),
            dataIndex: 'service_family',
            key: 'service_family',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Unit Price',
        sorter: true,
        children: [
          {
            title: FilterBySwap('unit_price', form),
            dataIndex: 'unit_price',
            key: 'unit_price',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Resource Name',
        sorter: true,
        children: [
          {
            title: FilterBySwap('resource_name', form),
            dataIndex: 'resource_name',
            key: 'resource_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Invoice SectionId',
        sorter: true,
        children: [
          {
            title: FilterBySwap('invoice_section_id', form),
            dataIndex: 'invoice_section_id',
            key: 'invoice_section_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Invoice Section',
        sorter: true,
        children: [
          {
            title: FilterBySwap('invoice_section', form),
            dataIndex: 'invoice_section',
            key: 'invoice_section',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'ReservationId',
        sorter: true,
        children: [
          {
            title: FilterBySwap('reservation_id', form),
            dataIndex: 'reservation_id',
            key: 'reservation_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Reservation Name',
        sorter: true,
        children: [
          {
            title: FilterBySwap('reservation_name', form),
            dataIndex: 'reservation_name',
            key: 'reservation_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Product OrderId',
        sorter: true,
        children: [
          {
            title: FilterBySwap('product_order_id', form),
            dataIndex: 'product_order_id',
            key: 'product_order_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Product Order Name',
        sorter: true,
        children: [
          {
            title: FilterBySwap('product_order_name', form),
            dataIndex: 'product_order_name',
            key: 'product_order_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Term',
        sorter: true,
        children: [
          {
            title: FilterBySwap('term', form),
            dataIndex: 'term',
            key: 'term',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Publisher Name',
        sorter: true,
        children: [
          {
            title: FilterBySwap('publisher_name', form),
            dataIndex: 'publisher_name',
            key: 'publisher_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Plan Name',
        sorter: true,
        children: [
          {
            title: FilterBySwap('plan_name', form),
            dataIndex: 'plan_name',
            key: 'plan_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Frequency',
        sorter: true,
        children: [
          {
            title: FilterBySwap('frequency', form),
            dataIndex: 'frequency',
            key: 'frequency',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Publisher Type',
        sorter: true,
        children: [
          {
            title: FilterBySwap('publisher_type', form),
            dataIndex: 'publisher_type',
            key: 'publisher_type',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'PayGPrice',
        sorter: true,
        children: [
          {
            title: FilterBySwap('pay_g_price', form),
            dataIndex: 'pay_g_price',
            key: 'pay_g_price',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Pricing Model',
        sorter: true,
        children: [
          {
            title: FilterBySwap('pricing_model', form),
            dataIndex: 'pricing_model',
            key: 'pricing_model',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Idle',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('idle', azureDailyUsage.search.lookups?.booleanLookup),
            dataIndex: 'idle',
            key: 'idle',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Idle - EST Savings',
        sorter: true,
        children: [
          {
            title: FilterBySwap('idle_est_savings', form),
            dataIndex: 'idle_est_savings',
            key: 'idle_est_savings',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Placement',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('placement', azureDailyUsage.search.lookups?.booleanLookup),
            dataIndex: 'placement',
            key: 'placement',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Placement - EST Savings',
        sorter: true,
        children: [
          {
            title: FilterBySwap('placement_est_savings', form),
            dataIndex: 'placement_est_savings',
            key: 'placement_est_savings',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'VM - Instance Id',
        sorter: true,
        children: [
          {
            title: FilterBySwap('vm_instance_id', form),
            dataIndex: 'vm_instance_id',
            key: 'vm_instance_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'VM - Resource Name',
        sorter: true,
        children: [
          {
            title: FilterBySwap('vm_resource_name', form),
            dataIndex: 'vm_resource_name',
            key: 'vm_resource_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'ResourceRate - List',
        sorter: true,
        children: [
          {
            title: FilterBySwap('resource_rate_list', form),
            dataIndex: 'resource_rate_list',
            key: 'resource_rate_list',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Discount',
        sorter: true,
        children: [
          {
            title: FilterBySwap('discount', form),
            dataIndex: 'discount',
            key: 'discount',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Rate Card Unit',
        sorter: true,
        children: [
          {
            title: FilterBySwap('rate_card_unit', form),
            dataIndex: 'rate_card_unit',
            key: 'rate_card_unit',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Usage %',
        sorter: true,
        children: [
          {
            title: FilterBySwap('usage', form),
            dataIndex: 'usage',
            key: 'usage',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Growth %',
        sorter: true,
        children: [
          {
            title: FilterBySwap('growth', form),
            dataIndex: 'growth',
            key: 'growth',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeAzureDailyUsage = (id: number) => {
    dispatch(deleteAzureDailyUsage(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.AzureDailyUsage}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/azure/azure-daily-usage/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.AzureDailyUsage}>
        <Popconfirm title="Sure to delete?" onConfirm={() => removeAzureDailyUsage(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.AzureDailyUsage)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={azureDailyUsageSelector}
        searchTableData={searchAzureDailyUsage}
        clearTableDataMessages={clearAzureDailyUsageMessages}
        setTableColumnSelection={setTableColumnSelection}
      />
    </>
  );
};

export default forwardRef(MainTable);
