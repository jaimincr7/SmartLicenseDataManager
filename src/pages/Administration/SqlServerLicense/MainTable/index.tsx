import { Checkbox, Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  FilterByBooleanDropDown,
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { IMainTable, ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import { AlignType } from 'rc-table/lib/interface';
import _ from 'lodash';
import DataTable from '../../../../common/components/DataTable';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import {
  clearConfigSqlServerLicenseMessages,
  configSqlServerLicenseSelector,
  setTableColumnSelection,
} from '../../../../store/master/sqlServerLicense/sqlServerLicense.reducer';
import {
  deleteConfigSqlServerLicense,
  searchConfigSqlServerLicense,
} from '../../../../store/master/sqlServerLicense/sqlServerLicense.action';
import configSqlServerLicenseService from '../../../../services/master/sqlServerLicense/sqlServerLicense.service';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const {
    setSelectedId,
    setShowSelectedListModal,
    setValuesForSelection,
    isMultiple,
    tableButtons,
  } = props;
  const configSqlServerLicense = useAppSelector(configSqlServerLicenseSelector);
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
    return configSqlServerLicenseService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(
      dataIndex,
      configSqlServerLicense.search.tableName,
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
        column: 'ServiceId',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'service_id',
              configSqlServerLicense.search.lookups?.config_sql_server_services
            ),
            dataIndex: 'sql_server_service_name',
            key: 'sql_server_service_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Edition</span>,
        column: 'EditionId',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'edition_id',
              configSqlServerLicense.search.lookups?.config_sql_server_editions
            ),
            dataIndex: 'sql_server_edition_name',
            key: 'sql_server_edition_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Version</span>,
        column: 'VersionId',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'version_id',
              configSqlServerLicense.search.lookups?.config_sql_server_versions
            ),
            dataIndex: 'sql_server_version_name',
            key: 'sql_server_version_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">License Unit</span>,
        column: 'LicenseUnitId',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'license_unit_id',
              configSqlServerLicense.search.lookups?.config_license_units
            ),
            dataIndex: 'license_unit_name',
            key: 'license_unit_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Product Name</span>,
        column: 'Product Name',
        sorter: true,
        children: [
          {
            title: FilterBySwap('product_name', form),
            dataIndex: 'product_name',
            key: 'product_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Units Per License</span>,
        column: 'UnitsPerLicense',
        sorter: true,
        children: [
          {
            title: FilterBySwap('units_per_license', form),
            dataIndex: 'units_per_license',
            key: 'units_per_license',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">License Quantity Minimum</span>,
        column: 'LicenseQuantityMinimum',
        sorter: true,
        children: [
          {
            title: FilterBySwap('license_quantity_minimum', form),
            dataIndex: 'license_quantity_minimum',
            key: 'license_quantity_minimum',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Server CAL Eligible</span>,
        column: 'Server_CAL_Eligible',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'server_cal_eligible',
              configSqlServerLicense.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'server_cal_eligible',
            key: 'server_cal_eligible',
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
        title: <span className="dragHandler">Alternate License Type</span>,
        column: 'AlternateLicenseType',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'alternate_license_type',
              configSqlServerLicense.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'alternate_license_type',
            key: 'alternate_license_type',
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
        title: <span className="dragHandler">Includes SA</span>,
        column: 'Includes SA',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'includes_sa',
              configSqlServerLicense.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'includes_sa',
            key: 'includes_sa',
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
        title: <span className="dragHandler">Server Mobility Rights</span>,
        column: 'Server Mobility Rights',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'server_mobility_rights',
              configSqlServerLicense.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'server_mobility_rights',
            key: 'server_mobility_rights',
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

  const removeConfigSqlServerLicense = (id: number) => {
    dispatch(deleteConfigSqlServerLicense(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.ConfigSqlServerLicense}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/administration/config-sql-server-license/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.ConfigSqlServerLicense}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeConfigSqlServerLicense(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.ConfigSqlServerLicense)}
        setSelectedId={setSelectedId}
        showDelete={false}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={configSqlServerLicenseSelector}
        searchTableData={searchConfigSqlServerLicense}
        clearTableDataMessages={clearConfigSqlServerLicenseMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.ConfigSqlServerLicense)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        globalSearchExist={false}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
