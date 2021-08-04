import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import { IMainTable } from './mainTable.model';
import _ from 'lodash';
import {
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { ISearch } from '../../../../common/models/common';
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
  const { setSelectedId } = props;
  const configuration = useAppSelector(configurationSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const exportExcelFile = (searchData: ISearch) => {
    return configurationService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(dataIndex, configuration.search.tableName, form);
  };

  const getTableColumns = (form) => {
    return [
      {
        title: <span className="dragHandler">Name</span>,
        column: 'name',
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
        title: <span className="dragHandler">Description</span>,
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
        title: <span className="dragHandler">Embedded Url</span>,
        column: 'EmbeddedUrl',
        sorter: true,
        children: [
          {
            title: FilterBySwap('embedded_url', form),
            dataIndex: 'embedded_url',
            key: 'embedded_url',
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
        <Popconfirm title="Sure to delete?" onConfirm={() => removeConfiguration(data.id)}>
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
      />
    </>
  );
};

export default forwardRef(MainTable);
