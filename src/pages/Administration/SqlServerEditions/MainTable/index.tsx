import { Checkbox, Popconfirm } from 'antd';
import _ from 'lodash';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  FilterByBooleanDropDown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { AlignType } from 'rc-table/lib/interface';
import { IMainTable, ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import DataTable from '../../../../common/components/DataTable';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import {
  clearConfigSqlServerEditionsMessages,
  configSqlServerEditionsSelector,
  setTableColumnSelection,
} from '../../../../store/master/sqlServerEditions/sqlServerEditions.reducer';
import {
  deleteConfigSqlServerEditions,
  searchConfigSqlServerEditions,
} from '../../../../store/master/sqlServerEditions/sqlServerEditions.action';
import configSqlServerEditionsService from '../../../../services/master/sqlServerEditions/sqlServerEditions.service';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const {
    setSelectedId,
    setShowSelectedListModal,
    setValuesForSelection,
    isMultiple,
    tableButtons,
  } = props;
  const configSqlServerEditions = useAppSelector(configSqlServerEditionsSelector);
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
    return configSqlServerEditionsService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(
      dataIndex,
      configSqlServerEditions.search.tableName,
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
        title: <span className="dragHandler">Edition</span>,
        column: 'Edition',
        sorter: true,
        children: [
          {
            title: FilterBySwap('edition', form),
            dataIndex: 'edition',
            key: 'edition',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Licensable</span>,
        column: 'Licensable',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'licensable',
              configSqlServerEditions.search.tableName,
              setObjectForColumnFilter
            ),
            dataIndex: 'licensable',
            key: 'licensable',
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

  const removeConfigSqlServerEditions = (id: number) => {
    dispatch(deleteConfigSqlServerEditions(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.ConfigSqlServerEditions}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/administration/config-sql-server-editions/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.ConfigSqlServerEditions}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeConfigSqlServerEditions(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.ConfigSqlServerEditions)}
        setSelectedId={setSelectedId}
        showDelete={false}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={configSqlServerEditionsSelector}
        searchTableData={searchConfigSqlServerEditions}
        clearTableDataMessages={clearConfigSqlServerEditionsMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        showBulkUpdate={ability.can(Action.Update, Page.ConfigSqlServerEditions)}
        setValuesForSelection={setValuesForSelection}
        setObjectForColumnFilter={setObjectForColumnFilter}
        globalSearchExist={false}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
