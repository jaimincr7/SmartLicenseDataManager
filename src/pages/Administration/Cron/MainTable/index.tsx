import { Button, Popover } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useAppSelector } from '../../../../store/app.hooks';
import _ from 'lodash';
import {
  FilterByDateSwap,
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import DataTable from '../../../../common/components/DataTable';
import { setTableColumnSelection } from '../../../../store/ad/adDevices/adDevices.reducer';
import { searchCron } from '../../../../store/master/cron/cron.action';
import { clearCronMessages, cronSelector } from '../../../../store/master/cron/cron.reducer';
import { globalSearchSelector } from '../../../../store/globalSearch/globalSearch.reducer';
import { useHistory } from 'react-router-dom';
import { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import { IMainTable } from '../../../../common/models/common';
import moment from 'moment';
import { Common } from '../../../../common/constants/common';
import StartApiModal from '../StartModal';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const cron = useAppSelector(cronSelector);
  const globalLookups = useAppSelector(globalSearchSelector);
  const dataTableRef = useRef(null);
  const history = useHistory();
  const [ showStartApi, setShowStartApi ] = useState(false);
  const [ startTimeDisabled, setStartTimeDisabled ] = useState(true);
  const [ id, setId ] = useState(0);

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(dataIndex, cron.search.tableName, form);
  };

  const getTableColumns = (form) => {
    return [
      {
        title: <span className="dragHandler">Api Id</span>,
        column: 'Api_Id',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown('api_id', cron.search.lookups?.sps_apis),
            dataIndex: 'api_name',
            key: 'api_name',
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
            title: FilterByDropdown('tenant_id', cron.search.lookups?.tenants),
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
            title: FilterByDropdown('company_id', cron.search.lookups?.companies),
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
            title: FilterByDropdown('bu_id', cron.search.lookups?.bus),
            dataIndex: 'bu_name',
            key: 'bu_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Formula</span>,
        column: 'FormulaId',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown('formula_id', cron.search.lookups?.bus),
            dataIndex: 'cron_job_formula_description',
            key: 'cron_job_formula_description',
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
            title: FilterByDateSwap('start_time', cron.search.tableName, form),
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
            title: FilterByDateSwap('end_time', cron.search.tableName, form),
            dataIndex: 'end_time',
            key: 'end_time',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
       {
         title: <span className="dragHandler">Schedule Time</span>,
         column: 'ScheduleTime',
         sorter: true,
         ellipsis: true,
         children: [
           {
             title: FilterByDateSwap('schedule_time', cron.search.tableName, form),
             dataIndex: 'schedule_time',
             key: 'schedule_time',
             ellipsis: true,
             render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
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
        title: <span className="dragHandler">Api Url</span>,
        column: 'Api_Url',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('api_url', form),
            dataIndex: 'api_url',
            key: 'api_url',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  // const removeSpsApiJobs = (id: number) => {
  //   //dispatch(deleteSpsApiJobs(id));
  // };

  const renderActionButton = (data: any) => {
    return (
      <a
        href="#"
        title=""
        className="action-btn"
        onClick={(e) => {
          e.preventDefault();
          if (Object.values(globalLookups.search)?.filter((x) => x > 0)?.length === 3)
            {
              if(data.status == 'Stopped')
              {
                setShowStartApi(true);
                setId(data.id);
              }
            }
        }}
      >
        {data.status == 'Stopped' ? (
          <Button type="primary" onClick={(data)=> onStart(data)}>
          Start!
        </Button>
        ) : (
          <Button type="primary" >
          Stop!
        </Button>
        )}
      </a>
    );
  };

  const onStart = (data: any) => {
    if (data.url) {
      const newURL = new URL(data.url);
      const urlSearchParams = new URLSearchParams(newURL.search);
      const params = Object.fromEntries(urlSearchParams?.entries());
      const editableParams = Object.values(params)?.filter(
        (x) => x?.toLowerCase() === '@starttime' || x?.toLowerCase() === '@endtime'
      );
      if (editableParams?.length > 0) {
        setStartTimeDisabled(false);
      }
  }
  }

  const tableAction = (_, data: any) => (
    <div className="btns-block">
      {/* <Can I={Action.View} a={Page.SpsApiJobs}>
        <a
          title=""
          className="action-btn"
          onClick={() => {
            //setSelectedId(data.id);
            history.push(`/administration/cron/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-eye.svg`} alt="" />
        </a>
      </Can> */}
     <Can I={Action.Update} a={Page.SpsApiJobs}>
        <a
          hidden
          className="action-btn"
          onClick={() => {
            //setSelectedId(data.id);
            history.push(`/administration/cron/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can> 
      {/* <Can I={Action.Delete} a={Page.SpsApiJobs}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeSpsApiJobs(data.id)}>
          <a href="#" title="" className="action-btn">
            <img src={`${process.env.PUBLIC_URL}/assets/images/ic-delete.svg`} alt="" />
          </a>
        </Popconfirm>
      </Can> */}
      {Object.values(globalLookups.search)?.filter((x) => x > 0)?.length !== 3 ? (
        <Popover content={<>Please select global filter first!</>} trigger="click">
          {renderActionButton(data)}
        </Popover>
      ) : (
        renderActionButton(data)
      )}
    </div>
  );

  return (
    <>
      <DataTable
        ref={dataTableRef}
        showAddButton={false}
        //setSelectedId={setSelectedId}
        tableAction={tableAction}
        hideExportButton={true}
        globalSearchExist={false}
        getTableColumns={getTableColumns}
        reduxSelector={cronSelector}
        searchTableData={searchCron}
        clearTableDataMessages={clearCronMessages}
        setTableColumnSelection={setTableColumnSelection}
      />
      {
        showStartApi && (
          <StartApiModal
            startTime={startTimeDisabled}
            setShowApi={setShowStartApi}
            id={id}
          />
        )
      }
    </>
  );
};

export default forwardRef(MainTable);
