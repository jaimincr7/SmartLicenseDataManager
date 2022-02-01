import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import {
  setTableColumnSelection,
  clearCiscoProductAttributesMessages,
  ciscoProductAttributesSelector,
} from '../../../../store/hwCisco/ciscoProductAttributes/ciscoProductAttributes.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  deleteCiscoProductAttributes,
  searchCiscoProductAttributes,
} from '../../../../store/hwCisco/ciscoProductAttributes/ciscoProductAttributes.action';
import _ from 'lodash';
import ciscoProductAttributesService from '../../../../services/hwCisco/ciscoProductAttributes/ciscoProductAttributes.service';
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
  const ciscoProductAttributes = useAppSelector(ciscoProductAttributesSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const globalFilters = useAppSelector(globalSearchSelector);
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
    return ciscoProductAttributesService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    setFilterKeys(ObjectForColumnFilter);
    return FilterWithSwapOption(
      dataIndex,
      ciscoProductAttributes.search.tableName,
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
              ciscoProductAttributes.search.lookups?.tenants?.length > 0
                ? ciscoProductAttributes.search.lookups?.tenants
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
              ciscoProductAttributes.search.lookups?.companies?.length > 0
                ? ciscoProductAttributes.search.lookups?.companies
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
              ciscoProductAttributes.search.lookups?.bus?.length > 0
                ? ciscoProductAttributes.search.lookups?.bus
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
              ciscoProductAttributes.search.tableName,
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
        title: <span className="dragHandler">LDo Sales</span>,
        column: 'LDoSales',
        sorter: true,
        children: [
          {
            title: FilterByDateSwapTable(
              'l_do_sales',
              ciscoProductAttributes.search.tableName,
              form
            ),
            dataIndex: 'l_do_sales',
            key: 'l_do_sales',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">LDo Support</span>,
        column: 'LDoSupport',
        sorter: true,
        children: [
          {
            title: FilterByDateSwapTable(
              'l_do_support',
              ciscoProductAttributes.search.tableName,
              form
            ),
            dataIndex: 'l_do_support',
            key: 'l_do_support',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Date Confirmed</span>,
        column: 'Date_Confirmed',
        sorter: true,
        children: [
          {
            title: FilterByDateSwapTable(
              'date_confirmed',
              ciscoProductAttributes.search.tableName,
              form
            ),
            dataIndex: 'date_confirmed',
            key: 'date_confirmed',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },

      //STRINGS

      {
        title: <span className="dragHandler">Source</span>,
        column: 'Source',
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
        title: <span className="dragHandler">Product ID</span>,
        column: 'Product_ID',
        sorter: true,
        children: [
          {
            title: FilterBySwap('product_id', form),
            dataIndex: 'product_id',
            key: 'product_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Product Description</span>,
        column: 'Product_Description',
        sorter: true,
        children: [
          {
            title: FilterBySwap('product_description', form),
            dataIndex: 'product_description',
            key: 'product_description',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">LDoS Category</span>,
        column: 'LDoS_Category',
        sorter: true,
        children: [
          {
            title: FilterBySwap('l_do_s_category', form),
            dataIndex: 'l_do_s_category',
            key: 'l_do_s_category',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Date Source</span>,
        column: 'Date_Source',
        sorter: true,
        children: [
          {
            title: FilterBySwap('date_source', form),
            dataIndex: 'date_source',
            key: 'date_source',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Asset Type</span>,
        column: 'Asset_Type',
        sorter: true,
        children: [
          {
            title: FilterBySwap('asset_type', form),
            dataIndex: 'asset_type',
            key: 'asset_type',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Product Type</span>,
        column: 'Product_Type',
        sorter: true,
        children: [
          {
            title: FilterBySwap('product_type', form),
            dataIndex: 'product_type',
            key: 'product_type',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Product Group</span>,
        column: 'Product_Group',
        sorter: true,
        children: [
          {
            title: FilterBySwap('product_group', form),
            dataIndex: 'product_group',
            key: 'product_group',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Product Family</span>,
        column: 'Product_Family',
        sorter: true,
        children: [
          {
            title: FilterBySwap('product_family', form),
            dataIndex: 'product_family',
            key: 'product_family',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Product Sub Type</span>,
        column: 'Product_SubType',
        sorter: true,
        children: [
          {
            title: FilterBySwap('product_sub_type', form),
            dataIndex: 'product_sub_type',
            key: 'product_sub_type',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Generalized Type</span>,
        column: 'Generalized_Type',
        sorter: true,
        children: [
          {
            title: FilterBySwap('generalized_type', form),
            dataIndex: 'generalized_type',
            key: 'generalized_type',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Software Analysis Category</span>,
        column: 'Software_Analysis_Category',
        sorter: true,
        children: [
          {
            title: FilterBySwap('software_analysis_category', form),
            dataIndex: 'software_analysis_category',
            key: 'software_analysis_category',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Architecture Group</span>,
        column: 'Architecture_Group',
        sorter: true,
        children: [
          {
            title: FilterBySwap('architecture_group', form),
            dataIndex: 'architecture_group',
            key: 'architecture_group',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Architecture Sub Group</span>,
        column: 'Architecture_SubGroup',
        sorter: true,
        children: [
          {
            title: FilterBySwap('architecture_sub_group', form),
            dataIndex: 'architecture_sub_group',
            key: 'architecture_sub_group',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Coverage Policy</span>,
        column: 'Coverage_Policy',
        sorter: true,
        children: [
          {
            title: FilterBySwap('coverage_policy', form),
            dataIndex: 'coverage_policy',
            key: 'coverage_policy',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">No Coverage Reason</span>,
        column: 'No_Coverage_Reason',
        sorter: true,
        children: [
          {
            title: FilterBySwap('no_coverage_reason', form),
            dataIndex: 'no_coverage_reason',
            key: 'no_coverage_reason',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Hardware List Price</span>,
        column: 'Hardware_List_Price',
        sorter: true,
        children: [
          {
            title: FilterBySwap('hardware_list_price', form),
            dataIndex: 'hardware_list_price',
            key: 'hardware_list_price',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Maintenance List Price</span>,
        column: 'Maintenance_List_Price',
        sorter: true,
        children: [
          {
            title: FilterBySwap('maintenance_list_price', form),
            dataIndex: 'maintenance_list_price',
            key: 'maintenance_list_price',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeCiscoProductAttributes = (id: number) => {
    dispatch(deleteCiscoProductAttributes(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.HwCiscoProductAttributes}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/hw-cisco/cisco-product-attributes/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.HwCiscoProductAttributes}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeCiscoProductAttributes(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.HwCiscoProductAttributes)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={ciscoProductAttributesSelector}
        searchTableData={searchCiscoProductAttributes}
        clearTableDataMessages={clearCiscoProductAttributesMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.HwCiscoProductAttributes)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
