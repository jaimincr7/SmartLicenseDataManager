import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  setTableColumnSelection,
  clearWindowsServerEntitlementsMessages,
  windowsServerEntitlementsSelector,
} from '../../../../store/windowsServer/windowsServerEntitlements/windowsServerEntitlements.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  deleteWindowsServerEntitlements,
  searchWindowsServerEntitlements,
} from '../../../../store/windowsServer/windowsServerEntitlements/windowsServerEntitlements.action';
import { IMainTable } from './mainTable.model';
import moment from 'moment';
import { Common } from '../../../../common/constants/common';
import _ from 'lodash';
import windowsServerEntitlementsService from '../../../../services/windowsServer/windowsServerEntitlements/windowsServerEntitlements.service';
import {
  FilterByDate,
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import DataTable from '../../../../common/components/DataTable';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const { setSelectedId } = props;
  const windowsServerEntitlements = useAppSelector(windowsServerEntitlementsSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const exportExcelFile = (searchData: ISearch) => {
    return windowsServerEntitlementsService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(dataIndex, windowsServerEntitlements.search.tableName, form);
  };

  const getTableColumns = (form) => {
    return [
      {
        title: 'Tenant Name',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('tenant_id', windowsServerEntitlements.search.lookups?.tenants),
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
            title: FilterByDropdown(
              'company_id',
              windowsServerEntitlements.search.lookups?.companies
            ),
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
            title: FilterByDropdown('bu_id', windowsServerEntitlements.search.lookups?.bus),
            dataIndex: 'bu_name',
            key: 'bu_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Date Added',
        sorter: true,
        children: [
          {
            title: FilterByDate('date_added'),
            dataIndex: 'date_added',
            key: 'date_added',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: 'Product Name',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'license_id',
              windowsServerEntitlements.search.lookups?.config_windows_server_licenses
            ),
            dataIndex: 'product_name',
            key: 'product_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Qty 01',
        sorter: true,
        children: [
          {
            title: FilterBySwap('qty_01', form),
            dataIndex: 'qty_01',
            key: 'qty_01',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Qty 02',
        sorter: true,
        children: [
          {
            title: FilterBySwap('qty_02', form),
            dataIndex: 'qty_02',
            key: 'qty_02',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Qty 03',
        sorter: true,
        children: [
          {
            title: FilterBySwap('qty_03', form),
            dataIndex: 'qty_03',
            key: 'qty_03',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeWindowsServerEntitlements = (id: number) => {
    dispatch(deleteWindowsServerEntitlements(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.WindowsServerEntitlement}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/windows-server/entitlements/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.WindowsServerEntitlement}>
        <Popconfirm
          title="Sure to delete?"
          onConfirm={() => removeWindowsServerEntitlements(data.id)}
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
        showAddButton={ability.can(Action.Add, Page.WindowsServerEntitlement)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={windowsServerEntitlementsSelector}
        searchTableData={searchWindowsServerEntitlements}
        clearTableDataMessages={clearWindowsServerEntitlementsMessages}
        setTableColumnSelection={setTableColumnSelection}
      />
    </>
  );
};

export default forwardRef(MainTable);
