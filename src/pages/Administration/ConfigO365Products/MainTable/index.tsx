import { Checkbox, Popconfirm } from 'antd';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import _ from 'lodash';
import {
  FilterByBooleanDropDown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { IMainTable, ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import { AlignType } from 'rc-table/lib/interface';
import DataTable from '../../../../common/components/DataTable';
import {
  clearConfigO365ProductsMessages,
  setTableColumnSelection,
  configO365ProductsSelector,
} from '../../../../store/master/configO365Products/configO365Products.reducer';
import configO365ProductsService from '../../../../services/master/configO365Products/configO365Products.service';
import {
  deleteConfigO365Products,
  searchConfigO365Products,
} from '../../../../store/master/configO365Products/configO365Products.action';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const {
    setSelectedId,
    setShowSelectedListModal,
    setValuesForSelection,
    isMultiple,
    tableButtons,
  } = props;
  const configO365Products = useAppSelector(configO365ProductsSelector);
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
    return configO365ProductsService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(
      dataIndex,
      configO365Products.search.tableName,
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
        title: <span className="dragHandler">Product</span>,
        column: 'Product',
        sorter: true,
        children: [
          {
            title: FilterBySwap('product', form),
            dataIndex: 'product',
            key: 'product',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Price</span>,
        column: 'Price',
        sorter: true,
        children: [
          {
            title: FilterBySwap('price', form),
            dataIndex: 'price',
            key: 'price',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Units</span>,
        column: 'Units',
        sorter: true,
        children: [
          {
            title: FilterBySwap('units', form),
            dataIndex: 'units',
            key: 'units',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Enterprise Product</span>,
        column: 'Enterprise Product',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'enterprise_product',
              configO365Products.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'enterprise_product',
            key: 'enterprise_product',
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
        title: <span className="dragHandler">Component Only</span>,
        column: 'Component Only',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'component_only',
              configO365Products.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'component_only',
            key: 'component_only',
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
        title: <span className="dragHandler">Hide</span>,
        column: 'Hide',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'hide',
              configO365Products.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'hide',
            key: 'hide',
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

  const removeConfigO365Products = (id: number) => {
    dispatch(deleteConfigO365Products(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.Bu}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/administration/config-o365-products/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.Bu}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeConfigO365Products(data.id)}>
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
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showAddButton={ability.can(Action.Add, Page.Bu)}
        showBulkUpdate={ability.can(Action.Update, Page.Bu)}
        showDelete={false}
        globalSearchExist={false}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={configO365ProductsSelector}
        searchTableData={searchConfigO365Products}
        clearTableDataMessages={clearConfigO365ProductsMessages}
        setTableColumnSelection={setTableColumnSelection}
        setObjectForColumnFilter={setObjectForColumnFilter}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
