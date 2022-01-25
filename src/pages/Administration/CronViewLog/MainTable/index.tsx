import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import {
  setTableColumnSelection,
  clearCronViewLogMessages,
  cronViewLogSelector,
} from '../../../../store/master/cronViewLog/cronViewLog.reducer';
import { useAppSelector } from '../../../../store/app.hooks';
import { searchCronViewLog } from '../../../../store/master/cronViewLog/cronViewLog.action';
import moment from 'moment';
import _ from 'lodash';
import {
  FilterByDateSwap,
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import DataTable from '../../../../common/components/DataTable';
import { Popover } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { IMainTable } from './mainTable.model';
import { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const { job_id } = props;
  const cronViewLog = useAppSelector(cronViewLogSelector);
  const dataTableRef = useRef(null);
  const [ObjectForColumnFilter, setObjectForColumnFilter] = useState({});

  const extraSearchData = {
    crone_job_data_id: job_id,
  };

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(
      dataIndex,
      cronViewLog.search.tableName,
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
        title: <span className="dragHandler">ID</span>,
        column: 'id',
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
        title: <span className="dragHandler">Schedule Api Id</span>,
        column: 'CronDataId',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('cron_data_id', form),
            dataIndex: 'cron_data_id',
            key: 'cron_data_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Api</span>,
        column: 'Api_Id',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown('api_id', cronViewLog.search.lookups?.apis),
            dataIndex: 'api_name',
            key: 'api_name',
            ellipsis: true,
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
      {
        title: <span className="dragHandler">Run Date</span>,
        column: 'RunDate',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDateSwapTable('run_date', cronViewLog.search.tableName, form),
            dataIndex: 'run_date',
            key: 'run_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format('YYYY-MM-DD HH:mm:ss') : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Next Run Date</span>,
        column: 'NextRunDate',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDateSwapTable('next_run_date', cronViewLog.search.tableName, form),
            dataIndex: 'next_run_date',
            key: 'next_run_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format('YYYY-MM-DD HH:mm:ss') : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Complete Date</span>,
        column: 'CompleteDate',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDateSwapTable('complete_date', cronViewLog.search.tableName, form),
            dataIndex: 'complete_date',
            key: 'complete_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format('YYYY-MM-DD HH:mm:ss') : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Log Date</span>,
        column: 'LogDate',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDateSwapTable('log_date', cronViewLog.search.tableName, form),
            dataIndex: 'log_date',
            key: 'log_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format('YYYY-MM-DD HH:mm:ss') : ''),
          },
        ],
      },
    ];
  };

  const renderActionButton = () => {
    return (
      <a href="#" title="" className="action-btn">
        <InfoCircleOutlined />
      </a>
    );
  };

  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Error} a={Page.CronViewLogData}>
        {!(
          data.status == 'Success' ||
          data.status == 'Stopped' ||
          data.status == 'Running' ||
          data.status == 'Ready'
        ) ? (
          <Popover content={data.comment} trigger="hover">
            {renderActionButton()}
          </Popover>
        ) : (
          <></>
        )}
      </Can>
    </div>
  );

  return (
    <>
      <DataTable
        globalSearchExist={false}
        ref={dataTableRef}
        showAddButton={false}
        hideExportButton={true}
        tableAction={tableAction}
        getTableColumns={getTableColumns}
        reduxSelector={cronViewLogSelector}
        searchTableData={searchCronViewLog}
        clearTableDataMessages={clearCronViewLogMessages}
        setTableColumnSelection={setTableColumnSelection}
        extraSearchData={extraSearchData}
        setObjectForColumnFilter={setObjectForColumnFilter}
      />
    </>
  );
};

export default forwardRef(MainTable);
