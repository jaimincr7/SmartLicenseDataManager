import { Popconfirm } from 'antd';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import _ from 'lodash';
import {
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import DataTable from '../../../../common/components/DataTable';
import { setTableColumnSelection } from '../../../../store/sps/spsAPI/spsApi.reducer';
import { deleteSpsApi, searchImportAPIs } from '../../../../store/sps/spsAPI/spsApi.action';
import { clearCallApiMessages, spsApiSelector } from '../../../../store/sps/spsAPI/spsApi.reducer';
import { useHistory } from 'react-router-dom';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import { IMainTable } from '../../../../common/models/common';

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

  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.SPSApi}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/sps/sps-api/${data.id}`);
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
    </div>
  );

  return (
    <>
      <DataTable
        ref={dataTableRef}
        showAddButton={ability.can(Action.Add, Page.SPSApi)}
        tableAction={tableAction}
        getTableColumns={getTableColumns}
        reduxSelector={spsApiSelector}
        searchTableData={searchImportAPIs}
        setTableColumnSelection={setTableColumnSelection}
        hideExportButton={true}
        globalSearchExist={false}
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
