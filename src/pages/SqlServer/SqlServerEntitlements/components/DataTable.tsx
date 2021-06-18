import { Table, Popconfirm } from 'antd';
import React, { useState } from 'react';
import {
  clearSqlServerEntitlements,
  clearSqlServerEntitlementsMessages,
  sqlServerEntitlementsSelector,
} from '../../../../store/sqlServerEntitlements/sqlServerEntitlements.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  ISearchSqlServerEntitlements,
  ISqlServerEntitlements,
} from '../../../../services/sqlServerEntitlements/sqlServerEntitlements.model';
import {
  deleteSqlServerEntitlements,
  searchSqlServerEntitlements,
} from '../../../../store/sqlServerEntitlements/sqlServerEntitlements.action';
import { toast } from 'react-toastify';
import { fixedColumn, IDataTable } from './dataTable.model';
import moment from 'moment';
import { Common } from '../../../../common/constants/common';
import _ from 'lodash';

const DataTable: React.FC<IDataTable> = (props) => {
  const { search, setSelectedId } = props;

  const sqlServerEntitlements = useAppSelector(sqlServerEntitlementsSelector);
  const dispatch = useAppDispatch();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const fetchSqlServerEntitlements = () => {
    const searchData: ISearchSqlServerEntitlements = {
      order_by: 'id',
      order_direction: 'DESC',
      limit: pagination.pageSize,
      offset: (pagination.current - 1) * pagination.pageSize,
      is_lookup: false,
      ...(search || {}),
    };
    dispatch(searchSqlServerEntitlements(searchData));
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const removeSqlServerEntitlements = (id: number) => {
    dispatch(deleteSqlServerEntitlements(id));
  };

  React.useEffect(() => {
    if (sqlServerEntitlements.delete.messages.length > 0) {
      if (sqlServerEntitlements.delete.hasErrors) {
        toast.error(sqlServerEntitlements.delete.messages.join(' '));
      } else {
        toast.success(sqlServerEntitlements.delete.messages.join(' '));
        fetchSqlServerEntitlements();
      }
      dispatch(clearSqlServerEntitlementsMessages());
    }
  }, [sqlServerEntitlements.delete.messages]);

  React.useEffect(() => {
    fetchSqlServerEntitlements();
    return () => {
      dispatch(clearSqlServerEntitlements());
    };
  }, [search, pagination]);

  const columns = [
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
      title: 'BU Name',
      dataIndex: 'bu_name',
      key: 'bu_name',
      ellipsis: true,
    },
    {
      title: 'Date Added',
      dataIndex: 'date_added',
      key: 'date_added',
      ellipsis: true,
      render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
    },
    {
      title: 'License Id',
      dataIndex: 'license_id',
      key: 'license_id',
      ellipsis: true,
    },
    {
      title: 'Qty 01',
      dataIndex: 'qty_01',
      key: 'qty_01',
      ellipsis: true,
    },
    {
      title: 'Qty 02',
      dataIndex: 'qty_02',
      key: 'qty_02',
      ellipsis: true,
    },
    {
      title: 'Qty 03',
      dataIndex: 'qty_03',
      key: 'qty_03',
      ellipsis: true,
    },
    {
      title: 'Action',
      key: 'Action',
      width: '80px',
      fixed: 'right' as fixedColumn,
      render: (_, data: ISqlServerEntitlements) => (
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
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => removeSqlServerEntitlements(data.id)}
          >
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
      dataSource={sqlServerEntitlements.search.data}
      columns={columns}
      loading={sqlServerEntitlements.search.loading}
      pagination={{ ...pagination, total: sqlServerEntitlements.search.count }}
      onChange={handleTableChange}
      className="custom-table"
    />
  );
};

export default DataTable;
