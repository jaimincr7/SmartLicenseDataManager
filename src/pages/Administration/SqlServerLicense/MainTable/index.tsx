import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { IMainTable, ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
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
  const { setSelectedId } = props;
  const configSqlServerLicense = useAppSelector(configSqlServerLicenseSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const exportExcelFile = (searchData: ISearch) => {
    return configSqlServerLicenseService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(dataIndex, configSqlServerLicense.search.tableName, form);
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
            title: FilterByDropdown(
              'server_cal_eligible',
              configSqlServerLicense.search.lookups?.booleanLookup
            ),
            dataIndex: 'server_cal_eligible',
            key: 'server_cal_eligible',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Alternate License Type</span>,
        column: 'AlternateLicenseType',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'alternate_license_type',
              configSqlServerLicense.search.lookups?.booleanLookup
            ),
            dataIndex: 'alternate_license_type',
            key: 'alternate_license_type',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Includes SA</span>,
        column: 'Includes SA',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'includes_sa',
              configSqlServerLicense.search.lookups?.booleanLookup
            ),
            dataIndex: 'includes_sa',
            key: 'includes_sa',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Server Mobility Rights</span>,
        column: 'Server Mobility Rights',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'server_mobility_rights',
              configSqlServerLicense.search.lookups?.booleanLookup
            ),
            dataIndex: 'server_mobility_rights',
            key: 'server_mobility_rights',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
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
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={configSqlServerLicenseSelector}
        searchTableData={searchConfigSqlServerLicense}
        clearTableDataMessages={clearConfigSqlServerLicenseMessages}
        setTableColumnSelection={setTableColumnSelection}
      />
    </>
  );
};

export default forwardRef(MainTable);
