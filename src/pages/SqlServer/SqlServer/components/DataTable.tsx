import { Table, Popconfirm, Input, Form, Button, Select } from 'antd';
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
import { Common } from '../../../../common/constants/common';
import _ from 'lodash';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';
import { IDropDownOption } from '../../../../common/models/commont';

let pageLoaded = false;

const DataTable: React.FC<IDataTable> = (props) => {
  const { search, setSelectedId } = props;

  const sqlServers = useAppSelector(sqlServerSelector);
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
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
  }, [search, pagination, inlineSearch]);

  const onFinish = (values: any) => {
    setInlineSearch(values);
  };

  const onReset = () => {
    form.resetFields();
    setInlineSearch({});
  };

  const FilterByInput = (dataIndex: string) => (
    <>
      <Form.Item name={dataIndex} className="m-0">
        <Input placeholder="Search keyword" autoComplete="off" />
      </Form.Item>
    </>
  );

  const FilterByDropdown = (dataIndex: string, dropdownOptions: IDropDownOption[] = []) => (
    <>
      <Form.Item name={dataIndex} className="m-0">
        <Select
          suffixIcon={<img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />}
          mode="multiple"
          placeholder="Select"
          maxTagCount="responsive"
        >
          {dropdownOptions.map((option: IDropDownOption) => (
            <Select.Option key={option.name} value={option.id}>
              {option.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </>
  );

  const columns = [
    {
      title: 'Product Name',
      width: '100',
      children: [
        {
          title: FilterByInput('product_name'),
          dataIndex: 'product_name',
          key: 'product_name',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'Operating System',
      width: '100',
      children: [
        {
          title: FilterByInput('operating_system'),
          dataIndex: 'operating_system',
          key: 'operating_system',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'Tenant Name',
      width: '100',
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
      dataIndex: 'date_added',
      key: 'date_added',
      ellipsis: true,
      render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
    },
    {
      title: 'SQL Cluster',
      dataIndex: 'sql_cluster',
      key: 'sql_cluster',
      ellipsis: true,
    },
    {
      title: 'Host',
      dataIndex: 'host',
      key: 'host',
      ellipsis: true,
    },
    {
      title: 'Device Name',
      dataIndex: 'device_name',
      key: 'device_name',
      ellipsis: true,
    },
    {
      title: 'Device Type',
      dataIndex: 'device_type',
      key: 'device_type',
      ellipsis: true,
    },
    {
      title: 'Product Family',
      dataIndex: 'product_family',
      key: 'product_family',
      ellipsis: true,
    },
    {
      title: 'Version',
      dataIndex: 'version',
      key: 'version',
      ellipsis: true,
    },
    {
      title: 'Edition',
      dataIndex: 'edition',
      key: 'edition',
      ellipsis: true,
    },
    {
      title: 'Device State',
      dataIndex: 'device_state',
      key: 'device_state',
      ellipsis: true,
    },
    {
      title: 'Software State',
      dataIndex: 'software_state',
      key: 'software_state',
      ellipsis: true,
    },
    {
      title: 'Cluster',
      dataIndex: 'cluster',
      key: 'cluster',
      ellipsis: true,
    },
    {
      title: 'Source',
      dataIndex: 'source',
      key: 'source',
      ellipsis: true,
    },
    {
      title: 'OS Type',
      dataIndex: 'os_type',
      key: 'os_type',
      ellipsis: true,
    },
    {
      title: 'Raw Software Title',
      dataIndex: 'raw_software_title',
      key: 'raw_software_title',
      ellipsis: true,
    },
    {
      title: 'FQDN',
      dataIndex: 'fqdn',
      key: 'fqdn',
      ellipsis: true,
    },
    {
      title: 'Service',
      dataIndex: 'service',
      key: 'service',
      ellipsis: true,
    },
    {
      title: 'Cost Code',
      dataIndex: 'cost_code',
      key: 'cost_code',
      ellipsis: true,
    },
    {
      title: 'Line of Business',
      dataIndex: 'line_of_business',
      key: 'line_of_business',
      ellipsis: true,
    },
    {
      title: 'Market',
      dataIndex: 'market',
      key: 'market',
      ellipsis: true,
    },
    {
      title: 'Application',
      dataIndex: 'application',
      key: 'application',
      ellipsis: true,
    },
    {
      title: 'Data Center',
      dataIndex: 'data_center',
      key: 'data_center',
      ellipsis: true,
    },
    {
      title: 'Serial Number',
      dataIndex: 'serial_number',
      key: 'serial_number',
      ellipsis: true,
    },
    {
      title: 'SQL Cluster Node Type',
      dataIndex: 'sql_cluster_node_type',
      key: 'sql_cluster_node_type',
      ellipsis: true,
    },
    {
      title: 'Action',
      children: [
        {
          title: (
            <div className="btns-block">
              <Button htmlType="submit">
                <SearchOutlined />
              </Button>
              <Button htmlType="button" onClick={onReset}>
                <ClearOutlined />
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
