import { Table, Popconfirm, Button } from 'antd';
import React, { useState } from 'react';
import {
  clearSqlServer,
  clearSqlServerMessages,
  sqlServerSelector,
} from '../../../../store/sqlServer/sqlServer.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import { ISearchSqlServer, ISqlServer } from '../../../../services/sqlServer/sqlServer.model';
import { deleteSqlServer, searchSqlServer } from '../../../../store/sqlServer/sqlServer.action';
import { toast } from 'react-toastify';
import { Link, useRouteMatch } from 'react-router-dom';
import { fixedColumn, IDataTable } from './dataTable.model';
import moment from 'moment';
import { Common } from '../../../../common/constants/common';

const DataTable: React.FC<IDataTable> = (props) => {
  const { search, setSelectedId } = props;

  const sqlServers = useAppSelector(sqlServerSelector);
  const dispatch = useAppDispatch();
  const match = useRouteMatch();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const fetchSqlServer = () => {
    const searchData: ISearchSqlServer = {
      order_by: 'id',
      order_direction: 'DESC',
      is_lookup: false,
      limit: pagination.pageSize,
      offset: (pagination.current - 1) * pagination.pageSize,
      ...(search || {}),
    };
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
    return () => {
      dispatch(clearSqlServer());
    };
  }, [search, pagination]);

  const columns = [
    {
      title: 'Product Name',
      dataIndex: 'product_name',
      key: 'product_name',
      ellipsis: true,
    },
    {
      title: 'Operating System',
      dataIndex: 'operating_system',
      key: 'operating_system',
      ellipsis: true,
    },
    {
      title: 'Tenant Name',
      dataIndex: 'tenant_name',
      key: 'tenant_name',
      ellipsis: true,
    },
    {
      title: 'Company Name',
      dataIndex: 'company_name',
      key: 'company_name',
      ellipsis: true,
    },
    {
      title: 'Bu Name',
      dataIndex: 'bu_name',
      key: 'bu_name',
      ellipsis: true,
    },
    {
      title: 'Date Added',
      dataIndex: 'date_added',
      key: 'date_added',
      ellipsis: true,
      render: (date:Date) => moment(date).format(Common.DATEFORMAT)
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
      key: 'Action',
      width: '80px',
      fixed: 'right' as fixedColumn,
      render: (_, data: ISqlServer) => (
        <div className="btns-block">
          <a href="#" className="action-btn" onClick={()=> {setSelectedId(data.id)}}>
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
  ];

  return (
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
  );
};

export default DataTable;
