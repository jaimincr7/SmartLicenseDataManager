import { Table, Form, Button, Checkbox, Popover } from 'antd';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import moment from 'moment';
import _ from 'lodash';
import { FileExcelOutlined } from '@ant-design/icons';
import { IDetailDataTableProps } from './detailDataTable.model';
import { fixedColumn, IInlineSearch, orderByType } from '../../../../../common/models/common';
import { useAppSelector, useAppDispatch } from '../../../../../store/app.hooks';
import { ISearchSqlServerLicenseDetail } from '../../../../../services/sqlServer/sqlServerLicenseDetail/sqlServerLicenseDetail.model';
import {
  Filter,
  FilterByDate,
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../../common/components/DataTable/DataTableFilters';
import { Common, DEFAULT_PAGE_SIZE, exportExcel } from '../../../../../common/constants/common';
import sqlServerLicenseDetailService from '../../../../../services/sqlServer/sqlServerLicenseDetail/sqlServerLicenseDetail.service';
import { sqlServerLicenseDetailSelector } from '../../../../../store/sqlServer/sqlServerLicenseDetail/sqlServerLicenseDetail.reducer';
import { searchSqlServerLicenseDetail } from '../../../../../store/sqlServer/sqlServerLicenseDetail/sqlServerLicenseDetail.action';

let tableFilter = {
  keyword: '',
  order_by: 'sql_server_license_detail_id',
  order_direction: 'DESC' as orderByType,
  filter_keys: {},
};

const DetailDataTable: React.FC<IDetailDataTableProps> = (props) => {
  const { licenseId } = props;

  const licenseDetail = useAppSelector(sqlServerLicenseDetailSelector);
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const [tableColumn, setTableColumn] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const [inlineSearch, setInlineSearch] = useState<IInlineSearch>({});

  const getSearchData = (page, isExportToExcel: boolean) => {
    const { filter_keys, ...rest } = tableFilter;

    if (!page) {
      page = pagination;
    }

    const inlineSearchFilter = _.pickBy(filter_keys, function (value) {
      return !(
        value === undefined ||
        value === '' ||
        _.isNull(value) ||
        (Array.isArray(value) && value.length === 0)
      );
    });
    setInlineSearch(inlineSearchFilter);

    const searchData: ISearchSqlServerLicenseDetail = {
      limit: page.pageSize,
      offset: (page.current - 1) * page.pageSize,
      ...(rest || {}),
      filter_keys: inlineSearchFilter,
      is_export_to_excel: isExportToExcel,
      sql_server_license_id: licenseId,
    };
    return searchData;
  };

  const fetchSqlServerLicense = (page = null) => {
    const searchData = getSearchData(page, false);
    dispatch(searchSqlServerLicenseDetail(searchData));
  };

  // Start: Pagination ans Sorting
  const handleTableChange = (paginating, filters, sorter) => {
    tableFilter = {
      ...tableFilter,
      order_by:
        sorter.field || sorter.column?.children[0]?.dataIndex || 'sql_server_license_detail_id',
      order_direction: (sorter.order === 'ascend' ? 'ASC' : 'DESC') as orderByType,
    };
    setPagination(paginating);
    fetchSqlServerLicense(paginating);
  };

  // Keyword search
  const onFinishSearch = (value: string) => {
    tableFilter = {
      ...tableFilter,
      keyword: value,
    };
    setPagination({ ...pagination, current: 1 });
    fetchSqlServerLicense({ ...pagination, current: 1 });
  };

  // Start: Column level filter
  const onFinish = (values: IInlineSearch) => {
    tableFilter.filter_keys = values;
    setPagination({ ...pagination, current: 1 });
    fetchSqlServerLicense({ ...pagination, current: 1 });
  };
  const onReset = () => {
    onFinish({});
  };
  React.useEffect(() => {
    form.resetFields();
  }, [inlineSearch]);

  React.useEffect(() => {
    fetchSqlServerLicense();
  }, [licenseId]);

  const FilterBySwap = (dataIndex: string) => {
    return FilterWithSwapOption(dataIndex, licenseDetail.search.tableName, form, licenseId);
  };
  // End: Column level filter

  // Export Excel
  const downloadExcel = () => {
    setLoading(true);
    const searchData = getSearchData(pagination, true);

    return sqlServerLicenseDetailService.exportExcelFile(searchData).then((res) => {
      if (!res) {
        toast.error('Document not available.');
        return;
      } else {
        const fileName = `${moment().format('yyyyMMDDHHmmss')}.xlsx`; //res.headers["content-disposition"];
        const url = window.URL.createObjectURL(new Blob([res.data]));
        exportExcel(fileName, url);
        setLoading(false);
      }
    });
  };

  // Table columns
  const columns = [
    {
      title: 'Sql Server Id',
      sorter: true,
      ellipsis: true,
      children: [
        {
          title: FilterBySwap('sql_server_id'),
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
          title: FilterBySwap('source'),
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
          title: FilterBySwap('data_center'),
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
          title: FilterBySwap('cluster'),
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
          title: FilterByDropdown('ha_enabled', licenseDetail.search.lookups?.booleanLookup),
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
          title: FilterBySwap('host'),
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
          title: FilterBySwap('procs'),
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
          title: FilterBySwap('cores'),
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
          title: FilterBySwap('device_name'),
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
          title: FilterBySwap('device_type'),
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
          title: FilterBySwap('sql_cluster'),
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
          title: FilterBySwap('product_family'),
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
          title: FilterBySwap('version'),
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
          title: FilterBySwap('edition'),
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
          title: FilterBySwap('device_state'),
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
          title: FilterBySwap('software_state'),
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
          title: FilterBySwap('os_type'),
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
          title: FilterBySwap('raw_software_title'),
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
          title: FilterBySwap('fqdn'),
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
          title: FilterBySwap('service'),
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
          title: FilterBySwap('cost_code'),
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
          title: FilterBySwap('line_of_business'),
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
          title: FilterBySwap('market'),
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
          title: FilterBySwap('application'),
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
          title: FilterBySwap('serial_number'),
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
          title: FilterBySwap('sql_cluster_node_type'),
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
          title: FilterBySwap('vCPU'),
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
          title: FilterByDropdown('azure_hosted', licenseDetail.search.lookups?.booleanLookup),
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
          title: FilterBySwap('name'),
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
          title: FilterBySwap('opt_agreement_type'),
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
            licenseDetail.search.lookups?.booleanLookup
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
          title: FilterByDropdown('opt_cluster_logic', licenseDetail.search.lookups?.booleanLookup),
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
          title: FilterByDropdown('opt_entitlements', licenseDetail.search.lookups?.booleanLookup),
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
            licenseDetail.search.lookups?.booleanLookup
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
          title: FilterBySwap('notes'),
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
          title: FilterByDropdown('orphaned_vm', licenseDetail.search.lookups?.booleanLookup),
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
          title: FilterByDropdown('licensable', licenseDetail.search.lookups?.booleanLookup),
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
          title: FilterBySwap('service_id'),
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
          title: FilterBySwap('version_id'),
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
          title: FilterBySwap('edition_id'),
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
          title: FilterBySwap('host_max_version_id'),
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
          title: FilterBySwap('host_max_edition_id'),
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
          title: FilterBySwap('cluster_max_version_id'),
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
          title: FilterBySwap('cluster_max_edition_id'),
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
          title: FilterBySwap('cluster_seq_num'),
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
          title: FilterBySwap('host_seq_num'),
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
          title: FilterBySwap('device_seq_num'),
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
          title: FilterBySwap('effective_processors'),
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
          title: FilterBySwap('effective_cores'),
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
          title: FilterBySwap('effective_vcpu'),
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
          title: FilterBySwap('effective_vcpu_for_proc_licenses'),
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
          title: FilterBySwap('core_density'),
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
          title: FilterBySwap('excluded'),
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
          title: FilterBySwap('licensable_cluster_seq_num'),
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
          title: FilterBySwap('licensable_host_seq_num'),
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
          title: FilterBySwap('licensable_device_seq_num'),
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
          title: FilterBySwap('licensed_at'),
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
          title: FilterBySwap('license_type'),
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
          title: FilterBySwap('license_count'),
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
          title: FilterBySwap('license_cost'),
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
          title: FilterBySwap('s_license_type_device'),
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
          title: FilterBySwap('s_license_count_device'),
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
          title: FilterBySwap('s_license_cost_device'),
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
          title: FilterBySwap('s_license_cost_host_device_licensed'),
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
          title: FilterBySwap('s_license_type_host'),
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
          title: FilterBySwap('s_license_count_host'),
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
          title: FilterBySwap('s_license_cost_host'),
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
          title: FilterBySwap('comment'),
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
          title: FilterBySwap('license_id'),
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
          title: FilterBySwap('license_qty'),
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
          title: FilterBySwap('assigned_license_id'),
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
          title: FilterBySwap('assigned_license_qty'),
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
          title: FilterBySwap('requires_server_mobility'),
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
          title: FilterBySwap('license_requires_sa'),
          dataIndex: 'license_requires_sa',
          key: 'license_requires_sa',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'Action',
      children: [
        {
          title: (
            <div className="btns-block">
              <Button
                htmlType="submit"
                className={`action-btn filter-btn p-0 ${
                  _.every(inlineSearch, _.isEmpty) ? '' : 'active'
                }`}
              >
                <img src={`${process.env.PUBLIC_URL}/assets/images/ic-filter.svg`} alt="" />
                <img
                  src={`${process.env.PUBLIC_URL}/assets/images/ic-filter-white.svg`}
                  className="ovarlap"
                  alt=""
                />
              </Button>
              <Button htmlType="button" onClick={onReset} className="action-btn filter-btn p-0">
                <img src={`${process.env.PUBLIC_URL}/assets/images/ic-clean.svg`} alt="" />
                <img
                  src={`${process.env.PUBLIC_URL}/assets/images/ic-clean-white.svg`}
                  className="ovarlap"
                  alt=""
                />
              </Button>
            </div>
          ),
          key: 'Action',
          width: '80px',
          fixed: 'right' as fixedColumn,
          // render: (_, data: ISqlServerLicense) => (
          //     <div className="btns-block">
          //         <a
          //             title=""
          //             className="action-btn"
          //             onClick={() => {
          //                 setSelectedId(data.id);
          //                 history.push(`/sql-server/license/edit/${data.id}`);
          //             }}
          //         >
          //             View
          //             {/* <img src={`${process.env.PUBLIC_URL}/assets/images/ic-delete.svg`} alt="" /> */}
          //         </a>
          //         <a
          //             className="action-btn"
          //             onClick={() => {
          //                 setSelectedId(data.id);
          //                 history.push(`/sql-server/license/${data.id}`);
          //             }}
          //         >
          //             <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
          //         </a>
          //         <Popconfirm title="Sure to delete?" onConfirm={() => removeSqlServerLicense(data.id)}>
          //             <a href="#" title="" className="action-btn">
          //                 <img src={`${process.env.PUBLIC_URL}/assets/images/ic-delete.svg`} alt="" />
          //             </a>
          //         </Popconfirm>
          //     </div>
          // ),
        },
      ],
    },
  ];

  // Start: Hide-show columns
  const hideShowColumn = (e, title) => {
    if (e.target.checked) {
      setTableColumn({ ...tableColumn, [title]: true });
    } else {
      setTableColumn({ ...tableColumn, [title]: false });
    }
  };
  const dropdownMenu = (
    <ul className="checkbox-list">
      {columns.map((col) => (
        <li key={col.title}>
          <Checkbox
            checked={tableColumn[col.title] !== false}
            onClick={(e) => hideShowColumn(e, col.title)}
          >
            {col.title}
          </Checkbox>
        </li>
      ))}
    </ul>
  );
  const getColumns = () => {
    return columns.filter((col) => {
      return tableColumn[col.title] !== false;
    });
  };
  // End: Hide-show columns

  return (
    <>
      <div className="title-block search-block">
        <Filter onSearch={onFinishSearch} />
        <div className="btns-block">
          <Button onClick={downloadExcel} icon={<FileExcelOutlined />} loading={loading}>
            Export
          </Button>
          <Popover content={dropdownMenu} trigger="click" overlayClassName="custom-popover">
            <Button
              icon={
                <em className="anticon">
                  <img src={`${process.env.PUBLIC_URL}/assets/images/ic-lines.svg`} alt="" />
                </em>
              }
            >
              Show/Hide Columns
            </Button>
          </Popover>
        </div>
      </div>
      <Form form={form} initialValues={inlineSearch} name="searchTable" onFinish={onFinish}>
        <Table
          scroll={{ x: true }}
          rowKey={(record) => record.sql_server_license_detail_id}
          dataSource={licenseDetail.search.data}
          columns={getColumns()}
          loading={licenseDetail.search.loading}
          pagination={{
            ...pagination,
            total: licenseDetail.search.count,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
          onChange={handleTableChange}
          className="custom-table"
          sortDirections={['ascend', 'descend']}
        />
      </Form>
    </>
  );
};

export default DetailDataTable;
