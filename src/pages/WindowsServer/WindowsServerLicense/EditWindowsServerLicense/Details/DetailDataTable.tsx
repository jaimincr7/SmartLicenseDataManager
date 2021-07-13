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
import windowsServerLicenseDetailService from '../../../../../services/windowsServer/windowsServerLicenseDetail/windowsServerLicenseDetail.service';
import { useAppSelector } from '../../../../../store/app.hooks';
import { searchWindowsServerLicenseDetail } from '../../../../../store/windowsServer/windowsServerLicenseDetail/windowsServerLicenseDetail.action';
import {
  setTableColumnSelection,
  windowsServerLicenseDetailSelector,
} from '../../../../../store/windowsServer/windowsServerLicenseDetail/windowsServerLicenseDetail.reducer';
import { Common } from '../../../../../common/constants/common';
import { ISearchWindowsServerLicenseDetail } from '../../../../../services/windowsServer/windowsServerLicenseDetail/windowsServerLicenseDetail.model';

const DetailDataTable: React.FC<IDetailDataTableProps> = (props) => {
  const { licenseId } = props;
  const windowsServerLicenseDetail = useAppSelector(windowsServerLicenseDetailSelector);
  const dataTableRef = useRef(null);

  const extraSearchData = {
    windows_server_license_id: licenseId,
  };

  const exportExcelFile = (searchData: ISearchWindowsServerLicenseDetail) => {
    return windowsServerLicenseDetailService.exportExcelFile(searchData);
  };

  const getColumnLookup = (column: string) => {
    return windowsServerLicenseDetailService
      .getLicenseDetailColumnLookup(licenseId, column)
      .then((res) => {
        return res.body.data;
      });
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(
      dataIndex,
      windowsServerLicenseDetail.search.tableName,
      form,
      getColumnLookup
    );
  };

  const getTableColumns = (form) => {
    return [
      {
        title: 'Windows Server Id',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('windows_server_id', form),
            dataIndex: 'windows_server_id',
            key: 'windows_server_id',
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
              windowsServerLicenseDetail.search.lookups?.booleanLookup
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
        title: 'SC Version',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('sc_version', form),
            dataIndex: 'sc_version',
            key: 'sc_version',
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
        title: 'DRS Enabled',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'drs_enabled',
              windowsServerLicenseDetail.search.lookups?.booleanLookup
            ),
            dataIndex: 'drs_enabled',
            key: 'drs_enabled',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
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
        title: 'Operating  System',
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
              windowsServerLicenseDetail.search.lookups?.booleanLookup
            ),
            dataIndex: 'azure_hosted',
            key: 'azure_hosted',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Exempt',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown(
              'exempt',
              windowsServerLicenseDetail.search.lookups?.booleanLookup
            ),
            dataIndex: 'exempt',
            key: 'exempt',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'SC Exempt',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown(
              'sc_exempt',
              windowsServerLicenseDetail.search.lookups?.booleanLookup
            ),
            dataIndex: 'sc_exempt',
            key: 'sc_exempt',
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
        title: 'Agreement Type',
        sorter: true,
        dataIndex: 'opt_agreement_type',
        key: 'opt_agreement_type',
        ellipsis: true,
      },
      {
        title: 'Default to Data Center on Hosts',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown(
              'opt_default_to_data_center_on_hosts',
              windowsServerLicenseDetail.search.lookups?.booleanLookup
            ),
            dataIndex: 'opt_default_to_data_center_on_hosts',
            key: 'opt_default_to_data_center_on_hosts',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Entitlements',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown(
              'opt_entitlements',
              windowsServerLicenseDetail.search.lookups?.booleanLookup
            ),
            dataIndex: 'opt_entitlements',
            key: 'opt_entitlements',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Exclude Non-Prod',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown(
              'opt_exclude_non_prod',
              windowsServerLicenseDetail.search.lookups?.booleanLookup
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
        title: 'SC Notes',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('sc_notes', form),
            dataIndex: 'sc_notes',
            key: 'sc_notes',
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
              windowsServerLicenseDetail.search.lookups?.booleanLookup
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
              windowsServerLicenseDetail.search.lookups?.booleanLookup
            ),
            dataIndex: 'licensable',
            key: 'licensable',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'SC Licensable',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown(
              'sc_licensable',
              windowsServerLicenseDetail.search.lookups?.booleanLookup
            ),
            dataIndex: 'sc_licensable',
            key: 'sc_licensable',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'OS Version Id',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('os_version_id', form),
            dataIndex: 'os_version_id',
            key: 'os_version_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'OS Edition Id',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('os_edition_id', form),
            dataIndex: 'os_edition_id',
            key: 'os_edition_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'SC Version Id',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('sc_version_id', form),
            dataIndex: 'sc_version_id',
            key: 'sc_version_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Max OS Version Id',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('max_os_version_id', form),
            dataIndex: 'max_os_version_id',
            key: 'max_os_version_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Max OS Edition Id',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('max_os_edition_id', form),
            dataIndex: 'max_os_edition_id',
            key: 'max_os_edition_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Max SC Version Id',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('max_sc_version_id', form),
            dataIndex: 'max_sc_version_id',
            key: 'max_sc_version_id',
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
        title: 'Host - Num of VMs',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('host_num_of_vms', form),
            dataIndex: 'host_num_of_vms',
            key: 'host_num_of_vms',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Host - Num of VMs Licensable',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('host_num_of_vms_licensable', form),
            dataIndex: 'host_num_of_vms_licensable',
            key: 'host_num_of_vms_licensable',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Host - Num VMs with WS DC',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('host_num_vms_with_ws_dc', form),
            dataIndex: 'host_num_vms_with_ws_dc',
            key: 'host_num_vms_with_ws_dc',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Host - SC Num of VMs Licensable',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('host_sc_num_of_vms_licensable', form),
            dataIndex: 'host_sc_num_of_vms_licensable',
            key: 'host_sc_num_of_vms_licensable',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Cluster - Num of VMs',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('cluster_num_of_vms', form),
            dataIndex: 'cluster_num_of_vms',
            key: 'cluster_num_of_vms',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Cluster - Num of VMs Licensable',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('cluster_num_of_vms_licensable', form),
            dataIndex: 'cluster_num_of_vms_licensable',
            key: 'cluster_num_of_vms_licensable',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Cluster - Num VMs with WS DC',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('cluster_num_vms_with_ws_dc', form),
            dataIndex: 'cluster_num_vms_with_ws_dc',
            key: 'cluster_num_vms_with_ws_dc',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Cluster - SC Num of VMs Licensable',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('cluster_sc_num_of_vms_licensable', form),
            dataIndex: 'cluster_sc_num_of_vms_licensable',
            key: 'cluster_sc_num_of_vms_licensable',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'WS Effective Processors',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('ws_effective_processors', form),
            dataIndex: 'ws_effective_processors',
            key: 'ws_effective_processors',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'WS Effective Cores',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('ws_effective_cores', form),
            dataIndex: 'ws_effective_cores',
            key: 'ws_effective_cores',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'WS License Multiplier',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('ws_license_multiplier', form),
            dataIndex: 'ws_license_multiplier',
            key: 'ws_license_multiplier',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'WS License Type',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('ws_license_type', form),
            dataIndex: 'ws_license_type',
            key: 'ws_license_type',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'WS License Count',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('ws_license_count', form),
            dataIndex: 'ws_license_count',
            key: 'ws_license_count',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'WS License Cost',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('ws_license_cost', form),
            dataIndex: 'ws_license_cost',
            key: 'ws_license_cost',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'SC License Multiplier',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('sc_license_multiplier', form),
            dataIndex: 'sc_license_multiplier',
            key: 'sc_license_multiplier',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'SC License Type',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('sc_license_type', form),
            dataIndex: 'sc_license_type',
            key: 'sc_license_type',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'SC License Count',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('sc_license_count', form),
            dataIndex: 'sc_license_count',
            key: 'sc_license_count',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'SC License Cost',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('sc_license_cost', form),
            dataIndex: 'sc_license_cost',
            key: 'sc_license_cost',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'S - WS DC Core Licenses',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('s_ws_dc_core_licenses', form),
            dataIndex: 's_ws_dc_core_licenses',
            key: 's_ws_dc_core_licenses',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'S - WS Std Core Licenses',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('s_ws_std_core_licenses', form),
            dataIndex: 's_ws_std_core_licenses',
            key: 's_ws_std_core_licenses',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'S - WS DC Core Licenses Cost',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('s_ws_dc_core_licenses_cost', form),
            dataIndex: 's_ws_dc_core_licenses_cost',
            key: 's_ws_dc_core_licenses_cost',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'S - WS Std Core Licenses Cost',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('s_ws_std_core_licenses_cost', form),
            dataIndex: 's_ws_std_core_licenses_cost',
            key: 's_ws_std_core_licenses_cost',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'S - SC DC Core Licenses',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('s_sc_dc_core_licenses', form),
            dataIndex: 's_sc_dc_core_licenses',
            key: 's_sc_dc_core_licenses',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'S - SC Std Core Licenses',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('s_sc_std_core_licenses', form),
            dataIndex: 's_sc_std_core_licenses',
            key: 's_sc_std_core_licenses',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'S - SC DC Core Licenses Cost',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('s_sc_dc_core_licenses_cost', form),
            dataIndex: 's_sc_dc_core_licenses_cost',
            key: 's_sc_dc_core_licenses_cost',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'S - SC Std Core Licenses Cost',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('s_sc_std_core_licenses_cost', form),
            dataIndex: 's_sc_std_core_licenses_cost',
            key: 's_sc_std_core_licenses_cost',
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
        title: 'SC License Id',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('sc_license_id', form),
            dataIndex: 'sc_license_id',
            key: 'sc_license_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'SC License Qty',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('sc_license_qty', form),
            dataIndex: 'sc_license_qty',
            key: 'sc_license_qty',
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
        title: 'Assigned SC License Id',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('assigned_sc_license_id', form),
            dataIndex: 'assigned_sc_license_id',
            key: 'assigned_sc_license_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Assigned SC License Qty',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('assigned_sc_license_qty', form),
            dataIndex: 'assigned_sc_license_qty',
            key: 'assigned_sc_license_qty',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'SC Server',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'sc_server',
              windowsServerLicenseDetail.search.lookups?.booleanLookup
            ),
            dataIndex: 'sc_server',
            key: 'sc_server',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'SC Agent',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'sc_agent',
              windowsServerLicenseDetail.search.lookups?.booleanLookup
            ),
            dataIndex: 'sc_agent',
            key: 'sc_agent',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
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
        reduxSelector={windowsServerLicenseDetailSelector}
        searchTableData={searchWindowsServerLicenseDetail}
        setTableColumnSelection={setTableColumnSelection}
        defaultOrderBy="windows_server_license_detail_id"
        extraSearchData={extraSearchData}
      />
    </>
  );
};

export default DetailDataTable;
