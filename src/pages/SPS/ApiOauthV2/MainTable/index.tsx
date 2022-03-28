import { Checkbox, Popconfirm } from 'antd';
import _ from 'lodash';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  FilterByBooleanDropDown,
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { AlignType } from 'rc-table/lib/interface';
import { IMainTable, ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import DataTable from '../../../../common/components/DataTable';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import {
  clearSpsApiOauthV2Messages,
  spsApiOauthV2Selector,
  setTableColumnSelection,
  clearSpsApiOauthV2Data,
} from '../../../../store/sps/apiOauthV2/apiOauthV2.reducer';
import {
  deleteSpsApiOauthV2,
  searchSpsApiOauthV2,
} from '../../../../store/sps/apiOauthV2/apiOauthV2.action';
import spsApiOauthV2Service from '../../../../services/sps/apiOauthV2/apiOauthV2.service';
import { globalSearchSelector } from '../../../../store/globalSearch/globalSearch.reducer';
import AddSpsApiOauthV2Modal from '../AddApiOauthV2Modal';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const {
    setSelectedId,
    setShowSelectedListModal,
    setValuesForSelection,
    isMultiple,
    tableButtons,
    isTabbed,
    addModalVisible,
    setAddModalVisible,
  } = props;
  const spsApiOauthV2 = useAppSelector(spsApiOauthV2Selector);
  const dispatch = useAppDispatch();
  const globalFilters = useAppSelector(globalSearchSelector);
  const dataTableRef = useRef(null);
  const history = useHistory();
  const [ObjectForColumnFilter, setObjectForColumnFilter] = useState({});

  const refreshDataTable = () => {
    dataTableRef?.current.refreshData();
  };

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
    return spsApiOauthV2Service.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(
      dataIndex,
      spsApiOauthV2.search.tableName,
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
              spsApiOauthV2.search.lookups?.tenants?.length > 0
                ? spsApiOauthV2.search.lookups?.tenants
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
              spsApiOauthV2.search.lookups?.companies?.length > 0
                ? spsApiOauthV2.search.lookups?.companies
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
              spsApiOauthV2.search.lookups?.bus?.length > 0
                ? spsApiOauthV2.search.lookups?.bus
                : globalFilters?.globalBULookup?.data
            ),
            dataIndex: 'bu_name',
            key: 'bu_name',
            ellipsis: true,
          },
        ],
      },
      // {
      //   title: <span className="dragHandler">API Type</span>,
      //   column: 'API_TypeId',
      //   sorter: true,
      //   children: [
      //     {
      //       title: FilterBySwap('type', form),
      //       dataIndex: 'type',
      //       key: 'type',
      //       ellipsis: true,
      //     },
      //   ],
      // },
      {
        title: <span className="dragHandler">API Type</span>,
        column: 'API_Type',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('api_type_id', spsApiOauthV2.search.lookups?.sps_api_types),
            dataIndex: 'sps_api_type_name',
            key: 'sps_api_type_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Base Url</span>,
        column: 'Base_Url_Id',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('base_url_id', spsApiOauthV2.search.lookups?.sps_api_base_urls),
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
              spsApiOauthV2.search.tableName,
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
              spsApiOauthV2.search.tableName,
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
    ];
  };

  useEffect(() => {
    if (spsApiOauthV2.save.data !== null && spsApiOauthV2.save.data !== undefined) {
      if (!spsApiOauthV2.save.hasErrors) {
        history.push(`/sps/sps-api-oauth-v2/${spsApiOauthV2.save.data.id}`);
        dispatch(clearSpsApiOauthV2Data());
      }
    }
  }, [spsApiOauthV2.save.data]);

  const removeSpsApiOauthV2 = (id: number) => {
    dispatch(deleteSpsApiOauthV2(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      {/* <a
          className="action-btn"
          onClick={() => {
            setId(data.api_type_id);
            setShowInjectionModal(true);
            setOauthId(data.id);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-eye.svg`} alt="" />
        </a> */}
      <Can I={Action.Update} a={Page.SpsApiOauthV2}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            {
              isTabbed ? (
                <AddSpsApiOauthV2Modal
                  showModal={addModalVisible}
                  isMultiple={false}
                  handleModalClose={() => {
                    setAddModalVisible(false);
                    {
                      props.isTabbed ? null : history.push('/sps/sps-api-oauth-v2');
                    }
                  }}
                  id={data.id}
                  refreshDataTable={() => refreshDataTable()}
                />
              ) : (
                history.push(`/sps/sps-api-oauth-v2/${data.id}`)
              );
            }
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.SpsApiOauthV2}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeSpsApiOauthV2(data.id)}>
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
        globalSearchExist={true}
        showAddButton={ability.can(Action.Add, Page.SpsApiOauthV2)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={spsApiOauthV2Selector}
        searchTableData={searchSpsApiOauthV2}
        clearTableDataMessages={clearSpsApiOauthV2Messages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.SpsApiOauthV2)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
