import { Popconfirm, Popover } from 'antd';
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
import { deleteCron, searchCron, stopApi } from '../../../../store/master/cron/cron.action';
import { clearCronMessages, cronSelector } from '../../../../store/master/cron/cron.reducer';
import { globalSearchSelector } from '../../../../store/globalSearch/globalSearch.reducer';
import { useHistory } from 'react-router-dom';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import { IMainTable } from '../../../../common/models/common';
import moment from 'moment';
import { Common } from '../../../../common/constants/common';
import StartApiModal from '../StartModal';
import { CaretRightOutlined, PauseOutlined } from '@ant-design/icons';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const cron = useAppSelector(cronSelector);
  const globalLookups = useAppSelector(globalSearchSelector);
  const dataTableRef = useRef(null);
  const dispatch = useAppDispatch();
  const history = useHistory();
  const globalFilters = useAppSelector(globalSearchSelector);
  const [showStartApi, setShowStartApi] = useState(false);
  const [startTimeDisabled, setStartTimeDisabled] = useState(true);
  const [id, setId] = useState(0);
  const [frequencyId, setFrequencyId] = useState(0);
  const [query, setQuery] = useState({});
  const [ObjectForColumnFilter, setObjectForColumnFilter] = useState({});

  const { setSelectedId, setShowSelectedListModal, setValuesForSelection, isMultiple } = props;

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  useEffect(() => {
    if (isMultiple) {
      dataTableRef?.current.getValuesForSelection();
    }
  }, [isMultiple]);

  const refreshDataTable = () => {
    dataTableRef?.current.refreshData();
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(
      dataIndex,
      cron.search.tableName,
      form,
      null,
      ObjectForColumnFilter
    );
  };

  const FilterByDateSwapTable = (dataIndex: string, tableName: string, form: any) => {
    return FilterByDateSwap(dataIndex, tableName, form, null, ObjectForColumnFilter);
  };

  const getTableColumns = (form) => {
    return [
      {
        title: <span className="dragHandler">Id</span>,
        column: 'Id',
        sorter: true,
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
        title: <span className="dragHandler">Api Group</span>,
        column: 'ApiGroupId',
        sorter: true,
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
        sorter: true,
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
        sorter: true,
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
        sorter: true,
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
        title: <span className="dragHandler">Start Time</span>,
        column: 'StartTime',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDateSwapTable('start_time', cron.search.tableName, form),
            dataIndex: 'start_time',
            key: 'start_time',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">End Time</span>,
        column: 'EndTime',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDateSwapTable('end_time', cron.search.tableName, form),
            dataIndex: 'end_time',
            key: 'end_time',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Frequency Type</span>,
        column: 'Frequency Type',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('cron_frequency_type', form),
            dataIndex: 'cron_frequency_type',
            key: 'cron_frequency_type',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Frequency Day</span>,
        column: 'Frequency Day',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('day_name', form),
            dataIndex: 'day_name',
            key: 'day_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Frequency Time</span>,
        column: 'Frequency Time',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterWithSwapOption(
              'cron_frequency_time',
              cron.search.tableName,
              form,
              null,
              ObjectForColumnFilter,
              true
            ),
            dataIndex: 'cron_frequency_time',
            key: 'cron_frequency_time',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format('HH:MM:SS') : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Status</span>,
        column: 'Status',
        sorter: true,
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
    ];
  };

  const renderActionButton = (data: any) => {
    return (
      <a
        href="#"
        title=""
        className="action-btn"
        onClick={(e) => {
          e.preventDefault();
          if (Object.values(globalLookups.search)?.filter((x) => x > 0)?.length === 3) {
            if (data.status == 'Stopped' || data.status == 'Ready' || data.status == 'Error') {
              setFrequencyId(data.cron_job_frequency_id);
              setShowStartApi(true);
              setId(data.id);
              if (data.url) {
                const newURL = new URL(data.url);
                const urlSearchParams = new URLSearchParams(newURL.search);
                const params = Object.fromEntries(urlSearchParams?.entries());
                const editableParams = Object.values(params)?.filter(
                  (x) => x?.toLowerCase() === '@starttime' || x?.toLowerCase() === '@endtime'
                );
                if (editableParams?.length > 0) {
                  setQuery(params);
                  setStartTimeDisabled(false);
                }
              }
            }
            if (data.status === 'Running' || data.status === 'Success') {
              dispatch(stopApi(data.id));
            }
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
            history.push(`/administration/schedule-api-log/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-eye.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.RunCronJob} a={Page.Cron}>
        {Object.values(globalLookups.search)?.filter((x) => x > 0)?.length !== 3 ? (
          <Popover content={<>Please select global filter first!</>} trigger="click">
            {renderActionButton(data)}
          </Popover>
        ) : (
          renderActionButton(data)
        )}
      </Can>
      <Can I={Action.Update} a={Page.Cron}>
        <a
          className="action-btn"
          onClick={() => {
            history.push(`/administration/schedule-api-data/${data.id}`);
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
        hideExportButton={true}
        //globalSearchExist={false}
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
      />
      {showStartApi && (
        <StartApiModal
          startTime={startTimeDisabled}
          setShowApi={setShowStartApi}
          showModal={showStartApi}
          id={id}
          refreshDataTable={refreshDataTable}
          queryParams={query}
          frequency={frequencyId}
        />
      )}
    </>
  );
};

export default forwardRef(MainTable);
