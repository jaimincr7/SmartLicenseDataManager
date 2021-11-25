import { Button, Checkbox, Modal } from 'antd';
import _ from 'lodash';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useAppSelector } from '../../../../store/app.hooks';
import {
  FilterByBooleanDropDown,
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import DataTable from '../../../../common/components/DataTable';
import {
  clearSpsApiOauthMessages,
  spsApiOauthSelector,
  setTableColumnSelection,
} from '../../../../store/sps/apiOauth/apiOauth.reducer';
import { searchSpsApiOauth } from '../../../../store/sps/apiOauth/apiOauth.action';
import { IApiTableProps } from './apiTable.model';

const ApiTable: React.ForwardRefRenderFunction<unknown, IApiTableProps> = (props, ref) => {
  const { type_id , showModal , handleModalClose } = props;
  const spsApiOauth = useAppSelector(spsApiOauthSelector);
  const dataTableRef = useRef(null);
  const [ObjectForColumnFilter, setObjectForColumnFilter] = useState({});

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  useEffect(() => {
    console.log(type_id);
  }, [])

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(
      dataIndex,
      spsApiOauth.search.tableName,
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
        children: [
          {
            title: FilterByDropdown(
              'tenant_id', spsApiOauth.search.lookups?.tenants
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
        children: [
          {
            title: FilterByDropdown(
              'company_id', spsApiOauth.search.lookups?.companies
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
        children: [
          {
            title: FilterByDropdown(
              'bu_id', spsApiOauth.search.lookups?.bus
            ),
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
            title: FilterByDropdown('api_type_id', spsApiOauth.search.lookups?.sps_api_types),
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
            title: FilterBySwap('uid', form),
            dataIndex: 'uid',
            key: 'uid',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Url Base</span>,
        column: 'UrlBase',
        sorter: true,
        children: [
          {
            title: FilterBySwap('url_base', form),
            dataIndex: 'url_base',
            key: 'url_base',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Base Url Id</span>,
        column: 'BaseUrlId',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('base_url_id', spsApiOauth.search.lookups?.sps_api_base_urls),
            dataIndex: 'sps_base_url_name',
            key: 'sps_base_url_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Consent</span>,
        column: 'Consent',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'consent',
              spsApiOauth.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'consent',
            key: 'consent',
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
          },
        ],
      },
      {
        title: <span className="dragHandler">Active</span>,
        column: 'Active',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'active',
              spsApiOauth.search.tableName,
              ObjectForColumnFilter
            ),
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
          },
        ],
      },
    ];
  };

  const CallApi = (x) => {
    console.log(x);
  };

  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Button onClick={() => CallApi(data.id)}>Call</Button>
    </div>
  );

  return (
    <>
    <Modal
        wrapClassName="custom-modal"
        title={'Add Query Params'}
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
        tableAction={tableAction}
        getTableColumns={getTableColumns}
        reduxSelector={spsApiOauthSelector}
        searchTableData={searchSpsApiOauth}
        clearTableDataMessages={clearSpsApiOauthMessages}
        setTableColumnSelection={setTableColumnSelection}
        setObjectForColumnFilter={setObjectForColumnFilter}
        type_id={type_id}
      />
    </Modal>  
    </>
  );
};

export default forwardRef(ApiTable);
