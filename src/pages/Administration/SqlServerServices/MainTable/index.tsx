import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import { FilterWithSwapOption } from '../../../../common/components/DataTable/DataTableFilters';
import { IMainTable, ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import DataTable from '../../../../common/components/DataTable';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import {
  clearConfigSqlServerServicesMessages,
  configSqlServerServicesSelector,
  setTableColumnSelection,
} from '../../../../store/master/sqlServerServices/sqlServerServices.reducer';
import {
  deleteConfigSqlServerServices,
  searchConfigSqlServerServices,
} from '../../../../store/master/sqlServerServices/sqlServerServices.action';
import configSqlServerServicesService from '../../../../services/master/sqlServerServices/sqlServerServices.service';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const {
    setSelectedId,
    setShowSelectedListModal,
    setValuesForSelection,
    isMultiple,
    tableButtons,
  } = props;
  const configSqlServerServices = useAppSelector(configSqlServerServicesSelector);
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
    return configSqlServerServicesService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(
      dataIndex,
      configSqlServerServices.search.tableName,
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
        title: <span className="dragHandler">Service</span>,
        column: 'Service',
        sorter: true,
        children: [
          {
            title: FilterBySwap('service', form),
            dataIndex: 'service',
            key: 'service',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeConfigSqlServerServices = (id: number) => {
    dispatch(deleteConfigSqlServerServices(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.ConfigSqlServerServices}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/administration/config-sql-server-services/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.ConfigSqlServerServices}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeConfigSqlServerServices(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.ConfigSqlServerServices)}
        setSelectedId={setSelectedId}
        showDelete={false}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={configSqlServerServicesSelector}
        searchTableData={searchConfigSqlServerServices}
        clearTableDataMessages={clearConfigSqlServerServicesMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        showBulkUpdate={ability.can(Action.Update, Page.ConfigSqlServerServices)}
        setValuesForSelection={setValuesForSelection}
        setObjectForColumnFilter={setObjectForColumnFilter}
        globalSearchExist={false}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
