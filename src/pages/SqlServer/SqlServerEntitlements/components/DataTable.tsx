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
import { commonSelector } from '../../../../store/common/common.reducer';

let pageLoaded = false;

const DataTable: React.ForwardRefRenderFunction<unknown, IDataTable> = (props, ref) => {
  const { setSelectedId } = props;

  const sqlServerEntitlements = useAppSelector(sqlServerEntitlementsSelector);
  const commonFilters = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const history = useHistory();
  const [form] = Form.useForm();

  const [tableColumn, setTableColumn] = useState<{ [key: string]: boolean }>({});
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  let tableFilter = {
    keyword: '',
    order_by: 'id',
    order_direction: 'DESC' as orderByType,
    filter_keys: {},
  };

  const [inlineSearch, setInlineSearch] = useState<IInlineSearch>({});

  const fetchSqlServerEntitlements = (page: number = null) => {
    const { filter_keys, ...rest } = tableFilter;

    if (page) {
      setPagination({ ...pagination, current: page });
    } else {
      page = pagination.current;
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

    const searchData: ISearchSqlServerEntitlements = {
      is_lookup: !pageLoaded,
      limit: pagination.pageSize,
      offset: (page - 1) * pagination.pageSize,
      ...(rest || {}),
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
    fetchSqlServerEntitlements(1);
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
    fetchSqlServerEntitlements();
  };

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
    tableFilter = {
      ...tableFilter,
      keyword: value,
    };
    fetchSqlServerEntitlements();
  };

  // Start: Column level filter
  const onFinish = (values: IInlineSearch) => {
    tableFilter.filter_keys = values;
    setPagination({ ...pagination, current: 1 });
    fetchSqlServerEntitlements();
  };
  const onReset = () => {
    onFinish({});
  };
  React.useEffect(() => {
    form.resetFields();
  }, [inlineSearch]);

  const FilterBySwap = (dataIndex: string) => {
    return FilterWithSwapOption(dataIndex, sqlServerEntitlements.search.tableName, form);
  };
  // End: Column level filter

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
      title: 'Product Name',
      sorter: true,
      children: [
        {
          title: FilterByDropdown(
            'license_id',
            sqlServerEntitlements.search.lookups?.sqlServerLicenses
          ),
          dataIndex: 'product_name',
          key: 'product_name',
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
      <Form form={form} initialValues={inlineSearch} name="searchTable" onFinish={onFinish}>
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
