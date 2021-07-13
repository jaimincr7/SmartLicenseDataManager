import React, { useRef } from 'react';
import { IDetailDataTableProps } from './detailDataTable.model';
import moment from 'moment';
import _ from 'lodash';
import DataTable from '../../../../../common/components/DataTable';
import {
  FilterWithSwapOption,
  FilterByDropdown,
  FilterByDate,
} from '../../../../../common/components/DataTable/DataTableFilters';
import sqlServerLicenseDetailService from '../../../../../services/sqlServer/sqlServerLicenseDetail/sqlServerLicenseDetail.service';
import { useAppSelector } from '../../../../../store/app.hooks';
import { searchSqlServerLicenseDetail } from '../../../../../store/sqlServer/sqlServerLicenseDetail/sqlServerLicenseDetail.action';
import {
  setTableColumnSelection,
  sqlServerLicenseDetailSelector,
} from '../../../../../store/sqlServer/sqlServerLicenseDetail/sqlServerLicenseDetail.reducer';
import { Common } from '../../../../../common/constants/common';
import { ISearchSqlServerLicenseDetail } from '../../../../../services/sqlServer/sqlServerLicenseDetail/sqlServerLicenseDetail.model';

const DetailDataTable: React.FC<IDetailDataTableProps> = (props) => {
  const { licenseId } = props;
  const sqlServerLicenseDetail = useAppSelector(sqlServerLicenseDetailSelector);
  const dataTableRef = useRef(null);

  const extraSearchData = {
    sql_server_license_id: licenseId,
  };

  const exportExcelFile = (searchData: ISearchSqlServerLicenseDetail) => {
    return sqlServerLicenseDetailService.exportExcelFile(searchData);
  };

  const getColumnLookup = (column: string) => {
    return sqlServerLicenseDetailService
      .getLicenseDetailColumnLookup(licenseId, column)
      .then((res) => {
        return res.body.data;
      });
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(
      dataIndex,
      sqlServerLicenseDetail.search.tableName,
      form,
      getColumnLookup
    );
  };

  const getTableColumns = (form) => {
    return [
      {
        title: 'Sql Server Id',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('sql_server_id', form),
            dataIndex: 'sql_server_id',
            key: 'sql_server_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Date Added',
        sorter: true,
        ellipsis: true,
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
        title: 'Source',
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
        title: 'Data Center',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('data_center', form),
            dataIndex: 'data_center',
            key: 'data_center',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Cluster',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('cluster', form),
            dataIndex: 'cluster',
            key: 'cluster',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'HA Enabled',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown(
              'ha_enabled',
              sqlServerLicenseDetail.search.lookups?.booleanLookup
            ),
            dataIndex: 'ha_enabled',
            key: 'ha_enabled',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Host',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('host', form),
            dataIndex: 'host',
            key: 'host',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Procs',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('procs', form),
            dataIndex: 'procs',
            key: 'procs',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Cores',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('cores', form),
            dataIndex: 'cores',
            key: 'cores',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Device Name',
        sorter: true,
        ellipsis: true,
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
        title: 'Device Type',
        sorter: true,
        ellipsis: true,
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
        title: 'Tenant Id',
        sorter: true,
        dataIndex: 'tenant_id',
        key: 'tenant_id',
        ellipsis: true,
      },
      {
        title: 'Company Id',
        sorter: true,
        dataIndex: 'company_id',
        key: 'company_id',
        ellipsis: true,
      },
      {
        title: 'BU Id',
        sorter: true,
        dataIndex: 'bu_id',
        key: 'bu_id',
        ellipsis: true,
      },
      {
        title: 'SQL Cluster',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('sql_cluster', form),
            dataIndex: 'sql_cluster',
            key: 'sql_cluster',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Product Family',
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
        title: 'Version',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('version', form),
            dataIndex: 'version',
            key: 'version',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Edition',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('edition', form),
            dataIndex: 'edition',
            key: 'edition',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Device State',
        sorter: true,
        ellipsis: true,
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
        title: 'Software State',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('software_state', form),
            dataIndex: 'software_state',
            key: 'software_state',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'OS Type',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('os_type', form),
            dataIndex: 'os_type',
            key: 'os_type',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Raw Software Title',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('raw_software_title', form),
            dataIndex: 'raw_software_title',
            key: 'raw_software_title',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'FQDN',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('fqdn', form),
            dataIndex: 'fqdn',
            key: 'fqdn',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Service',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('service', form),
            dataIndex: 'service',
            key: 'service',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Cost Code',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('cost_code', form),
            dataIndex: 'cost_code',
            key: 'cost_code',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Line of Business',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('line_of_business', form),
            dataIndex: 'line_of_business',
            key: 'line_of_business',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Market',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('market', form),
            dataIndex: 'market',
            key: 'market',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Application',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('application', form),
            dataIndex: 'application',
            key: 'application',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Serial Number',
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
        title: 'SQL Cluster Node Type',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('sql_cluster_node_type', form),
            dataIndex: 'sql_cluster_node_type',
            key: 'sql_cluster_node_type',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'vCPU',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('vCPU', form),
            dataIndex: 'vCPU',
            key: 'vCPU',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Azure Hosted',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown(
              'azure_hosted',
              sqlServerLicenseDetail.search.lookups?.booleanLookup
            ),
            dataIndex: 'azure_hosted',
            key: 'azure_hosted',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Name',
        sorter: true,
        ellipsis: true,
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
        title: 'Opt-Agreement Type',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('opt_agreement_type', form),
            dataIndex: 'opt_agreement_type',
            key: 'opt_agreement_type',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Opt-Default to Enterprise on Hosts',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown(
              'opt_default_to_enterprise_on_hosts',
              sqlServerLicenseDetail.search.lookups?.booleanLookup
            ),
            dataIndex: 'opt_default_to_enterprise_on_hosts',
            key: 'opt_default_to_enterprise_on_hosts',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Opt-Cluster Logic',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown(
              'opt_cluster_logic',
              sqlServerLicenseDetail.search.lookups?.booleanLookup
            ),
            dataIndex: 'opt_cluster_logic',
            key: 'opt_cluster_logic',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Opt-Entitlements',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown(
              'opt_entitlements',
              sqlServerLicenseDetail.search.lookups?.booleanLookup
            ),
            dataIndex: 'opt_entitlements',
            key: 'opt_entitlements',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Opt-Exclude Non-Prod',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown(
              'opt_exclude_non_prod',
              sqlServerLicenseDetail.search.lookups?.booleanLookup
            ),
            dataIndex: 'opt_exclude_non_prod',
            key: 'opt_exclude_non_prod',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Notes',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('notes', form),
            dataIndex: 'notes',
            key: 'notes',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Orphaned VM',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown(
              'orphaned_vm',
              sqlServerLicenseDetail.search.lookups?.booleanLookup
            ),
            dataIndex: 'orphaned_vm',
            key: 'orphaned_vm',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Licensable',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown(
              'licensable',
              sqlServerLicenseDetail.search.lookups?.booleanLookup
            ),
            dataIndex: 'licensable',
            key: 'licensable',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Service Id',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('service_id', form),
            dataIndex: 'service_id',
            key: 'service_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Version Id',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('version_id', form),
            dataIndex: 'version_id',
            key: 'version_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Edition Id',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('edition_id', form),
            dataIndex: 'edition_id',
            key: 'edition_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Host Max Version Id',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('host_max_version_id', form),
            dataIndex: 'host_max_version_id',
            key: 'host_max_version_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Host Max Edition Id',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('host_max_edition_id', form),
            dataIndex: 'host_max_edition_id',
            key: 'host_max_edition_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Cluster Max Version Id',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('cluster_max_version_id', form),
            dataIndex: 'cluster_max_version_id',
            key: 'cluster_max_version_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Cluster Max Edition Id',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('cluster_max_edition_id', form),
            dataIndex: 'cluster_max_edition_id',
            key: 'cluster_max_edition_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Cluster Seq Num',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('cluster_seq_num', form),
            dataIndex: 'cluster_seq_num',
            key: 'cluster_seq_num',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Host Seq Num',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('host_seq_num', form),
            dataIndex: 'host_seq_num',
            key: 'host_seq_num',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Device Seq Num',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('device_seq_num', form),
            dataIndex: 'device_seq_num',
            key: 'device_seq_num',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Effective Processors',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('effective_processors', form),
            dataIndex: 'effective_processors',
            key: 'effective_processors',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Effective Cores',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('effective_cores', form),
            dataIndex: 'effective_cores',
            key: 'effective_cores',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Effective vCPU',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('effective_vcpu', form),
            dataIndex: 'effective_vcpu',
            key: 'effective_vcpu',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Effective vCPU for Proc Licenses',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('effective_vcpu_for_proc_licenses', form),
            dataIndex: 'effective_vcpu_for_proc_licenses',
            key: 'effective_vcpu_for_proc_licenses',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Core Density',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('core_density', form),
            dataIndex: 'core_density',
            key: 'core_density',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Excluded',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('excluded', form),
            dataIndex: 'excluded',
            key: 'excluded',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Licensable Cluster Seq Num',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('licensable_cluster_seq_num', form),
            dataIndex: 'licensable_cluster_seq_num',
            key: 'licensable_cluster_seq_num',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Licensable Host Seq Num',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('licensable_host_seq_num', form),
            dataIndex: 'licensable_host_seq_num',
            key: 'licensable_host_seq_num',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Licensable Device Seq Num',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('licensable_device_seq_num', form),
            dataIndex: 'licensable_device_seq_num',
            key: 'licensable_device_seq_num',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Licensed At',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('licensed_at', form),
            dataIndex: 'licensed_at',
            key: 'licensed_at',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'License Type',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('license_type', form),
            dataIndex: 'license_type',
            key: 'license_type',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'License Count',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('license_count', form),
            dataIndex: 'license_count',
            key: 'license_count',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'License Cost',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('license_cost', form),
            dataIndex: 'license_cost',
            key: 'license_cost',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'S - License Type - Device',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('s_license_type_device', form),
            dataIndex: 's_license_type_device',
            key: 's_license_type_device',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'S - License Count - Device',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('s_license_count_device', form),
            dataIndex: 's_license_count_device',
            key: 's_license_count_device',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'S - License Cost - Device',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('s_license_cost_device', form),
            dataIndex: 's_license_cost_device',
            key: 's_license_cost_device',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'S - License Cost - Host - Device Licensed',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('s_license_cost_host_device_licensed', form),
            dataIndex: 's_license_cost_host_device_licensed',
            key: 's_license_cost_host_device_licensed',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'S - License Type - Host',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('s_license_type_host', form),
            dataIndex: 's_license_type_host',
            key: 's_license_type_host',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'S - License Count - Host',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('s_license_count_host', form),
            dataIndex: 's_license_count_host',
            key: 's_license_count_host',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'S - License Cost - Host',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('s_license_cost_host', form),
            dataIndex: 's_license_cost_host',
            key: 's_license_cost_host',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Comment',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('comment', form),
            dataIndex: 'comment',
            key: 'comment',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'License Id',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('license_id', form),
            dataIndex: 'license_id',
            key: 'license_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'License Qty',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('license_qty', form),
            dataIndex: 'license_qty',
            key: 'license_qty',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Assigned License Id',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('assigned_license_id', form),
            dataIndex: 'assigned_license_id',
            key: 'assigned_license_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Assigned License Qty',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('assigned_license_qty', form),
            dataIndex: 'assigned_license_qty',
            key: 'assigned_license_qty',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Requires Server Mobility',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('requires_server_mobility', form),
            dataIndex: 'requires_server_mobility',
            key: 'requires_server_mobility',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'License Requires SA',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('license_requires_sa', form),
            dataIndex: 'license_requires_sa',
            key: 'license_requires_sa',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  return (
    <>
      <DataTable
        ref={dataTableRef}
        showAddButton={false}
        globalSearchExist={false}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={sqlServerLicenseDetailSelector}
        searchTableData={searchSqlServerLicenseDetail}
        setTableColumnSelection={setTableColumnSelection}
        defaultOrderBy="sql_server_license_detail_id"
        extraSearchData={extraSearchData}
      />
    </>
  );
};

export default DetailDataTable;
