import { Checkbox, Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import {
  setTableColumnSelection,
  clearDeviceStateMessages,
  deviceStateSelector,
} from '../../../../store/inventory/deviceState/deviceState.reducer';
import { AlignType } from 'rc-table/lib/interface';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  deleteDeviceState,
  searchDeviceState,
} from '../../../../store/inventory/deviceState/deviceState.action';
import _ from 'lodash';
import deviceService from '../../../../services/inventory/deviceState/deviceState.service';
import {
  FilterByBooleanDropDown,
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { IMainTable, ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import DataTable from '../../../../common/components/DataTable';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import { globalSearchSelector } from '../../../../store/globalSearch/globalSearch.reducer';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const {
    setSelectedId,
    setShowSelectedListModal,
    setValuesForSelection,
    isMultiple,
    setFilterKeys,
    tableButtons,
  } = props;
  const deviceState = useAppSelector(deviceStateSelector);
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
    return deviceService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    setFilterKeys(ObjectForColumnFilter);
    return FilterWithSwapOption(
      dataIndex,
      deviceState.search.tableName,
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
        title: <span className="dragHandler">Tenant Name</span>,
        column: 'TenantId',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'tenant_id',
              deviceState.search.lookups?.tenants?.length > 0
                ? deviceState.search.lookups?.tenants
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
              deviceState.search.lookups?.companies?.length > 0
                ? deviceState.search.lookups?.companies
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
              deviceState.search.lookups?.bus?.length > 0
                ? deviceState.search.lookups?.bus
                : globalFilters?.globalBULookup?.data
            ),
            dataIndex: 'bu_name',
            key: 'bu_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Pattern</span>,
        column: 'Pattern',
        sorter: true,
        children: [
          {
            title: FilterBySwap('pattern', form),
            dataIndex: 'pattern',
            key: 'pattern',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">State Name</span>,
        column: 'State Name',
        sorter: true,
        children: [
          {
            title: FilterBySwap('state_name', form),
            dataIndex: 'state_name',
            key: 'state_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Start Position</span>,
        column: 'Start Position',
        sorter: true,
        children: [
          {
            title: FilterBySwap('start_position', form),
            dataIndex: 'start_position',
            key: 'start_position',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Exact Match</span>,
        column: 'Exact Match',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'exact_match',
              deviceState.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'exact_match',
            key: 'exact_match',
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
        title: <span className="dragHandler">Entire Field</span>,
        column: 'Entire Field',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'entire_field',
              deviceState.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'entire_field',
            key: 'entire_field',
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

  const removeDeviceState = (id: number) => {
    dispatch(deleteDeviceState(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.DeviceState}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/inventory-module/device-states/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.DeviceState}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeDeviceState(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.DeviceState)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={deviceStateSelector}
        searchTableData={searchDeviceState}
        clearTableDataMessages={clearDeviceStateMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.DeviceState)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
