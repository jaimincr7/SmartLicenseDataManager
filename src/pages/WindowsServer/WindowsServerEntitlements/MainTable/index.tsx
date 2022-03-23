import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
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
import _ from 'lodash';
import windowsServerEntitlementsService from '../../../../services/windowsServer/windowsServerEntitlements/windowsServerEntitlements.service';
import {
  FilterByDateSwap,
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { IMainTable, ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import DataTable from '../../../../common/components/DataTable';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import { globalSearchSelector } from '../../../../store/globalSearch/globalSearch.reducer';
import { showDateFromApi } from '../../../../common/helperFunction';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const {
    setSelectedId,
    setShowSelectedListModal,
    setValuesForSelection,
    isMultiple,
    setFilterKeys,
    tableButtons,
  } = props;
  const windowsServerEntitlements = useAppSelector(windowsServerEntitlementsSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();
  const globalFilters = useAppSelector(globalSearchSelector);
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
    return windowsServerEntitlementsService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    setFilterKeys(ObjectForColumnFilter);
    return FilterWithSwapOption(
      dataIndex,
      windowsServerEntitlements.search.tableName,
      form,
      null,
      ObjectForColumnFilter
    );
  };

  const FilterByDateSwapTable = (dataIndex: string, tableName: string, form: any) => {
    return FilterByDateSwap(dataIndex, tableName, form, null, ObjectForColumnFilter);
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
        title: <span className="dragHandler">Tenant Name</span>,
        column: 'TenantId',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'tenant_id',
              windowsServerEntitlements.search.lookups?.tenants?.length > 0
                ? windowsServerEntitlements.search.lookups?.tenants
                : globalFilters?.globalTenantLookup?.data
            ),
            dataIndex: 'tenant_name',
            key: 'tenant_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Company Name</span>,
        column: 'CompanyId',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'company_id',
              windowsServerEntitlements.search.lookups?.companies?.length > 0
                ? windowsServerEntitlements.search.lookups?.companies
                : globalFilters?.globalCompanyLookup?.data
            ),
            dataIndex: 'company_name',
            key: 'company_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Bu Name</span>,
        column: 'BU_Id',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'bu_id',
              windowsServerEntitlements.search.lookups?.bus?.length > 0
                ? windowsServerEntitlements.search.lookups?.bus
                : globalFilters?.globalBULookup?.data
            ),
            dataIndex: 'bu_name',
            key: 'bu_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Date Added</span>,
        column: 'Date Added',
        sorter: true,
        children: [
          {
            title: FilterByDateSwapTable(
              'date_added',
              windowsServerEntitlements.search.tableName,
              form
            ),
            dataIndex: 'date_added',
            key: 'date_added',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Product Name</span>,
        column: 'LicenseId',
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
        title: <span className="dragHandler">Qty 01</span>,
        column: 'Qty01',
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
        title: <span className="dragHandler">Qty 02</span>,
        column: 'Qty02',
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
        title: <span className="dragHandler">Qty 03</span>,
        column: 'Qty03',
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
      {
        title: <span className="dragHandler">License ID</span>,
        column: 'License_Id',
        sorter: true,
        children: [
          {
            title: FilterBySwap('license_id', form),
            dataIndex: 'license_id',
            key: 'license_id',
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
          title="Delete Record?"
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
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.WindowsServerEntitlement)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
