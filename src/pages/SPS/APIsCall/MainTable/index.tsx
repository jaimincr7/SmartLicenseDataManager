import { Popover } from 'antd';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import _ from 'lodash';
import {
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import DataTable from '../../../../common/components/DataTable';
import {
  setTableColumnSelection,
  spsApiCallSelector,
} from '../../../../store/sps/spsAPICall/spsApiCall.reducer';
import {
  callAllApi,
  callApi,
  searchImportAPIs,
} from '../../../../store/sps/spsAPICall/spsApiCall.action';
import { clearCallApiMessages } from '../../../../store/sps/spsAPICall/spsApiCall.reducer';
import { globalSearchSelector } from '../../../../store/globalSearch/globalSearch.reducer';
import { toast } from 'react-toastify';
import { ICallAllApi, ICallAPI } from '../../../../services/sps/spsApiCall/spsApiCall.model';
import { useHistory } from 'react-router-dom';
import { PhoneOutlined, ControlFilled } from '@ant-design/icons';
import CallApiModal from '../CallApiModal';
import { IMainTable } from '../../../../common/models/common';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const dispatch = useAppDispatch();
  const spsApis = useAppSelector(spsApiCallSelector);
  const globalLookups = useAppSelector(globalSearchSelector);
  const dataTableRef = useRef(null);
  const history = useHistory();
  const [callApiObj, setCallApiObj] = useState({
    id: 0,
    params: null,
    isAll: false,
    show: false,
    filterKeys: null,
    keyword: null,
  });
  const [ObjectForColumnFilter, setObjectForColumnFilter] = useState({});

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(
      dataIndex,
      spsApis.search.tableName,
      form,
      null,
      ObjectForColumnFilter
    );
  };

  useEffect(() => {
    if (spsApis.callApi.messages.length > 0) {
      if (spsApis.callApi.hasErrors) {
        toast.error(spsApis.callApi.messages.join(' '));
      } else {
        toast.success(spsApis.callApi.messages.join(' '));
        dataTableRef?.current.refreshData();
      }
      dispatch(clearCallApiMessages());
    } else if (spsApis.callAllApi.messages.length > 0) {
      if (spsApis.callAllApi.hasErrors) {
        toast.error(spsApis.callAllApi.messages.join(' '));
      } else {
        toast.success(spsApis.callAllApi.messages.join(' '));
        dataTableRef?.current.refreshData();
      }
      dispatch(clearCallApiMessages());
    }
  }, [spsApis.callApi.messages, spsApis.callAllApi.messages]);

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
        children: [
          {
            title: FilterByDropdown('tenant_id', spsApis.search.lookups?.tenants),
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
        children: [
          {
            title: FilterByDropdown('company_id', spsApis.search.lookups?.companies),
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
        children: [
          {
            title: FilterByDropdown('bu_id', spsApis.search.lookups?.bus),
            dataIndex: 'bu_name',
            key: 'bu_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Group</span>,
        column: 'Group',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('group_id', spsApis.search.lookups?.groups),
            dataIndex: 'group_name',
            key: 'group_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Type</span>,
        column: 'Type',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('api_type_id', spsApis.search.lookups?.types),
            dataIndex: 'type_name',
            key: 'type_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Name</span>,
        column: 'Name',
        sorter: true,
        children: [
          {
            title: FilterBySwap('name', form),
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">URL</span>,
        column: 'URL',
        sorter: true,
        children: [
          {
            title: FilterBySwap('url', form),
            dataIndex: 'url',
            key: 'url',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Stored Procedure</span>,
        column: 'Stored Procedure',
        sorter: true,
        children: [
          {
            title: FilterBySwap('stored_procedure', form),
            dataIndex: 'stored_procedure',
            key: 'stored_procedure',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Enabled</span>,
        column: 'Enabled',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('enabled', form),
            dataIndex: 'enabled',
            key: 'enabled',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
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
          if (Object.values(globalLookups.search)?.filter((x) => x > 0)?.length === 3)
            data.is_mapping && data.enabled
              ? onCallApi(data)
              : history.push(`/administration/config-sps-api-column-mapping/add?api_id=${data.id}`);
        }}
      >
        {data.is_mapping ? (
          <PhoneOutlined title="Call Api" spin={spsApis.callApi.loading}/>
        ) : (
          <ControlFilled title="Map Api" style={{ color: '#00274d' }} />
        )}
      </a>
    );
  };

  const onCallApiById = (id: number, params: any) => {
    const callApiObj: ICallAPI = {
      id: id,
      company_id: globalLookups.search.company_id,
      bu_id: globalLookups.search.bu_id,
      tenant_id: globalLookups.search.tenant_id,
      spsApiQueryParam: params,
    };
    dispatch(callApi(callApiObj));
  };

  const onCallApi = (data: any) => {
    if (data.url) {
      const newURL = new URL(data.url);
      const urlSearchParams = new URLSearchParams(newURL.search);
      const params = Object.fromEntries(urlSearchParams?.entries());
      const editableParams = Object.values(params)?.filter(
        (x) => x?.toLowerCase() === '@starttime' || x?.toLowerCase() === '@endtime'
      );
      if (editableParams?.length > 0) {
        setCallApiObj({ ...callApiObj, params: params, show: true, isAll: false, id: data.id });
      } else {
        onCallApiById(data.id, params);
      }
    } else {
      toast.error('Selected api does not have url.');
    }
  };

  const onCallAllApi = (tableFilter: any) => {
    if (spsApis.search.data?.length > 0) {
      const allParams = {};
      const searchData = spsApis.search.data?.filter((x) => x.url && x.is_mapping && x.enabled);
      if (searchData?.length > 0) {
        spsApis.search.data?.forEach((data: any) => {
          if (data.url && data.is_mapping && data.enabled) {
            const newURL = new URL(data.url);
            const urlSearchParams = new URLSearchParams(newURL.search);
            const params = Object.fromEntries(urlSearchParams?.entries());
            const editableParams = Object.values(params)?.filter(
              (x) => x?.toLowerCase() === '@starttime' || x?.toLowerCase() === '@endtime'
            );
            if (editableParams?.length > 0 && params) {
              Object.keys(params).forEach((key) => {
                if (!(key in allParams)) allParams[key] = params[key];
              });
            }
          }
        });
        if (Object.keys(allParams)?.length > 0) {
          setCallApiObj({
            params: allParams,
            filterKeys: tableFilter.filter_keys,
            keyword: tableFilter.keyword,
            show: true,
            isAll: true,
            id: 0,
          });
        } else {
          const cllApiObj: ICallAllApi = {
            filter_keys: tableFilter.filterKeys,
            keyword: tableFilter.keyword,
            company_id: globalLookups.search.company_id,
            bu_id: globalLookups.search.bu_id,
            tenant_id: globalLookups.search.tenant_id,
            sps_api_query_param: {},
          };
          dispatch(callAllApi(cllApiObj));
        }
      } else {
        toast.info('No mapping available for searched apis.');
      }
    }
  };

  const tableAction = (_, data: any) => (
    <div className="btns-block">
      {Object.values(globalLookups.search)?.filter((x) => x > 0)?.length !== 3 ? (
        <Popover content={<>Please select global filter first!</>} trigger="click">
          {renderActionButton(data)}
        </Popover>
      ) : (
        renderActionButton(data)
      )}
    </div>
  );

  const confirmCallApi = (values: any) => {
    if (callApiObj.isAll) {
      const cllApiObj: ICallAllApi = {
        filter_keys: callApiObj.filterKeys,
        keyword: callApiObj.keyword,
        company_id: globalLookups.search.company_id,
        bu_id: globalLookups.search.bu_id,
        tenant_id: globalLookups.search.tenant_id,
        sps_api_query_param: { values },
      };
      dispatch(callAllApi(cllApiObj));
    } else {
      onCallApiById(callApiObj.id, values);
    }
  };

  return (
    <>
      <DataTable
        ref={dataTableRef}
        showAddButton={false}
        tableAction={tableAction}
        getTableColumns={getTableColumns}
        reduxSelector={spsApiCallSelector}
        searchTableData={searchImportAPIs}
        setTableColumnSelection={setTableColumnSelection}
        hideExportButton={true}
        showCallApiBtn={true}
        clearTableDataMessages={clearCallApiMessages}
        onCallAllApi={(tableFilter) => onCallAllApi(tableFilter)}
        showBulkUpdate={false}
        disableRowSelection={true}
        setObjectForColumnFilter={setObjectForColumnFilter}
      />
      {callApiObj.show && (
        <CallApiModal
          showModal={callApiObj.show}
          params={callApiObj.params}
          handleModalClose={() => {
            setCallApiObj({
              filterKeys: null,
              keyword: null,
              show: false,
              isAll: false,
              id: 0,
              params: null,
            });
          }}
          refreshDataTable={() => {
            dataTableRef?.current.refreshData();
          }}
          onCallApi={(values) => {
            confirmCallApi(values);
          }}
        />
      )}
    </>
  );
};

export default forwardRef(MainTable);
