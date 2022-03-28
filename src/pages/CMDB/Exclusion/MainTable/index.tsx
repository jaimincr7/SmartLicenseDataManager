import { Checkbox, Popconfirm } from 'antd';
import _ from 'lodash';
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
import DataTable from '../../../../common/components/DataTable';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import {
  deleteCmdbExclusion,
  searchCmdbExclusion,
} from '../../../../store/cmdb/exclusion/exclusion.action';
import {
  clearCmdbExclusionMessages,
  cmdbExclusionSelector,
  setTableColumnSelection,
} from '../../../../store/cmdb/exclusion/exclusion.reducer';
import exclusionService from '../../../../services/cmdb/exclusion/exclusion.service';
import { globalSearchSelector } from '../../../../store/globalSearch/globalSearch.reducer';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const {
    setSelectedId,
    setShowSelectedListModal,
    setValuesForSelection,
    isMultiple,
    tableButtons,
  } = props;
  const cmdbExclusion = useAppSelector(cmdbExclusionSelector);
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
    return exclusionService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(
      dataIndex,
      cmdbExclusion.search.tableName,
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
        title: <span className="dragHandler">Tenant</span>,
        column: 'TenantId',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'tenant_id',
              cmdbExclusion.search.lookups?.tenants?.length > 0
                ? cmdbExclusion.search.lookups?.tenants
                : globalFilters?.globalTenantLookup?.data
            ),
            dataIndex: 'tenant_name',
            key: 'tenant_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Company</span>,
        column: 'CompanyId',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'company_id',
              cmdbExclusion.search.lookups?.companies?.length > 0
                ? cmdbExclusion.search.lookups?.companies
                : globalFilters?.globalCompanyLookup?.data
            ),
            dataIndex: 'company_name',
            key: 'company_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Bu</span>,
        column: 'BU_Id',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'bu_id',
              cmdbExclusion.search.lookups?.bus?.length > 0
                ? cmdbExclusion.search.lookups?.bus
                : globalFilters?.globalBULookup?.data
            ),
            dataIndex: 'bu_name',
            key: 'bu_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Name</span>,
        column: 'Name',
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
        title: <span className="dragHandler">Exclusion Component</span>,
        column: 'ExclusionId_ComponentId',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'exclusion_id_component_id',
              cmdbExclusion.search.lookups?.exclusion_components
            ),
            dataIndex: 'exclusion_component_name',
            key: 'exclusion_component_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Exclusion Location</span>,
        column: 'ExclusionId_LocationId',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'exclusion_id_location_id',
              cmdbExclusion.search.lookups?.config_exclusion_locations
            ),
            dataIndex: 'config_exclusion_location_name',
            key: 'config_exclusion_location_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Exclusion Operation</span>,
        column: 'ExclusionId_OperationId',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'exclusion_id_operation_id',
              cmdbExclusion.search.lookups?.config_exclusion_operations
            ),
            dataIndex: 'config_exclusion_operation_name',
            key: 'config_exclusion_operation_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Exclusion Type</span>,
        column: 'ExclusionTypeId',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'exclusion_type_id',
              cmdbExclusion.search.lookups?.exclusion_types
            ),
            dataIndex: 'exclusion_type_name',
            key: 'exclusion_type_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Value</span>,
        column: 'Value',
        sorter: true,
        children: [
          {
            title: FilterBySwap('value', form),
            dataIndex: 'value',
            key: 'value',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Order</span>,
        column: 'Order',
        sorter: true,
        children: [
          {
            title: FilterBySwap('order', form),
            dataIndex: 'order',
            key: 'order',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Is Enabled</span>,
        column: 'IsEnabled',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_enabled',
              cmdbExclusion.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_enabled',
            key: 'is_enabled',
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

  const removeCmdbExclusion = (id: number) => {
    dispatch(deleteCmdbExclusion(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.CmdbExclusion}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/cmdb/cmdb-exclusion/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.CmdbExclusion}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeCmdbExclusion(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.CmdbExclusion)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={cmdbExclusionSelector}
        searchTableData={searchCmdbExclusion}
        clearTableDataMessages={clearCmdbExclusionMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.CmdbExclusion)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
