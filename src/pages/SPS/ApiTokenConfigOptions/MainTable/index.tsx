import { Popconfirm } from 'antd';
import _ from 'lodash';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
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
  clearSpsApiTokenConfigOptionsMessages,
  spsApiTokenConfigOptionsSelector,
  setTableColumnSelection,
} from '../../../../store/sps/apiTokenConfigOptions/apiTokenConfigOptions.reducer';
import {
  deleteSpsApiTokenConfigOptions,
  searchSpsApiTokenConfigOptions,
} from '../../../../store/sps/apiTokenConfigOptions/apiTokenConfigOptions.action';
import spsApiTokenConfigOptionsService from '../../../../services/sps/apiTokenConfigOptions/apiTokenConfigOptions.service';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const { setSelectedId } = props;
  const spsApiTokenConfigOptions = useAppSelector(spsApiTokenConfigOptionsSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const exportExcelFile = (searchData: ISearch) => {
    return spsApiTokenConfigOptionsService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(dataIndex, spsApiTokenConfigOptions.search.tableName, form);
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
              spsApiTokenConfigOptions.search.lookups?.sps_api_types
            ),
            dataIndex: 'sps_api_type_name',
            key: 'sps_api_type_name',
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
      {
        title: <span className="dragHandler">Type</span>,
        column: 'Type',
        sorter: true,
        children: [
          {
            title: FilterBySwap('type', form),
            dataIndex: 'type',
            key: 'type',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Is Env Var</span>,
        column: 'IsEnvVar',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'is_env_var',
              spsApiTokenConfigOptions.search.lookups?.booleanLookup
            ),
            dataIndex: 'is_env_var',
            key: 'is_env_var',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
    ];
  };

  const removeSpsApiTokenConfigOptions = (id: number) => {
    dispatch(deleteSpsApiTokenConfigOptions(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.SpsApiTokenConfigOptions}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/sps/sps-api-token-config-options/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.SpsApiTokenConfigOptions}>
        <Popconfirm
          title="Sure to delete?"
          onConfirm={() => removeSpsApiTokenConfigOptions(data.id)}
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
        showAddButton={ability.can(Action.Add, Page.SpsApiTokenConfigOptions)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={spsApiTokenConfigOptionsSelector}
        searchTableData={searchSpsApiTokenConfigOptions}
        clearTableDataMessages={clearSpsApiTokenConfigOptionsMessages}
        setTableColumnSelection={setTableColumnSelection}
      />
    </>
  );
};

export default forwardRef(MainTable);
