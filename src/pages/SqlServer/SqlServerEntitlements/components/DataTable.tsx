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
import {
  clearSqlServerEntitlementsMessages,
  sqlServerEntitlementsSelector,
} from '../../../../store/sqlServerEntitlements/sqlServerEntitlements.reducer';
import {
  ISearchSqlServerEntitlements,
  ISqlServerEntitlements,
} from '../../../../services/sqlServerEntitlements/sqlServerEntitlements.model';
import {
  deleteSqlServerEntitlements,
  searchSqlServerEntitlements,
} from '../../../../store/sqlServerEntitlements/sqlServerEntitlements.action';
import sqlServerEntitlementsService from '../../../../services/sqlServerEntitlements/sqlServerEntitlements.service';

let pageLoaded = false;

const DataTable: React.ForwardRefRenderFunction<unknown, IDataTable> = (props, ref) => {
  const { setSelectedId } = props;

  const sqlServerEntitlements = useAppSelector(sqlServerEntitlementsSelector);
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

  const fetchSqlServerEntitlements = () => {
    const inlineSearchFilter = _.pickBy(inlineSearch, function (value) {
      return !(
        value === undefined ||
        value === '' ||
        _.isNull(value) ||
        (Array.isArray(value) && value.length === 0)
      );
    });

    const searchData: ISearchSqlServerEntitlements = {
      order_by: 'id',
      order_direction: 'DESC',
      is_lookup: !pageLoaded,
      limit: pagination.pageSize,
      offset: (pagination.current - 1) * pagination.pageSize,
      ...(search || {}),
      ...(sorter || {}),
      filter_keys: inlineSearchFilter,
    };
    pageLoaded = true;
    dispatch(searchSqlServerEntitlements(searchData));
  };
  useImperativeHandle(ref, () => ({
    refreshData() {
      fetchSqlServerEntitlements();
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
    fetchSqlServerEntitlements();
  }, [pagination]);
  // End: Pagination ans Sorting

  // Start: Delete action
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
    return sqlServerEntitlementsService
      .getLookupSqlServerEntitlementsByFieldName(column)
      .then((res) => {
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
      title: 'Tenant Name',
      sorter: true,
      children: [
        {
          title: FilterByDropdown('tenant_id', sqlServerEntitlements.search.lookups?.tenants),
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
          title: FilterByDropdown('company_id', sqlServerEntitlements.search.lookups?.companies),
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
          title: FilterByDropdown('bu_id', sqlServerEntitlements.search.lookups?.bus),
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
      title: 'License Id',
      sorter: true,
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
      title: 'Qty 01',
      sorter: true,
      children: [
        {
          title: FilterBySwap('qty_01'),
          dataIndex: 'qty_01',
          key: 'qty_01',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'Qty 02',
      sorter: true,
      children: [
        {
          title: FilterBySwap('qty_02'),
          dataIndex: 'qty_02',
          key: 'qty_02',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'Qty 03',
      sorter: true,
      children: [
        {
          title: FilterBySwap('qty_03'),
          dataIndex: 'qty_03',
          key: 'qty_03',
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
          render: (_, data: ISqlServerEntitlements) => (
            <div className="btns-block">
              <a
                className="action-btn"
                onClick={() => {
                  setSelectedId(data.id);
                  history.push(`/sql-server/entitlements/${data.id}`);
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
            Add Entitlements
          </Button>
        </div>
      </div>
      <Form form={form} name="searchTable" onFinish={onFinish}>
        <Table
          scroll={{ x: true }}
          rowKey={(record) => record.id}
          dataSource={sqlServerEntitlements.search.data}
          columns={getColumns()}
          loading={sqlServerEntitlements.search.loading}
          pagination={{
            ...pagination,
            total: sqlServerEntitlements.search.count,
            showTotal: (total) => `Total ${total} items`,
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
