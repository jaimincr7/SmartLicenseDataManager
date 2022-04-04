import { Checkbox, Popconfirm } from 'antd';
import _ from 'lodash';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  FilterByBooleanDropDown,
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { IMainTable, ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import { AlignType } from 'rc-table/lib/interface';
import DataTable from '../../../../common/components/DataTable';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import {
  clearSpsApiOauthMessages,
  spsApiOauthSelector,
  setTableColumnSelection,
} from '../../../../store/sps/apiOauth/apiOauth.reducer';
import {
  deleteSpsApiOauth,
  searchSpsApiOauth,
} from '../../../../store/sps/apiOauth/apiOauth.action';
import spsApiOauthService from '../../../../services/sps/apiOauth/apiOauth.service';
import { globalSearchSelector } from '../../../../store/globalSearch/globalSearch.reducer';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const {
    setSelectedId,
    setShowSelectedListModal,
    setValuesForSelection,
    isMultiple,
    tableButtons,
  } = props;
  const spsApiOauth = useAppSelector(spsApiOauthSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();
  const globalFilters = useAppSelector(globalSearchSelector);
  const [ObjectForColumnFilter, setObjectForColumnFilter] = useState({});

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

  const exportExcelFile = (searchData: ISearch) => {
    return spsApiOauthService.exportExcelFile(searchData);
  };

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
              'tenant_id',
              spsApiOauth.search.lookups?.tenants?.length > 0
                ? spsApiOauth.search.lookups?.tenants
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
        children: [
          {
            title: FilterByDropdown(
              'company_id',
              spsApiOauth.search.lookups?.companies?.length > 0
                ? spsApiOauth.search.lookups?.companies
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
        children: [
          {
            title: FilterByDropdown(
              'bu_id',
              spsApiOauth.search.lookups?.bus?.length > 0
                ? spsApiOauth.search.lookups?.bus
                : globalFilters?.globalBULookup?.data
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
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
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
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">Token</span>,
        column: 'Token',
        sorter: true,
        children: [
          {
            title: FilterBySwap('token', form),
            dataIndex: 'token',
            key: 'token',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeSpsApiOauth = (id: number) => {
    dispatch(deleteSpsApiOauth(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.SpsApiOauth}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/sps/sps-api-oauth/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.SpsApiOauth}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeSpsApiOauth(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.SpsApiOauth)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={spsApiOauthSelector}
        searchTableData={searchSpsApiOauth}
        clearTableDataMessages={clearSpsApiOauthMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.SpsApiOauth)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
