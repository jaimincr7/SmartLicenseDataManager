import { Table, Form, Button, Checkbox, Popover } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/app.hooks';
import { toast } from 'react-toastify';
import { IDataTable } from './dataTable.model';
import moment from 'moment';
import { DEFAULT_PAGE_SIZE, exportExcel } from '../../../common/constants/common';
import _ from 'lodash';
import { Filter } from './DataTableFilters';
import { fixedColumn, IInlineSearch, ISearch, orderByType } from '../../../common/models/common';
import { commonSelector } from '../../../store/common/common.reducer';
import { FileExcelOutlined } from '@ant-design/icons';
import { saveTableColumnSelection } from '../../../store/common/common.action';

let pageLoaded = false;

let tableFilter = {
  keyword: '',
  order_by: 'id',
  order_direction: 'DESC' as orderByType,
  filter_keys: {},
};

const DataTable: React.ForwardRefRenderFunction<unknown, IDataTable> = (props, ref) => {
  const {
    showAddButton,
    setSelectedId,
    getTableColumns,
    reduxSelector,
    tableAction,
    searchTableData,
    clearTableDataMessages,
    exportExcelFile,
    setTableColumnSelection,
  } = props;

  const reduxStoreData = useAppSelector(reduxSelector);
  const commonFilters = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

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

    const searchData: ISearch = {
      is_lookup: !pageLoaded,
      is_column_selection: !pageLoaded,
      limit: page.pageSize,
      offset: (page.current - 1) * page.pageSize,
      ...(rest || {}),
      filter_keys: inlineSearchFilter,
      is_export_to_excel: isExportToExcel,
    };
    pageLoaded = true;
    return searchData;
  };

  const fetchTableData = (page = null) => {
    const searchData = getSearchData(page, false);
    dispatch(searchTableData(searchData));
  };
  useImperativeHandle(ref, () => ({
    refreshData() {
      fetchTableData();
    },
  }));
  React.useEffect(() => {
    return () => {
      pageLoaded = false;
      tableFilter = {
        keyword: '',
        order_by: 'id',
        order_direction: 'DESC' as orderByType,
        filter_keys: {},
      };
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
    fetchTableData({ ...pagination, current: 1 });
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
    fetchTableData(paginating);
  };

  React.useEffect(() => {
    if (reduxStoreData.delete.messages.length > 0) {
      if (reduxStoreData.delete.hasErrors) {
        toast.error(reduxStoreData.delete.messages.join(' '));
      } else {
        toast.success(reduxStoreData.delete.messages.join(' '));
        fetchTableData();
      }
      dispatch(clearTableDataMessages());
    }
  }, [reduxStoreData.delete.messages]);
  // End: Delete action

  // Keyword search
  const onFinishSearch = (value: string) => {
    tableFilter = {
      ...tableFilter,
      keyword: value,
    };
    setPagination({ ...pagination, current: 1 });
    fetchTableData({ ...pagination, current: 1 });
  };

  // Start: Column level filter
  const onFinish = (values: IInlineSearch) => {
    tableFilter.filter_keys = values;
    setPagination({ ...pagination, current: 1 });
    fetchTableData({ ...pagination, current: 1 });
  };
  const onReset = () => {
    onFinish({});
  };
  React.useEffect(() => {
    form.resetFields();
  }, [inlineSearch]);

  // End: Column level filter

  // Export Excel
  const downloadExcel = () => {
    setLoading(true);
    const searchData = getSearchData(pagination, true);

    return exportExcelFile(searchData).then((res) => {
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
    ...(getTableColumns(form) || []),
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
          render: tableAction,
        },
      ],
    },
  ];

  // Start: Hide-show columns
  const hideShowColumn = (e, title) => {
    if (e.target.checked) {
      dispatch(
        setTableColumnSelection({ ...reduxStoreData.tableColumnSelection.columns, [title]: true })
      );
    } else {
      dispatch(
        setTableColumnSelection({ ...reduxStoreData.tableColumnSelection.columns, [title]: false })
      );
    }
  };

  const saveTableColumns = () => {
    const isAllDeselected = Object.values(reduxStoreData.tableColumnSelection.columns).every(
      (col) => col === false
    );
    if (isAllDeselected) {
      toast.info('Please select some columns.');
      return false;
    }
    dispatch(saveTableColumnSelection(reduxStoreData.tableColumnSelection));
  };

  const handleSelectAllChange = (e) => {
    let selectedColumns: { [key: string]: boolean } = {};
    columns.forEach((col) => {
      selectedColumns = { ...selectedColumns, [col.title]: e.target.checked };
    });
    dispatch(setTableColumnSelection(selectedColumns));
  };

  const dropdownMenu = (
    <div className="checkbox-list-wrapper">
      <ul className="checkbox-list">
        <li className="line-bottom">
          <Checkbox
            className="strong"
            checked={Object.values(reduxStoreData.tableColumnSelection.columns).every(
              (el) => el === true
            )}
            onClick={handleSelectAllChange}
            indeterminate={
              !Object.values(reduxStoreData.tableColumnSelection.columns).every(
                (el) => el === true
              ) &&
              !Object.values(reduxStoreData.tableColumnSelection.columns).every(
                (el) => el === false
              )
            }
          >
            Select All
          </Checkbox>
        </li>
        {columns.map((col) => (
          <li key={col.title}>
            <Checkbox
              checked={reduxStoreData.tableColumnSelection.columns[col.title] !== false}
              onClick={(e) => hideShowColumn(e, col.title)}
            >
              {col.title}
            </Checkbox>
          </li>
        ))}
      </ul>
      <div className="bottom-fix">
        <Button
          type="primary"
          className="w-100"
          loading={commonFilters.saveTableColumnSelection.loading}
          onClick={saveTableColumns}
        >
          Save
        </Button>
      </div>
    </div>
  );
  const getColumns = () => {
    return columns.filter((col) => {
      return reduxStoreData.tableColumnSelection.columns[col.title] !== false;
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
          {showAddButton && (
            <Button
              type="primary"
              onClick={() => {
                setSelectedId(0);
              }}
            >
              Add
            </Button>
          )}
        </div>
      </div>
      <Form form={form} initialValues={inlineSearch} name="searchTable" onFinish={onFinish}>
        <Table
          scroll={{ x: true }}
          rowKey={(record) => record.id}
          dataSource={reduxStoreData.search.data}
          columns={getColumns()}
          loading={reduxStoreData.search.loading}
          pagination={{
            ...pagination,
            total: reduxStoreData.search.count,
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
