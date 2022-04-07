import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import {
  setTableColumnSelection,
  clearSpsApiJobsMessages,
  spsApiJobsSelector,
} from '../../../../store/sps/spsApiJobs/spsApiJobs.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  deleteSpsApiJobs,
  searchSpsApiJobs,
} from '../../../../store/sps/spsApiJobs/spsApiJobs.action';
import moment from 'moment';
import _ from 'lodash';
import spsApiJobsService from '../../../../services/sps/spsApiJobs/spsApiJobs.service';
import {
  FilterByDateSwap,
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import DataTable from '../../../../common/components/DataTable';
import { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import { globalSearchSelector } from '../../../../store/globalSearch/globalSearch.reducer';
import { IMainTable } from './mainTable.model';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const spsApiJobs = useAppSelector(spsApiJobsSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();
  const globalFilters = useAppSelector(globalSearchSelector);
  const [ObjectForColumnFilter, setObjectForColumnFilter] = useState({});
  const { job_id } = props;

  const extraSearchData = {
    id: job_id,
  };

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const exportExcelFile = (searchData: ISearch) => {
    return spsApiJobsService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(
      dataIndex,
      spsApiJobs.search.tableName,
      form,
      null,
      ObjectForColumnFilter
    );
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
        title: <span className="dragHandler">Tenant Name</span>,
        column: 'TenantId',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown(
              'tenant_id',
              spsApiJobs.search.lookups?.tenants?.length > 0
                ? spsApiJobs.search.lookups?.tenants
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
              spsApiJobs.search.lookups?.companies?.length > 0
                ? spsApiJobs.search.lookups?.companies
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
              spsApiJobs.search.lookups?.bus?.length > 0
                ? spsApiJobs.search.lookups?.bus
                : globalFilters?.globalBULookup?.data
            ),
            dataIndex: 'bu_name',
            key: 'bu_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Date Added</span>,
        column: 'Date Added',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDateSwap(
              'date',
              spsApiJobs.search.tableName,
              form,
              null,
              ObjectForColumnFilter,
              true,
              true
            ),
            dataIndex: 'date',
            key: 'date',
            ellipsis: true,
            render: (date: Date) =>
              !_.isNull(date) ? moment(date).format('YYYY-MM-DD HH:mm:ss') : '',
          },
        ],
      },
      {
        title: <span className="dragHandler">Call Start</span>,
        column: 'Call Start',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDateSwap(
              'call_start',
              spsApiJobs.search.tableName,
              form,
              null,
              ObjectForColumnFilter,
              true,
              true
            ),
            dataIndex: 'call_start',
            key: 'call_start',
            ellipsis: true,
            render: (date: Date) =>
              !_.isNull(date) ? moment(date).format('YYYY-MM-DD HH:mm:ss') : '',
          },
        ],
      },
      {
        title: <span className="dragHandler">Call End</span>,
        column: 'Call End',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDateSwap(
              'call_end',
              spsApiJobs.search.tableName,
              form,
              null,
              ObjectForColumnFilter,
              true,
              true
            ),
            dataIndex: 'call_end',
            key: 'call_end',
            ellipsis: true,
            render: (date: Date) =>
              !_.isNull(date) ? moment(date).format('YYYY-MM-DD HH:mm:ss') : '',
          },
        ],
      },
      {
        title: <span className="dragHandler">API Call Id</span>,
        column: 'API_CallId',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown('api_call_id', spsApiJobs.search.lookups?.api_calls),
            dataIndex: 'api_call_name',
            key: 'api_call_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">API Type Id</span>,
        column: 'API_TypeId',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown('api_type_id', spsApiJobs.search.lookups?.api_types),
            dataIndex: 'api_type_name',
            key: 'api_type_name',
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
      {
        title: <span className="dragHandler">API Call Count</span>,
        column: 'API Call Count',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('api_call_count', form),
            dataIndex: 'api_call_count',
            key: 'api_call_count',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeSpsApiJobs = (id: number) => {
    dispatch(deleteSpsApiJobs(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.View} a={Page.SpsApiJobs}>
        <a
          title=""
          className="action-btn"
          onClick={() => {
            //setSelectedId(data.id);
            history.push(`/sps/sps-api-jobs-data/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-eye.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Update} a={Page.SpsApiJobs}>
        <a
          hidden
          className="action-btn"
          onClick={() => {
            //setSelectedId(data.id);
            history.push(`/sps/sps-api-jobs-data/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.SpsApiJobs}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeSpsApiJobs(data.id)}>
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
        showAddButton={false}
        showDelete={false}
        extraSearchData={extraSearchData}
        //setSelectedId={setSelectedId}
        isSpsApiJobsId={job_id > 0 ? true : false}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={spsApiJobsSelector}
        searchTableData={searchSpsApiJobs}
        clearTableDataMessages={clearSpsApiJobsMessages}
        setTableColumnSelection={setTableColumnSelection}
        disableRowSelection={true}
        setObjectForColumnFilter={setObjectForColumnFilter}
      />
    </>
  );
};

export default forwardRef(MainTable);
