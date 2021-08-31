import { Button, Popover } from 'antd';
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import { IMainTable } from './mainTable.model';
import _ from 'lodash';
import {
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import DataTable from '../../../../common/components/DataTable';
import { setTableColumnSelection } from '../../../../store/ad/adDevices/adDevices.reducer';
import { callApi, searchImportAPIs } from '../../../../store/sps/spsAPI/spsApi.action';
import { clearCallApiMessages, spsApiSelector } from '../../../../store/sps/spsAPI/spsApi.reducer';
import { globalSearchSelector } from '../../../../store/globalSearch/globalSearch.reducer';
import { toast } from 'react-toastify';
import { ICallAPI } from '../../../../services/sps/spsApi/sps.model';
import { useHistory } from 'react-router-dom';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const { setSelectedId } = props;
  const dispatch = useAppDispatch();
  const spsApis = useAppSelector(spsApiSelector);
  const globalLookups = useAppSelector(globalSearchSelector);
  const dataTableRef = useRef(null);
  const history = useHistory();

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(dataIndex, spsApis.search.tableName, form);
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
    }
  }, [spsApis.callApi.messages]);

  const getTableColumns = (form) => {
    return [
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
      <Button
        htmlType="button"
        onClick={() => {
          if (Object.values(globalLookups.search)?.filter((x) => x > 0)?.length === 3)
            data.is_mapping && data.enabled
              ? onCallApi(data)
              : history.push(`/administration/config-sps-api-column-mapping/add?api_id=${data.id}`);
        }}
      >
        {data.is_mapping ? 'Call' : 'Add'}
      </Button>
    );
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
        setSelectedId(data.id, params);
      } else {
        const callApiObj: ICallAPI = {
          id: data.id,
          company_id: globalLookups.search.company_id,
          bu_id: globalLookups.search.bu_id,
          tenant_id: globalLookups.search.tenant_id,
          spsApiQueryParam: params,
        };
        dispatch(callApi(callApiObj));
      }
    } else {
      toast.error('Selected api does not have url.');
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

  return (
    <>
      <DataTable
        ref={dataTableRef}
        showAddButton={false}
        tableAction={tableAction}
        getTableColumns={getTableColumns}
        reduxSelector={spsApiSelector}
        searchTableData={searchImportAPIs}
        setTableColumnSelection={setTableColumnSelection}
        hideExportButton={true}
        globalSearchExist={false}
      />
    </>
  );
};

export default forwardRef(MainTable);
