import { Button, Form, Input, Layout, PageHeader, Popconfirm, Space, Table } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import { useEffect, useState } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ISearchSqlServer, ISqlServer } from '../../../services/sqlServer/sqlServer.model';
import { useAppDispatch, useAppSelector } from '../../../store/app.hooks';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { deleteSqlServer, searchSqlServer } from '../../../store/sqlServer/sqlServer.action';
import {
  clearSqlServer,
  clearSqlServerMessages,
  sqlServerSelector,
} from '../../../store/sqlServer/sqlServer.reducer';
import { ISqlServerProps } from './sqlServer.model';
import { SearchOutlined } from '@ant-design/icons';
import './sqlServer.style.scss';

const SqlServer: React.FC<ISqlServerProps> = () => {
  const sqlServers = useAppSelector(sqlServerSelector);
  const dispatch = useAppDispatch();
  const match = useRouteMatch();
  const [form] = Form.useForm();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [search, setSearch] = useState({
    keyword: '',
    is_lookup: false
  });
  const fetchSqlServer = () => {
    const searchData: ISearchSqlServer = {
      order_by: 'id',
      order_direction: 'DESC',
      ...search,
      limit: pagination.pageSize,
      offset: (pagination.current - 1) * pagination.pageSize,
    };
    dispatch(searchSqlServer(searchData));
  };
  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };
  const onFinish = (values: ISearchSqlServer) => {
    setSearch({ ...search, keyword: values.keyword });
  };

  const removeSqlServer = (id: number) => {
    dispatch(deleteSqlServer(id));
  };

  useEffect(() => {
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

  useEffect(() => {
    fetchSqlServer();
    return () => {
      dispatch(clearSqlServer());
    };
  }, [search, pagination]);

  const columns = [
    {
      title: 'Product Name',
      dataIndex: 'product_name',
      key: 'product_name',
    },
    {
      title: 'OS',
      dataIndex: 'operating_system',
      key: 'operating_system',
    },
    {
      title: 'Bu Name',
      dataIndex: 'bu_name',
      key: 'bu_name',
    },
    {
      title: 'Company Name',
      dataIndex: 'company_name',
      key: 'company_name',
    },
    {
      title: 'Cluster',
      dataIndex: 'cluster',
      key: 'cluster',
    },
    {
      title: 'Cost Code',
      dataIndex: 'cost_code',
      key: 'cost_code',
    },
    {
      title: 'Data Center',
      dataIndex: 'data_center',
      key: 'data_center',
    },    
    {
      title: 'Device Name',
      dataIndex: 'device_name',
      key: 'device_name',
    },      
    {
      title: 'Tenant Name',
      dataIndex: 'tenant_name',
      key: 'tenant_name',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_, data: ISqlServer) => (
        <Space size="middle">
          <Link to={`${match.url}/edit/${data.id}`}>
            <EditOutlined />
          </Link>
          <Popconfirm title="Sure to delete?" onConfirm={() => removeSqlServer(data.id)}>
            <DeleteOutlined />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const Filter = () => (
    <>
      <Form form={form} name="horizontal_login" layout="inline" onFinish={onFinish}>
        <Form.Item
          name="keyword"
        >
          <Input prefix={<SearchOutlined />} placeholder="Search" allowClear={true} />
        </Form.Item>
        <Form.Item shouldUpdate >
          {() => (
            <Button
              type="primary"
              htmlType="submit"
              style={{ margin: '0' }}
            >
              Search
            </Button>
          )}
        </Form.Item>
      </Form>
    </>
  );

  return (
    <div className="slqServerListingPage">
      <Layout className="layout">
        <PageHeader
          className="site-page-header"
          title="Sql Server"
          extra={[
            <Link key="1" to={`${match.url}/add`}>
              <Button type="primary">
                <PlusOutlined /> Add
              </Button>
            </Link>,
          ]}
        />
        <Content style={{ padding: '0 25px' }}>
          <div className="site-layout-content">
            <Filter />
            <br />
            <Table
              rowKey={(record) => record.id}
              dataSource={sqlServers.search.data}
              columns={columns}
              loading={sqlServers.search.loading}
              pagination={{ ...pagination, total: sqlServers.search.count }}
              onChange={handleTableChange}
            />
          </div>
        </Content>
      </Layout>
    </div>
  );
};

export default SqlServer;
