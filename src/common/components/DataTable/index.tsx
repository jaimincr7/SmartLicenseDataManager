import { Table, Form, Button, Checkbox, Popover, Popconfirm } from 'antd';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/app.hooks';
import { toast } from 'react-toastify';
import { IDataTable } from './dataTable.model';
import moment from 'moment';
import { DEFAULT_PAGE_SIZE } from '../../../common/constants/common';
import _ from 'lodash';
import { Filter } from './DataTableFilters';
import {
  fixedColumn,
  IInlineSearch,
  ISearch,
  ITableColumnSelection,
  orderByType,
} from '../../../common/models/common';
import {
  clearBulkDeleteMessage,
  clearCronJobSchedularMessages,
  commonSelector,
} from '../../../store/common/common.reducer';
import { FileExcelOutlined } from '@ant-design/icons';
import { bulkDelete, saveTableColumnSelection } from '../../../store/common/common.action';
import { globalSearchSelector } from '../../../store/globalSearch/globalSearch.reducer';
import ReactDragListView from 'react-drag-listview';
import { spsApiCallSelector } from '../../../store/sps/spsAPICall/spsApiCall.reducer';
import { startAll } from '../../../store/master/cron/cron.action';
import { IBulkDelete } from '../../../services/common/common.model';

let pageLoaded = false;

const DataTable: React.ForwardRefRenderFunction<unknown, IDataTable> = (props, ref) => {
  const {
    defaultOrderBy,
    showAddButton,
    showBulkUpdate,
    setShowSelectedListModal,
    globalSearchExist,
    extraSearchData,
    setSelectedId,
    getTableColumns,
    reduxSelector,
    tableAction,
    tableButtons,
    searchTableData,
    clearTableDataMessages,
    exportExcelFile,
    setTableColumnSelection,
    hideExportButton,
    showCallApiBtn,
    onCallAllApi,
    setValuesForSelection,
    setNumberOfRecords,
    disableRowSelection,
    setObjectForColumnFilter,
    isStartSchedulaAllApi,
    hideShowHideButton,
    type_id,
    isExcelColumnMapping,
    isSpsApiJobsId,
    setDropDownFlag,
    dropDownFlag,
    filterKeysDD,
    filterRecordsForLocalSearch,
    showDelete,
  } = props;

  const tableFilter = useRef({
    keyword: '',
    order_by: 'id',
    order_direction: 'DESC' as orderByType,
    filter_keys: {},
  });

  const reduxStoreData = useAppSelector(reduxSelector);
  const common = useAppSelector(commonSelector);
  const globalFilters = useAppSelector(globalSearchSelector);
  const spsApisState = useAppSelector(spsApiCallSelector);
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
  const [selectedRowList, setSelectedRowList] = React.useState([]);

  tableFilter.current.order_by = defaultOrderBy ? defaultOrderBy : tableFilter.current.order_by;

  //For checked List of Rows Selection
  const rowSelection = {
    selectedRowList,
    onChange: (selectedRowList) => {
      setSelectedRowList({
        ...selectedRowList,
        selectedRowList: selectedRowList,
      });
    },
  };

  const getSearchData = (page, isExportToExcel: boolean) => {
    const { filter_keys, ...rest } = tableFilter.current;

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
    Object.keys(inlineSearchFilterObj)?.forEach((key) => {
      const val = inlineSearchFilterObj[key];
      if (val?.length === 2 && typeof val[0] === 'object' && moment(val[0]).isValid()) {
        inlineSearchFilterObj[key] = {
          start_date: val[0],
          end_date: val[1],
        };
      }
    });

    const searchData: ISearch = {
      is_lookup: true,
      is_column_selection: !pageLoaded,
      limit: isStartSchedulaAllApi === true ? undefined : page.pageSize,
      offset: isStartSchedulaAllApi === true ? undefined : (page.current - 1) * page.pageSize,
      ...(rest || {}),
      filter_keys: type_id ? { api_type_id: type_id } : inlineSearchFilterObj,
      is_export_to_excel: isExportToExcel,
      ...(extraSearchData || {}),
    };
    pageLoaded = true;
    return searchData;
  };

  const fetchTableData = (page = null) => {
    const searchData = getSearchData(page, false);
    searchData;
    if (setObjectForColumnFilter) {
      let filterDate;
      if(isSpsApiJobsId || isExcelColumnMapping) {
        filterDate = {
          ...searchData.filter_keys,
          ...extraSearchData
        }
      } else {
        filterDate = {
          ...searchData.filter_keys,
        }
      }
      setObjectForColumnFilter({
        filter_keys: filterDate,
        keyword: searchData.keyword,
        limit: searchData.limit,
        offset: searchData.offset,
        is_column_selection: searchData.is_column_selection,
        order_by: tableFilter.current.order_by,
        order_direction: tableFilter.current.order_direction,
        column_called: [],
      });
    }
    //setCallColumnApi(true);
    if (isExcelColumnMapping === true) {
      searchData.filter_keys = { ...searchData.filter_keys, ...extraSearchData };
    }
    //For Sps Api Jobs Filter
    if (isSpsApiJobsId === true) {
      searchData.filter_keys = { ...searchData.filter_keys, ...extraSearchData };
    }
    dispatch(searchTableData(searchData));
  };
  useImperativeHandle(ref, () => ({
    refreshData() {
      fetchTableData();
    },
    getValuesForSelection() {
      const inlineSearchFilter = _.pickBy(tableFilter.current.filter_keys, function (value) {
        return !(
          value === undefined ||
          value === '' ||
          _.isNull(value) ||
          (Array.isArray(value) && value.length === 0)
        );
      });
      const Obj = {
        isLookup: !pageLoaded,
        filterKeys: inlineSearchFilter,
        is_export_to_excel: !pageLoaded,
        limit: 10,
        offset: 0,
        order_by: tableFilter.current.order_by,
        order_direction: tableFilter.current.order_direction,
        keyword: tableFilter.current.keyword,
      };
      Obj['selectedIds'] = selectedRowList;
      setValuesForSelection(Obj);
    },
    getNumberOfRecordsForUpdate() {
      if (Object.keys(selectedRowList).length <= 1) {
        setNumberOfRecords(reduxStoreData.search.count);
      } else {
        setNumberOfRecords(Object.keys(selectedRowList).length - 1);
      }
    },
  }));

  React.useEffect(() => {
    return () => {
      //For RowSelection in Table
      pageLoaded = false;
      tableFilter.current = {
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
      }
      tableFilter.current.filter_keys = { ...tableFilter.current.filter_keys, ...globalSearch };
      setPagination({ ...pagination, current: 1 });
      fetchTableData({ ...pagination, current: 1 });
    }
  }, [globalFilters.search]);

  React.useEffect(() => {
    const isGlobalSearchExist: boolean = globalSearchExist === undefined ? true : globalSearchExist;
    if (!isGlobalSearchExist) {
      setPagination({ ...pagination, current: 1 });
      fetchTableData({ ...pagination, current: 1 });
    }
  }, []);
  // End: Global Search

  // Start: Pagination ans Sorting
  const handleTableChange = (paginating, filters, sorter) => {
    if (!isStartSchedulaAllApi) {
      tableFilter.current = {
        ...tableFilter.current,
        order_by:
          sorter.field ||
          sorter.column?.children[0]?.dataIndex ||
          (defaultOrderBy ? defaultOrderBy : 'id'),
        order_direction: (sorter.order === 'ascend' ? 'ASC' : 'DESC') as orderByType,
      };
      setPagination(paginating);
      fetchTableData(paginating);
    }
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

  React.useEffect(() => {
    if (common.bulkDelete?.messages && common.bulkDelete?.messages.length > 0) {
      if (common.bulkDelete.hasErrors) {
        toast.error(common.bulkDelete?.messages.join(' '));
      } else {
        toast.warn(common.bulkDelete?.messages.join(' '));
      }
      dispatch(clearBulkDeleteMessage());
    }
  }, [common?.bulkDelete?.messages]);

  React.useEffect(() => {
    if (common.manageCronJob?.messages && common.manageCronJob?.messages.length > 0) {
      if (common.manageCronJob.hasErrors) {
        toast.error(common.manageCronJob?.messages.join(' '));
      } else {
        toast.success(common.manageCronJob?.messages.join(' '));
      }
      dispatch(clearCronJobSchedularMessages());
    }
  }, [common.manageCronJob.messages]);
  // End: Delete action

  // Keyword search
  const onFinishSearch = (value: string) => {
    tableFilter.current = {
      ...tableFilter.current,
      keyword: value,
    };
    setPagination({ ...pagination, current: 1 });
    fetchTableData({ ...pagination, current: 1 });
  };

  // Start: Column level filter
  const onFinish = (values: IInlineSearch) => {
    tableFilter.current.filter_keys = values;
    setPagination({ ...pagination, current: 1 });
    fetchTableData({ ...pagination, current: 1 });
  };
  const onReset = () => {
    if (setDropDownFlag) setDropDownFlag(false);
    const globalSearch: IInlineSearch = {};
    for (const key in globalFilters.search) {
      const element = globalFilters.search[key];
      globalSearch[key] = element ? [element] : null;
    }
    if (
      globalFilters.search.tenant_id &&
      globalFilters.search.tenant_id !== 0 &&
      !(globalSearchExist == false)
    ) {
      const initlValues = {
        company_id: _.isNull(globalSearch.company_id) ? null : globalSearch.company_id[0],
        bu_id: _.isNull(globalSearch.bu_id) ? null : globalSearch.bu_id[0],
        tenant_id: _.isNull(globalSearch.tenant_id) ? null : globalSearch.tenant_id[0],
      };
      form.setFieldsValue(initlValues);
      if (globalFilters.search) {
        onFinish(initlValues);
      }
    } else {
      onFinish({});
    }
  };
  React.useEffect(() => {
    form.resetFields();
  }, [inlineSearch]);
  // End: Column level filter

  // Export Excel
  const downloadExcel = () => {
    const exArr: any[] = getColumns();
    setLoading(true);
    const export_column_details: Array<{ key: string; index: any; label: string }> = [];
    exArr.map((column, index) => {
      if (column?.children[0]?.key !== 'Actions') {
        export_column_details.push({
          key: column?.children[0]?.key,
          index: index + 1,
          label: column.title.props?.children,
        });
      }
    });
    const searchData = getSearchData(pagination, true);
    searchData.is_lookup = false;
    searchData.limit = 0;
    const exportData = {
      ...searchData,
      export_column_details,
      total_records: reduxStoreData.search.count,
      table_name: reduxStoreData.search.tableName,
    };

    return exportExcelFile(exportData).then((res) => {
      if (res && res?.data?.body?.messages) {
        toast.warning(res.data.body.messages.join(' '));
      } else {
        toast.error('Document not available.');
        //window.open(window.location.href);
        // const fileName = `${res.headers['content-disposition'].split('filename=')[1]}`; //res.headers["content-disposition"];
        // const url = window.URL.createObjectURL(new Blob([res.data]));
        // exportExcel(fileName, url);
      }
      setLoading(false);
    });
  };

  // Table columns
  let columns = [
    ...(getTableColumns(form) || []),
    {
      title: 'Actions',
      column: 'Actions',
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
      if (isAllDeselected) {
        toast.info('Please select any column.');
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
      if (disableRowSelection) {
        const item = updatedColumns.splice(fromIndex, 1)[0];
        updatedColumns.splice(toIndex, 0, item);
      } else {
        const item = updatedColumns.splice(fromIndex - 1, 1)[0];
        updatedColumns.splice(toIndex - 1, 0, item);
      }
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

      const remainingColumns = [];
      let updatedColumns = sortedOrder?.map((a) =>
        tableColumns.find((x) =>
          x.column
            ? x.column.toString().toLowerCase() === a.toString().toLowerCase()
            : x.title === a
        )
      );
      updatedColumns = updatedColumns.filter((data) => data !== undefined);
      for (const key in tableColumns) {
        const element = tableColumns[key];
        const flagColumn = updatedColumns.filter(
          (x) => x?.column.toString().toLowerCase() === element?.column.toString().toLowerCase()
        );
        if (flagColumn && flagColumn.length < 1) {
          remainingColumns.push(element);
        }
      }
      let updatedVar = [];
      if (remainingColumns.length) {
        updatedVar = [...remainingColumns, ...updatedColumns];
        setTableColumns(updatedVar);
      } else {
        setTableColumns(updatedColumns);
      }
    }
  }, [reduxStoreData?.tableColumnSelection?.column_orders]);

  const getColumns = () => {
    if (tableColumns.length > 0) {
      columns = tableColumns.map((i) => columns?.find((j) => j?.column === i?.column));
    }
    return columns?.filter((col) => {
      return col?.column in reduxStoreData.tableColumnSelection.columns
        ? reduxStoreData.tableColumnSelection.columns[col.column]
        : true;
    });
  };

  const onRowSelection = () => {
    if (onCallAllApi) {
      onCallAllApi(tableFilter.current);
    }
  };

  const bulkDeleteData = () => {
    const inlineSearchFilter = _.pickBy(tableFilter.current.filter_keys, function (value) {
      return !(
        value === undefined ||
        value === '' ||
        _.isNull(value) ||
        (Array.isArray(value) && value.length === 0)
      );
    });
    const Obj: IBulkDelete = {
      filter_keys: inlineSearchFilter,
      is_export_to_excel: !pageLoaded,
      limit: 10,
      offset: 0,
      order_by: tableFilter.current.order_by,
      order_direction: tableFilter.current.order_direction,
      keyword: tableFilter.current.keyword,
      table_name: reduxStoreData.search.tableName,
    };
    const list: any = {
      ...selectedRowList,
    };
    const data = list?.selectedRowList?.map((x) => (x = x?.split('-')[0]));
    Obj['selectedIds'] = data;
    dispatch(bulkDelete(Obj));
  };

  const renderCallApiButton = () => {
    if (showCallApiBtn) {
      return (
        <Button
          loading={spsApisState.callAllApi.loading}
          className="btn-icon"
          onClick={() => {
            if (isStartSchedulaAllApi) {
              const inlineSearchFilter = _.pickBy(
                tableFilter.current.filter_keys,
                function (value) {
                  return !(
                    value === undefined ||
                    value === '' ||
                    _.isNull(value) ||
                    (Array.isArray(value) && value.length === 0)
                  );
                }
              );
              const Obj = {
                isLookup: !pageLoaded,
                filterKeys: dropDownFlag === true ? { ...filterKeysDD } : inlineSearchFilter,
                is_export_to_excel: !pageLoaded,
                limit: 10,
                offset: 0,
                order_by: tableFilter.current.order_by,
                order_direction: tableFilter.current.order_direction,
                keyword: tableFilter.current.keyword,
              };
              setDropDownFlag(false);
              dispatch(startAll(Obj));
            } else {
              onRowSelection();
            }
          }}
        >
          {isStartSchedulaAllApi ? <>Schedule All</> : <>Call All API</>}
        </Button>
      );
    }
  };

  return (
    <>
      <div className="title-block search-block tabel-search">
        <Filter onSearch={onFinishSearch} />
        <div className="btns-block">
          {tableButtons ? tableButtons() : <></>}
          {!hideExportButton &&
            (reduxStoreData.search.count > 50000 ? (
              <Popconfirm title="Do you want to export file?" onConfirm={downloadExcel}>
                <Button icon={<FileExcelOutlined />} loading={loading}>
                  Export
                </Button>
              </Popconfirm>
            ) : (
              <Button
                onClick={downloadExcel}
                icon={<FileExcelOutlined />}
                loading={loading}
                disabled={reduxStoreData.search.count === 0}
              >
                Export
              </Button>
            ))}
          {hideShowHideButton ? (
            <></>
          ) : (
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
          )}
          {renderCallApiButton()}
          {showDelete !== false && (
            <Popconfirm title="Delete Record?" onConfirm={() => bulkDeleteData()}>
              <Button type="primary" disabled={reduxStoreData.search.count == 0}>
                {Object.keys(selectedRowList).length <= 1
                  ? `Delete All (${
                      dropDownFlag === true
                        ? filterRecordsForLocalSearch?.length
                        : reduxStoreData.search.count
                    })`
                  : `Delete Selected (${Object.keys(selectedRowList).length - 1})`}
              </Button>
            </Popconfirm>
          )}
          {showBulkUpdate && (
            <Button
              type="primary"
              onClick={() => {
                setShowSelectedListModal(true);
              }}
              disabled={reduxStoreData.search.count == 0}
            >
              {Object.keys(selectedRowList).length <= 1
                ? `Update All (${
                    dropDownFlag === true
                      ? filterRecordsForLocalSearch?.length
                      : reduxStoreData.search.count
                  })`
                : `Update Selected (${Object.keys(selectedRowList).length - 1})`}
            </Button>
          )}
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
            rowSelection={!disableRowSelection ? rowSelection : null}
            scroll={{ x: true }}
            rowKey={(record) =>
              record[defaultOrderBy ? defaultOrderBy : 'id'] +
              '-' +
              (record['oauth_id'] ? record['oauth_id'] : '')
            }
            dataSource={
              dropDownFlag === true ? filterRecordsForLocalSearch : reduxStoreData.search.data
            }
            columns={isDragged ? tableColumns : getColumns()}
            loading={
              reduxStoreData.search.loading ||
              reduxStoreData?.delete?.loading ||
              reduxStoreData?.callAllApi?.loading ||
              reduxStoreData?.callApi?.loading ||
              reduxStoreData?.runJobData?.loading
            }
            pagination={
              isStartSchedulaAllApi
                ? false
                : {
                    ...pagination,
                    pageSizeOptions: ['10', '100', '500', '1000'],
                    showSizeChanger: true,
                    total: reduxStoreData.search.count,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                  }
            }
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
