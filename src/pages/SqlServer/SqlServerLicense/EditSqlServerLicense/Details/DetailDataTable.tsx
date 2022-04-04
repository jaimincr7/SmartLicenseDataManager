import React, { useRef, useState } from 'react';
import { IDetailDataTableProps } from './detailDataTable.model';
import _ from 'lodash';
import { AlignType } from 'rc-table/lib/interface';
import DataTable from '../../../../../common/components/DataTable';
import {
  FilterWithSwapOption,
  FilterByDropdown,
  FilterByDateSwap,
} from '../../../../../common/components/DataTable/DataTableFilters';
import sqlServerLicenseDetailService from '../../../../../services/sqlServer/sqlServerLicenseDetail/sqlServerLicenseDetail.service';
import { useAppSelector } from '../../../../../store/app.hooks';
import { searchSqlServerLicenseDetail } from '../../../../../store/sqlServer/sqlServerLicenseDetail/sqlServerLicenseDetail.action';
import {
  setTableColumnSelection,
  sqlServerLicenseDetailSelector,
} from '../../../../../store/sqlServer/sqlServerLicenseDetail/sqlServerLicenseDetail.reducer';
import { ISearchSqlServerLicenseDetail } from '../../../../../services/sqlServer/sqlServerLicenseDetail/sqlServerLicenseDetail.model';
import { Checkbox } from 'antd';
import { showDateFromApi } from '../../../../../common/helperFunction';

const DetailDataTable: React.FC<IDetailDataTableProps> = (props) => {
  const { licenseId } = props;
  const sqlServerLicenseDetail = useAppSelector(sqlServerLicenseDetailSelector);
  const dataTableRef = useRef(null);
  const [ObjectForColumnFilter, setObjectForColumnFilter] = useState({});

  const extraSearchData = {
    sql_server_license_id: licenseId,
  };

  const exportExcelFile = (searchData: ISearchSqlServerLicenseDetail) => {
    return sqlServerLicenseDetailService.exportExcelFile(searchData);
  };

  const getColumnLookup = (data: {}) => {
    return sqlServerLicenseDetailService
      .getLicenseDetailColumnLookup(licenseId, data)
      .then((res) => {
        return res.body.data;
      });
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(
      dataIndex,
      sqlServerLicenseDetail.search.tableName,
      form,
      getColumnLookup,
      ObjectForColumnFilter
    );
  };

  const FilterByDateSwapTable = (dataIndex: string, tableName: string, form: any) => {
    return FilterByDateSwap(dataIndex, tableName, form, getColumnLookup, ObjectForColumnFilter);
  };

  const getTableColumns = (form) => {
    return [
      {
        title: <span className="dragHandler">Sql Server Id</span>,
        column: 'SQLServerId',
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
        title: <span className="dragHandler">Date Added</span>,
        column: 'Date Added',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDateSwapTable(
              'date_added',
              sqlServerLicenseDetail.search.tableName,
              form
            ),
            dataIndex: 'date_added',
            key: 'date_added',
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
        title: <span className="dragHandler">Datacenter</span>,
        column: 'Datacenter',
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
        title: <span className="dragHandler">Cluster</span>,
        column: 'Cluster',
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
        title: <span className="dragHandler">License Product Name</span>,
        column: 'License Product Name',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('license_product_name', form),
            dataIndex: 'license_product_name',
            key: 'license_product_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Assigned License Product Name</span>,
        column: 'Assigned License Product Name',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('assigned_license_product_name', form),
            dataIndex: 'assigned_license_product_name',
            key: 'assigned_license_product_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">HA Enabled</span>,
        column: 'HA enabled',
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
        title: <span className="dragHandler">Host</span>,
        column: 'Host',
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
        title: <span className="dragHandler">Procs</span>,
        column: 'Procs',
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
        title: <span className="dragHandler">Cores</span>,
        column: 'Cores',
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
        title: <span className="dragHandler">Device Name</span>,
        column: 'Device Name',
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
        title: <span className="dragHandler">Device Type</span>,
        column: 'Device Type',
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
        title: <span className="dragHandler">SQL Cluster</span>,
        column: 'SQL Cluster',
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
        title: <span className="dragHandler">Version</span>,
        column: 'Version',
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
        title: <span className="dragHandler">Edition</span>,
        column: 'Edition',
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
        title: <span className="dragHandler">Device State</span>,
        column: 'Device State',
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
        title: <span className="dragHandler">Software State</span>,
        column: 'Software State',
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
        title: <span className="dragHandler">OS Type</span>,
        column: 'OS Type',
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
        title: <span className="dragHandler">Raw Software Title</span>,
        column: 'Raw Software Title',
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
        title: <span className="dragHandler">FQDN</span>,
        column: 'FQDN',
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
        title: <span className="dragHandler">Service</span>,
        column: 'Service',
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
        title: <span className="dragHandler">Cost Code</span>,
        column: 'Cost Code',
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
        title: <span className="dragHandler">Line of Business</span>,
        column: 'Line of Business',
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
        title: <span className="dragHandler">Market</span>,
        column: 'Market',
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
        title: <span className="dragHandler">Application</span>,
        column: 'Application',
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
        title: <span className="dragHandler">SQL Cluster Node Type</span>,
        column: 'SQL Cluster Node Type',
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
        title: <span className="dragHandler">vCPU</span>,
        column: 'vCPU',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('vcpu', form),
            dataIndex: 'vcpu',
            key: 'vcpu',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Azure Hosted</span>,
        column: 'Azure Hosted',
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
        title: <span className="dragHandler">Name</span>,
        column: 'Name',
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
        title: <span className="dragHandler">Agreement Type</span>,
        column: 'Opt_AgreementType',
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
        title: <span className="dragHandler">Default to Enterprise on Hosts</span>,
        column: 'Opt_DefaultToEnterpriseOnHosts',
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
        title: <span className="dragHandler">Cluster Logic</span>,
        column: 'Opt_ClusterLogic',
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
        title: <span className="dragHandler">Entitlements</span>,
        column: 'Opt_Entitlements',
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
        title: <span className="dragHandler">Exclude Non-Prod</span>,
        column: 'Opt_ExcludeNonProd',
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
        title: <span className="dragHandler">Notes</span>,
        column: 'Notes',
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
        title: <span className="dragHandler">Orphaned VM</span>,
        column: 'Orphaned VM',
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
        title: <span className="dragHandler">Licensable</span>,
        column: 'Licensable',
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
        title: <span className="dragHandler">Service Id</span>,
        column: 'ServiceId',
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
        title: <span className="dragHandler">Version Id</span>,
        column: 'VersionId',
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
        title: <span className="dragHandler">Edition Id</span>,
        column: 'EditionId',
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
        title: <span className="dragHandler">Host Max Version Id</span>,
        column: 'HostMaxVersionId',
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
        title: <span className="dragHandler">Host Max Edition Id</span>,
        column: 'HostMaxEditionId',
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
        title: <span className="dragHandler">Cluster Max Version Id</span>,
        column: 'ClusterMaxVersionId',
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
        title: <span className="dragHandler">Cluster Max Edition Id</span>,
        column: 'ClusterMaxEditionid',
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
        title: <span className="dragHandler">Cluster Seq Num</span>,
        column: 'ClusterSeqNum',
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
        title: <span className="dragHandler">Host Seq Num</span>,
        column: 'HostSeqNum',
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
        title: <span className="dragHandler">Device Seq Num</span>,
        column: 'DeviceSeqNum',
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
        title: <span className="dragHandler">Effective Processors</span>,
        column: 'Effective Processors',
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
        title: <span className="dragHandler">Effective Cores</span>,
        column: 'Effective Cores',
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
        title: <span className="dragHandler">Effective vCPU</span>,
        column: 'Effective vCPU',
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
        title: <span className="dragHandler">Effective vCPU for Proc Licenses</span>,
        column: 'Effective vCPU for Proc Licenses',
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
        title: <span className="dragHandler">Core Density</span>,
        column: 'Core Density',
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
        title: <span className="dragHandler">Excluded</span>,
        column: 'Excluded',
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
        title: <span className="dragHandler">Licensable Cluster Seq Num</span>,
        column: 'Licensable - ClusterSeqNum',
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
        title: <span className="dragHandler">Licensable Host Seq Num</span>,
        column: 'Licensable - HostSeqNum',
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
        title: <span className="dragHandler">Licensable Device Seq Num</span>,
        column: 'Licensable - DeviceSeqNum',
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
        title: <span className="dragHandler">Licensed At</span>,
        column: 'Licensed At',
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
        title: <span className="dragHandler">License Type</span>,
        column: 'License Type',
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
        title: <span className="dragHandler">License Count</span>,
        column: 'License Count',
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
        title: <span className="dragHandler">License Cost</span>,
        column: 'License Cost',
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
        title: <span className="dragHandler">S - License Type - Device</span>,
        column: 'S - License Type - Device',
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
        title: <span className="dragHandler">S - License Count - Device</span>,
        column: 'S - License Count - Device',
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
        title: <span className="dragHandler">S - License Cost - Device</span>,
        column: 'S - License Cost - Device',
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
        title: <span className="dragHandler">S - License Cost - Host - Device Licensed</span>,
        column: 'S - License Cost - Host - Device Licensed',
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
        title: <span className="dragHandler">S - License Type - Host</span>,
        column: 'S - License Type - Host',
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
        title: <span className="dragHandler">S - License Count - Host</span>,
        column: 'S - License Count - Host',
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
        title: <span className="dragHandler">S - License Cost - Host</span>,
        column: 'S - License Cost - Host',
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
        title: <span className="dragHandler">Comment</span>,
        column: 'Comment',
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
        title: <span className="dragHandler">License Id</span>,
        column: 'License Id',
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
        title: <span className="dragHandler">License Qty</span>,
        column: 'License Qty',
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
        title: <span className="dragHandler">Assigned License Id</span>,
        column: 'Assigned License Id',
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
        title: <span className="dragHandler">Assigned License Qty</span>,
        column: 'Assigned License Qty',
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
        title: <span className="dragHandler">Requires Server Mobility</span>,
        column: 'Requires Server Mobility',
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
        title: <span className="dragHandler">License Requires SA</span>,
        column: 'License Requires SA',
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
        setObjectForColumnFilter={setObjectForColumnFilter}
      />
    </>
  );
};

export default DetailDataTable;
