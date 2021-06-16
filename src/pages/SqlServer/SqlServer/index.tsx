import { Button, Layout, PageHeader, Popconfirm, Space, Table } from 'antd';
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
import './sqlServer.style.scss';

const SqlServer: React.FC<ISqlServerProps> = () => {
  const sqlServers = useAppSelector(sqlServerSelector);
  const dispatch = useAppDispatch();
  const match = useRouteMatch();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const fetchSqlServer = (pagination) => {
    const search: ISearchSqlServer = {
      is_lookup: false,
      limit: pagination.pagesize,
      offset: (pagination.current - 1) * pagination.pagesize,
    };
    dispatch(searchSqlServer(search));
  };

  const removeSqlServer = (id: number) => {
    dispatch(deleteSqlServer(id));
  };

  useEffect(() => {
    if (sqlServers.delete.messages.length > 0) {
      if (sqlServers.delete.hasErrors) {
        toast.error(sqlServers.delete.messages.join('\n'));
      } else {
        toast.success(sqlServers.delete.messages.join('\n'));
        fetchSqlServer(pagination);
      }
      dispatch(clearSqlServerMessages());
    }
  }, [sqlServers.delete.messages]);

  useEffect(() => {
    fetchSqlServer(pagination);
    return () => {
      dispatch(clearSqlServer());
    };
  }, [dispatch]);

  const handleTableChange = (pagination) => {
    setPagination(pagination);
    fetchSqlServer(pagination);
  };

  const columns = [
    {
      title: 'Host',
      dataIndex: 'host',
      key: 'host',
    },
    {
      title: 'Device Name',
      dataIndex: 'device_name',
      key: 'device_name',
    },
    {
      title: 'Device Type',
      dataIndex: 'device_type',
      key: 'device_type',
    },
    {
      title: 'Product Family',
      dataIndex: 'product_family',
      key: 'product_family',
    },
    {
      title: 'Version',
      dataIndex: 'version',
      key: 'version',
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
