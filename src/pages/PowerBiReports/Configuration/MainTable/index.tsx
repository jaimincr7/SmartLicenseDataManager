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
  clearConfigurationMessages,
  configurationSelector,
  setTableColumnSelection,
} from '../../../../store/powerBiReports/configuration/configuration.reducer';
import configurationService from '../../../../services/powerBiReports/configuration/configuration.service';
import {
  deleteConfiguration,
  searchConfiguration,
} from '../../../../store/powerBiReports/configuration/configuration.action';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const { setSelectedId, setShowSelectedListModal, setValuesForSelection, isMultiple } = props;
  const configuration = useAppSelector(configurationSelector);
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
    return configurationService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(
      dataIndex,
      configuration.search.tableName,
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
        title: <span className="dragHandler">Name</span>,
        column: 'Description',
        sorter: true,
        children: [
          {
            title: FilterBySwap('description', form),
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Report Type</span>,
        column: 'Report Type',
        sorter: true,
        children: [
          {
            title: FilterBySwap('report_type', form),
            dataIndex: 'report_type',
            key: 'report_type',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">PB Report Id</span>,
        column: 'PBReportId',
        sorter: true,
        children: [
          {
            title: FilterBySwap('pb_report_id', form),
            dataIndex: 'pb_report_id',
            key: 'pb_report_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Work Space Id</span>,
        column: 'WorkSpaceId',
        sorter: true,
        children: [
          {
            title: FilterBySwap('work_space_id', form),
            dataIndex: 'work_space_id',
            key: 'work_space_id',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeConfiguration = (id: number) => {
    dispatch(deleteConfiguration(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.PowerBIConfig}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/power-bi-reports/config/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.PowerBIConfig}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeConfiguration(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.PowerBIConfig)}
        globalSearchExist={false}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={configurationSelector}
        searchTableData={searchConfiguration}
        clearTableDataMessages={clearConfigurationMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.PowerBIConfig)}
        setObjectForColumnFilter={setObjectForColumnFilter}
      />
    </>
  );
};

export default forwardRef(MainTable);
