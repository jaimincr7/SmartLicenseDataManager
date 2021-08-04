import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  setTableColumnSelection,
  clearCiscoSiteMatrixMessages,
  ciscoSiteMatrixSelector,
} from '../../../../store/hwCisco/ciscoSiteMatrix/ciscoSiteMatrix.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  deleteCiscoSiteMatrix,
  searchCiscoSiteMatrix,
} from '../../../../store/hwCisco/ciscoSiteMatrix/ciscoSiteMatrix.action';
import { IMainTable } from './mainTable.model';
import moment from 'moment';
import { Common } from '../../../../common/constants/common';
import _ from 'lodash';
import ciscoSiteMatrixService from '../../../../services/hwCisco/ciscoSiteMatrix/ciscoSiteMatrix.service';
import {
  FilterByDate,
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import DataTable from '../../../../common/components/DataTable';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const { setSelectedId } = props;
  const ciscoSiteMatrix = useAppSelector(ciscoSiteMatrixSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const exportExcelFile = (searchData: ISearch) => {
    return ciscoSiteMatrixService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(dataIndex, ciscoSiteMatrix.search.tableName, form);
  };

  const getTableColumns = (form) => {
    return [
      {
        title: 'Tenant Name',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('tenant_id', ciscoSiteMatrix.search.lookups?.tenants),
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
            title: FilterByDropdown('company_id', ciscoSiteMatrix.search.lookups?.companies),
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
            title: FilterByDropdown('bu_id', ciscoSiteMatrix.search.lookups?.bus),
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
        title: 'Source',
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
        title: 'Installed At Site Id',
        sorter: true,
        children: [
          {
            title: FilterBySwap('installed_at_site_id', form),
            dataIndex: 'installed_at_site_id',
            key: 'installed_at_site_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Historical Shipped Instance Count',
        sorter: true,
        children: [
          {
            title: FilterBySwap('historical_shipped_instance_count', form),
            dataIndex: 'historical_shipped_instance_count',
            key: 'historical_shipped_instance_count',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Installed At Customer Name',
        sorter: true,
        children: [
          {
            title: FilterBySwap('installed_at_customer_name', form),
            dataIndex: 'installed_at_customer_name',
            key: 'installed_at_customer_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Installed At Site Status',
        sorter: true,
        children: [
          {
            title: FilterBySwap('installed_at_site_status', form),
            dataIndex: 'installed_at_site_status',
            key: 'installed_at_site_status',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Installed At Country',
        sorter: true,
        children: [
          {
            title: FilterBySwap('installed_at_country', form),
            dataIndex: 'installed_at_country',
            key: 'installed_at_country',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Installed At City',
        sorter: true,
        children: [
          {
            title: FilterBySwap('installed_at_city', form),
            dataIndex: 'installed_at_city',
            key: 'installed_at_city',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Installed At Address Line',
        sorter: true,
        children: [
          {
            title: FilterBySwap('installed_at_address_line', form),
            dataIndex: 'installed_at_address_line',
            key: 'installed_at_address_line',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Installed At Postal Code',
        sorter: true,
        children: [
          {
            title: FilterBySwap('installed_at_postal_code', form),
            dataIndex: 'installed_at_postal_code',
            key: 'installed_at_postal_code',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Installed At State Province',
        sorter: true,
        children: [
          {
            title: FilterBySwap('installed_at_state_province', form),
            dataIndex: 'installed_at_state_province',
            key: 'installed_at_state_province',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Installed At Cr Party Id',
        sorter: true,
        children: [
          {
            title: FilterBySwap('installed_at_cr_party_id', form),
            dataIndex: 'installed_at_cr_party_id',
            key: 'installed_at_cr_party_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Installed At Cr Party Name',
        sorter: true,
        children: [
          {
            title: FilterBySwap('installed_at_cr_party_name', form),
            dataIndex: 'installed_at_cr_party_name',
            key: 'installed_at_cr_party_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Installed At Gu Id',
        sorter: true,
        children: [
          {
            title: FilterBySwap('installed_at_gu_id', form),
            dataIndex: 'installed_at_gu_id',
            key: 'installed_at_gu_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Installed At Gu Name',
        sorter: true,
        children: [
          {
            title: FilterBySwap('installed_at_gu_name', form),
            dataIndex: 'installed_at_gu_name',
            key: 'installed_at_gu_name',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeCiscoSiteMatrix = (id: number) => {
    dispatch(deleteCiscoSiteMatrix(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.HwCiscoSiteMatrix}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/hw-cisco/cisco-site-matrix/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.HwCiscoSiteMatrix}>
        <Popconfirm title="Sure to delete?" onConfirm={() => removeCiscoSiteMatrix(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.HwCiscoSiteMatrix)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={ciscoSiteMatrixSelector}
        searchTableData={searchCiscoSiteMatrix}
        clearTableDataMessages={clearCiscoSiteMatrixMessages}
        setTableColumnSelection={setTableColumnSelection}
      />
    </>
  );
};

export default forwardRef(MainTable);
