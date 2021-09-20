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
import moment from 'moment';
import { Common } from '../../../../common/constants/common';
import _ from 'lodash';
import azureDailyUsageService from '../../../../services/azure/azureDailyUsage/azureDailyUsage.service';
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
            title: FilterByDropdown('tenant_id', azureDailyUsage.search.lookups?.tenants),
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
            title: FilterByDropdown('company_id', azureDailyUsage.search.lookups?.companies),
            dataIndex: 'company_name',
            key: 'company_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Bu Name</span>,
        column: 'Bu_Id',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Date Added</span>,
        column: 'Date Added',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDateSwap('date_added', azureDailyUsage.search.tableName, form),
            dataIndex: 'date_added',
            key: 'date_added',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Account Name</span>,
        column: 'Account Name',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Account Owner Id</span>,
        column: 'AccountOwnerId',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Additional Info</span>,
        column: 'AdditionalInfo',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">AHB - Applied</span>,
        column: 'AHB - Applied',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">AHB - Est Savings</span>,
        column: 'AHB - Est Savings',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">AHB - Suggested</span>,
        column: 'AHB - Suggested',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">RI - Applied</span>,
        column: 'RI-Applied',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">RI - Est Savings</span>,
        column: 'RI - Est Savings',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">RI - Suggested</span>,
        column: 'RI - Suggested',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Availability Zone</span>,
        column: 'AvailabilityZone',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Billing Account Id</span>,
        column: 'BillingAccountId',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Billing Account Name</span>,
        column: 'BillingAccountName',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Billing Currency</span>,
        column: 'BillingCurrency',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Billing Period StartDate</span>,
        column: 'BillingPeriodStartDate',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDateSwap(
              'billing_period_start_date',
              azureDailyUsage.search.tableName,
              form
            ),
            dataIndex: 'billing_period_start_date',
            key: 'billing_period_start_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Billing Period EndDate</span>,
        column: 'BillingPeriodEndDate',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDateSwap(
              'billing_period_end_date',
              azureDailyUsage.search.tableName,
              form
            ),
            dataIndex: 'billing_period_end_date',
            key: 'billing_period_end_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Billing Profile Id</span>,
        column: 'BillingProfileId',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Billing Profile Name</span>,
        column: 'BillingProfileName',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">ChargeType</span>,
        column: 'ChargeType',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Charges Billed Separately</span>,
        column: 'Charges Billed Separately',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Consumed Quantity</span>,
        column: 'Consumed Quantity',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Consumed Service</span>,
        column: 'Consumed Service',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Cost Center</span>,
        column: 'Cost Center',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Date</span>,
        column: 'Date',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDateSwap('date', azureDailyUsage.search.tableName, form),
            dataIndex: 'date',
            key: 'date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Day</span>,
        column: 'Day',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Month</span>,
        column: 'Month',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Month Name</span>,
        column: 'Month Name',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Year</span>,
        column: 'Year',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Department Name</span>,
        column: 'Department Name',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">DevTest - Applied</span>,
        column: 'DevTest - Applied',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">DevTest - Est Savings</span>,
        column: 'DevTest - Est Savings',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">DevTest - Suggested</span>,
        column: 'DevTest - Suggested',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Service Administrator Id</span>,
        column: 'ServiceAdministratorId',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">SubscriptionId</span>,
        column: 'SubscriptionId',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Subscription_GUId</span>,
        column: 'Subscription_GUId',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Subscription Name</span>,
        column: 'SubscriptionName',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Product</span>,
        column: 'Product',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">MeterId</span>,
        column: 'MeterId',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Meter Category</span>,
        column: 'Meter Category',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Meter Sub-Category</span>,
        column: 'Meter Sub-Category',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Meter Region</span>,
        column: 'Meter Region',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Meter Name</span>,
        column: 'Meter Name',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Resource Rate</span>,
        column: 'ResourceRate',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Extended Cost</span>,
        column: 'ExtendedCost',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Resource Location</span>,
        column: 'Resource Location',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">InstanceId</span>,
        column: 'InstanceId',
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
        title: <span className="dragHandler">Service Info1</span>,
        column: 'ServiceInfo1',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Service Info2</span>,
        column: 'ServiceInfo2',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Tags</span>,
        column: 'Tags',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Store Service Identifier</span>,
        column: 'StoreServiceIdentifier',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Unit Of Measure</span>,
        column: 'Unit Of Measure',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Resource Group</span>,
        column: 'Resource Group',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">OfferId</span>,
        column: 'OfferId',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Is Azure Credit Eligible</span>,
        column: 'IsAzureCreditEligible',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Part Number</span>,
        column: 'PartNumber',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Service Family</span>,
        column: 'ServiceFamily',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Unit Price</span>,
        column: 'UnitPrice',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Resource Name</span>,
        column: 'ResourceName',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Invoice SectionId</span>,
        column: 'InvoiceSectionId',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Invoice Section</span>,
        column: 'InvoiceSection',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">ReservationId</span>,
        column: 'ReservationId',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Reservation Name</span>,
        column: 'ReservationName',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Product OrderId</span>,
        column: 'ProductOrderId',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Product Order Name</span>,
        column: 'ProductOrderName',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Term</span>,
        column: 'Term',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Publisher Name</span>,
        column: 'PublisherName',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Plan Name</span>,
        column: 'PlanName',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Frequency</span>,
        column: 'Frequency',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Publisher Type</span>,
        column: 'PublisherType',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">PayGPrice</span>,
        column: 'PayGPrice',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Pricing Model</span>,
        column: 'PricingModel',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Idle</span>,
        column: 'Idle',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Idle - EST Savings</span>,
        column: 'Idle - Est Savings',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Placement</span>,
        column: 'Placement',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Placement - EST Savings</span>,
        column: 'Placement - Est Savings',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">VM - Resource Name</span>,
        column: 'VM-ResourceName',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">ResourceRate - List</span>,
        column: 'ResourceRate - List',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Discount</span>,
        column: 'Discount',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Rate Card Unit</span>,
        column: 'Rate Card Unit',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Usage %</span>,
        column: 'Usage',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Growth %</span>,
        column: 'Growth %',
        sorter: true,
        ellipsis: true,
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
        <Popconfirm title="Delete Record?" onConfirm={() => removeAzureDailyUsage(data.id)}>
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
