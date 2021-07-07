import { Table, Popconfirm, Form, Button, Checkbox, Popover } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import { toast } from 'react-toastify';
import { fixedColumn, IDataTable, IInlineSearch } from './dataTable.model';
import moment from 'moment';
import { Common, DEFAULT_PAGE_SIZE, exportExcel } from '../../../../common/constants/common';
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
import {
  clearSqlServerLicenseMessages,
  sqlServerLicenseSelector,
} from '../../../../store/sqlServerLicense/sqlServerLicense.reducer';
import {
  ISearchSqlServerLicense,
  ISqlServerLicense,
} from '../../../../services/sqlServerLicense/sqlServerLicense.model';
import {
  deleteSqlServerLicense,
  searchSqlServerLicense,
} from '../../../../store/sqlServerLicense/sqlServerLicense.action';
import sqlServerLicenseService from '../../../../services/sqlServerLicense/sqlServerLicense.service';

let pageLoaded = false;

let tableFilter = {
  keyword: '',
  order_by: 'id',
  order_direction: 'DESC' as orderByType,
  filter_keys: {},
};

const DataTable: React.ForwardRefRenderFunction<unknown, IDataTable> = (props, ref) => {
  const { setSelectedId } = props;

  const sqlServerLicense = useAppSelector(sqlServerLicenseSelector);
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

    const searchData: ISearchSqlServerLicense = {
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

  const fetchSqlServerLicense = (page = null) => {
    const searchData = getSearchData(page, false);
    dispatch(searchSqlServerLicense(searchData));
  };
  useImperativeHandle(ref, () => ({
    refreshData() {
      fetchSqlServerLicense();
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
    fetchSqlServerLicense({ ...pagination, current: 1 });
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
    fetchSqlServerLicense(paginating);
  };

  // Start: Delete action
  const removeSqlServerLicense = (id: number) => {
    dispatch(deleteSqlServerLicense(id));
  };
  React.useEffect(() => {
    if (sqlServerLicense.delete.messages.length > 0) {
      if (sqlServerLicense.delete.hasErrors) {
        toast.error(sqlServerLicense.delete.messages.join(' '));
      } else {
        toast.success(sqlServerLicense.delete.messages.join(' '));
        fetchSqlServerLicense();
      }
      dispatch(clearSqlServerLicenseMessages());
    }
  }, [sqlServerLicense.delete.messages]);
  // End: Delete action

  // Keyword search
  const onFinishSearch = (value: string) => {
    tableFilter = {
      ...tableFilter,
      keyword: value,
    };
    setPagination({ ...pagination, current: 1 });
    fetchSqlServerLicense({ ...pagination, current: 1 });
  };

  // Start: Column level filter
  const onFinish = (values: IInlineSearch) => {
    tableFilter.filter_keys = values;
    setPagination({ ...pagination, current: 1 });
    fetchSqlServerLicense({ ...pagination, current: 1 });
  };
  const onReset = () => {
    onFinish({});
  };
  React.useEffect(() => {
    form.resetFields();
  }, [inlineSearch]);

  const FilterBySwap = (dataIndex: string) => {
    return FilterWithSwapOption(dataIndex, sqlServerLicense.search.tableName, form);
  };
  // End: Column level filter

  // Export Excel
  const downloadExcel = () => {
    setLoading(true);
    const searchData = getSearchData(pagination, true);

    return sqlServerLicenseService.exportExcelFile(searchData).then((res) => {
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
      title: 'Tenant Name',
      sorter: true,
      children: [
        {
          title: FilterByDropdown('tenant_id', sqlServerLicense.search.lookups?.tenants),
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
          title: FilterByDropdown('company_id', sqlServerLicense.search.lookups?.companies),
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
          title: FilterByDropdown('bu_id', sqlServerLicense.search.lookups?.bus),
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
      title: 'Agreement Type',
      sorter: true,
      children: [
        {
          title: FilterByDropdown(
            'opt_agreement_type',
            sqlServerLicense.search.lookups?.agreementTypes
          ),
          dataIndex: 'agreement_type',
          key: 'agreement_type',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'Opt-Default to Enterprise on Hosts',
      sorter: true,
      children: [
        {
          title: FilterByDropdown(
            'apt_default_to_enterprise_on_hosts',
            sqlServerLicense.search.lookups?.booleanLookup
          ),
          dataIndex: 'apt_default_to_enterprise_on_hosts',
          key: 'apt_default_to_enterprise_on_hosts',
          ellipsis: true,
          render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
        },
      ],
    },
    {
      title: 'Opt-Cluster Logic',
      sorter: true,
      children: [
        {
          title: FilterByDropdown(
            'opt_cluster_logic',
            sqlServerLicense.search.lookups?.booleanLookup
          ),
          dataIndex: 'opt_cluster_logic',
          key: 'opt_cluster_logic',
          ellipsis: true,
          render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
        },
      ],
    },
    {
      title: 'Opt-Entitlements',
      sorter: true,
      children: [
        {
          title: FilterByDropdown(
            'opt_entitlements',
            sqlServerLicense.search.lookups?.booleanLookup
          ),
          dataIndex: 'opt_entitlements',
          key: 'opt_entitlements',
          ellipsis: true,
          render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
        },
      ],
    },
    {
      title: 'Opt-Exclude Non-Prod',
      sorter: true,
      children: [
        {
          title: FilterByDropdown(
            'opt_exclude_non_prod',
            sqlServerLicense.search.lookups?.booleanLookup
          ),
          dataIndex: 'opt_exclude_non_prod',
          key: 'opt_exclude_non_prod',
          ellipsis: true,
          render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
        },
      ],
    },
    {
      title: 'Notes',
      sorter: true,
      children: [
        {
          title: FilterBySwap('notes'),
          dataIndex: 'notes',
          key: 'notes',
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
          render: (_, data: ISqlServerLicense) => (
            <div className="btns-block">
              <a
                title=""
                className="action-btn"
                onClick={() => {
                  setSelectedId(data.id);
                  history.push(`/sql-server/license/edit/${data.id}`);
                }}
              >
                View
                {/* <img src={`${process.env.PUBLIC_URL}/assets/images/ic-delete.svg`} alt="" /> */}
              </a>
              <a
                className="action-btn"
                onClick={() => {
                  setSelectedId(data.id);
                  history.push(`/sql-server/license/${data.id}`);
                }}
              >
                <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
              </a>
              <Popconfirm title="Sure to delete?" onConfirm={() => removeSqlServerLicense(data.id)}>
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
            Add Sql Server License
          </Button>
        </div>
      </div>
      <Form form={form} initialValues={inlineSearch} name="searchTable" onFinish={onFinish}>
        <Table
          scroll={{ x: true }}
          rowKey={(record) => record.id}
          dataSource={sqlServerLicense.search.data}
          columns={getColumns()}
          loading={sqlServerLicense.search.loading}
          pagination={{
            ...pagination,
            total: sqlServerLicense.search.count,
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
