import React, { useRef, useState } from 'react';
import { IDetailDataTableProps } from './detailDataTable.model';
import _ from 'lodash';
import DataTable from '../../../../../common/components/DataTable';
import {
  FilterWithSwapOption,
  FilterByDropdown,
  FilterByDateSwap,
} from '../../../../../common/components/DataTable/DataTableFilters';
import { AlignType } from 'rc-table/lib/interface';
import windowsServerLicenseDetailService from '../../../../../services/windowsServer/windowsServerLicenseDetail/windowsServerLicenseDetail.service';
import { useAppSelector } from '../../../../../store/app.hooks';
import { searchWindowsServerLicenseDetail } from '../../../../../store/windowsServer/windowsServerLicenseDetail/windowsServerLicenseDetail.action';
import {
  setTableColumnSelection,
  windowsServerLicenseDetailSelector,
} from '../../../../../store/windowsServer/windowsServerLicenseDetail/windowsServerLicenseDetail.reducer';
import { ISearchWindowsServerLicenseDetail } from '../../../../../services/windowsServer/windowsServerLicenseDetail/windowsServerLicenseDetail.model';
import { Checkbox } from 'antd';
import { globalSearchSelector } from '../../../../../store/globalSearch/globalSearch.reducer';
import { showDateFromApi } from '../../../../../common/helperFunction';

const DetailDataTable: React.FC<IDetailDataTableProps> = (props) => {
  const { licenseId } = props;
  const windowsServerLicenseDetail = useAppSelector(windowsServerLicenseDetailSelector);
  const globalFilters = useAppSelector(globalSearchSelector);
  const dataTableRef = useRef(null);
  const [ObjectForColumnFilter, setObjectForColumnFilter] = useState({});

  const extraSearchData = {
    windows_server_license_id: licenseId,
  };

  const exportExcelFile = (searchData: ISearchWindowsServerLicenseDetail) => {
    return windowsServerLicenseDetailService.exportExcelFile(searchData);
  };

  const getColumnLookup = (data: {}) => {
    return windowsServerLicenseDetailService
      .getLicenseDetailColumnLookup(licenseId, data)
      .then((res) => {
        return res.body.data;
      });
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(
      dataIndex,
      windowsServerLicenseDetail.search.tableName,
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
        title: <span className="dragHandler">Windows Server Id</span>,
        column: 'WindowsServerId',
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
        title: <span className="dragHandler">Date Added</span>,
        column: 'Date Added',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDateSwapTable(
              'date_added',
              windowsServerLicenseDetail.search.tableName,
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
        title: <span className="dragHandler">HA Enabled</span>,
        column: 'HA enabled',
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
        title: <span className="dragHandler">Tenant Name</span>,
        column: 'TenantId',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'tenant_id',
              windowsServerLicenseDetail.search.lookups?.tenants?.length > 0
                ? windowsServerLicenseDetail.search.lookups?.tenants
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
              windowsServerLicenseDetail.search.lookups?.companies?.length > 0
                ? windowsServerLicenseDetail.search.lookups?.companies
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
              windowsServerLicenseDetail.search.lookups?.bus?.length > 0
                ? windowsServerLicenseDetail.search.lookups?.bus
                : globalFilters?.globalBULookup?.data
            ),
            dataIndex: 'bu_name',
            key: 'bu_name',
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
        title: <span className="dragHandler">SC Version</span>,
        column: 'SC Version',
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
        title: <span className="dragHandler">DRS Enabled</span>,
        column: 'DRS enabled',
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
        title: <span className="dragHandler">Operating System</span>,
        column: 'OperatingSystem',
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
        title: <span className="dragHandler">vCPU</span>,
        column: 'vCPU',
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
        title: <span className="dragHandler">Azure Hosted</span>,
        column: 'Azure Hosted',
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
        title: <span className="dragHandler">Exempt</span>,
        column: 'Exempt',
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
        title: <span className="dragHandler">SC Exempt</span>,
        column: 'SC Exempt',
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
        title: <span className="dragHandler">Default to Datacenter on Hosts</span>,
        column: 'Opt_DefaultToEnterpriseOnHosts',
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
              windowsServerLicenseDetail.search.lookups?.booleanLookup
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
              windowsServerLicenseDetail.search.lookups?.booleanLookup
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
        title: <span className="dragHandler">SC Notes</span>,
        column: 'SC Notes',
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
        title: <span className="dragHandler">Orphaned VM</span>,
        column: 'Orphaned VM',
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
              windowsServerLicenseDetail.search.lookups?.booleanLookup
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
        title: <span className="dragHandler">SC Licensable</span>,
        column: 'SC Licensable',
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
        title: <span className="dragHandler">OS Version Id</span>,
        column: 'OSVersionId',
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
        title: <span className="dragHandler">OS Edition Id</span>,
        column: 'OSEditionId',
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
        title: <span className="dragHandler">SC Version Id</span>,
        column: 'SCVersionId',
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
        title: <span className="dragHandler">Max OS Version Id</span>,
        column: 'MaxOSVersionId',
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
        title: <span className="dragHandler">Max OS Edition Id</span>,
        column: 'MaxOSEditionid',
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
        title: <span className="dragHandler">Max SC Version Id</span>,
        column: 'MaxSCVersionId',
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
        title: <span className="dragHandler">Host - Num of VMs</span>,
        column: 'Host - Num of VMs',
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
        title: <span className="dragHandler">Host - Num of VMs Licensable</span>,
        column: 'Host - Num of VMs Licensable',
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
        title: <span className="dragHandler">Host - Num VMs with WS DC</span>,
        column: 'Host - Num VMs with WS DC',
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
        title: <span className="dragHandler">Host - SC Num of VMs Licensable</span>,
        column: 'Host - SC Num of VMs Licensable',
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
        title: <span className="dragHandler">Cluster - Num of VMs</span>,
        column: 'Cluster - Num of VMs',
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
        title: <span className="dragHandler">Cluster - Num of VMs Licensable</span>,
        column: 'Cluster - Num of VMs Licensable',
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
        title: <span className="dragHandler">Cluster - Num VMs with WS DC</span>,
        column: 'Cluster - Num VMs with WS DC',
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
        title: <span className="dragHandler">Cluster - SC Num of VMs Licensable</span>,
        column: 'Cluster - SC Num of VMs Licensable',
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
        title: <span className="dragHandler">WS Effective Processors</span>,
        column: 'WSEffectiveProcessors',
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
        title: <span className="dragHandler">WS Effective Cores</span>,
        column: 'WSEffectiveCores',
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
        title: <span className="dragHandler">WS License Multiplier</span>,
        column: 'WSLicenseMultiplier',
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
        title: <span className="dragHandler">WS License Type</span>,
        column: 'WS License Type',
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
        title: <span className="dragHandler">WS License Count</span>,
        column: 'WSLicenseCount',
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
        title: <span className="dragHandler">WS License Cost</span>,
        column: 'WSLicenseCost',
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
        title: <span className="dragHandler">SC License Multiplier</span>,
        column: 'SCLicenseMultiplier',
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
        title: <span className="dragHandler">SC License Type</span>,
        column: 'SCLicenseType',
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
        title: <span className="dragHandler">SC License Count</span>,
        column: 'SCLicenseCount',
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
        title: <span className="dragHandler">SC License Cost</span>,
        column: 'SCLicenseCost',
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
        title: <span className="dragHandler">S - WS DC Core Licenses</span>,
        column: 'S - WS DC Core Licenses',
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
        title: <span className="dragHandler">S - WS Std Core Licenses</span>,
        column: 'S - WS Std Core Licenses',
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
        title: <span className="dragHandler">S - WS DC Core Licenses Cost</span>,
        column: 'S - WS DC Core Licenses',
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
        title: <span className="dragHandler">S - WS Std Core Licenses Cost</span>,
        column: 'S - WS Std Core Licenses Cost',
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
        title: <span className="dragHandler">S - SC DC Core Licenses</span>,
        column: 'S - SC DC Core Licenses',
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
        title: <span className="dragHandler">S - SC Std Core Licenses</span>,
        column: 'S - SC Std Core Licenses',
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
        title: <span className="dragHandler">S - SC DC Core Licenses Cost</span>,
        column: 'S - SC DC Core Licenses Cost',
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
        title: <span className="dragHandler">S - SC Std Core Licenses Cost</span>,
        column: 'S - SC Std Core Licenses Cost',
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
        title: <span className="dragHandler">License Id</span>,
        column: 'LicenseId',
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
        column: 'LicenseQty',
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
        title: <span className="dragHandler">SC License Id</span>,
        column: 'SCLicenseId',
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
        title: <span className="dragHandler">SC License Qty</span>,
        column: 'SCLicenseQty',
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
        title: <span className="dragHandler">Assigned License Id</span>,
        column: 'AssignedLicenseId',
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
        column: 'AssignedLicenseQty',
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
        title: <span className="dragHandler">Assigned SC License Id</span>,
        column: 'AssignedSCLicenseId',
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
        title: <span className="dragHandler">Assigned SC License Qty</span>,
        column: 'AssignedSCLicenseQty',
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
        title: <span className="dragHandler">SC Server</span>,
        column: 'SCServer',
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
        title: <span className="dragHandler">SC Agent</span>,
        column: 'SCAgent',
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
    ];
  };

  return (
    <>
      <DataTable
        ref={dataTableRef}
        showAddButton={false}
        globalSearchExist={true}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={windowsServerLicenseDetailSelector}
        searchTableData={searchWindowsServerLicenseDetail}
        setTableColumnSelection={setTableColumnSelection}
        defaultOrderBy="windows_server_license_detail_id"
        extraSearchData={extraSearchData}
        setObjectForColumnFilter={setObjectForColumnFilter}
      />
    </>
  );
};

export default DetailDataTable;
