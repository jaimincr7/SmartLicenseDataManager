import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { IMainTable, ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import DataTable from '../../../../common/components/DataTable';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import {
  clearSpsApiInjectionValueParamV2Messages,
  spsApiInjectionValueParamV2Selector,
  setTableColumnSelection,
} from '../../../../store/sps/apiInjectionValueParamV2/apiInjectionValueParamV2.reducer';
import {
  deleteSpsApiInjectionValueParamV2,
  searchSpsApiInjectionValueParamV2,
} from '../../../../store/sps/apiInjectionValueParamV2/apiInjectionValueParamV2.action';
import spsApiInjectionValueParamV2Service from '../../../../services/sps/apiInjectionValueParamV2/apiInjectionValueParamV2.service';
import { globalSearchSelector } from '../../../../store/globalSearch/globalSearch.reducer';
import AddSpsApiInjectionValueParamV2Modal from '../AddApiInjectionValueParamV2Modal';

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
  const spsApiInjectionValueParamV2 = useAppSelector(spsApiInjectionValueParamV2Selector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const globalFilters = useAppSelector(globalSearchSelector);
  const history = useHistory();
  const [ObjectForColumnFilter, setObjectForColumnFilter] = useState({});

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const refreshDataTable = () => {
    dataTableRef?.current.refreshData();
  };

  useEffect(() => {
    if (isMultiple) {
      dataTableRef?.current.getValuesForSelection();
    }
  }, [isMultiple]);

  const exportExcelFile = (searchData: ISearch) => {
    return spsApiInjectionValueParamV2Service.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(
      dataIndex,
      spsApiInjectionValueParamV2.search.tableName,
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
              spsApiInjectionValueParamV2.search.lookups?.tenants?.length > 0
                ? spsApiInjectionValueParamV2.search.lookups?.tenants
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
              spsApiInjectionValueParamV2.search.lookups?.companies?.length > 0
                ? spsApiInjectionValueParamV2.search.lookups?.companies
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
              spsApiInjectionValueParamV2.search.lookups?.bus?.length > 0
                ? spsApiInjectionValueParamV2.search.lookups?.bus
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
            title: FilterByDropdown(
              'api_type_id',
              spsApiInjectionValueParamV2.search.lookups?.sps_api_types
            ),
            dataIndex: 'sps_api_type_name',
            key: 'sps_api_type_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Injection Param</span>,
        column: 'Injection Param',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'injection_param_id',
              spsApiInjectionValueParamV2.search.lookups?.sps_api_injection_params
            ),
            dataIndex: 'sps_api_injection_param_name',
            key: 'sps_api_injection_param_name',
            ellipsis: true,
          },
        ],
      },
      // {
      //   title: <span className="dragHandler">OauthId</span>,
      //   column: 'OauthId',
      //   sorter: true,
      //   children: [
      //     {
      //       title: FilterBySwap('oauth_id', form),
      //       dataIndex: 'oauth_id',
      //       key: 'oauth_id',
      //       ellipsis: true,
      //     },
      //   ],
      // },
      {
        title: <span className="dragHandler">Value</span>,
        column: 'Value',
        sorter: true,
        children: [
          {
            title: FilterBySwap('value', form),
            dataIndex: 'value',
            key: 'value',
            ellipsis: true,
          },
        ],
      },
      // {
      //   title: <span className="dragHandler">Token</span>,
      //   column: 'Token',
      //   sorter: true,
      //   children: [
      //     {
      //       title: FilterBySwap('token', form),
      //       dataIndex: 'token',
      //       key: 'token',
      //       ellipsis: true,
      //     },
      //   ],
      // },
    ];
  };

  const removeSpsApiInjectionValueParamV2 = (id: number) => {
    dispatch(deleteSpsApiInjectionValueParamV2(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.SpsApiInjectionValueParamV2}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            {
              isTabbed ? (
                <AddSpsApiInjectionValueParamV2Modal
                  showModal={addModalVisible}
                  isMultiple={false}
                  handleModalClose={() => {
                    setAddModalVisible(false);
                    {
                      props.isTabbed ? null : history.push('/sps/sps-api-injection-value-v2');
                    }
                  }}
                  id={data.id}
                  refreshDataTable={() => refreshDataTable()}
                />
              ) : (
                history.push(`/sps/sps-api-injection-value-v2/${data.id}`)
              );
            }
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.SpsApiInjectionValueParamV2}>
        <Popconfirm
          title="Delete Record?"
          onConfirm={() => removeSpsApiInjectionValueParamV2(data.id)}
        >
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
        globalSearchExist={false}
        showAddButton={ability.can(Action.Add, Page.SpsApiInjectionValueParamV2)}
        setSelectedId={setSelectedId}
        showDelete={false}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={spsApiInjectionValueParamV2Selector}
        searchTableData={searchSpsApiInjectionValueParamV2}
        clearTableDataMessages={clearSpsApiInjectionValueParamV2Messages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.SpsApiInjectionValueParamV2)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
