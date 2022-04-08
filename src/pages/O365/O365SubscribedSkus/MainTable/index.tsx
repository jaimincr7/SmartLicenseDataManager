import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import _ from 'lodash';
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
import {
  deleteO365SubscribedSkus,
  searchO365SubscribedSkus,
} from '../../../../store/o365/o365SubscribedSkus/o365SubscribedSkus.action';
import {
  clearO365SubscribedSkusMessages,
  o365SubscribedSkusSelector,
  setTableColumnSelection,
} from '../../../../store/o365/o365SubscribedSkus/o365SubscribedSkus.reducer';
import o365SubscribedSkusService from '../../../../services/o365/o365SubscribedSkus/o365SubscribedSkus.service';
import { globalSearchSelector } from '../../../../store/globalSearch/globalSearch.reducer';
import { showDateFromApi } from '../../../../common/helperFunction';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const {
    setSelectedId,
    setShowSelectedListModal,
    setValuesForSelection,
    isMultiple,
    tableButtons,
    setFilterKeys,
  } = props;
  const o365SubscribedSkus = useAppSelector(o365SubscribedSkusSelector);
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
    return o365SubscribedSkusService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    setFilterKeys(ObjectForColumnFilter);
    return FilterWithSwapOption(
      dataIndex,
      o365SubscribedSkus.search.tableName,
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
              o365SubscribedSkus.search.lookups?.tenants?.length > 0
                ? o365SubscribedSkus.search.lookups?.tenants
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
              o365SubscribedSkus.search.lookups?.companies?.length > 0
                ? o365SubscribedSkus.search.lookups?.companies
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
              o365SubscribedSkus.search.lookups?.bus?.length > 0
                ? o365SubscribedSkus.search.lookups?.bus
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
            title: FilterByDateSwapTable('date_added', o365SubscribedSkus.search.tableName, form),
            dataIndex: 'date_added',
            key: 'date_added',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      // {
      //   title: <span className="dragHandler">Currency</span>,
      //   column: 'CurrencyId',
      //   sorter: true,
      //   children: [
      //     {
      //       title: FilterByDropdown('currency_id', o365SubscribedSkus.search.lookups?.currency),
      //       dataIndex: 'currency',
      //       key: 'currency',
      //       ellipsis: true,
      //     },
      //   ],
      // },
      {
        title: <span className="dragHandler">Capability Status</span>,
        column: 'capabilityStatus',
        sorter: true,
        children: [
          {
            title: FilterBySwap('capability_status', form),
            dataIndex: 'capability_status',
            key: 'capability_status',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Consumed Units</span>,
        column: 'consumedUnits',
        sorter: true,
        children: [
          {
            title: FilterBySwap('consumed_units', form),
            dataIndex: 'consumed_units',
            key: 'consumed_units',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Response Id</span>,
        column: 'responseId',
        sorter: true,
        children: [
          {
            title: FilterBySwap('response_id', form),
            dataIndex: 'response_id',
            key: 'response_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">SKU Id</span>,
        column: 'skuId',
        sorter: true,
        children: [
          {
            title: FilterBySwap('sku_id', form),
            dataIndex: 'sku_id',
            key: 'sku_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">SKU Part Number</span>,
        column: 'skuPartNumber',
        sorter: true,
        children: [
          {
            title: FilterBySwap('sku_part_number', form),
            dataIndex: 'sku_part_number',
            key: 'sku_part_number',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Applies To</span>,
        column: 'appliesTo',
        sorter: true,
        children: [
          {
            title: FilterBySwap('applies_to', form),
            dataIndex: 'applies_to',
            key: 'applies_to',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Enabled</span>,
        column: 'enabled',
        sorter: true,
        children: [
          {
            title: FilterBySwap('enabled', form),
            dataIndex: 'enabled',
            key: 'enabled',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Suspended</span>,
        column: 'suspended',
        sorter: true,
        children: [
          {
            title: FilterBySwap('suspended', form),
            dataIndex: 'suspended',
            key: 'suspended',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Warning</span>,
        column: 'warning',
        sorter: true,
        children: [
          {
            title: FilterBySwap('warning', form),
            dataIndex: 'warning',
            key: 'warning',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Service Plans</span>,
        column: 'servicePlans',
        sorter: true,
        children: [
          {
            title: FilterBySwap('service_plans', form),
            dataIndex: 'service_plans',
            key: 'service_plans',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeO365SubscribedSkus = (id: number) => {
    dispatch(deleteO365SubscribedSkus(id));
  };

  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.O365SubscribedSkus}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/o365/o365-subscribed-skus/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.O365SubscribedSkus}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeO365SubscribedSkus(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.O365SubscribedSkus)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={o365SubscribedSkusSelector}
        searchTableData={searchO365SubscribedSkus}
        clearTableDataMessages={clearO365SubscribedSkusMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.O365SubscribedSkus)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
