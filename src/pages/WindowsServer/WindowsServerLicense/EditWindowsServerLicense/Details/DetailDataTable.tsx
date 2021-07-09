import { Table, Form, Button, Checkbox, Popover } from 'antd';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import moment from 'moment';
import _ from 'lodash';
import { FileExcelOutlined } from '@ant-design/icons';
import { IDetailDataTableProps } from './detailDataTable.model';
import { fixedColumn, IInlineSearch, orderByType } from '../../../../../common/models/common';
import { useAppSelector, useAppDispatch } from '../../../../../store/app.hooks';
import { ISearchWindowsServerLicenseDetail } from '../../../../../services/windowsServer/windowsServerLicenseDetail/windowsServerLicenseDetail.model';
import {
  Filter,
  FilterByDate,
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../../common/components/DataTable/DataTableFilters';
import { Common, DEFAULT_PAGE_SIZE, exportExcel } from '../../../../../common/constants/common';
import windowsServerLicenseDetailService from '../../../../../services/windowsServer/windowsServerLicenseDetail/windowsServerLicenseDetail.service';
import { windowsServerLicenseDetailSelector } from '../../../../../store/windowsServer/windowsServerLicenseDetail/windowsServerLicenseDetail.reducer';
import { searchWindowsServerLicenseDetail } from '../../../../../store/windowsServer/windowsServerLicenseDetail/windowsServerLicenseDetail.action';

let tableFilter = {
  keyword: '',
  order_by: 'windows_server_license_detail_id',
  order_direction: 'DESC' as orderByType,
  filter_keys: {},
};

const DetailDataTable: React.FC<IDetailDataTableProps> = (props) => {
  const { licenseId } = props;

  const licenseDetail = useAppSelector(windowsServerLicenseDetailSelector);
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

    const searchData: ISearchWindowsServerLicenseDetail = {
      limit: page.pageSize,
      offset: (page.current - 1) * page.pageSize,
      ...(rest || {}),
      filter_keys: inlineSearchFilter,
      is_export_to_excel: isExportToExcel,
      windows_server_license_id: licenseId,
    };
    return searchData;
  };

  const fetchWindowsServerLicenseDetail = (page = null) => {
    const searchData = getSearchData(page, false);
    dispatch(searchWindowsServerLicenseDetail(searchData));
  };

  // Start: Pagination ans Sorting
  const handleTableChange = (paginating, filters, sorter) => {
    tableFilter = {
      ...tableFilter,
      order_by:
        sorter.field || sorter.column?.children[0]?.dataIndex || 'windows_server_license_detail_id',
      order_direction: (sorter.order === 'ascend' ? 'ASC' : 'DESC') as orderByType,
    };
    setPagination(paginating);
    fetchWindowsServerLicenseDetail(paginating);
  };

  // Keyword search
  const onFinishSearch = (value: string) => {
    tableFilter = {
      ...tableFilter,
      keyword: value,
    };
    setPagination({ ...pagination, current: 1 });
    fetchWindowsServerLicenseDetail({ ...pagination, current: 1 });
  };

  // Start: Column level filter
  const onFinish = (values: IInlineSearch) => {
    tableFilter.filter_keys = values;
    setPagination({ ...pagination, current: 1 });
    fetchWindowsServerLicenseDetail({ ...pagination, current: 1 });
  };
  const onReset = () => {
    onFinish({});
  };
  React.useEffect(() => {
    form.resetFields();
  }, [inlineSearch]);

  React.useEffect(() => {
    fetchWindowsServerLicenseDetail();
  }, [licenseId]);

  // const getLicenseColumnLookup = async (column: string) => {
  //   const response = await windowsServerLicenseDetailService.getLicenseDetailColumnLookup(licenseId, column).then((res) => {
  //     return res.body;
  //   });
  //   console.log(response.data)
  //   return response.data;
  // };

  const FilterBySwap = (dataIndex: string) => {
    // getLicenseColumnLookup(dataIndex);
    return FilterWithSwapOption(dataIndex, licenseDetail.search.tableName, form, licenseId);
  };
  // End: Column level filter

  // Export Excel
  const downloadExcel = () => {
    setLoading(true);
    const searchData = getSearchData(pagination, true);

    return windowsServerLicenseDetailService.exportExcelFile(searchData).then((res) => {
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
      title: 'Windows Server Id',
      sorter: true,
      ellipsis: true,
      children: [
        {
          title: FilterBySwap('windows_server_id'),
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
      title: 'SC Version',
      sorter: true,
      ellipsis: true,
      children: [
        {
          title: FilterBySwap('sc_version'),
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
      title: 'DRS Enabled',
      sorter: true,
      children: [
        {
          title: FilterByDropdown('drs_enabled', licenseDetail.search.lookups?.booleanLookup),
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
          title: FilterBySwap('fqdn'),
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
          title: FilterBySwap('operating_system'),
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
      title: 'Exempt',
      sorter: true,
      ellipsis: true,
      children: [
        {
          title: FilterByDropdown('exempt', licenseDetail.search.lookups?.booleanLookup),
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
          title: FilterByDropdown('sc_exempt', licenseDetail.search.lookups?.booleanLookup),
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
          title: FilterBySwap('name'),
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
            licenseDetail.search.lookups?.booleanLookup
          ),
          dataIndex: 'opt_default_to_data_center_on_hosts',
          key: 'opt_default_to_data_center_on_hosts',
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
      title: 'SC Notes',
      sorter: true,
      ellipsis: true,
      children: [
        {
          title: FilterBySwap('sc_notes'),
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
      title: 'SC Licensable',
      sorter: true,
      ellipsis: true,
      children: [
        {
          title: FilterByDropdown('sc_licensable', licenseDetail.search.lookups?.booleanLookup),
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
          title: FilterBySwap('os_version_id'),
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
          title: FilterBySwap('os_edition_id'),
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
          title: FilterBySwap('sc_version_id'),
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
          title: FilterBySwap('max_os_version_id'),
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
          title: FilterBySwap('max_os_edition_id'),
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
          title: FilterBySwap('max_sc_version_id'),
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
      title: 'Host - Num of VMs',
      sorter: true,
      ellipsis: true,
      children: [
        {
          title: FilterBySwap('host_num_of_vms'),
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
          title: FilterBySwap('host_num_of_vms_licensable'),
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
          title: FilterBySwap('host_num_vms_with_ws_dc'),
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
          title: FilterBySwap('host_sc_num_of_vms_licensable'),
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
          title: FilterBySwap('cluster_num_of_vms'),
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
          title: FilterBySwap('cluster_num_of_vms_licensable'),
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
          title: FilterBySwap('cluster_num_vms_with_ws_dc'),
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
          title: FilterBySwap('cluster_sc_num_of_vms_licensable'),
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
          title: FilterBySwap('ws_effective_processors'),
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
          title: FilterBySwap('ws_effective_cores'),
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
          title: FilterBySwap('ws_license_multiplier'),
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
          title: FilterBySwap('ws_license_type'),
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
          title: FilterBySwap('ws_license_count'),
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
          title: FilterBySwap('ws_license_cost'),
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
          title: FilterBySwap('sc_license_multiplier'),
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
          title: FilterBySwap('sc_license_type'),
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
          title: FilterBySwap('sc_license_count'),
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
          title: FilterBySwap('sc_license_cost'),
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
          title: FilterBySwap('s_ws_dc_core_licenses'),
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
          title: FilterBySwap('s_ws_std_core_licenses'),
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
          title: FilterBySwap('s_ws_dc_core_licenses_cost'),
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
          title: FilterBySwap('s_ws_std_core_licenses_cost'),
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
          title: FilterBySwap('s_sc_dc_core_licenses'),
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
          title: FilterBySwap('s_sc_std_core_licenses'),
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
          title: FilterBySwap('s_sc_dc_core_licenses_cost'),
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
          title: FilterBySwap('s_sc_std_core_licenses_cost'),
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
      title: 'SC License Id',
      sorter: true,
      ellipsis: true,
      children: [
        {
          title: FilterBySwap('sc_license_id'),
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
          title: FilterBySwap('sc_license_qty'),
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
      title: 'Assigned SC License Id',
      sorter: true,
      ellipsis: true,
      children: [
        {
          title: FilterBySwap('assigned_sc_license_id'),
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
          title: FilterBySwap('assigned_sc_license_qty'),
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
          title: FilterByDropdown('sc_server', licenseDetail.search.lookups?.booleanLookup),
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
          title: FilterByDropdown('sc_agent', licenseDetail.search.lookups?.booleanLookup),
          dataIndex: 'sc_agent',
          key: 'sc_agent',
          ellipsis: true,
          render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
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
          rowKey={(record) => record.windows_server_license_detail_id}
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
