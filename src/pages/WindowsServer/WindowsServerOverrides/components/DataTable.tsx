import { Table, Popconfirm, Form, Button, Checkbox, Popover } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import { toast } from 'react-toastify';
import { fixedColumn, IDataTable, IInlineSearch } from './dataTable.model';
import moment from 'moment';
import { DEFAULT_PAGE_SIZE, exportExcel } from '../../../../common/constants/common';
import _ from 'lodash';
import {
  Filter,
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTableFilters';
import { orderByType } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import { commonSelector } from '../../../../store/common/common.reducer';
import { FileExcelOutlined } from '@ant-design/icons';
import {
  clearWindowsServerOverridesMessages,
  windowsServerOverridesSelector,
} from '../../../../store/windowsServer/windowsServerOverrides/windowsServerOverrides.reducer';
import windowsServerOverridesService from '../../../../services/windowsServer/windowsServerOverrides/windowsServerOverrides.service';
import {
  deleteWindowsServerOverrides,
  searchWindowsServerOverrides,
} from '../../../../store/windowsServer/windowsServerOverrides/windowsServerOverrides.action';
import {
  ISearchWindowsServerOverrides,
  IWindowsServerOverrides,
} from '../../../../services/windowsServer/windowsServerOverrides/windowsServerOverrides.model';

let pageLoaded = false;

let tableFilter = {
  keyword: '',
  order_by: 'id',
  order_direction: 'DESC' as orderByType,
  filter_keys: {},
};

const DataTable: React.ForwardRefRenderFunction<unknown, IDataTable> = (props, ref) => {
  const { setSelectedId } = props;

  const overrides = useAppSelector(windowsServerOverridesSelector);
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

    const searchData: ISearchWindowsServerOverrides = {
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

  const fetchWindowsServerOverrides = (page = null) => {
    const searchData = getSearchData(page, false);
    dispatch(searchWindowsServerOverrides(searchData));
  };
  useImperativeHandle(ref, () => ({
    refreshData() {
      fetchWindowsServerOverrides();
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
    fetchWindowsServerOverrides({ ...pagination, current: 1 });
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
    fetchWindowsServerOverrides(paginating);
  };

  // Start: Delete action
  const removeWindowsServerOverrides = (id: number) => {
    dispatch(deleteWindowsServerOverrides(id));
  };
  React.useEffect(() => {
    if (overrides.delete.messages.length > 0) {
      if (overrides.delete.hasErrors) {
        toast.error(overrides.delete.messages.join(' '));
      } else {
        toast.success(overrides.delete.messages.join(' '));
        fetchWindowsServerOverrides();
      }
      dispatch(clearWindowsServerOverridesMessages());
    }
  }, [overrides.delete.messages]);
  // End: Delete action

  // Keyword search
  const onFinishSearch = (value: string) => {
    tableFilter = {
      ...tableFilter,
      keyword: value,
    };
    setPagination({ ...pagination, current: 1 });
    fetchWindowsServerOverrides({ ...pagination, current: 1 });
  };

  // Start: Column level filter
  const onFinish = (values: IInlineSearch) => {
    tableFilter.filter_keys = values;
    setPagination({ ...pagination, current: 1 });
    fetchWindowsServerOverrides({ ...pagination, current: 1 });
  };
  const onReset = () => {
    onFinish({});
  };
  React.useEffect(() => {
    form.resetFields();
  }, [inlineSearch]);

  const FilterBySwap = (dataIndex: string) => {
    return FilterWithSwapOption(dataIndex, overrides.search.tableName, form);
  };
  // End: Column level filter

  // Export Excel
  const downloadExcel = () => {
    setLoading(true);
    const searchData = getSearchData(pagination, true);

    return windowsServerOverridesService.exportExcelFile(searchData).then((res) => {
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
          title: FilterByDropdown('tenant_id', overrides.search.lookups?.tenants),
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
          title: FilterByDropdown('company_id', overrides.search.lookups?.companies),
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
          title: FilterByDropdown('bu_id', overrides.search.lookups?.bus),
          dataIndex: 'bu_name',
          key: 'bu_name',
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
          title: FilterBySwap('id_device_type'),
          dataIndex: 'id_device_type',
          key: 'id_device_type',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'Field',
      sorter: true,
      children: [
        {
          title: FilterBySwap('id_field'),
          dataIndex: 'id_field',
          key: 'id_field',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'Value',
      sorter: true,
      children: [
        {
          title: FilterBySwap('id_value'),
          dataIndex: 'id_value',
          key: 'id_value',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'Override Field',
      sorter: true,
      children: [
        {
          title: FilterBySwap('override_field'),
          dataIndex: 'override_field',
          key: 'override_field',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'Override Value',
      sorter: true,
      children: [
        {
          title: FilterBySwap('override_value'),
          dataIndex: 'override_value',
          key: 'override_value',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'Enabled',
      sorter: true,
      children: [
        {
          title: FilterByDropdown('enabled', overrides.search.lookups?.booleanLookup),
          dataIndex: 'enabled',
          key: 'enabled',
          ellipsis: true,
          render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
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
          render: (_, data: IWindowsServerOverrides) => (
            <div className="btns-block">
              <a
                className="action-btn"
                onClick={() => {
                  setSelectedId(data.id);
                  history.push(`/windows-server/overrides/${data.id}`);
                }}
              >
                <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
              </a>
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => removeWindowsServerOverrides(data.id)}
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
            Add Override
          </Button>
        </div>
      </div>
      <Form form={form} initialValues={inlineSearch} name="searchTable" onFinish={onFinish}>
        <Table
          scroll={{ x: true }}
          rowKey={(record) => record.id}
          dataSource={overrides.search.data}
          columns={getColumns()}
          loading={overrides.search.loading}
          pagination={{
            ...pagination,
            total: overrides.search.count,
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
