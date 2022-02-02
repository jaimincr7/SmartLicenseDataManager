import { Popconfirm } from 'antd';
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
import { IMainTable } from '../../../../common/models/common';
import moment from 'moment';
import { Common } from '../../../../common/constants/common';
import { CaretRightOutlined, PauseOutlined } from '@ant-design/icons';
import { IStartApi } from '../../../../services/master/cron/cron.model';
import { toast } from 'react-toastify';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const cron = useAppSelector(cronSelector);
  const dataTableRef = useRef(null);
  const dispatch = useAppDispatch();
  const history = useHistory();
  const globalFilters = useAppSelector(globalSearchSelector);
  const [ObjectForColumnFilter, setObjectForColumnFilter] = useState({});

  const {
    setSelectedId,
    setShowSelectedListModal,
    setValuesForSelection,
    isMultiple,
    setFilterKeys,
  } = props;

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
    setFilterKeys(ObjectForColumnFilter);
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
        title: <span className="dragHandler">API Group</span>,
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
        title: <span className="dragHandler">Date Modified</span>,
        column: 'Date Modified',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDateSwapTable('date_modified', cron.search.tableName, form),
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
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDateSwapTable('date_added', cron.search.tableName, form),
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
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterWithSwapOption(
              'start_date',
              cron.search.tableName,
              form,
              null,
              ObjectForColumnFilter,
              true
            ),
            dataIndex: 'start_date',
            key: 'start_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATETIMEFORMAT) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Stop Date</span>,
        column: 'StopDate',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDateSwapTable('stop_date', cron.search.tableName, form),
            dataIndex: 'stop_date',
            key: 'stop_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATETIMEFORMAT) : ''),
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
            title: FilterBySwap('frequency_type', form),
            dataIndex: 'frequency_type',
            key: 'frequency_type',
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
            title: FilterBySwap('frequency_day', form),
            dataIndex: 'frequency_day',
            key: 'frequency_day',
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
            history.push(`/administration/schedule-api-log/${data.id}`);
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
        showCallApiBtn={true}
        isStartSchedulaAllApi={true}
      />
    </>
  );
};

export default forwardRef(MainTable);
