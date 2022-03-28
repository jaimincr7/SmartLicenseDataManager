import { Checkbox, Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import {
  setTableColumnSelection,
  clearCiscoPolicyMessages,
  ciscoPolicySelector,
} from '../../../../store/hwCisco/ciscoPolicy/ciscoPolicy.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import { AlignType } from 'rc-table/lib/interface';
import {
  deleteCiscoPolicy,
  searchCiscoPolicy,
} from '../../../../store/hwCisco/ciscoPolicy/ciscoPolicy.action';
import _ from 'lodash';
import ciscoPolicyService from '../../../../services/hwCisco/ciscoPolicy/ciscoPolicy.service';
import {
  FilterByDropdown,
  FilterWithSwapOption,
  FilterByDateSwap,
  FilterByBooleanDropDown,
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
  const ciscoPolicy = useAppSelector(ciscoPolicySelector);
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
    return ciscoPolicyService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    setFilterKeys(ObjectForColumnFilter);
    return FilterWithSwapOption(
      dataIndex,
      ciscoPolicy.search.tableName,
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
              ciscoPolicy.search.lookups?.tenants?.length > 0
                ? ciscoPolicy.search.lookups?.tenants
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
              ciscoPolicy.search.lookups?.companies?.length > 0
                ? ciscoPolicy.search.lookups?.companies
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
              ciscoPolicy.search.lookups?.bus?.length > 0
                ? ciscoPolicy.search.lookups?.bus
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
            title: FilterByDateSwapTable('date_added', ciscoPolicy.search.tableName, form),
            dataIndex: 'date_added',
            key: 'date_added',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Quote Begin Date</span>,
        column: 'Quote Begin Date',
        sorter: true,
        children: [
          {
            title: FilterByDateSwapTable('quote_begin_date', ciscoPolicy.search.tableName, form),
            dataIndex: 'quote_begin_date',
            key: 'quote_begin_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Quote End Date</span>,
        column: 'Quote End Date',
        sorter: true,
        children: [
          {
            title: FilterByDateSwapTable('quote_end_date', ciscoPolicy.search.tableName, form),
            dataIndex: 'quote_end_date',
            key: 'quote_end_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Coverage Expiration</span>,
        column: 'Coverage Expiration',
        sorter: true,
        children: [
          {
            title: FilterByDateSwapTable('coverage_expiration', ciscoPolicy.search.tableName, form),
            dataIndex: 'coverage_expiration',
            key: 'coverage_expiration',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Start Date</span>,
        column: 'Start Date',
        sorter: true,
        children: [
          {
            title: FilterByDateSwapTable('start_date', ciscoPolicy.search.tableName, form),
            dataIndex: 'start_date',
            key: 'start_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">End Date</span>,
        column: 'End Date',
        sorter: true,
        children: [
          {
            title: FilterByDateSwapTable('end_date', ciscoPolicy.search.tableName, form),
            dataIndex: 'end_date',
            key: 'end_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">2nd Start Date</span>,
        column: '2nd Start Date',
        sorter: true,
        children: [
          {
            title: FilterByDateSwapTable('second_start_date', ciscoPolicy.search.tableName, form),
            dataIndex: 'second_start_date',
            key: 'second_start_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">2nd End Date</span>,
        column: '2nd End Date',
        sorter: true,
        children: [
          {
            title: FilterByDateSwapTable('second_end_date', ciscoPolicy.search.tableName, form),
            dataIndex: 'second_end_date',
            key: 'second_end_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },

      //STRINGS

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
        title: <span className="dragHandler">UID</span>,
        column: 'UID',
        sorter: true,
        children: [
          {
            title: FilterBySwap('uid', form),
            dataIndex: 'uid',
            key: 'uid',
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
        title: <span className="dragHandler">Instance ID</span>,
        column: 'Instance ID',
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
        title: <span className="dragHandler">Parent Child Indicator</span>,
        column: 'Parent Child Indicator',
        sorter: true,
        children: [
          {
            title: FilterBySwap('parent_child_indicator', form),
            dataIndex: 'parent_child_indicator',
            key: 'parent_child_indicator',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Minor Follow Parent</span>,
        column: 'Minor Follow Parent',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'minor_follow_parent',
              ciscoPolicy.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'minor_follow_parent',
            key: 'minor_follow_parent',
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
        title: <span className="dragHandler">Quote Group</span>,
        column: 'Quote Group',
        sorter: true,
        children: [
          {
            title: FilterBySwap('quote_group', form),
            dataIndex: 'quote_group',
            key: 'quote_group',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Quote Service Level</span>,
        column: 'Quote Service Level',
        sorter: true,
        children: [
          {
            title: FilterBySwap('quote_service_level', form),
            dataIndex: 'quote_service_level',
            key: 'quote_service_level',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Quote EOS</span>,
        column: 'Quote EOS',
        sorter: true,
        children: [
          {
            title: FilterBySwap('quote_eos', form),
            dataIndex: 'quote_eos',
            key: 'quote_eos',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Service Level Compare</span>,
        column: 'Service Level Compare',
        sorter: true,
        children: [
          {
            title: FilterBySwap('service_level_compare', form),
            dataIndex: 'service_level_compare',
            key: 'service_level_compare',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Quote Price</span>,
        column: 'Quote Price',
        sorter: true,
        children: [
          {
            title: FilterBySwap('quote_price', form),
            dataIndex: 'quote_price',
            key: 'quote_price',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Quote Number</span>,
        column: 'Quote Number',
        sorter: true,
        children: [
          {
            title: FilterBySwap('quote_number', form),
            dataIndex: 'quote_number',
            key: 'quote_number',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Quote Issues</span>,
        column: 'Quote Issues',
        sorter: true,
        children: [
          {
            title: FilterBySwap('quote_issues', form),
            dataIndex: 'quote_issues',
            key: 'quote_issues',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">ACTION</span>,
        column: 'ACTION',
        sorter: true,
        children: [
          {
            title: FilterBySwap('action', form),
            dataIndex: 'action',
            key: 'action',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Response</span>,
        column: 'RESPONSE',
        sorter: true,
        children: [
          {
            title: FilterBySwap('response', form),
            dataIndex: 'response',
            key: 'response',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Requested Service Level</span>,
        column: 'Requested Service Level',
        sorter: true,
        children: [
          {
            title: FilterBySwap('requested_service_level', form),
            dataIndex: 'requested_service_level',
            key: 'requested_service_level',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Duration Exception</span>,
        column: 'Duration Exception',
        sorter: true,
        children: [
          {
            title: FilterBySwap('duration_exception', form),
            dataIndex: 'duration_exception',
            key: 'duration_exception',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Redundant System</span>,
        column: 'Redundant System',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'redundant_system',
              ciscoPolicy.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'redundant_system',
            key: 'redundant_system',
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
        title: <span className="dragHandler">Quote Status</span>,
        column: 'Quote Status',
        sorter: true,
        children: [
          {
            title: FilterBySwap('quote_status', form),
            dataIndex: 'quote_status',
            key: 'quote_status',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Cancellation Tracking</span>,
        column: 'CANCELLATION TRACKING',
        sorter: true,
        children: [
          {
            title: FilterBySwap('cancellation_tracking', form),
            dataIndex: 'cancellation_tracking',
            key: 'cancellation_tracking',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Canceled Recovered Amount</span>,
        column: 'CANCELED RECOVERED AMOUNT',
        sorter: true,
        children: [
          {
            title: FilterBySwap('canceled_recovered_amount', form),
            dataIndex: 'canceled_recovered_amount',
            key: 'canceled_recovered_amount',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Ineligible Reason</span>,
        column: 'Ineligible Reason',
        sorter: true,
        children: [
          {
            title: FilterBySwap('ineligible_reason', form),
            dataIndex: 'ineligible_reason',
            key: 'ineligible_reason',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Coverage Review</span>,
        column: 'Coverage Review',
        sorter: true,
        children: [
          {
            title: FilterBySwap('coverage_review', form),
            dataIndex: 'coverage_review',
            key: 'coverage_review',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Coverage Review Category</span>,
        column: 'Coverage Review Category',
        sorter: true,
        children: [
          {
            title: FilterBySwap('coverage_review_category', form),
            dataIndex: 'coverage_review_category',
            key: 'coverage_review_category',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Is device within Coverage Policy?</span>,
        column: 'Is device within Coverage Policy?',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_device_within_coverage_policy',
              ciscoPolicy.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_device_within_coverage_policy',
            key: 'is_device_within_coverage_policy',
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
        title: <span className="dragHandler">Coverage Policy Exclusion Reason</span>,
        column: 'Coverage Policy Exclusion Reason',
        sorter: true,
        children: [
          {
            title: FilterBySwap('coverage_policy_exclusion_reason', form),
            dataIndex: 'coverage_policy_exclusion_reason',
            key: 'coverage_policy_exclusion_reason',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">LDOS</span>,
        column: 'LDOS',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'ldos',
              ciscoPolicy.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'ldos',
            key: 'ldos',
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
        title: <span className="dragHandler">Valid Through LDoS</span>,
        column: 'Valid Through LDoS',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'valid_through_l_do_s',
              ciscoPolicy.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'valid_through_l_do_s',
            key: 'valid_through_l_do_s',
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
        title: <span className="dragHandler">Eligible For Quoting</span>,
        column: 'Eligible For Quoting',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'eligible_for_quoting',
              ciscoPolicy.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'eligible_for_quoting',
            key: 'eligible_for_quoting',
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
        title: <span className="dragHandler">Coverage Required</span>,
        column: 'Coverage Required',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'coverage_required',
              ciscoPolicy.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'coverage_required',
            key: 'coverage_required',
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
        title: <span className="dragHandler">Coverage Declined Reason</span>,
        column: 'Coverage Declined Reason',
        sorter: true,
        children: [
          {
            title: FilterBySwap('coverage_declined_reason', form),
            dataIndex: 'coverage_declined_reason',
            key: 'coverage_declined_reason',
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
        title: <span className="dragHandler">Service Indicator</span>,
        column: 'Service Indicator',
        sorter: true,
        children: [
          {
            title: FilterBySwap('service_indicator', form),
            dataIndex: 'service_indicator',
            key: 'service_indicator',
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
        title: <span className="dragHandler">Service Level Desc</span>,
        column: 'Service Level Desc',
        sorter: true,
        children: [
          {
            title: FilterBySwap('service_level_desc', form),
            dataIndex: 'service_level_desc',
            key: 'service_level_desc',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Contract Status</span>,
        column: 'Contract Status',
        sorter: true,
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
        title: <span className="dragHandler">Service Vendor</span>,
        column: 'Service Vendor',
        sorter: true,
        children: [
          {
            title: FilterBySwap('service_vendor', form),
            dataIndex: 'service_vendor',
            key: 'service_vendor',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Maintenance Price</span>,
        column: 'Maintenance Price',
        sorter: true,
        children: [
          {
            title: FilterBySwap('maintenance_price', form),
            dataIndex: 'maintenance_price',
            key: 'maintenance_price',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Maintenance PO</span>,
        column: 'Maintenance PO',
        sorter: true,
        children: [
          {
            title: FilterBySwap('maintenance_po', form),
            dataIndex: 'maintenance_po',
            key: 'maintenance_po',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Maintenance SO</span>,
        column: 'Maintenance SO',
        sorter: true,
        children: [
          {
            title: FilterBySwap('maintenance_so', form),
            dataIndex: 'maintenance_so',
            key: 'maintenance_so',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Service Program</span>,
        column: 'Service Program',
        sorter: true,
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
        title: <span className="dragHandler">2nd Service Level</span>,
        column: '2nd Service Level',
        sorter: true,
        children: [
          {
            title: FilterBySwap('second_service_level', form),
            dataIndex: 'second_service_level',
            key: 'second_service_level',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">2nd Service Level Desc</span>,
        column: '2nd Service Level Desc',
        sorter: true,
        children: [
          {
            title: FilterBySwap('second_service_level_desc', form),
            dataIndex: 'second_service_level_desc',
            key: 'second_service_level_desc',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">2nd Contract Status</span>,
        column: '2nd Contract Status',
        sorter: true,
        children: [
          {
            title: FilterBySwap('second_contract_status', form),
            dataIndex: 'second_contract_status',
            key: 'second_contract_status',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">2nd Contract Number</span>,
        column: '2nd Contract Number',
        sorter: true,
        children: [
          {
            title: FilterBySwap('second_contract_number', form),
            dataIndex: 'second_contract_number',
            key: 'second_contract_number',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">2nd Svc Vendor</span>,
        column: '2nd Svc Vendor',
        sorter: true,
        children: [
          {
            title: FilterBySwap('second_svc_vendor', form),
            dataIndex: 'second_svc_vendor',
            key: 'second_svc_vendor',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">2nd Maintenance Price</span>,
        column: '2nd Maintenance Price',
        sorter: true,
        children: [
          {
            title: FilterBySwap('second_maintenance_price', form),
            dataIndex: 'second_maintenance_price',
            key: 'second_maintenance_price',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">2nd Maintenance PO</span>,
        column: '2nd Maintenance PO',
        sorter: true,
        children: [
          {
            title: FilterBySwap('second_maintenance_po', form),
            dataIndex: 'second_maintenance_po',
            key: 'second_maintenance_po',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">2nd Maintenance SO</span>,
        column: '2nd Maintenance SO',
        sorter: true,
        children: [
          {
            title: FilterBySwap('second_maintenance_so', form),
            dataIndex: 'second_maintenance_so',
            key: 'second_maintenance_so',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">2nd Service Program</span>,
        column: '2nd Service Program',
        sorter: true,
        children: [
          {
            title: FilterBySwap('second_service_program', form),
            dataIndex: 'second_service_program',
            key: 'second_service_program',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Service Renewal Date</span>,
        column: 'Service Renewal Date',
        sorter: true,
        children: [
          {
            title: FilterBySwap('service_renewal_date', form),
            dataIndex: 'service_renewal_date',
            key: 'service_renewal_date',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Service Auto-Renewal Term</span>,
        column: 'Service Auto-Renewal Term',
        sorter: true,
        children: [
          {
            title: FilterBySwap('service_auto_renewal_term', form),
            dataIndex: 'service_auto_renewal_term',
            key: 'service_auto_renewal_term',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Service Billing Frequency</span>,
        column: 'Service Billing Frequency',
        sorter: true,
        children: [
          {
            title: FilterBySwap('service_billing_frequency', form),
            dataIndex: 'service_billing_frequency',
            key: 'service_billing_frequency',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Service Monthly Cost</span>,
        column: 'Service Monthly Cost',
        sorter: true,
        children: [
          {
            title: FilterBySwap('service_monthly_cost', form),
            dataIndex: 'service_monthly_cost',
            key: 'service_monthly_cost',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Sample</span>,
        column: 'SAMPLE',
        sorter: true,
        children: [
          {
            title: FilterBySwap('sample', form),
            dataIndex: 'sample',
            key: 'sample',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeCiscoPolicy = (id: number) => {
    dispatch(deleteCiscoPolicy(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.HwCiscoPolicy}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/hw-cisco/cisco-policy/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.HwCiscoPolicy}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeCiscoPolicy(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.HwCiscoPolicy)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={ciscoPolicySelector}
        searchTableData={searchCiscoPolicy}
        clearTableDataMessages={clearCiscoPolicyMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.HwCiscoPolicy)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
