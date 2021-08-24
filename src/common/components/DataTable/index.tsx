import { Table, Form, Button, Checkbox, Popover } from 'antd';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/app.hooks';
import { toast } from 'react-toastify';
import { IDataTable } from './dataTable.model';
import moment from 'moment';
import { allDateColumns, DEFAULT_PAGE_SIZE, exportExcel } from '../../../common/constants/common';
import _ from 'lodash';
import { Filter } from './DataTableFilters';
import {
  fixedColumn,
  IInlineSearch,
  ISearch,
  ITableColumnSelection,
  orderByType,
} from '../../../common/models/common';
import { commonSelector } from '../../../store/common/common.reducer';
import { FileExcelOutlined } from '@ant-design/icons';
import { saveTableColumnSelection } from '../../../store/common/common.action';
import { globalSearchSelector } from '../../../store/globalSearch/globalSearch.reducer';
import ReactDragListView from 'react-drag-listview';

let pageLoaded = false;

let tableFilter = {
  keyword: '',
  order_by: 'id',
  order_direction: 'DESC' as orderByType,
  filter_keys: {},
};

const DataTable: React.ForwardRefRenderFunction<unknown, IDataTable> = (props, ref) => {
  const {
    defaultOrderBy,
    showAddButton,
    globalSearchExist,
    extraSearchData,
    setSelectedId,
    getTableColumns,
    reduxSelector,
    tableAction,
    searchTableData,
    clearTableDataMessages,
    exportExcelFile,
    setTableColumnSelection,
    hideExportButton,
  } = props;

  const reduxStoreData = useAppSelector(reduxSelector);
  const common = useAppSelector(commonSelector);
  const globalFilters = useAppSelector(globalSearchSelector);
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const [inlineSearch, setInlineSearch] = useState<IInlineSearch>({});
  const [indeterminate, setIndeterminate] = React.useState(false);
  const [checkAll, setCheckAll] = React.useState(false);
  const [isDragged, setIsDragged] = React.useState(false);
  const [tableColumns, setTableColumns] = React.useState([]);
  tableFilter.order_by = defaultOrderBy ? defaultOrderBy : tableFilter.order_by;

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

    const inlineSearchFilterObj: { [key: string]: any } = { ...inlineSearchFilter };
    allDateColumns.forEach((colName: string) => {
      if (colName in inlineSearchFilterObj) {
        const currentColValue = inlineSearchFilterObj[colName];
        if (currentColValue?.length === 2 && typeof currentColValue[0] === 'object') {
          inlineSearchFilterObj[colName] = {
            start_date: currentColValue[0],
            end_date: currentColValue[1],
          };
        }
      }
    });

    const searchData: ISearch = {
      is_lookup: !pageLoaded,
      is_column_selection: !pageLoaded,
      limit: page.pageSize,
      offset: (page.current - 1) * page.pageSize,
      ...(rest || {}),
      filter_keys: inlineSearchFilterObj,
      is_export_to_excel: isExportToExcel,
      ...(extraSearchData || {}),
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
    const isGlobalSearchExist: boolean = globalSearchExist === undefined ? true : globalSearchExist;
    if (isGlobalSearchExist) {
      const globalSearch: IInlineSearch = {};
      for (const key in globalFilters.search) {
        const element = globalFilters.search[key];
        globalSearch[key] = element ? [element] : null;
        // if (element) {
        //   globalSearch[key] = [element];
        // }
      }
      tableFilter.filter_keys = { ...tableFilter.filter_keys, ...globalSearch };
      setPagination({ ...pagination, current: 1 });
      fetchTableData({ ...pagination, current: 1 });
    } else {
      setPagination({ ...pagination, current: 1 });
      fetchTableData({ ...pagination, current: 1 });
    }
  }, [globalFilters.search]);
  // End: Global Search

  // Start: Pagination ans Sorting
  const handleTableChange = (paginating, filters, sorter) => {
    tableFilter = {
      ...tableFilter,
      order_by:
        sorter.field ||
        sorter.column?.children[0]?.dataIndex ||
        (defaultOrderBy ? defaultOrderBy : 'id'),
      order_direction: (sorter.order === 'ascend' ? 'ASC' : 'DESC') as orderByType,
    };
    setPagination(paginating);
    fetchTableData(paginating);
  };

  React.useEffect(() => {
    if (reduxStoreData.delete?.messages && reduxStoreData.delete?.messages.length > 0) {
      if (reduxStoreData.delete.hasErrors) {
        toast.error(reduxStoreData.delete?.messages.join(' '));
      } else {
        toast.success(reduxStoreData.delete?.messages.join(' '));
        fetchTableData();
      }
      dispatch(clearTableDataMessages());
    }
  }, [reduxStoreData?.delete?.messages]);
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
  let columns = [
    ...(getTableColumns(form) || []),
    {
      title: 'Actions',
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
          key: 'Actions',
          width: '80px',
          fixed: 'right' as fixedColumn,
          render: tableAction ? tableAction : () => <></>,
        },
      ],
    },
  ];

  React.useEffect(() => {
    setTableColumns(columns);
  }, [reduxStoreData.tableColumnSelection.table_name]);

  React.useEffect(() => {
    handleIndeterminate();
  }, [reduxStoreData.tableColumnSelection.columns]);

  // Start: Hide-show columns
  const hideShowColumn = (e, title) => {
    let tableColumnsObj: { [key: string]: boolean } = reduxStoreData.tableColumnSelection.columns;
    if (Object.keys(tableColumnsObj)?.length === 0) {
      columns?.forEach((col) => {
        tableColumnsObj = {
          ...tableColumnsObj,
          [col.column ? col.column : col.title]: true,
        };
      });
    }
    if (e.target.checked) {
      dispatch(setTableColumnSelection({ ...tableColumnsObj, [title]: true }));
    } else {
      dispatch(setTableColumnSelection({ ...tableColumnsObj, [title]: false }));
    }
    handleIndeterminate();
  };

  const handleIndeterminate = () => {
    const selectedColumns = columns
      .filter((col) => reduxStoreData.tableColumnSelection.columns[col.column] !== false)
      .map((x) => x.title);
    setIndeterminate(!!selectedColumns.length && selectedColumns.length < columns.length);
    setCheckAll(selectedColumns.length === columns.length);
  };

  const saveTableColumns = () => {
    let tableColumnSelectionObj: ITableColumnSelection = reduxStoreData.tableColumnSelection;
    columns?.forEach((col, index) => {
      tableColumnSelectionObj = {
        ...tableColumnSelectionObj,
        column_orders: {
          ...tableColumnSelectionObj.column_orders,
          [col.column ? col.column : col.title]: index,
        },
      };
    });

    if (Object.keys(tableColumnSelectionObj.columns)?.length === 0) {
      columns?.forEach((col) => {
        tableColumnSelectionObj = {
          ...tableColumnSelectionObj,
          columns: {
            ...tableColumnSelectionObj.columns,
            [col.column ? col.column : col.title]: true,
          },
        };
      });
    } else {
      const isAllDeselected = Object.values(tableColumnSelectionObj.columns).every(
        (col) => col === false
      );
      if (isAllDeselected && tableColumnSelectionObj.id !== null) {
        toast.info('Please select some columns.');
        return false;
      }
    }

    dispatch(saveTableColumnSelection(tableColumnSelectionObj)).then(() => {
      if (!tableColumnSelectionObj.id) {
        pageLoaded = false;
        fetchTableData();
      }
    });
  };

  const handleSelectAllChange = (e) => {
    let selectedColumns: { [key: string]: boolean } = {};
    setIndeterminate(false);
    setCheckAll(e.target.checked);
    columns.forEach((col) => {
      selectedColumns = { ...selectedColumns, [col.column]: e.target.checked };
    });
    dispatch(setTableColumnSelection(selectedColumns));
  };

  const renderColumnNames = () => {
    const names = [...columns];
    return names
      ?.sort((a, b) => a.column?.localeCompare(b.column))
      ?.map((col, i) => (
        <li key={`li-${i}-${col.column}`}>
          <Checkbox
            checked={
              col.column in reduxStoreData.tableColumnSelection.columns
                ? reduxStoreData.tableColumnSelection.columns[col.column]
                : true
            }
            onClick={(e) => hideShowColumn(e, col.column)}
          >
            {col.title}
          </Checkbox>
        </li>
      ));
  };
  const dropdownMenu = (
    <div className="checkbox-list-wrapper">
      <ul className="checkbox-list">
        <li className="line-bottom">
          <Checkbox
            className="strong"
            checked={checkAll}
            onClick={handleSelectAllChange}
            indeterminate={indeterminate}
          >
            Select All
          </Checkbox>
        </li>
        {renderColumnNames()}
      </ul>
      <div className="bottom-fix">
        <Button
          type="primary"
          className="w-100"
          loading={common.saveTableColumnSelection.loading}
          onClick={saveTableColumns}
        >
          Save
        </Button>
      </div>
    </div>
  );

  // End: Hide-show columns
  const dragProps = {
    onDragEnd(fromIndex, toIndex) {
      const visibleColumns = columns?.filter((col) => {
        return col.column in reduxStoreData.tableColumnSelection.columns
          ? reduxStoreData.tableColumnSelection.columns[col.column]
          : true;
      });

      fromIndex = tableColumns.findIndex((x) => x.column === visibleColumns[fromIndex]?.column);
      toIndex = tableColumns.findIndex((x) => x.column === visibleColumns[toIndex]?.column);
      const updatedColumns = [...tableColumns];
      const item = updatedColumns.splice(fromIndex, 1)[0];
      updatedColumns.splice(toIndex, 0, item);
      setTableColumns(updatedColumns);
      setIsDragged(true);
      setTimeout(() => {
        setIsDragged(false);
      });
    },
    nodeSelector: 'th',
    handleSelector: '.dragHandler',
  };

  useEffect(() => {
    if (reduxStoreData?.tableColumnSelection?.column_orders) {
      const sortedOrder = Object.keys(reduxStoreData?.tableColumnSelection?.column_orders)?.sort(
        function (a, b) {
          return (
            reduxStoreData?.tableColumnSelection?.column_orders[a] -
            reduxStoreData?.tableColumnSelection?.column_orders[b]
          );
        }
      );

      const updatedColumns = sortedOrder?.map((a) =>
        tableColumns.find((x) => (x.column ? x.column === a : x.title === a))
      );
      setTableColumns(updatedColumns);
    }
  }, [reduxStoreData?.tableColumnSelection?.column_orders]);

  const getColumns = () => {
    if (tableColumns.length > 0) {
      columns = tableColumns.map((i) => columns.find((j) => j.column === i.column));
    }
    return columns?.filter((col) => {
      return col.column in reduxStoreData.tableColumnSelection.columns
        ? reduxStoreData.tableColumnSelection.columns[col.column]
        : true;
    });
  };

  return (
    <>
      <div className="title-block search-block">
        <Filter onSearch={onFinishSearch} />
        <div className="btns-block">
          {!hideExportButton && (
            <Button
              onClick={downloadExcel}
              icon={<FileExcelOutlined />}
              loading={loading}
              disabled={reduxStoreData.search.count === 0}
            >
              Export
            </Button>
          )}
          <Popover content={dropdownMenu} trigger="click" overlayClassName="custom-popover">
            <Button
              disabled={reduxStoreData.search.count === 0}
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
        <ReactDragListView {...dragProps}>
          <Table
            scroll={{ x: true }}
            rowKey={(record) => record[defaultOrderBy ? defaultOrderBy : 'id']}
            dataSource={reduxStoreData.search.data}
            columns={isDragged ? tableColumns : getColumns()}
            loading={reduxStoreData.search.loading || reduxStoreData?.delete?.loading}
            pagination={{
              ...pagination,
              pageSizeOptions: ['10', '100', '500', '2500'],
              total: reduxStoreData.search.count,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            }}
            onChange={handleTableChange}
            className="custom-table"
            sortDirections={['ascend', 'descend']}
          />
        </ReactDragListView>
      </Form>
    </>
  );
};

export default forwardRef(DataTable);
