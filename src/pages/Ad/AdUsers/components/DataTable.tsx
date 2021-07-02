import { Table, Popconfirm, Form, Button, Checkbox, Popover } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import { toast } from 'react-toastify';
import { fixedColumn, IDataTable, IInlineSearch } from './dataTable.model';
import moment from 'moment';
import { Common, DEFAULT_PAGE_SIZE } from '../../../../common/constants/common';
import _ from 'lodash';
import {
  Filter,
  FilterByDate,
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTableFilters';
import { orderByType } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import { commonSelector } from '../../../../store/common/common.reducer';
import { FileExcelOutlined } from '@ant-design/icons';
import { adUsersSelector, clearAdUsersMessages } from '../../../../store/adUsers/adUsers.reducer';
import { IAdUser, ISearchAdUsers } from '../../../../services/adUsers/adUsers.model';
import { deleteAdUser, searchAdUsers } from '../../../../store/adUsers/adUsers.action';
import adUsersService from '../../../../services/adUsers/adUsers.service';

let pageLoaded = false;

let tableFilter = {
  keyword: '',
  order_by: 'id',
  order_direction: 'DESC' as orderByType,
  filter_keys: {},
};

const DataTable: React.ForwardRefRenderFunction<unknown, IDataTable> = (props, ref) => {
  const { setSelectedId } = props;

  const adUsers = useAppSelector(adUsersSelector);
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

    const searchData: ISearchAdUsers = {
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

  const fetchAdUsers = (page = null) => {
    const searchData = getSearchData(page, false);
    dispatch(searchAdUsers(searchData));
  };
  useImperativeHandle(ref, () => ({
    refreshData() {
      fetchAdUsers();
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
    fetchAdUsers({ ...pagination, current: 1 });
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
    fetchAdUsers(paginating);
  };

  // Start: Delete action
  const removeAdUsers = (id: number) => {
    dispatch(deleteAdUser(id));
  };
  React.useEffect(() => {
    if (adUsers.delete.messages.length > 0) {
      if (adUsers.delete.hasErrors) {
        toast.error(adUsers.delete.messages.join(' '));
      } else {
        toast.success(adUsers.delete.messages.join(' '));
        fetchAdUsers();
      }
      dispatch(clearAdUsersMessages());
    }
  }, [adUsers.delete.messages]);
  // End: Delete action

  // Keyword search
  const onFinishSearch = (value: string) => {
    tableFilter = {
      ...tableFilter,
      keyword: value,
    };
    setPagination({ ...pagination, current: 1 });
    fetchAdUsers({ ...pagination, current: 1 });
  };

  // Start: Column level filter
  const onFinish = (values: IInlineSearch) => {
    tableFilter.filter_keys = values;
    setPagination({ ...pagination, current: 1 });
    fetchAdUsers({ ...pagination, current: 1 });
  };
  const onReset = () => {
    onFinish({});
  };
  React.useEffect(() => {
    form.resetFields();
  }, [inlineSearch]);

  const FilterBySwap = (dataIndex: string) => {
    return FilterWithSwapOption(dataIndex, adUsers.search.tableName, form);
  };
  // End: Column level filter

  const exportExcel = (fileName: string, url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    link.remove();
  };
  // Export Excel
  const downloadExcel = () => {
    setLoading(true);
    const searchData = getSearchData(pagination, true);

    return adUsersService.exportExcelFile(searchData).then((res) => {
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
      title: 'Display Name',
      sorter: true,
      children: [
        {
          title: FilterBySwap('display_name'),
          dataIndex: 'display_name',
          key: 'display_name',
          ellipsis: true,
        },
      ],
    },
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
      title: 'Surname',
      sorter: true,
      children: [
        {
          title: FilterBySwap('surname'),
          dataIndex: 'surname',
          key: 'surname',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'Tenant Name',
      sorter: true,
      children: [
        {
          title: FilterByDropdown('tenant_id', adUsers.search.lookups?.tenants),
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
          title: FilterByDropdown('company_id', adUsers.search.lookups?.companies),
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
          title: FilterByDropdown('bu_id', adUsers.search.lookups?.bus),
          dataIndex: 'bu_name',
          key: 'bu_name',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'Enabled',
      sorter: true,
      children: [
        {
          title: FilterByDropdown('enabled', adUsers.search.lookups?.booleanLookup),
          dataIndex: 'enabled',
          key: 'enabled',
          ellipsis: true,
          render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
        },
      ],
    },
    {
      title: 'Given Name',
      sorter: true,
      children: [
        {
          title: FilterBySwap('given_name'),
          dataIndex: 'given_name',
          key: 'given_name',
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
      title: 'Locked Out',
      sorter: true,
      children: [
        {
          title: FilterByDropdown('locked_out', adUsers.search.lookups?.booleanLookup),
          dataIndex: 'locked_out',
          key: 'locked_out',
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
      children: [
        {
          title: FilterByDropdown('password_never_expires', adUsers.search.lookups?.booleanLookup),
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
      title: 'When Changed',
      sorter: true,
      children: [
        {
          title: FilterByDate('whenChanged'),
          dataIndex: 'whenChanged',
          key: 'whenChanged',
          ellipsis: true,
          render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
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
          title: FilterBySwap('exclusion'), //FilterByDropdown('exclusion_id', adUsers.search.lookups?.exclusion),
          dataIndex: 'exclusion',
          key: 'exclusion',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'Exclusion Id',
      sorter: true,
      children: [
        {
          title: FilterBySwap('exclusion_id'), //FilterByDropdown('exclusion_id', adUsers.search.lookups?.exclusion),
          dataIndex: 'exclusion_id',
          key: 'exclusion_id',
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
      title: 'Password Not Required',
      sorter: true,
      children: [
        {
          title: FilterByDropdown('password_not_required', adUsers.search.lookups?.booleanLookup),
          dataIndex: 'password_not_required',
          key: 'password_not_required',
          ellipsis: true,
          render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
        },
      ],
    },
    {
      title: 'Inventoried',
      sorter: true,
      children: [
        {
          title: FilterByDropdown('inventoried', adUsers.search.lookups?.booleanLookup),
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
          title: FilterByDropdown('active', adUsers.search.lookups?.booleanLookup),
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
          title: FilterByDropdown('qualified', adUsers.search.lookups?.booleanLookup),
          dataIndex: 'qualified',
          key: 'qualified',
          ellipsis: true,
          render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
        },
      ],
    },
    {
      title: 'o365 Licensed',
      sorter: true,
      children: [
        {
          title: FilterByDropdown('o365_licensed', adUsers.search.lookups?.booleanLookup),
          dataIndex: 'o365_licensed',
          key: 'o365_licensed',
          ellipsis: true,
          render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
        },
      ],
    },
    {
      title: 'o365 Licenses',
      sorter: true,
      children: [
        {
          title: FilterBySwap('o365_licenses'),
          dataIndex: 'o365_licenses',
          key: 'o365_licenses',
          ellipsis: true,
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
      title: 'Exchange Active Mailbox',
      sorter: true,
      children: [
        {
          title: FilterByDropdown('exchangeActiveMailbox', adUsers.search.lookups?.booleanLookup),
          dataIndex: 'exchangeActiveMailbox',
          key: 'exchangeActiveMailbox',
          ellipsis: true,
          render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
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
          render: (_, data: IAdUser) => (
            <div className="btns-block">
              <a
                className="action-btn"
                onClick={() => {
                  setSelectedId(data.id);
                  history.push(`/ad/ad-users/${data.id}`);
                }}
              >
                <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
              </a>
              <Popconfirm title="Sure to delete?" onConfirm={() => removeAdUsers(data.id)}>
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
            Add Ad User
          </Button>
        </div>
      </div>
      <Form form={form} initialValues={inlineSearch} name="searchTable" onFinish={onFinish}>
        <Table
          scroll={{ x: true }}
          rowKey={(record) => record.id}
          dataSource={adUsers.search.data}
          columns={getColumns()}
          loading={adUsers.search.loading}
          pagination={{
            ...pagination,
            total: adUsers.search.count,
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
