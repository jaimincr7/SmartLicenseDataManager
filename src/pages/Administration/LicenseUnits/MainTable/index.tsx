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
  clearConfigLicenseUnitsMessages,
  configLicenseUnitsSelector,
  setTableColumnSelection,
} from '../../../../store/master/licenseUnits/licenseUnits.reducer';
import {
  deleteConfigLicenseUnits,
  searchConfigLicenseUnits,
} from '../../../../store/master/licenseUnits/licenseUnits.action';
import configLicenseUnitsService from '../../../../services/master/licenseUnits/licenseUnits.service';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const { setSelectedId } = props;
  const configLicenseUnits = useAppSelector(configLicenseUnitsSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const exportExcelFile = (searchData: ISearch) => {
    return configLicenseUnitsService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(dataIndex, configLicenseUnits.search.tableName, form);
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
        title: <span className="dragHandler">License Unit</span>,
        column: 'LicenseUnit',
        sorter: true,
        children: [
          {
            title: FilterBySwap('license_unit', form),
            dataIndex: 'license_unit',
            key: 'license_unit',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeConfigLicenseUnits = (id: number) => {
    dispatch(deleteConfigLicenseUnits(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.ConfigLicenseUnits}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/administration/config-license-units/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.ConfigLicenseUnits}>
        <Popconfirm title="Sure to delete?" onConfirm={() => removeConfigLicenseUnits(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.ConfigLicenseUnits)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={configLicenseUnitsSelector}
        searchTableData={searchConfigLicenseUnits}
        clearTableDataMessages={clearConfigLicenseUnitsMessages}
        setTableColumnSelection={setTableColumnSelection}
      />
    </>
  );
};

export default forwardRef(MainTable);
