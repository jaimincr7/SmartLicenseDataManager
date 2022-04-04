import { Checkbox, Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  FilterByBooleanDropDown,
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { AlignType } from 'rc-table/lib/interface';
import { IMainTable, ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import _ from 'lodash';
import DataTable from '../../../../common/components/DataTable';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import {
  clearConfigWindowsServerLicenseMessages,
  configWindowsServerLicenseSelector,
  setTableColumnSelection,
} from '../../../../store/master/windowsServerLicense/windowsServerLicense.reducer';
import {
  deleteConfigWindowsServerLicense,
  searchConfigWindowsServerLicense,
} from '../../../../store/master/windowsServerLicense/windowsServerLicense.action';
import configWindowsServerLicenseService from '../../../../services/master/windowsServerLicense/windowsServerLicense.service';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const {
    setSelectedId,
    setShowSelectedListModal,
    setValuesForSelection,
    isMultiple,
    tableButtons,
  } = props;
  const configWindowsServerLicense = useAppSelector(configWindowsServerLicenseSelector);
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
    return configWindowsServerLicenseService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(
      dataIndex,
      configWindowsServerLicense.search.tableName,
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
        column: 'EditionId',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'edition_id',
              configWindowsServerLicense.search.lookups?.config_windows_server_editions
            ),
            dataIndex: 'windows_server_edition_name',
            key: 'windows_server_edition_name',
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
              configWindowsServerLicense.search.lookups?.config_windows_server_versions
            ),
            dataIndex: 'windows_server_version_name',
            key: 'windows_server_version_name',
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
              configWindowsServerLicense.search.lookups?.config_license_units
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
        title: <span className="dragHandler">Additional Virtual OSEs</span>,
        column: 'AdditionalVirtualOSEs',
        sorter: true,
        children: [
          {
            title: FilterBySwap('additional_virtual_oes_s', form),
            dataIndex: 'additional_virtual_oes_s',
            key: 'additional_virtual_oes_s',
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
        title: <span className="dragHandler">Includes System Center</span>,
        column: 'Includes System Center',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'includes_system_center',
              configWindowsServerLicense.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'includes_system_center',
            key: 'includes_system_center',
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
              configWindowsServerLicense.search.tableName,
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
              configWindowsServerLicense.search.tableName,
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
        title: <span className="dragHandler">Includes Windows Server</span>,
        column: 'Includes Windows Server',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'includes_windows_server',
              configWindowsServerLicense.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'includes_windows_server',
            key: 'includes_windows_server',
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

  const removeConfigWindowsServerLicense = (id: number) => {
    dispatch(deleteConfigWindowsServerLicense(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.ConfigWindowsServerLicense}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/administration/config-windows-server-license/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.ConfigWindowsServerLicense}>
        <Popconfirm
          title="Delete Record?"
          onConfirm={() => removeConfigWindowsServerLicense(data.id)}
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
        showAddButton={ability.can(Action.Add, Page.ConfigWindowsServerLicense)}
        setSelectedId={setSelectedId}
        showDelete={false}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={configWindowsServerLicenseSelector}
        searchTableData={searchConfigWindowsServerLicense}
        clearTableDataMessages={clearConfigWindowsServerLicenseMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        showBulkUpdate={ability.can(Action.Update, Page.ConfigWindowsServerLicense)}
        setValuesForSelection={setValuesForSelection}
        setObjectForColumnFilter={setObjectForColumnFilter}
        globalSearchExist={false}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
