import { Popconfirm } from 'antd';
import _ from 'lodash';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import {
  setTableColumnSelection,
  clearSlim360O365LicensesMessages,
  slim360O365LicensesSelector,
} from '../../../../store/slim360/o365Licenses/o365Licenses.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  deleteSlim360O365Licenses,
  searchSlim360O365Licenses,
} from '../../../../store/slim360/o365Licenses/o365Licenses.action';
import slim360O365LicensesService from '../../../../services/slim360/o365Licenses/o365Licenses.service';
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
    tableButtons,
  } = props;
  const slim360O365Licenses = useAppSelector(slim360O365LicensesSelector);
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
    return slim360O365LicensesService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(
      dataIndex,
      slim360O365Licenses.search.tableName,
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
              slim360O365Licenses.search.lookups?.tenants?.length > 0
                ? slim360O365Licenses.search.lookups?.tenants
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
              slim360O365Licenses.search.lookups?.companies?.length > 0
                ? slim360O365Licenses.search.lookups?.companies
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
              slim360O365Licenses.search.lookups?.bus?.length > 0
                ? slim360O365Licenses.search.lookups?.bus
                : globalFilters?.globalBULookup?.data
            ),
            dataIndex: 'bu_name',
            key: 'bu_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Azure Id</span>,
        column: 'azureId',
        sorter: true,
        children: [
          {
            title: FilterBySwap('azure_id', form),
            dataIndex: 'azure_id',
            key: 'azure_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Azure Tenant Id</span>,
        column: 'azureTenantId',
        sorter: true,
        children: [
          {
            title: FilterBySwap('azure_tenant_id', form),
            dataIndex: 'azure_tenant_id',
            key: 'azure_tenant_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Sku Id</span>,
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
        title: <span className="dragHandler">Sku Name</span>,
        column: 'skuName',
        sorter: true,
        children: [
          {
            title: FilterBySwap('sku_name', form),
            dataIndex: 'sku_name',
            key: 'sku_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Sku Part Number</span>,
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
        title: <span className="dragHandler">Purchased</span>,
        column: 'purchased',
        sorter: true,
        children: [
          {
            title: FilterBySwap('purchased', form),
            dataIndex: 'purchased',
            key: 'purchased',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Consumed</span>,
        column: 'consumed',
        sorter: true,
        children: [
          {
            title: FilterBySwap('consumed', form),
            dataIndex: 'consumed',
            key: 'consumed',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Available</span>,
        column: 'available',
        sorter: true,
        children: [
          {
            title: FilterBySwap('available', form),
            dataIndex: 'available',
            key: 'available',
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
        title: <span className="dragHandler">Baseline</span>,
        column: 'baseline',
        sorter: true,
        children: [
          {
            title: FilterBySwap('baseline', form),
            dataIndex: 'baseline',
            key: 'baseline',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Cost</span>,
        column: 'cost',
        sorter: true,
        children: [
          {
            title: FilterBySwap('cost', form),
            dataIndex: 'cost',
            key: 'cost',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Item Cost</span>,
        column: 'itemCost',
        sorter: true,
        children: [
          {
            title: FilterBySwap('item_cost', form),
            dataIndex: 'item_cost',
            key: 'item_cost',
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
            title: FilterByDateSwapTable('date_added', slim360O365Licenses.search.tableName, form),
            dataIndex: 'date_added',
            key: 'date_added',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Expiration Date</span>,
        column: 'expirationDate',
        sorter: true,
        children: [
          {
            title: FilterByDateSwap(
              'expiration_date',
              slim360O365Licenses.search.tableName,
              form,
              null,
              ObjectForColumnFilter,
              true
            ),
            dataIndex: 'expiration_date',
            key: 'expiration_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Payment Cycle</span>,
        column: 'paymentCycle',
        sorter: true,
        children: [
          {
            title: FilterBySwap('payment_cycle', form),
            dataIndex: 'payment_cycle',
            key: 'payment_cycle',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Plans</span>,
        column: 'plans',
        sorter: true,
        children: [
          {
            title: FilterBySwap('plans', form),
            dataIndex: 'plans',
            key: 'plans',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Committed Year 1</span>,
        column: 'committedYear1',
        sorter: true,
        children: [
          {
            title: FilterBySwap('committed_year_1', form),
            dataIndex: 'committed_year_1',
            key: 'committed_year_1',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Committed Year 2</span>,
        column: 'committedYear2',
        sorter: true,
        children: [
          {
            title: FilterBySwap('committed_year_2', form),
            dataIndex: 'committed_year_2',
            key: 'committed_year_2',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Committed Year 3</span>,
        column: 'committedYear3',
        sorter: true,
        children: [
          {
            title: FilterBySwap('committed_year_3', form),
            dataIndex: 'committed_year_3',
            key: 'committed_year_3',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Year 1 Item Cost</span>,
        column: 'year1ItemCost',
        sorter: true,
        children: [
          {
            title: FilterBySwap('year_1_item_cost', form),
            dataIndex: 'year_1_item_cost',
            key: 'year_1_item_cost',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Year 2 Item Cost</span>,
        column: 'year2ItemCost',
        sorter: true,
        children: [
          {
            title: FilterBySwap('year_2_item_cost', form),
            dataIndex: 'year_2_item_cost',
            key: 'year_2_item_cost',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Year 3 Item Cost</span>,
        column: 'year3ItemCost',
        sorter: true,
        children: [
          {
            title: FilterBySwap('year_3_item_cost', form),
            dataIndex: 'year_3_item_cost',
            key: 'year_3_item_cost',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Future Item Cost</span>,
        column: 'futureItemCost',
        sorter: true,
        children: [
          {
            title: FilterBySwap('future_item_cost', form),
            dataIndex: 'future_item_cost',
            key: 'future_item_cost',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">CSP Item Cost</span>,
        column: 'cspItemCost',
        sorter: true,
        children: [
          {
            title: FilterBySwap('csp_item_cost', form),
            dataIndex: 'csp_item_cost',
            key: 'csp_item_cost',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Current Year Item Cost</span>,
        column: 'currentYearItemCost',
        sorter: true,
        children: [
          {
            title: FilterBySwap('current_year_item_cost', form),
            dataIndex: 'current_year_item_cost',
            key: 'current_year_item_cost',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Current Year Committed</span>,
        column: 'currentYearCommitted',
        sorter: true,
        children: [
          {
            title: FilterBySwap('current_year_committed', form),
            dataIndex: 'current_year_committed',
            key: 'current_year_committed',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Current Average Price</span>,
        column: 'currentAvgPrice',
        sorter: true,
        children: [
          {
            title: FilterBySwap('current_avg_price', form),
            dataIndex: 'current_avg_price',
            key: 'current_avg_price',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Current Purchase Cost</span>,
        column: 'currentPurchaseCost',
        sorter: true,
        children: [
          {
            title: FilterBySwap('current_purchase_cost', form),
            dataIndex: 'current_purchase_cost',
            key: 'current_purchase_cost',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeSlim360O365Licenses = (id: number) => {
    dispatch(deleteSlim360O365Licenses(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.Slim360O365Licenses}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/slim360/slim360-o365-licenses/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.Slim360O365Licenses}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeSlim360O365Licenses(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.Slim360O365Licenses)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={slim360O365LicensesSelector}
        searchTableData={searchSlim360O365Licenses}
        clearTableDataMessages={clearSlim360O365LicensesMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.Slim360O365Licenses)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
