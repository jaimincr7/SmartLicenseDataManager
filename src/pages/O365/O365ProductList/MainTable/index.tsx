import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import { IMainTable } from './mainTable.model';
import _ from 'lodash';
import {
  FilterByDateSwap,
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import DataTable from '../../../../common/components/DataTable';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import {
  deleteO365ProductList,
  searchO365ProductList,
} from '../../../../store/o365/o365ProductList/o365ProductList.action';
import {
  clearO365ProductListMessages,
  o365ProductListSelector,
  setTableColumnSelection,
} from '../../../../store/o365/o365ProductList/o365ProductList.reducer';
import o365ProductListService from '../../../../services/o365/o365ProductList/o365ProductList.service';
import moment from 'moment';
import { Common } from '../../../../common/constants/common';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const { setSelectedId } = props;
  const o365ProductList = useAppSelector(o365ProductListSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const exportExcelFile = (searchData: ISearch) => {
    return o365ProductListService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(dataIndex, o365ProductList.search.tableName, form);
  };

  const getTableColumns = (form) => {
    return [
      {
        title: <span className="dragHandler">Tenant Name</span>,
        column: 'TenantId',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('tenant_id', o365ProductList.search.lookups?.tenants),
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
            title: FilterByDropdown('company_id', o365ProductList.search.lookups?.companies),
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
            title: FilterByDropdown('bu_id', o365ProductList.search.lookups?.bus),
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
            title: FilterByDateSwap('date_added', o365ProductList.search.tableName, form),
            dataIndex: 'date_added',
            key: 'date_added',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Product Title</span>,
        column: 'Product Title',
        sorter: true,
        children: [
          {
            title: FilterBySwap('product_title', form),
            dataIndex: 'product_title',
            key: 'product_title',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Total Licenses</span>,
        column: 'Total Licenses',
        sorter: true,
        children: [
          {
            title: FilterBySwap('total_licenses', form),
            dataIndex: 'total_licenses',
            key: 'total_licenses',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Expired Licenses</span>,
        column: 'Expired Licenses',
        sorter: true,
        children: [
          {
            title: FilterBySwap('expired_licenses', form),
            dataIndex: 'expired_licenses',
            key: 'expired_licenses',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Assigned Licenses</span>,
        column: 'Assigned Licenses',
        sorter: true,
        children: [
          {
            title: FilterBySwap('assigned_licenses', form),
            dataIndex: 'assigned_licenses',
            key: 'assigned_licenses',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Status Message</span>,
        column: 'Status Message',
        sorter: true,
        children: [
          {
            title: FilterBySwap('status_message', form),
            dataIndex: 'status_message',
            key: 'status_message',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeO365ProductList = (id: number) => {
    dispatch(deleteO365ProductList(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.O365ProductList}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/o365/o365-product-list/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.O365ProductList}>
        <Popconfirm title="Sure to delete?" onConfirm={() => removeO365ProductList(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.O365ProductList)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={o365ProductListSelector}
        searchTableData={searchO365ProductList}
        clearTableDataMessages={clearO365ProductListMessages}
        setTableColumnSelection={setTableColumnSelection}
      />
    </>
  );
};

export default forwardRef(MainTable);
