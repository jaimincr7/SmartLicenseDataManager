import { Table, Popconfirm, Form, Button, Checkbox, Popover } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
  clearSqlServerMessages,
  sqlServerSelector,
} from '../../../../store/sqlServer/sqlServer.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import { ISearchSqlServer, ISqlServer } from '../../../../services/sqlServer/sqlServer.model';
import { deleteSqlServer, searchSqlServer } from '../../../../store/sqlServer/sqlServer.action';
import { toast } from 'react-toastify';
import { fixedColumn, IDataTable, IInlineSearch } from './dataTable.model';
import moment from 'moment';
import { Common, DEFAULT_PAGE_SIZE } from '../../../../common/constants/common';
import _ from 'lodash';
import sqlServerService from '../../../../services/sqlServer/sqlServer.service';
import {
  Filter,
  FilterByDate,
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTableFilters';
import { orderByType } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';

let pageLoaded = false;

const DataTable: React.ForwardRefRenderFunction<unknown, IDataTable> = (props, ref) => {
  const { setSelectedId } = props;

  const sqlServers = useAppSelector(sqlServerSelector);
  const dispatch = useAppDispatch();
  const history = useHistory();

  const [form] = Form.useForm();

  const [tableColumn, setTableColumn] = useState<{ [key: string]: boolean }>({});
  const [search, setSearch] = useState({ keyword: '' });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [sorter, setSorter] = useState({
    order_by: 'id',
    order_direction: 'DESC' as orderByType,
  });
  const [inlineSearch, setInlineSearch] = useState<IInlineSearch>({});

  const fetchSqlServer = () => {
    const searchData: ISearchSqlServer = {
      order_by: 'id',
      order_direction: 'DESC',
      is_lookup: !pageLoaded,
      limit: pagination.pageSize,
      offset: (pagination.current - 1) * pagination.pageSize,
      ...(search || {}),
      ...(sorter || {}),
      filter_keys: inlineSearch,
    };
    pageLoaded = true;
    dispatch(searchSqlServer(searchData));
  };
  useImperativeHandle(ref, () => ({
    refreshData() {
      fetchSqlServer();
    },
  }));

  // Start: Pagination ans Sorting
  const handleTableChange = (paginating, filters, sorter) => {
    setSorter({
      order_by: sorter.field || sorter.column?.children[0]?.dataIndex || 'id',
      order_direction: (sorter.order === 'ascend' ? 'ASC' : 'DESC') as orderByType,
    });
    setPagination(paginating);
  };
  React.useEffect(() => {
    fetchSqlServer();
  }, [pagination]);
  // End: Pagination ans Sorting

  // Start: Delete action
  const removeSqlServer = (id: number) => {
    dispatch(deleteSqlServer(id));
  };
  React.useEffect(() => {
    if (sqlServers.delete.messages.length > 0) {
      if (sqlServers.delete.hasErrors) {
        toast.error(sqlServers.delete.messages.join(' '));
      } else {
        toast.success(sqlServers.delete.messages.join(' '));
        fetchSqlServer();
      }
      dispatch(clearSqlServerMessages());
    }
  }, [sqlServers.delete.messages]);
  // End: Delete action

  // Keyword search
  const onFinishSearch = (value: string) => {
    setSearch({ ...search, keyword: value });
  };

  // Start: Column level filter
  const onFinish = (values: IInlineSearch) => {
    setInlineSearch(values);
  };
  const onReset = () => {
    form.resetFields();
    setInlineSearch({});
  };
  const getColumnLookup = (column: string) => {
    return sqlServerService.getLookupSqlServerByFieldName(column).then((res) => {
      return res.body.data;
    });
  };
  const FilterBySwap = (dataIndex: string) => {
    return FilterWithSwapOption(dataIndex, getColumnLookup, form);
  };
  // End: Column level filter

  React.useEffect(() => {
    setPagination({ ...pagination, current: 1 });
  }, [inlineSearch, search]);

  // Table columns
  const columns = [
    {
      title: 'Product Name',
      sorter: true,
      children: [
        {
          title: FilterBySwap('product_name'),
          dataIndex: 'product_name',
          key: 'product_name',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'Operating System',
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
      title: 'Tenant Name',
      sorter: true,
      children: [
        {
          title: FilterByDropdown('tenant_id', sqlServers.search.lookups?.tenants),
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
          title: FilterByDropdown('company_id', sqlServers.search.lookups?.companies),
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
          title: FilterByDropdown('bu_id', sqlServers.search.lookups?.bus),
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
      title: 'SQL Cluster',
      sorter: true,
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
      title: 'Host',
      sorter: true,
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
      title: 'Device Name',
      sorter: true,
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
      title: 'Product Family',
      sorter: true,
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
      title: 'Cluster',
      sorter: true,
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
      title: 'OS Type',
      sorter: true,
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
      title: 'Data Center',
      sorter: true,
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
      title: 'Serial Number',
      sorter: true,
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
      title: 'Action',
      children: [
        {
          title: (
            <div className="btns-block">
              <Button
                htmlType="submit"
                className={`action-btn filter-btn p-0 ${_.isEmpty(inlineSearch) ? '' : 'active'}`}
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
          render: (_, data: ISqlServer) => (
            <div className="btns-block">
              <a
                className="action-btn"
                onClick={() => {
                  setSelectedId(data.id);
                  history.push(`/sql-server/${data.id}`);
                }}
              >
                <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
              </a>
              <Popconfirm title="Sure to delete?" onConfirm={() => removeSqlServer(data.id)}>
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
            Add Sql Server
          </Button>
        </div>
      </div>
      <Form form={form} name="searchTable" onFinish={onFinish}>
        <Table
          scroll={{ x: true }}
          rowKey={(record) => record.id}
          dataSource={sqlServers.search.data}
          columns={getColumns()}
          loading={sqlServers.search.loading}
          pagination={{ ...pagination, total: sqlServers.search.count }}
          onChange={handleTableChange}
          className="custom-table"
          sortDirections={['ascend', 'descend']}
        />
      </Form>
    </>
  );
};

export default forwardRef(DataTable);
