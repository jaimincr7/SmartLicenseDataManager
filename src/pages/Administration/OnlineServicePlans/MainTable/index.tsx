import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import { IMainTable } from './mainTable.model';
import { FilterWithSwapOption } from '../../../../common/components/DataTable/DataTableFilters';
import { ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import DataTable from '../../../../common/components/DataTable';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import {
  clearConfigOnlineServicePlansMessages,
  configOnlineServicePlansSelector,
  setTableColumnSelection,
} from '../../../../store/master/onlineServicePlans/onlineServicePlans.reducer';
import {
  deleteConfigOnlineServicePlans,
  searchConfigOnlineServicePlans,
} from '../../../../store/master/onlineServicePlans/onlineServicePlans.action';
import configOnlineServicePlansService from '../../../../services/master/onlineServicePlans/onlineServicePlans.service';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const { setSelectedId } = props;
  const configOnlineServicePlans = useAppSelector(configOnlineServicePlansSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const exportExcelFile = (searchData: ISearch) => {
    return configOnlineServicePlansService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(dataIndex, configOnlineServicePlans.search.tableName, form);
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
        title: <span className="dragHandler">String ID</span>,
        column: 'String ID',
        sorter: true,
        children: [
          {
            title: FilterBySwap('string_id', form),
            dataIndex: 'string_id',
            key: 'string_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">GUID</span>,
        column: 'GUID',
        sorter: true,
        children: [
          {
            title: FilterBySwap('guid', form),
            dataIndex: 'guid',
            key: 'guid',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeConfigOnlineServicePlans = (id: number) => {
    dispatch(deleteConfigOnlineServicePlans(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.ConfigOnlineServicePlans}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/administration/config-online-service-plans/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.ConfigOnlineServicePlans}>
        <Popconfirm
          title="Sure to delete?"
          onConfirm={() => removeConfigOnlineServicePlans(data.id)}
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
        showAddButton={ability.can(Action.Add, Page.ConfigOnlineServicePlans)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={configOnlineServicePlansSelector}
        searchTableData={searchConfigOnlineServicePlans}
        clearTableDataMessages={clearConfigOnlineServicePlansMessages}
        setTableColumnSelection={setTableColumnSelection}
      />
    </>
  );
};

export default forwardRef(MainTable);
