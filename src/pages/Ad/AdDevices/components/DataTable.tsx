import { Table, Popconfirm, Form, Button, Checkbox, Popover } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import { toast } from 'react-toastify';
import { IDataTable } from './dataTable.model';
import moment from 'moment';
import { Common, DEFAULT_PAGE_SIZE, exportExcel } from '../../../../common/constants/common';
import _ from 'lodash';
import {
  Filter,
  FilterByDate,
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { fixedColumn, IInlineSearch, orderByType } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import { commonSelector } from '../../../../store/common/common.reducer';
import { FileExcelOutlined } from '@ant-design/icons';
import {
  adDevicesSelector,
  clearAdDeviceMessages,
} from '../../../../store/ad/adDevices/adDevices.reducer';
import { IAdDevices, ISearchAdDevices } from '../../../../services/ad/adDevices/adDevices.model';
import { deleteAdDevice, searchAdDevices } from '../../../../store/ad/adDevices/adDevices.action';
import adDevicesService from '../../../../services/ad/adDevices/adDevices.service';

let pageLoaded = false;

let tableFilter = {
  keyword: '',
  order_by: 'id',
  order_direction: 'DESC' as orderByType,
  filter_keys: {},
};

const DataTable: React.ForwardRefRenderFunction<unknown, IDataTable> = (props, ref) => {
  const { setSelectedId } = props;

  const adDevices = useAppSelector(adDevicesSelector);
  const commonFilters = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const history = useHistory();
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

    const searchData: ISearchAdDevices = {
      is_lookup: !pageLoaded,
      limit: page.pageSize,
      offset: (page.current - 1) * page.pageSize,
      ...(rest || {}),
      filter_keys: inlineSearchFilter,
      is_export_to_excel: isExportToExcel,
    };
    pageLoaded = true;
    return searchData;
  };

  const fetchAdDevices = (page = null) => {
    const searchData = getSearchData(page, false);
    dispatch(searchAdDevices(searchData));
  };
  useImperativeHandle(ref, () => ({
    refreshData() {
      fetchAdDevices();
    },
  }));
  React.useEffect(() => {
    return () => {
      pageLoaded = false;
    };
  }, []);

  // Start: Global Search
  React.useEffect(() => {
    const globalSearch: IInlineSearch = {};
    for (const key in commonFilters.search) {
      const element = commonFilters.search[key];
      if (element) {
        globalSearch[key] = [element];
      }
    }
    tableFilter.filter_keys = { ...tableFilter.filter_keys, ...globalSearch };
    setPagination({ ...pagination, current: 1 });
    fetchAdDevices({ ...pagination, current: 1 });
  }, [commonFilters.search]);
  // End: Global Search

  // Start: Pagination ans Sorting
  const handleTableChange = (paginating, filters, sorter) => {
    tableFilter = {
      ...tableFilter,
      order_by: sorter.field || sorter.column?.children[0]?.dataIndex || 'id',
      order_direction: (sorter.order === 'ascend' ? 'ASC' : 'DESC') as orderByType,
    };
    setPagination(paginating);
    fetchAdDevices(paginating);
  };

  // Start: Delete action
  const removeAdDevice = (id: number) => {
    dispatch(deleteAdDevice(id));
  };
  React.useEffect(() => {
    if (adDevices.delete.messages.length > 0) {
      if (adDevices.delete.hasErrors) {
        toast.error(adDevices.delete.messages.join(' '));
      } else {
        toast.success(adDevices.delete.messages.join(' '));
        fetchAdDevices();
      }
      dispatch(clearAdDeviceMessages());
    }
  }, [adDevices.delete.messages]);
  // End: Delete action

  // Keyword search
  const onFinishSearch = (value: string) => {
    tableFilter = {
      ...tableFilter,
      keyword: value,
    };
    setPagination({ ...pagination, current: 1 });
    fetchAdDevices({ ...pagination, current: 1 });
  };

  // Start: Column level filter
  const onFinish = (values: IInlineSearch) => {
    tableFilter.filter_keys = values;
    setPagination({ ...pagination, current: 1 });
    fetchAdDevices({ ...pagination, current: 1 });
  };
  const onReset = () => {
    onFinish({});
  };
  React.useEffect(() => {
    form.resetFields();
  }, [inlineSearch]);

  const FilterBySwap = (dataIndex: string) => {
    return FilterWithSwapOption(dataIndex, adDevices.search.tableName, form);
  };
  // End: Column level filter

  // Export Excel
  const downloadExcel = () => {
    setLoading(true);
    const searchData = getSearchData(pagination, true);

    return adDevicesService.exportExcelFile(searchData).then((res) => {
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
      title: 'Name',
      sorter: true,
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
      title: 'Device Type',
      sorter: true,
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
      title: 'Tenant Name',
      sorter: true,
      children: [
        {
          title: FilterByDropdown('tenant_id', adDevices.search.lookups?.tenants),
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
          title: FilterByDropdown('company_id', adDevices.search.lookups?.companies),
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
          title: FilterByDropdown('bu_id', adDevices.search.lookups?.bus),
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
      title: 'Enabled',
      sorter: true,
      children: [
        {
          title: FilterByDropdown('enabled', adDevices.search.lookups?.booleanLookup),
          dataIndex: 'enabled',
          key: 'enabled',
          ellipsis: true,
          render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
        },
      ],
    },
    {
      title: 'iPv4 Address',
      sorter: true,
      children: [
        {
          title: FilterBySwap('iPv4_address'),
          dataIndex: 'iPv4_address',
          key: 'iPv4_address',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'Last Logon',
      sorter: true,
      children: [
        {
          title: FilterBySwap('last_logon'),
          dataIndex: 'last_logon',
          key: 'last_logon',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'Last Logon Date',
      sorter: true,
      children: [
        {
          title: FilterByDate('last_logon_date'),
          dataIndex: 'last_logon_date',
          key: 'last_logon_date',
          ellipsis: true,
          render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
        },
      ],
    },
    {
      title: 'Last Logon Timestamp',
      sorter: true,
      children: [
        {
          title: FilterBySwap('last_logon_timestamp'),
          dataIndex: 'last_logon_timestamp',
          key: 'last_logon_timestamp',
          ellipsis: true,
        },
      ],
    },

    {
      title: 'Object Class',
      sorter: true,
      children: [
        {
          title: FilterBySwap('object_class'),
          dataIndex: 'object_class',
          key: 'object_class',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'Object Guid',
      sorter: true,
      children: [
        {
          title: FilterBySwap('object_guid'),
          dataIndex: 'object_guid',
          key: 'object_guid',
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
      title: 'Password Expired',
      sorter: true,
      children: [
        {
          title: FilterByDropdown('password_expired', adDevices.search.lookups?.booleanLookup),
          dataIndex: 'password_expired',
          key: 'password_expired',
          ellipsis: true,
          render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
        },
      ],
    },
    {
      title: 'Source',
      sorter: true,
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
      title: 'Password Last Set',
      sorter: true,
      children: [
        {
          title: FilterByDate('password_last_set'),
          dataIndex: 'password_last_set',
          key: 'password_last_set',
          ellipsis: true,
          render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
        },
      ],
    },
    {
      title: 'Password Never Expires',
      sorter: true,
      ellipsis: true,
      children: [
        {
          title: FilterByDropdown(
            'password_never_expires',
            adDevices.search.lookups?.booleanLookup
          ),
          dataIndex: 'password_never_expires',
          key: 'password_never_expires',
          ellipsis: true,
          render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
        },
      ],
    },
    {
      title: 'Sam Account Name',
      sorter: true,
      children: [
        {
          title: FilterBySwap('sam_account_name'),
          dataIndex: 'sam_account_name',
          key: 'sam_account_name',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'SId',
      sorter: true,
      children: [
        {
          title: FilterBySwap('sid'),
          dataIndex: 'sid',
          key: 'sid',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'User Principal Name',
      sorter: true,
      children: [
        {
          title: FilterBySwap('user_principal_name'),
          dataIndex: 'user_principal_name',
          key: 'user_principal_name',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'When Created',
      sorter: true,
      children: [
        {
          title: FilterByDate('when_created'),
          dataIndex: 'when_created',
          key: 'when_created',
          ellipsis: true,
          render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
        },
      ],
    },
    {
      title: 'Exclusion',
      sorter: true,
      children: [
        {
          title: FilterBySwap('exclusion'), //FilterByDropdown('exclusion_id', adDevices.search.lookups?.exclusion),
          dataIndex: 'exclusion',
          key: 'exclusion',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'Distinguished Name',
      sorter: true,
      children: [
        {
          title: FilterBySwap('distinguished_name'),
          dataIndex: 'distinguished_name',
          key: 'distinguished_name',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'DNS Host Name',
      sorter: true,
      children: [
        {
          title: FilterBySwap('dns_host_name'),
          dataIndex: 'dns_host_name',
          key: 'dns_host_name',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'Inventoried',
      sorter: true,
      children: [
        {
          title: FilterByDropdown('inventoried', adDevices.search.lookups?.booleanLookup),
          dataIndex: 'inventoried',
          key: 'inventoried',
          ellipsis: true,
          render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
        },
      ],
    },
    {
      title: 'Active',
      sorter: true,
      children: [
        {
          title: FilterByDropdown('active', adDevices.search.lookups?.booleanLookup),
          dataIndex: 'active',
          key: 'active',
          ellipsis: true,
          render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
        },
      ],
    },
    {
      title: 'Qualified',
      sorter: true,
      children: [
        {
          title: FilterByDropdown('qualified', adDevices.search.lookups?.booleanLookup),
          dataIndex: 'qualified',
          key: 'qualified',
          ellipsis: true,
          render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
        },
      ],
    },
    {
      title: 'Domain',
      sorter: true,
      children: [
        {
          title: FilterBySwap('domain'),
          dataIndex: 'domain',
          key: 'domain',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'Description',
      sorter: true,
      children: [
        {
          title: FilterBySwap('description'),
          dataIndex: 'description',
          key: 'description',
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
          render: (_, data: IAdDevices) => (
            <div className="btns-block">
              <a
                className="action-btn"
                onClick={() => {
                  setSelectedId(data.id);
                  history.push(`/ad/ad-devices/${data.id}`);
                }}
              >
                <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
              </a>
              <Popconfirm title="Sure to delete?" onConfirm={() => removeAdDevice(data.id)}>
                <a href="#" title="" className="action-btn">
                  <img src={`${process.env.PUBLIC_URL}/assets/images/ic-delete.svg`} alt="" />
                </a>
              </Popconfirm>
            </div>
          ),
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
          <Button
            type="primary"
            onClick={() => {
              setSelectedId(0);
            }}
          >
            Add Device
          </Button>
        </div>
      </div>
      <Form form={form} initialValues={inlineSearch} name="searchTable" onFinish={onFinish}>
        <Table
          scroll={{ x: true }}
          rowKey={(record) => record.id}
          dataSource={adDevices.search.data}
          columns={getColumns()}
          loading={adDevices.search.loading}
          pagination={{
            ...pagination,
            total: adDevices.search.count,
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

export default forwardRef(DataTable);
