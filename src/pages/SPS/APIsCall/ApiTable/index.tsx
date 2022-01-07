import { Button, Checkbox, Modal } from 'antd';
import _ from 'lodash';
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import DataTable from '../../../../common/components/DataTable';
import { AlignType } from 'rc-table/lib/interface';
import {
  clearSpsApiOauthMessages,
  spsApiOauthSelector,
  setTableColumnSelection,
} from '../../../../store/sps/apiOauth/apiOauth.reducer';
import { searchSpsApiOauth } from '../../../../store/sps/apiOauth/apiOauth.action';
import { IApiTableProps } from './apiTable.model';
import { callApi } from '../../../../store/sps/spsAPICall/spsApiCall.action';
import { spsApiCallSelector } from '../../../../store/sps/spsAPICall/spsApiCall.reducer';
import { ISearchAPIColumn } from '../../../../services/sps/apiColumnMapping/apiColMapping.model';
import { getApiColumn } from '../../../../store/sps/apiColumnMapping/apiColMapping.action';
import { ICallAPI } from '../../../../services/sps/spsApiCall/spsApiCall.model';

const ApiTable: React.ForwardRefRenderFunction<unknown, IApiTableProps> = (props, ref) => {
  const { type_id, showModal, handleModalClose, callApiObj, isFetchApi } = props;
  const dispatch = useAppDispatch();
  const spsApis = useAppSelector(spsApiCallSelector);
  const dataTableRef = useRef(null);

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const getTableColumns = () => {
    return [
      {
        title: <span className="dragHandler">Tenant Name</span>,
        column: 'TenantId',
        sorter: true,
        children: [
          {
            // title: FilterByDropdown(
            //   'tenant_id', spsApiOauth.search.lookups?.tenants
            // ),
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
            // title: FilterByDropdown(
            //   'company_id', spsApiOauth.search.lookups?.companies
            // ),
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
            // title: FilterByDropdown(
            //   'bu_id', spsApiOauth.search.lookups?.bus
            // ),
            dataIndex: 'bu_name',
            key: 'bu_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">API Type</span>,
        column: 'API_TypeId',
        sorter: true,
        children: [
          {
            //title: FilterByDropdown('api_type_id', spsApiOauth.search.lookups?.sps_api_types),
            dataIndex: 'sps_api_type_name',
            key: 'sps_api_type_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">UID</span>,
        column: 'UID',
        sorter: true,
        children: [
          {
            //title: FilterBySwap('uid', form),
            dataIndex: 'uid',
            key: 'uid',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Active</span>,
        column: 'Active',
        sorter: true,
        children: [
          {
            // title: FilterByBooleanDropDown(
            //   'active',
            //   spsApiOauth.search.tableName,
            //   ObjectForColumnFilter
            // ),
            dataIndex: 'active',
            key: 'active',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox defaultChecked disabled />
                ) : (
                  <Checkbox defaultChecked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
    ];
  };

  useEffect(() => {
    if (spsApis.callApi.loading) {
      handleModalClose();
    }
  }, [spsApis.callApi.loading]);

  const onCallApiById = (data: any) => {
    const callApiObject: ICallAPI = {
      id: callApiObj.id,
      company_id: data.company_id,
      bu_id: data.bu_id,
      tenant_id: data.tenant_id,
      sps_api_query_param: callApiObj.params,
    };
    dispatch(callApi(callApiObject));
  };

  const onFetchApi = (data: any) => {
    const fetchApiObject: ISearchAPIColumn = {
      id: callApiObj.id,
      company_id: data.company_id,
      bu_id: data.bu_id,
      tenant_id: data.tenant_id,
    };
    dispatch(getApiColumn(fetchApiObject));
    handleModalClose();
  };

  const tableAction = (_, data: any) => (
    <div className="btns-block">
      {isFetchApi ? (
        <Button onClick={() => onFetchApi(data)}>Fetch</Button>
      ) : (
        <Button onClick={() => onCallApiById(data)}>Call</Button>
      )}
    </div>
  );

  return (
    <>
      <Modal
        wrapClassName="custom-modal"
        title={'UID Selection'}
        centered
        visible={showModal}
        onCancel={handleModalClose}
        footer={false}
      >
        <DataTable
          ref={dataTableRef}
          showAddButton={false}
          disableRowSelection={true}
          showBulkUpdate={false}
          hideExportButton={true}
          hideShowHideButton={true}
          tableAction={tableAction}
          getTableColumns={getTableColumns}
          reduxSelector={spsApiOauthSelector}
          searchTableData={searchSpsApiOauth}
          clearTableDataMessages={clearSpsApiOauthMessages}
          setTableColumnSelection={setTableColumnSelection}
          type_id={type_id}
        />
      </Modal>
    </>
  );
};

export default forwardRef(ApiTable);
