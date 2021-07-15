import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  clearWindowsServerPricingMessages,
  windowsServerPricingSelector,
} from '../../../../store/windowsServer/windowsServerPricing/windowsServerPricing.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  deleteWindowsServerPricing,
  searchWindowsServerPricing,
} from '../../../../store/windowsServer/windowsServerPricing/windowsServerPricing.action';
import { IMainTable } from './mainTable.model';
import moment from 'moment';
import { Common } from '../../../../common/constants/common';
import _ from 'lodash';
import windowsServerPricingService from '../../../../services/windowsServer/windowsServerPricing/windowsServerPricing.service';
import {
  FilterByDate,
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import DataTable from '../../../../common/components/DataTable';
import { setTableColumnSelection } from '../../../../store/windowsServer/windowsServerPricing/windowsServerPricing.reducer';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const { setSelectedId } = props;
  const windowsServerPricing = useAppSelector(windowsServerPricingSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const exportExcelFile = (searchData: ISearch) => {
    return windowsServerPricingService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(dataIndex, windowsServerPricing.search.tableName, form);
  };

  const getTableColumns = (form) => {
    return [
      {
        title: 'Tenant Name',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('tenant_id', windowsServerPricing.search.lookups?.tenants),
            dataIndex: 'tenant_name',
            key: 'tenant_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Company Name',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('company_id', windowsServerPricing.search.lookups?.companies),
            dataIndex: 'company_name',
            key: 'company_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Bu Name',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('bu_id', windowsServerPricing.search.lookups?.bus),
            dataIndex: 'bu_name',
            key: 'bu_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Date Added',
        sorter: true,
        children: [
          {
            title: FilterByDate('date_added'),
            dataIndex: 'date_added',
            key: 'date_added',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: 'Product Name',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'license_id',
              windowsServerPricing.search.lookups?.config_windows_server_licenses
            ),
            dataIndex: 'product_name',
            key: 'product_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Agreement Type',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'agreement_type_id',
              windowsServerPricing.search.lookups?.agreementTypes
            ),
            dataIndex: 'agreement_type',
            key: 'agreement_type',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Currency Name',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('currency_id', windowsServerPricing.search.lookups?.currency),
            dataIndex: 'currency',
            key: 'currency',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Price',
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
    ];
  };

  const removeWindowsServerPricing = (id: number) => {
    dispatch(deleteWindowsServerPricing(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.WindowsServerPricing}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/windows-server/pricing/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.WindowsServerPricing}>
        <Popconfirm title="Sure to delete?" onConfirm={() => removeWindowsServerPricing(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.WindowsServerPricing)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={windowsServerPricingSelector}
        searchTableData={searchWindowsServerPricing}
        clearTableDataMessages={clearWindowsServerPricingMessages}
        setTableColumnSelection={setTableColumnSelection}
      />
    </>
  );
};

export default forwardRef(MainTable);
