import { Popconfirm } from 'antd';
import _ from 'lodash';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import { IMainTable } from './mainTable.model';
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
import moment from 'moment';
import { Common } from '../../../../common/constants/common';
import {
  clearCmsPurchaseMessages,
  cmsPurchaseSelector,
  setTableColumnSelection,
} from '../../../../store/cms/purchase/purchase.reducer';
import {
  deleteCmsPurchase,
  searchCmsPurchase,
} from '../../../../store/cms/purchase/purchase.action';
import purchaseService from '../../../../services/cms/purchase/purchase.service';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const { setSelectedId } = props;
  const cmsPurchase = useAppSelector(cmsPurchaseSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const exportExcelFile = (searchData: ISearch) => {
    return purchaseService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(dataIndex, cmsPurchase.search.tableName, form);
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
            title: FilterByDropdown('tenant_id', cmsPurchase.search.lookups?.tenants),
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
            title: FilterByDropdown('company_id', cmsPurchase.search.lookups?.companies),
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
            title: FilterByDropdown('bu_id', cmsPurchase.search.lookups?.bus),
            dataIndex: 'bu_name',
            key: 'bu_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Vendor</span>,
        column: 'Vendor ID',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('vendor_id', cmsPurchase.search.lookups?.cms_vendors),
            dataIndex: 'cms_vendor_name',
            key: 'cms_vendor_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Contract/Agreement ID</span>,
        column: 'Contract/Agreement ID',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'contract_agreement_id',
              cmsPurchase.search.lookups?.cms_contract_agreements
            ),
            dataIndex: 'cms_contract_agreement_name',
            key: 'cms_contract_agreement_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Spend Type</span>,
        column: 'Spend Type ID',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'spend_type_id',
              cmsPurchase.search.lookups?.cms_expenditure_types
            ),
            dataIndex: 'cms_expenditure_type_name',
            key: 'cms_expenditure_type_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Purchase Contact</span>,
        column: 'Purchase Contact ID',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'purchase_contact_id',
              cmsPurchase.search.lookups?.cms_contacts
            ),
            dataIndex: 'cms_contact_name',
            key: 'cms_contact_name',
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
            title: FilterByDateSwap('date_added', cmsPurchase.search.tableName, form),
            dataIndex: 'date_added',
            key: 'date_added',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Purchase Date</span>,
        column: 'Purchase Date',
        sorter: true,
        children: [
          {
            title: FilterByDateSwap('purchase_date', cmsPurchase.search.tableName, form),
            dataIndex: 'purchase_date',
            key: 'purchase_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Purchase Order Number</span>,
        column: 'Purchase Order Number',
        sorter: true,
        children: [
          {
            title: FilterBySwap('purchase_order_number', form),
            dataIndex: 'purchase_order_number',
            key: 'purchase_order_number',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeCmsPurchase = (id: number) => {
    dispatch(deleteCmsPurchase(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.CmsPurchase}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/cms/cms-purchase/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.CmsPurchase}>
        <Popconfirm title="Sure to delete?" onConfirm={() => removeCmsPurchase(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.CmsPurchase)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={cmsPurchaseSelector}
        searchTableData={searchCmsPurchase}
        clearTableDataMessages={clearCmsPurchaseMessages}
        setTableColumnSelection={setTableColumnSelection}
      />
    </>
  );
};

export default forwardRef(MainTable);
