import { Popconfirm } from 'antd';
import _ from 'lodash';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
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
  clearCmsPurchaseLineItemMessages,
  cmsPurchaseLineItemSelector,
  setTableColumnSelection,
} from '../../../../store/cms/purchaseLineItem/purchaseLineItem.reducer';
import {
  deleteCmsPurchaseLineItem,
  searchCmsPurchaseLineItem,
} from '../../../../store/cms/purchaseLineItem/purchaseLineItem.action';
import purchaseLineItemService from '../../../../services/cms/purchaseLineItem/purchaseLineItem.service';
import { showDateFromApi } from '../../../../common/helperFunction';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const {
    setSelectedId,
    setShowSelectedListModal,
    setValuesForSelection,
    isMultiple,
    tableButtons,
  } = props;
  const cmsPurchaseLineItem = useAppSelector(cmsPurchaseLineItemSelector);
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
    return purchaseLineItemService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(
      dataIndex,
      cmsPurchaseLineItem.search.tableName,
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
        title: <span className="dragHandler">Purchase</span>,
        column: 'Purchase ID',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'purchase_id',
              cmsPurchaseLineItem.search.lookups?.cms_purchases
            ),
            dataIndex: 'purchase_order_number',
            key: 'purchase_order_number',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Category</span>,
        column: 'Category ID',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'category_id',
              cmsPurchaseLineItem.search.lookups?.cms_categories
            ),
            dataIndex: 'cms_category_name',
            key: 'cms_category_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Category Extended</span>,
        column: 'Category Extended ID',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'category_extended_id',
              cmsPurchaseLineItem.search.lookups?.cms_category_extenders
            ),
            dataIndex: 'cms_category_extended_name',
            key: 'cms_category_extended_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Currency</span>,
        column: 'Currency ID',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('currency_id', cmsPurchaseLineItem.search.lookups?.currency),
            dataIndex: 'currency',
            key: 'currency',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Start Date</span>,
        column: 'Start Date',
        sorter: true,
        children: [
          {
            title: FilterByDateSwapTable('start_date', cmsPurchaseLineItem.search.tableName, form),
            dataIndex: 'start_date',
            key: 'start_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">End Date</span>,
        column: 'End Date',
        sorter: true,
        children: [
          {
            title: FilterByDateSwapTable('end_date', cmsPurchaseLineItem.search.tableName, form),
            dataIndex: 'end_date',
            key: 'end_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Part Number</span>,
        column: 'Part Number',
        sorter: true,
        children: [
          {
            title: FilterBySwap('part_number', form),
            dataIndex: 'part_number',
            key: 'part_number',
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
        title: <span className="dragHandler">Quantity</span>,
        column: 'Quantity',
        sorter: true,
        children: [
          {
            title: FilterBySwap('quantity', form),
            dataIndex: 'quantity',
            key: 'quantity',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Unit Price</span>,
        column: 'Unit Price',
        sorter: true,
        children: [
          {
            title: FilterBySwap('unit_price', form),
            dataIndex: 'unit_price',
            key: 'unit_price',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Extended Price</span>,
        column: 'Extended Price',
        sorter: true,
        children: [
          {
            title: FilterBySwap('extended_price', form),
            dataIndex: 'extended_price',
            key: 'extended_price',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeCmsPurchaseLineItem = (id: number) => {
    dispatch(deleteCmsPurchaseLineItem(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.CmsPurchaseLineItem}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/cms/cms-purchase-line-item/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.CmsPurchaseLineItem}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeCmsPurchaseLineItem(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.CmsPurchaseLineItem)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={cmsPurchaseLineItemSelector}
        searchTableData={searchCmsPurchaseLineItem}
        clearTableDataMessages={clearCmsPurchaseLineItemMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.CmsPurchaseLineItem)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        globalSearchExist={false}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
