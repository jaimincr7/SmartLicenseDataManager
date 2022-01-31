import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
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
import _ from 'lodash';
import ciscoSiteMatrixService from '../../../../services/hwCisco/ciscoSiteMatrix/ciscoSiteMatrix.service';
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
  const ciscoSiteMatrix = useAppSelector(ciscoSiteMatrixSelector);
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
    return ciscoSiteMatrixService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    setFilterKeys(ObjectForColumnFilter);
    return FilterWithSwapOption(
      dataIndex,
      ciscoSiteMatrix.search.tableName,
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
              ciscoSiteMatrix.search.lookups?.tenants?.length > 0
                ? ciscoSiteMatrix.search.lookups?.tenants
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
              ciscoSiteMatrix.search.lookups?.companies?.length > 0
                ? ciscoSiteMatrix.search.lookups?.companies
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
              ciscoSiteMatrix.search.lookups?.bus?.length > 0
                ? ciscoSiteMatrix.search.lookups?.bus
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
            title: FilterByDateSwapTable('date_added', ciscoSiteMatrix.search.tableName, form),
            dataIndex: 'date_added',
            key: 'date_added',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
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
        title: <span className="dragHandler">Installed At Site Id</span>,
        column: 'Installed-At SITE ID',
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
        title: <span className="dragHandler">Historical Shipped Instance Count</span>,
        column: 'Historical Shipped Instance Count',
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
        title: <span className="dragHandler">Installed At Customer Name</span>,
        column: 'Installed At Customer Name',
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
        title: <span className="dragHandler">Installed At Site Status</span>,
        column: 'Installed-At Site Status',
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
        title: <span className="dragHandler">Installed At Country</span>,
        column: 'Installed-At COUNTRY',
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
        title: <span className="dragHandler">Installed At City</span>,
        column: 'Installed-At CITY',
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
        title: <span className="dragHandler">Installed At Address Line</span>,
        column: 'Installed-At ADDRESS LINE',
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
        title: <span className="dragHandler">Installed At Postal Code</span>,
        column: 'Installed-At POSTAL CODE',
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
        title: <span className="dragHandler">Installed At State Province</span>,
        column: 'Installed-At STATE/Province',
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
        title: <span className="dragHandler">Installed At Cr Party Id</span>,
        column: 'Installed At CR Party ID',
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
        title: <span className="dragHandler">Installed At Cr Party Name</span>,
        column: 'Installed At CR Party Name',
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
        title: <span className="dragHandler">Installed At Gu Id</span>,
        column: 'Installed At GU ID',
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
        title: <span className="dragHandler">Installed At Gu Name</span>,
        column: 'Installed At GU Name',
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
        <Popconfirm title="Delete Record?" onConfirm={() => removeCiscoSiteMatrix(data.id)}>
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
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.HwCiscoSiteMatrix)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
