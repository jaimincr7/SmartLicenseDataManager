import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
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
import { Common } from '../../../../common/constants/common';
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
import { IMainTable } from './mainTable.model';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const spsApiJobs = useAppSelector(spsApiJobsSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const exportExcelFile = (searchData: ISearch) => {
    return spsApiJobsService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(dataIndex, spsApiJobs.search.tableName, form);
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
            title: FilterByDropdown('tenant_id', spsApiJobs.search.lookups?.tenants),
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
            title: FilterByDropdown('company_id', spsApiJobs.search.lookups?.companies),
            dataIndex: 'company_name',
            key: 'company_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Bu Name</span>,
        column: 'Bu_Id',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown('bu_id', spsApiJobs.search.lookups?.bus),
            dataIndex: 'bu_name',
            key: 'bu_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Date</span>,
        column: 'Date',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDateSwap('date', spsApiJobs.search.tableName, form),
            dataIndex: 'date',
            key: 'date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
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
            title: FilterByDateSwap('call_start', spsApiJobs.search.tableName, form),
            dataIndex: 'call_start',
            key: 'call_start',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
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
            title: FilterByDateSwap('call_end', spsApiJobs.search.tableName, form),
            dataIndex: 'call_end',
            key: 'call_end',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">SPS Input Type</span>,
        column: 'SPS_InputTypeId',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('sps_input_type_id', form),
            dataIndex: 'sps_input_type_id',
            key: 'sps_input_type_id',
            ellipsis: true,
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
            title: FilterBySwap('api_call_id', form),
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
            title: FilterBySwap('api_type_id', form),
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
        <Popconfirm title="Sure to delete?" onConfirm={() => removeSpsApiJobs(data.id)}>
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
        //setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={spsApiJobsSelector}
        searchTableData={searchSpsApiJobs}
        clearTableDataMessages={clearSpsApiJobsMessages}
        setTableColumnSelection={setTableColumnSelection}
      />
    </>
  );
};

export default forwardRef(MainTable);
