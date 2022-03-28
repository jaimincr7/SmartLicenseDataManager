import { Checkbox, Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import {
  setTableColumnSelection,
  clearAdDevicesExclusionsMessages,
  adDevicesExclusionsSelector,
} from '../../../../store/ad/adDevicesExclusions/adDevicesExclusions.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  deleteAdDevicesExclusions,
  searchAdDevicesExclusions,
} from '../../../../store/ad/adDevicesExclusions/adDevicesExclusions.action';
import _ from 'lodash';
import { AlignType } from 'rc-table/lib/interface';
import adDevicesExclusionsService from '../../../../services/ad/adDevicesExclusions/adDevicesExclusions.service';
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
    tableButtons,
  } = props;
  const adDevicesExclusions = useAppSelector(adDevicesExclusionsSelector);
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
    return adDevicesExclusionsService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form, columnWidthOpt?: boolean) => {
    return FilterWithSwapOption(
      dataIndex,
      adDevicesExclusions.search.tableName,
      form,
      null,
      ObjectForColumnFilter,
      null,
      columnWidthOpt === undefined ? false : columnWidthOpt
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
            title: FilterBySwap('id', form, true),
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
              adDevicesExclusions.search.lookups?.tenants?.length > 0
                ? adDevicesExclusions.search.lookups?.tenants
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
              adDevicesExclusions.search.lookups?.companies?.length > 0
                ? adDevicesExclusions.search.lookups?.companies
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
              adDevicesExclusions.search.lookups?.bus?.length > 0
                ? adDevicesExclusions.search.lookups?.bus
                : globalFilters?.globalBULookup?.data
            ),
            dataIndex: 'bu_name',
            key: 'bu_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Field</span>,
        column: 'Field',
        sorter: true,
        children: [
          {
            title: FilterBySwap('field', form),
            dataIndex: 'field',
            key: 'field',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Condition</span>,
        column: 'Condition',
        sorter: true,
        children: [
          {
            title: FilterBySwap('condition', form, true),
            dataIndex: 'condition',
            key: 'condition',
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
        title: <span className="dragHandler">Desktop</span>,
        column: 'Desktop',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'desktop',
              adDevicesExclusions.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'desktop',
            key: 'desktop',
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
        title: <span className="dragHandler">Server</span>,
        column: 'Server',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'server',
              adDevicesExclusions.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'server',
            key: 'server',
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
        title: <span className="dragHandler">Unknown</span>,
        column: 'Unknown',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'unknown',
              adDevicesExclusions.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'unknown',
            key: 'unknown',
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
        title: <span className="dragHandler">Instance Count</span>,
        column: 'InstanceCount',
        sorter: true,
        children: [
          {
            title: FilterBySwap('instance_count', form, true),
            dataIndex: 'instance_count',
            key: 'instance_count',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Decom</span>,
        column: 'Decom',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'decom',
              adDevicesExclusions.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'decom',
            key: 'decom',
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

  const removeAdDevicesExclusions = (id: number) => {
    dispatch(deleteAdDevicesExclusions(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.ADExclusions}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/ad/ad-devices-exclusions/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.ADExclusions}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeAdDevicesExclusions(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.ADExclusions)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={adDevicesExclusionsSelector}
        searchTableData={searchAdDevicesExclusions}
        clearTableDataMessages={clearAdDevicesExclusionsMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        showBulkUpdate={ability.can(Action.Update, Page.ADExclusions)}
        setValuesForSelection={setValuesForSelection}
        setObjectForColumnFilter={setObjectForColumnFilter}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
