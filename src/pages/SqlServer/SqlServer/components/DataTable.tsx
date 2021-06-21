import { Table, Popconfirm, Form, Button } from 'antd';
import React, { useState } from 'react';
import {
  clearSqlServerMessages,
  sqlServerSelector,
} from '../../../../store/sqlServer/sqlServer.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import { ISearchSqlServer, ISqlServer } from '../../../../services/sqlServer/sqlServer.model';
import { deleteSqlServer, searchSqlServer } from '../../../../store/sqlServer/sqlServer.action';
import { toast } from 'react-toastify';
import { fixedColumn, IDataTable } from './dataTable.model';
import moment from 'moment';
import { Common, DEFAULT_PAGE_SIZE } from '../../../../common/constants/common';
import _ from 'lodash';
import sqlServerService from '../../../../services/sqlServer/sqlServer.service';
import {
  FilterByDate,
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTableFilters';

let pageLoaded = false;

const DataTable: React.FC<IDataTable> = (props) => {
  const { search, setSelectedId } = props;

  const sqlServers = useAppSelector(sqlServerSelector);
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const [inlineSearch, setInlineSearch] = useState<any>({});

  const fetchSqlServer = () => {
    const searchData: ISearchSqlServer = {
      order_by: 'id',
      order_direction: 'DESC',
      is_lookup: !pageLoaded,
      limit: pagination.pageSize,
      offset: (pagination.current - 1) * pagination.pageSize,
      ...(search || {}),
      filter_keys: inlineSearch,
    };
    pageLoaded = true;
    dispatch(searchSqlServer(searchData));
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

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

  React.useEffect(() => {
    fetchSqlServer();
  }, [pagination]);

  React.useEffect(() => {
    setPagination({ ...pagination, current: 1 });
  }, [inlineSearch, search]);

  const onFinish = (values: any) => {
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

  const columns = [
    {
      title: 'Product Name',
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
              <Button htmlType="submit" className="action-btn filter-btn p-0">
                <img src={`${process.env.PUBLIC_URL}/assets/images/ic-search.svg`} alt="" />
              </Button>
              <Button htmlType="button" onClick={onReset} className="action-btn filter-btn p-0">
                <img src={`${process.env.PUBLIC_URL}/assets/images/ic-clear.svg`} alt="" />
              </Button>
            </div>
          ),
          key: 'Action',
          width: '80px',
          fixed: 'right' as fixedColumn,
          render: (_, data: ISqlServer) => (
            <div className="btns-block">
              <a
                href="#"
                className="action-btn"
                onClick={() => {
                  setSelectedId(data.id);
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

  return (
    <>
      <Form form={form} name="searchTable" onFinish={onFinish}>
        <Table
          scroll={{ x: true }}
          rowKey={(record) => record.id}
          dataSource={sqlServers.search.data}
          columns={columns}
          loading={sqlServers.search.loading}
          pagination={{ ...pagination, total: sqlServers.search.count }}
          onChange={handleTableChange}
          className="custom-table"
        />
      </Form>
    </>
  );
};

export default DataTable;
