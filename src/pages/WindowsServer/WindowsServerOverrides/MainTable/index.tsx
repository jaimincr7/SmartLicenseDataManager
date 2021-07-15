import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  clearWindowsServerOverridesMessages,
  windowsServerOverridesSelector,
} from '../../../../store/windowsServer/windowsServerOverrides/windowsServerOverrides.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  deleteWindowsServerOverrides,
  searchWindowsServerOverrides,
} from '../../../../store/windowsServer/windowsServerOverrides/windowsServerOverrides.action';
import { IMainTable } from './mainTable.model';
import _ from 'lodash';
import windowsServerOverridesService from '../../../../services/windowsServer/windowsServerOverrides/windowsServerOverrides.service';
import {
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import DataTable from '../../../../common/components/DataTable';
import { setTableColumnSelection } from '../../../../store/windowsServer/windowsServerOverrides/windowsServerOverrides.reducer';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const { setSelectedId } = props;
  const windowsServerOverrides = useAppSelector(windowsServerOverridesSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const exportExcelFile = (searchData: ISearch) => {
    return windowsServerOverridesService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(dataIndex, windowsServerOverrides.search.tableName, form);
  };

  const getTableColumns = (form) => {
    return [
      {
        title: 'Tenant Name',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('tenant_id', windowsServerOverrides.search.lookups?.tenants),
            dataIndex: 'tenant_name',
            key: 'tenant_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Company Name',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('company_id', windowsServerOverrides.search.lookups?.companies),
            dataIndex: 'company_name',
            key: 'company_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Bu Name',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('bu_id', windowsServerOverrides.search.lookups?.bus),
            dataIndex: 'bu_name',
            key: 'bu_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Device Name',
        sorter: true,
        children: [
          {
            title: FilterBySwap('device_name', form),
            dataIndex: 'device_name',
            key: 'device_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Device Type',
        sorter: true,
        children: [
          {
            title: FilterBySwap('id_device_type', form),
            dataIndex: 'id_device_type',
            key: 'id_device_type',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Field',
        sorter: true,
        children: [
          {
            title: FilterBySwap('id_field', form),
            dataIndex: 'id_field',
            key: 'id_field',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Value',
        sorter: true,
        children: [
          {
            title: FilterBySwap('id_value', form),
            dataIndex: 'id_value',
            key: 'id_value',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Override Field',
        sorter: true,
        children: [
          {
            title: FilterBySwap('override_field', form),
            dataIndex: 'override_field',
            key: 'override_field',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Override Value',
        sorter: true,
        children: [
          {
            title: FilterBySwap('override_value', form),
            dataIndex: 'override_value',
            key: 'override_value',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Enabled',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'enabled',
              windowsServerOverrides.search.lookups?.booleanLookup
            ),
            dataIndex: 'enabled',
            key: 'enabled',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Version',
        sorter: true,
        children: [
          {
            title: FilterBySwap('version', form),
            dataIndex: 'version',
            key: 'version',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Edition',
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
        title: 'Source',
        sorter: true,
        children: [
          {
            title: FilterBySwap('source', form),
            dataIndex: 'source',
            key: 'source',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Notes',
        sorter: true,
        children: [
          {
            title: FilterBySwap('notes', form),
            dataIndex: 'notes',
            key: 'notes',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeWindowsServerOverrides = (id: number) => {
    dispatch(deleteWindowsServerOverrides(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <a
        className="action-btn"
        onClick={() => {
          setSelectedId(data.id);
          history.push(`/windows-server/overrides/${data.id}`);
        }}
      >
        <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
      </a>
      <Popconfirm title="Sure to delete?" onConfirm={() => removeWindowsServerOverrides(data.id)}>
        <a href="#" title="" className="action-btn">
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-delete.svg`} alt="" />
        </a>
      </Popconfirm>
    </div>
  );

  return (
    <>
      <DataTable
        ref={dataTableRef}
        showAddButton={true}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={windowsServerOverridesSelector}
        searchTableData={searchWindowsServerOverrides}
        clearTableDataMessages={clearWindowsServerOverridesMessages}
        setTableColumnSelection={setTableColumnSelection}
      />
    </>
  );
};

export default forwardRef(MainTable);