import { Checkbox, Popconfirm } from 'antd';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import _ from 'lodash';
import {
  FilterByBooleanDropDown,
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import DataTable from '../../../../common/components/DataTable';
import { AlignType } from 'rc-table/lib/interface';
import { setTableColumnSelection } from '../../../../store/sps/spsAPI/spsApi.reducer';
import { deleteSpsApi, searchImportAPIs } from '../../../../store/sps/spsAPI/spsApi.action';
import { clearCallApiMessages, spsApiSelector } from '../../../../store/sps/spsAPI/spsApi.reducer';
import { useHistory } from 'react-router-dom';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import { IMainTable } from '../../../../common/models/common';
import { ControlFilled, ControlOutlined } from '@ant-design/icons';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const { setSelectedId, setShowSelectedListModal, setValuesForSelection, isMultiple } = props;
  const dispatch = useAppDispatch();
  const spsApis = useAppSelector(spsApiSelector);
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

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(
      dataIndex,
      spsApis.search.tableName,
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
        title: <span className="dragHandler">Group</span>,
        column: 'GroupId',
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
        column: 'API_TypeId',
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
        title: <span className="dragHandler">API Data Format</span>,
        column: 'ApiDataFormat',
        sorter: true,
        children: [
          {
            title: FilterBySwap('api_data_format', form),
            dataIndex: 'api_data_format',
            key: 'api_data_format',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Stored Procedure</span>,
        column: 'StoredProcedure',
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
            title: FilterByBooleanDropDown(
              'enabled',
              spsApis.search?.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'enabled',
            key: 'enabled',
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
        title: <span className="dragHandler">Is System Defined?</span>,
        column: 'IsSystemDefined',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_system_defined',
              spsApis.search?.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_system_defined',
            key: 'is_system_defined',
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

  const onFetchCall = (data: any) => {
    if (data?.sps_mapping_id > 0) {
      history.push(`/administration/config-sps-api-column-mapping/add/${data.sps_mapping_id}`);
    } else {
      history.push(`/administration/config-sps-api-column-mapping/add?api_id=${data.id}`);
    }
  };

  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.SPSApi}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/sps/sps-config-api/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.SPSApi}>
        <Popconfirm
          title="Delete Record?"
          onConfirm={() => {
            dispatch(deleteSpsApi(data.id));
          }}
        >
          <a href="#" title="" className="action-btn">
            <img src={`${process.env.PUBLIC_URL}/assets/images/ic-delete.svg`} alt="" />
          </a>
        </Popconfirm>
      </Can>
      {data?.enabled && (
        <a
          title=""
          className="action-btn"
          onClick={() => {
            onFetchCall(data);
          }}
        >
          {data?.sps_mapping_id > 0 ? (
            <ControlOutlined title="Mapped Api" />
          ) : (
            <ControlFilled title="Map Api" style={{ color: '#00274d' }} />
          )}
        </a>
      )}
    </div>
  );

  return (
    <>
      <DataTable
        ref={dataTableRef}
        showAddButton={ability.can(Action.Add, Page.SPSApi)}
        tableAction={tableAction}
        showDelete={false}
        globalSearchExist={false}
        getTableColumns={getTableColumns}
        reduxSelector={spsApiSelector}
        searchTableData={searchImportAPIs}
        setTableColumnSelection={setTableColumnSelection}
        hideExportButton={true}
        clearTableDataMessages={clearCallApiMessages}
        setSelectedId={(id) => setSelectedId(id)}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.SPSApi)}
        setObjectForColumnFilter={setObjectForColumnFilter}
      />
    </>
  );
};

export default forwardRef(MainTable);
