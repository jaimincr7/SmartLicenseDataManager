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
  clearSpsApiOauthUrlInjectionSiteMessages,
  spsApiOauthUrlInjectionSiteSelector,
  setTableColumnSelection,
} from '../../../../store/sps/apiOauthUrlInjectionSite/apiOauthUrlInjectionSite.reducer';
import {
  deleteSpsApiOauthUrlInjectionSite,
  searchSpsApiOauthUrlInjectionSite,
} from '../../../../store/sps/apiOauthUrlInjectionSite/apiOauthUrlInjectionSite.action';
import spsApiOauthUrlInjectionSiteService from '../../../../services/sps/apiOauthUrlInjectionSite/apiOauthUrlInjectionSite.service';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const {
    setSelectedId,
    setShowSelectedListModal,
    setValuesForSelection,
    isMultiple,
    tableButtons,
  } = props;
  const spsApiOauthUrlInjectionSite = useAppSelector(spsApiOauthUrlInjectionSiteSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();
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
    return spsApiOauthUrlInjectionSiteService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(
      dataIndex,
      spsApiOauthUrlInjectionSite.search.tableName,
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
        title: <span className="dragHandler">API Type</span>,
        column: 'API_TypeId',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'api_type_id',
              spsApiOauthUrlInjectionSite.search.lookups?.sps_api_types
            ),
            dataIndex: 'sps_api_type_name',
            key: 'sps_api_type_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Injection Site</span>,
        column: 'InjSite',
        sorter: true,
        children: [
          {
            title: FilterBySwap('inj_site', form),
            dataIndex: 'inj_site',
            key: 'inj_site',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Injection Param ID</span>,
        column: 'InjParamId',
        sorter: true,
        children: [
          {
            title: FilterBySwap('inj_param_id', form),
            dataIndex: 'inj_param_id',
            key: 'inj_param_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Param</span>,
        column: 'Param',
        sorter: true,
        children: [
          {
            title: FilterBySwap('param', form),
            dataIndex: 'param',
            key: 'param',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeSpsApiOauthUrlInjectionSite = (id: number) => {
    dispatch(deleteSpsApiOauthUrlInjectionSite(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.SpsApiOauthUrlInjectionSite}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/sps/sps-api-oauth-url-injection-site/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.SpsApiOauthUrlInjectionSite}>
        <Popconfirm
          title="Delete Record?"
          onConfirm={() => removeSpsApiOauthUrlInjectionSite(data.id)}
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
        showAddButton={ability.can(Action.Add, Page.SpsApiOauthUrlInjectionSite)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={spsApiOauthUrlInjectionSiteSelector}
        searchTableData={searchSpsApiOauthUrlInjectionSite}
        clearTableDataMessages={clearSpsApiOauthUrlInjectionSiteMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.SpsApiOauthUrlInjectionSite)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        globalSearchExist={false}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
