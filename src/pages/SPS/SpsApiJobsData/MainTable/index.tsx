import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  setTableColumnSelection,
  clearSpsApiJobsDataMessages,
  spsApiJobsDataSelector,
} from '../../../../store/sps/spsApiJobsData/spsApiJobsData.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  runJobData,
  searchSpsApiJobsData,
} from '../../../../store/sps/spsApiJobsData/spsApiJobsData.action';
import moment from 'moment';
import { Common } from '../../../../common/constants/common';
import _ from 'lodash';
import { globalSearchSelector } from '../../../../store/globalSearch/globalSearch.reducer';
import spsApiJobsDataService from '../../../../services/sps/spsApiJobsData/spsApiJobsData.service';
import {
  FilterByDateSwap,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { ISearch } from '../../../../common/models/common';
import DataTable from '../../../../common/components/DataTable';
import { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import { Popconfirm, Popover } from 'antd';
import { ICallAPI } from '../../../../services/sps/spsApiJobsData/spsApiJobsData.model';
import { ReloadOutlined } from '@ant-design/icons';
import { IMainTable } from './mainTable.model';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const { job_id } = props;
  const dispatch = useAppDispatch();
  const spsApiJobsData = useAppSelector(spsApiJobsDataSelector);
  const dataTableRef = useRef(null);
  const globalLookups = useAppSelector(globalSearchSelector);

  const extraSearchData = {
    job_id: job_id,
  };

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const exportExcelFile = (searchData: ISearch) => {
    return spsApiJobsDataService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(dataIndex, spsApiJobsData.search.tableName, form);
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
        title: <span className="dragHandler">API Job Id</span>,
        column: 'API_JobId',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('api_job_id', form),
            dataIndex: 'api_job_id',
            key: 'api_job_id',
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
        title: <span className="dragHandler">API Call Start</span>,
        column: 'API Call Start',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDateSwap('api_call_start', spsApiJobsData.search.tableName, form),
            dataIndex: 'api_call_start',
            key: 'api_call_start',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">API Call End</span>,
        column: 'API Call End',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDateSwap('api_call_end', spsApiJobsData.search.tableName, form),
            dataIndex: 'api_call_end',
            key: 'api_call_end',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Insert Data Start</span>,
        column: 'Insert Data Start',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDateSwap('insert_data_start', spsApiJobsData.search.tableName, form),
            dataIndex: 'insert_data_start',
            key: 'insert_data_start',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Processed</span>,
        column: 'Processed',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDateSwap('processed', spsApiJobsData.search.tableName, form),
            dataIndex: 'processed',
            key: 'processed',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Count</span>,
        column: 'Count',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('count', form),
            dataIndex: 'count',
            key: 'count',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const onRun = () => {
    const callApiObj: ICallAPI = {
      company_id: globalLookups.search.company_id,
      bu_id: globalLookups.search.bu_id,
      tenant_id: globalLookups.search.tenant_id,
    };
    dispatch(runJobData(callApiObj));
  };

  const renderActionButton = () => {
    return (
      <a
        href="#"
        title=""
        className="action-btn"
        onClick={() => {
          if (Object.values(globalLookups.search)?.filter((x) => x > 0)?.length === 3) {
            onRun();
          }
        }}
      >
        <ReloadOutlined title="Run Job Data" />
      </a>
    );
  };

  const tableAction = (_, data: any) => (
    <div className="btns-block">
      {data.status !== 'Success' &&
        (Object.values(globalLookups.search)?.filter((x) => x > 0)?.length !== 3 ? (
          <Popover content={<>Please select global filter first!</>} trigger="click">
            {renderActionButton()}
          </Popover>
        ) : (
          renderActionButton()
        ))}
      <Can I={Action.Delete} a={Page.SpsApiJobs}>
        <Popconfirm title="Sure to delete?">
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
        globalSearchExist={false}
        ref={dataTableRef}
        showAddButton={false}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={spsApiJobsDataSelector}
        searchTableData={searchSpsApiJobsData}
        clearTableDataMessages={clearSpsApiJobsDataMessages}
        setTableColumnSelection={setTableColumnSelection}
        extraSearchData={extraSearchData}
      />
    </>
  );
};

export default forwardRef(MainTable);
