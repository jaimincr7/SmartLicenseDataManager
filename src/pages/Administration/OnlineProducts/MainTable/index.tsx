import { Checkbox, Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  FilterByBooleanDropDown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { IMainTable, ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import { AlignType } from 'rc-table/lib/interface';
import _ from 'lodash';
import DataTable from '../../../../common/components/DataTable';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import {
  clearConfigOnlineProductsMessages,
  configOnlineProductsSelector,
  setTableColumnSelection,
} from '../../../../store/master/onlineProducts/onlineProducts.reducer';
import {
  deleteConfigOnlineProducts,
  searchConfigOnlineProducts,
} from '../../../../store/master/onlineProducts/onlineProducts.action';
import configOnlineProductsService from '../../../../services/master/onlineProducts/onlineProducts.service';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const {
    setSelectedId,
    setShowSelectedListModal,
    setValuesForSelection,
    isMultiple,
    tableButtons,
  } = props;
  const configOnlineProducts = useAppSelector(configOnlineProductsSelector);
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
    return configOnlineProductsService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(
      dataIndex,
      configOnlineProducts.search.tableName,
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
        title: <span className="dragHandler">String ID</span>,
        column: 'String ID',
        sorter: true,
        children: [
          {
            title: FilterBySwap('string_id', form),
            dataIndex: 'string_id',
            key: 'string_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">GUID</span>,
        column: 'GUID',
        sorter: true,
        children: [
          {
            title: FilterBySwap('guid', form),
            dataIndex: 'guid',
            key: 'guid',
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
        children: [
          {
            title: FilterByBooleanDropDown(
              'enterprise_product',
              configOnlineProducts.search.tableName,
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
    ];
  };

  const removeConfigOnlineProducts = (id: number) => {
    dispatch(deleteConfigOnlineProducts(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.ConfigOnlineProducts}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/administration/config-online-products/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.ConfigOnlineProducts}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeConfigOnlineProducts(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.ConfigOnlineProducts)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={configOnlineProductsSelector}
        searchTableData={searchConfigOnlineProducts}
        clearTableDataMessages={clearConfigOnlineProductsMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        showBulkUpdate={ability.can(Action.Update, Page.ConfigOnlineProducts)}
        setValuesForSelection={setValuesForSelection}
        setObjectForColumnFilter={setObjectForColumnFilter}
        globalSearchExist={false}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
