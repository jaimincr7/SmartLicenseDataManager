import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import {
  setTableColumnSelection,
  clearTabVLicenseMessages,
  tabVLicenseSelector,
} from '../../../../store/rvTools/tabVLicense/tabVLicense.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  deleteTabVLicense,
  searchTabVLicense,
} from '../../../../store/rvTools/tabVLicense/tabVLicense.action';
import _ from 'lodash';
import tabVLicenseService from '../../../../services/rvTools/tabVLicense/tabVLicense.service';
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
  const tabVLicense = useAppSelector(tabVLicenseSelector);
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
    return tabVLicenseService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    setFilterKeys(ObjectForColumnFilter);
    return FilterWithSwapOption(
      dataIndex,
      tabVLicense.search.tableName,
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
              tabVLicense.search.lookups?.tenants?.length > 0
                ? tabVLicense.search.lookups?.tenants
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
              tabVLicense.search.lookups?.compaanies?.length > 0
                ? tabVLicense.search.lookups?.compaanies
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
              tabVLicense.search.lookups?.bus?.length > 0
                ? tabVLicense.search.lookups?.bus
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
            title: FilterByDateSwapTable('date_added', tabVLicense.search.tableName, form),
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
        title: <span className="dragHandler">Key</span>,
        column: 'Key',
        sorter: true,
        children: [
          {
            title: FilterBySwap('key', form),
            dataIndex: 'key',
            key: 'key',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Labels</span>,
        column: 'Labels',
        sorter: true,
        children: [
          {
            title: FilterBySwap('labels', form),
            dataIndex: 'labels',
            key: 'labels',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Cost Unit</span>,
        column: 'Cost Unit',
        sorter: true,
        children: [
          {
            title: FilterBySwap('cost_unit', form),
            dataIndex: 'cost_unit',
            key: 'cost_unit',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Total</span>,
        column: 'Total',
        sorter: true,
        children: [
          {
            title: FilterBySwap('total', form),
            dataIndex: 'total',
            key: 'total',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Used</span>,
        column: 'Used',
        sorter: true,
        children: [
          {
            title: FilterBySwap('used', form),
            dataIndex: 'used',
            key: 'used',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Expiration Date</span>,
        column: 'Expiration Date',
        sorter: true,
        children: [
          {
            title: FilterBySwap('expiration_date', form),
            dataIndex: 'expiration_date',
            key: 'expiration_date',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Features</span>,
        column: 'Features',
        sorter: true,
        children: [
          {
            title: FilterBySwap('features', form),
            dataIndex: 'features',
            key: 'features',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">VI SDK Server</span>,
        column: 'VI SDK Server',
        sorter: true,
        children: [
          {
            title: FilterBySwap('vi_sdk_server', form),
            dataIndex: 'vi_sdk_server',
            key: 'vi_sdk_server',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">VI SDK UUID</span>,
        column: 'VI SDK UUID',
        sorter: true,
        children: [
          {
            title: FilterBySwap('vi_sdk_uuid', form),
            dataIndex: 'vi_sdk_uuid',
            key: 'vi_sdk_uuid',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeTabVLicense = (id: number) => {
    dispatch(deleteTabVLicense(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.TabVLicense}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/rv-tools/v-license/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.TabVLicense}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeTabVLicense(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.TabVLicense)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={tabVLicenseSelector}
        searchTableData={searchTabVLicense}
        clearTableDataMessages={clearTabVLicenseMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.TabVLicense)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
