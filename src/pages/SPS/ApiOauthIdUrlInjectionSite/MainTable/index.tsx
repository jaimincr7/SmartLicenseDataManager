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
  clearSpsApiOauthIdUrlInjectionSiteMessages,
  spsApiOauthIdUrlInjectionSiteSelector,
  setTableColumnSelection,
} from '../../../../store/sps/apiOauthIdUrlInjectionSite/apiOauthIdUrlInjectionSite.reducer';
import {
  deleteSpsApiOauthIdUrlInjectionSite,
  searchSpsApiOauthIdUrlInjectionSite,
} from '../../../../store/sps/apiOauthIdUrlInjectionSite/apiOauthIdUrlInjectionSite.action';
import spsApiOauthIdUrlInjectionSiteService from '../../../../services/sps/apiOauthIdUrlInjectionSite/apiOauthIdUrlInjectionSite.service';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const {
    setSelectedId,
    setShowSelectedListModal,
    setValuesForSelection,
    isMultiple,
    tableButtons,
  } = props;
  const spsApiOauthIdUrlInjectionSite = useAppSelector(spsApiOauthIdUrlInjectionSiteSelector);
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
    return spsApiOauthIdUrlInjectionSiteService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(
      dataIndex,
      spsApiOauthIdUrlInjectionSite.search.tableName,
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
        title: <span className="dragHandler">OAuth Id</span>,
        column: 'OAuthId',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'oauth_id',
              spsApiOauthIdUrlInjectionSite.search.lookups?.sps_api_oauths
            ),
            dataIndex: 'sps_api_oauth_name',
            key: 'sps_api_oauth_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Injection URL</span>,
        column: 'InjId',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'inj_id',
              spsApiOauthIdUrlInjectionSite.search.lookups?.sps_api_injection_sites
            ),
            dataIndex: 'sps_api_injection_site_name',
            key: 'sps_api_injection_site_name',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeSpsApiOauthIdUrlInjectionSite = (id: number) => {
    dispatch(deleteSpsApiOauthIdUrlInjectionSite(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.SpsApiOauthIdUrlInjectionSite}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/sps/sps-api-oauth-id-url-injection-site/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.SpsApiOauthIdUrlInjectionSite}>
        <Popconfirm
          title="Delete Record?"
          onConfirm={() => removeSpsApiOauthIdUrlInjectionSite(data.id)}
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
        showAddButton={ability.can(Action.Add, Page.SpsApiOauthIdUrlInjectionSite)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={spsApiOauthIdUrlInjectionSiteSelector}
        searchTableData={searchSpsApiOauthIdUrlInjectionSite}
        clearTableDataMessages={clearSpsApiOauthIdUrlInjectionSiteMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.SpsApiOauthIdUrlInjectionSite)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        globalSearchExist={false}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
