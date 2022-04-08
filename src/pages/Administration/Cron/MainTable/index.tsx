import { Form, Popconfirm, Select } from 'antd';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import _ from 'lodash';
import {
  FilterByDateSwap,
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import DataTable from '../../../../common/components/DataTable';
import { setTableColumnSelection } from '../../../../store/master/cron/cron.reducer';
import {
  deleteCron,
  searchCron,
  startApi,
  stopApi,
} from '../../../../store/master/cron/cron.action';
import { clearCronMessages, cronSelector } from '../../../../store/master/cron/cron.reducer';
import { globalSearchSelector } from '../../../../store/globalSearch/globalSearch.reducer';
import { useHistory } from 'react-router-dom';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import moment from 'moment';
import { Common } from '../../../../common/constants/common';
import { CaretRightOutlined, PauseOutlined } from '@ant-design/icons';
import { IStartApi } from '../../../../services/master/cron/cron.model';
import { toast } from 'react-toastify';
import { IMainTableCron } from './mainTable';

const { Option } = Select;

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTableCron> = (props, ref) => {
  const cron = useAppSelector(cronSelector);
  const dataTableRef = useRef(null);
  const dispatch = useAppDispatch();
  const history = useHistory();
  const globalFilters = useAppSelector(globalSearchSelector);
  const [ObjectForColumnFilter, setObjectForColumnFilter] = useState({});
  const [filterKeysID, setFilterKeysID] = useState({});
  const [filterRecords, setFilterRecords] = useState([]);

  const {
    setSelectedId,
    setShowSelectedListModal,
    setValuesForSelection,
    isMultiple,
    setFilterKeys,
    dropDownFlag,
    setDropDownFlag,
  } = props;

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  useEffect(() => {
    if (isMultiple && dropDownFlag === false) {
      dataTableRef?.current.getValuesForSelection();
    }
  }, [isMultiple]);

  const refreshDataTable = () => {
    dataTableRef?.current.refreshData();
  };

  const FilterBySwap = (dataIndex: string, form) => {
    setFilterKeys(ObjectForColumnFilter);
    return FilterWithSwapOption(
      dataIndex,
      cron.search.tableName,
      form,
      null,
      ObjectForColumnFilter
    );
  };

  //For Searching in Week Day...
  const searchWeekDay = (event) => {
    if (event !== undefined) {
      setDropDownFlag(true);
      const dummyRecords = _.cloneDeep(cron.search.data);
      const searchRecords = dummyRecords.filter(
        (data) => moment(data.start_date).format('dddd') === event
      );
      const filterIds = [];
      searchRecords.map((data) => {
        filterIds.push(data.id);
      });
      setFilterKeysID({ id: filterIds });
      setValuesForSelection({ ...ObjectForColumnFilter, selectedIds: filterIds });
      setFilterKeys({ ...ObjectForColumnFilter, filter_keys: { id: filterIds } });
      setFilterRecords(searchRecords);
    } else {
      setDropDownFlag(false);
    }
    //dispatch(searchWeekDays(searchRecords));
  };

  const FilterByWeekDay = () => {
    return (
      <div className="input-filter-group">
        <Form.Item name={'week_day'} className="m-0 filter-input sm">
          <Select
            placeholder="Select"
            maxTagCount="responsive"
            onChange={(event) => searchWeekDay(event)}
            allowClear
            showSearch
            //disabled={dropDownFlag}
            optionFilterProp="children"
            filterOption={(input, option: any) =>
              option.children
                ?.toString()
                ?.toLowerCase()
                .indexOf(input?.toString()?.toLowerCase()) >= 0
            }
            filterSort={(optionA: any, optionB: any) =>
              optionA.children
                ?.toString()
                ?.toLowerCase()
                ?.localeCompare(optionB.children?.toString()?.toLowerCase())
            }
          >
            <Option value="Monday">Monday</Option>
            <Option value="Tuesday">Tuesday</Option>
            <Option value="Wednesday">Wednesday</Option>
            <Option value="Thursday">Thursday</Option>
            <Option value="Friday">Friday</Option>
            <Option value="Saturday">Saturday</Option>
            <Option value="Sunday">Sunday</Option>
          </Select>
        </Form.Item>
      </div>
    );
  };

  //For Searching in Month Day...
  const searchMonthDay = (event) => {
    if (event !== undefined) {
      setDropDownFlag(true);
      const dummyRecords = _.cloneDeep(cron.search.data);
      const searchRecords = dummyRecords.filter((data) => data.month_day_name === +event);
      const filterIds = [];
      searchRecords.map((data) => {
        filterIds.push(data.id);
      });
      setFilterKeysID({ id: filterIds });
      setValuesForSelection({ ...ObjectForColumnFilter, selectedIds: filterIds });
      setFilterKeys({ ...ObjectForColumnFilter, filter_keys: { id: filterIds } });
      setFilterRecords(searchRecords);
    } else {
      setDropDownFlag(false);
    }
    //dispatch(searchWeekDays(searchRecords));
  };

  const FilterByMonthDay = () => {
    return (
      <div className="input-filter-group">
        <Form.Item name={'month_day'} className="m-0 filter-input sm">
          <Select
            placeholder="Select"
            maxTagCount="responsive"
            onChange={(event) => searchMonthDay(event)}
            allowClear
            showSearch
            //disabled={dropDownFlag}
            optionFilterProp="children"
            filterOption={(input, option: any) =>
              option.children
                ?.toString()
                ?.toLowerCase()
                .indexOf(input?.toString()?.toLowerCase()) >= 0
            }
            filterSort={(optionA: any, optionB: any) =>
              optionA.children
                ?.toString()
                ?.toLowerCase()
                ?.localeCompare(optionB.children?.toString()?.toLowerCase())
            }
          >
            <Option value="1">1</Option>
            <Option value="2">2</Option>
            <Option value="3">3</Option>
            <Option value="4">4</Option>
            <Option value="5">5</Option>
            <Option value="6">6</Option>
            <Option value="7">7</Option>
            <Option value="8">8</Option>
            <Option value="9">9</Option>
            <Option value="10">10</Option>
            <Option value="11">11</Option>
            <Option value="12">12</Option>
            <Option value="13">13</Option>
            <Option value="14">14</Option>
            <Option value="15">15</Option>
            <Option value="16">16</Option>
            <Option value="17">17</Option>
            <Option value="18">18</Option>
            <Option value="19">19</Option>
            <Option value="20">20</Option>
            <Option value="21">21</Option>
            <Option value="22">22</Option>
            <Option value="23">23</Option>
            <Option value="24">24</Option>
            <Option value="25">25</Option>
            <Option value="26">26</Option>
            <Option value="27">27</Option>
            <Option value="28">28</Option>
            <Option value="29">29</Option>
            <Option value="30">30</Option>
            <Option value="31">31</Option>
          </Select>
        </Form.Item>
      </div>
    );
  };

  const getTableColumns = (form) => {
    return [
      {
        title: <span className="dragHandler">Id</span>,
        column: 'Id',
        sorter: (a, b) => a.id - b.id,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('id', form),
            dataIndex: 'id',
            key: 'id',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">API Group</span>,
        column: 'ApiGroupId',
        sorter: (a, b) => a.api_group_name.localeCompare(b.api_group_name),
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown('api_group_id', cron.search.lookups?.api_groups),
            dataIndex: 'api_group_name',
            key: 'api_group_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Tenant Name</span>,
        column: 'TenantId',
        sorter: (a, b) => a.tenant_name.localeCompare(b.tenant_name),
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown(
              'tenant_id',
              cron.search.lookups?.tenants?.length > 0
                ? cron.search.lookups?.tenants
                : globalFilters?.globalTenantLookup?.data
            ),
            dataIndex: 'tenant_name',
            key: 'tenant_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Company Name</span>,
        column: 'CompanyId',
        sorter: (a, b) => a.company_name.localeCompare(b.company_name),
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown(
              'company_id',
              cron.search.lookups?.companies?.length > 0
                ? cron.search.lookups?.companies
                : globalFilters?.globalCompanyLookup?.data
            ),
            dataIndex: 'company_name',
            key: 'company_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Bu Name</span>,
        column: 'BU_Id',
        sorter: (a, b) => a.bu_name.localeCompare(b.bu_name),
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown(
              'bu_id',
              cron.search.lookups?.bus?.length > 0
                ? cron.search.lookups?.bus
                : globalFilters?.globalBULookup?.data
            ),
            dataIndex: 'bu_name',
            key: 'bu_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Date Modified</span>,
        column: 'Date Modified',
        sorter: (a, b) =>
          moment(a.date_modified, Common.DATEFORMAT).diff(
            moment(b.date_modified, Common.DATEFORMAT)
          ),
        ellipsis: true,
        children: [
          {
            title: FilterByDateSwap(
              'date_modified',
              cron.search.tableName,
              form,
              null,
              ObjectForColumnFilter,
              false
            ),
            dataIndex: 'date_modified',
            key: 'date_modified',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Date Added</span>,
        column: 'Date Added',
        sorter: (a, b) =>
          moment(a.date_added, Common.DATEFORMAT).diff(moment(b.date_added, Common.DATEFORMAT)),
        ellipsis: true,
        children: [
          {
            title: FilterByDateSwap(
              'date_added',
              cron.search.tableName,
              form,
              null,
              ObjectForColumnFilter,
              false
            ),
            dataIndex: 'date_added',
            key: 'date_added',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Start Date</span>,
        column: 'Start Date',
        sorter: (a, b) =>
          moment(a.date_added, Common.DATEFORMAT).diff(moment(b.date_added, Common.DATEFORMAT)),
        ellipsis: true,
        children: [
          {
            title: FilterByDateSwap(
              'start_date',
              cron.search.tableName,
              form,
              null,
              ObjectForColumnFilter,
              true,
              true
            ),
            dataIndex: 'start_date',
            key: 'start_date',
            ellipsis: true,
            render: (date: Date) =>
              !_.isNull(date) ? moment(date).format(Common.DATETIMEFORMAT) : '',
          },
        ],
      },
      {
        title: <span className="dragHandler">Stop Date</span>,
        column: 'StopDate',
        sorter: (a, b) =>
          moment(a.date_added, Common.DATEFORMAT).diff(moment(b.date_added, Common.DATEFORMAT)),
        ellipsis: true,
        children: [
          {
            title: FilterByDateSwap(
              'stop_date',
              cron.search.tableName,
              form,
              null,
              ObjectForColumnFilter,
              true,
              true
            ),
            dataIndex: 'stop_date',
            key: 'stop_date',
            ellipsis: true,
            render: (date: Date) =>
              !_.isNull(date) ? moment(date).format(Common.DATETIMEFORMAT) : '',
          },
        ],
      },
      {
        title: <span className="dragHandler">Frequency Type</span>,
        column: 'Frequency Type',
        sorter: (a, b) => a.frequency_type.localeCompare(b.frequency_type),
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('frequency_type', form),
            dataIndex: 'frequency_type',
            key: 'frequency_type',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Week Day</span>,
        column: 'Week Day',
        sorter: (a, b) => a.start_date.localeCompare(b.start_date),
        ellipsis: true,
        children: [
          {
            title: FilterByWeekDay(),
            dataIndex: 'start_date',
            key: 'start_date',
            render: (_, data) =>
              data.frequency_type == 'Weekly' ? moment(data.start_date).format('dddd') : '',
          },
        ],
      },
      {
        title: <span className="dragHandler">Month Day</span>,
        column: 'Month Day',
        sorter: (a, b) => a.frequency_day - b.frequency_day,
        ellipsis: true,
        children: [
          {
            title: FilterByMonthDay(),
            dataIndex: 'frequency_day',
            key: 'frequency_day',
            render: (_, data) => (data.frequency_type == 'Monthly' ? data.frequency_day : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Status</span>,
        column: 'Status',
        sorter: (a, b) => a.status.localeCompare(b.status),
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('status', form),
            dataIndex: 'status',
            key: 'status',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Next Run Date</span>,
        column: 'nextRunDate',
        sorter: (a, b) =>
          moment(a.date_added, Common.DATEFORMAT).diff(moment(b.date_added, Common.DATEFORMAT)),
        ellipsis: true,
        children: [
          {
            title: FilterByDateSwap(
              'next_run_date',
              cron.search.tableName,
              form,
              null,
              ObjectForColumnFilter,
              true,
              true
            ),
            dataIndex: 'next_run_date',
            key: 'next_run_date',
            ellipsis: true,
            render: (date: Date) =>
              !_.isNull(date) ? moment(date).format(Common.DATETIMEFORMAT) : '',
          },
        ],
      },
      {
        title: <span className="dragHandler">Last Run Date</span>,
        column: 'lastRunDate',
        sorter: (a, b) =>
          moment(a.date_added, Common.DATEFORMAT).diff(moment(b.date_added, Common.DATEFORMAT)),
        ellipsis: true,
        children: [
          {
            title: FilterByDateSwap(
              'last_run_date',
              cron.search.tableName,
              form,
              null,
              ObjectForColumnFilter,
              true,
              true
            ),
            dataIndex: 'last_run_date',
            key: 'last_run_date',
            ellipsis: true,
            render: (date: Date) =>
              !_.isNull(date) ? moment(date).format(Common.DATETIMEFORMAT) : '',
          },
        ],
      },
    ];
  };

  const onStartApi = (data: any) => {
    const startApiData: IStartApi = {
      id: data.id,
      sps_api_query_param: data.start_date
        ? [
            {
              startTime: data.start_date,
              endTime: data.stop_date,
            },
          ]
        : [],
    };
    dispatch(startApi(startApiData));
  };

  useEffect(() => {
    if (cron.startApi.messages.length > 0) {
      if (cron.startApi.hasErrors) {
        toast.error(cron.startApi.messages.join(' '));
      } else {
        toast.success(cron.startApi.messages.join(' '));
        refreshDataTable();
      }
      dispatch(clearCronMessages());
    }
  }, [cron.startApi.messages]);

  useEffect(() => {
    if (cron.startAllApi.messages.length > 0) {
      if (cron.startAllApi.hasErrors) {
        toast.error(cron.startAllApi.messages.join(' '));
      } else {
        toast.success(cron.startAllApi.messages.join(' '));
        refreshDataTable();
      }
      dispatch(clearCronMessages());
    }
  }, [cron.startAllApi.messages]);

  const renderActionButton = (data: any) => {
    return (
      <a
        href="#"
        title=""
        className="action-btn"
        onClick={(e) => {
          e.preventDefault();
          if (data.status == 'Stopped' || data.status == 'Ready' || data.status == 'Error') {
            onStartApi(data);
          }
          if (data.status === 'Running' || data.status === 'Success') {
            dispatch(stopApi(data.id));
          }
        }}
      >
        {data.status == 'Running' || data.status == 'Success' ? (
          <PauseOutlined />
        ) : (
          <CaretRightOutlined />
        )}
      </a>
    );
  };

  const removeCron = (id: number) => {
    dispatch(deleteCron(id));
  };

  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.View} a={Page.Cron}>
        <a
          title=""
          className="action-btn"
          onClick={() => {
            history.push(`/administration/sps-scheduler-log/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-eye.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.RunCronJob} a={Page.Cron}>
        {renderActionButton(data)}
      </Can>
      <Can I={Action.Update} a={Page.Cron}>
        <a
          className="action-btn"
          onClick={() => {
            history.push(`/administration/sps-scheduler/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.Cron}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeCron(data.id)}>
          <a href="#" title="" className="action-btn">
            <img src={`${process.env.PUBLIC_URL}/assets/images/ic-delete.svg`} alt="" />
          </a>
        </Popconfirm>
      </Can>
    </div>
  );

  return (
    <>
      <DataTable
        ref={dataTableRef}
        showAddButton={ability.can(Action.Add, Page.Cron)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        setDropDownFlag={setDropDownFlag}
        dropDownFlag={dropDownFlag}
        filterKeysDD={filterKeysID}
        filterRecordsForLocalSearch={filterRecords}
        hideExportButton={true}
        getTableColumns={getTableColumns}
        reduxSelector={cronSelector}
        searchTableData={searchCron}
        clearTableDataMessages={clearCronMessages}
        setTableColumnSelection={setTableColumnSelection}
        isCronJobApiButton={true}
        setObjectForColumnFilter={setObjectForColumnFilter}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.Cron)}
        showDelete={false}
        showCallApiBtn={true}
        isStartSchedulaAllApi={true}
      />
    </>
  );
};

export default forwardRef(MainTable);
