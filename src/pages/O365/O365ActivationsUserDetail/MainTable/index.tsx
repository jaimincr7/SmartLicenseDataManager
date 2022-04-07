import { Checkbox, Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import {
  setTableColumnSelection,
  clearO365ActivationsUserDetailMessages,
  o365ActivationsUserDetailSelector,
} from '../../../../store/o365/o365ActivationsUserDetail/o365ActivationsUserDetail.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  deleteO365ActivationsUserDetail,
  searchO365ActivationsUserDetail,
} from '../../../../store/o365/o365ActivationsUserDetail/o365ActivationsUserDetail.action';
import _ from 'lodash';
import { AlignType } from 'rc-table/lib/interface';
import o365ActivationsUserDetailService from '../../../../services/o365/o365ActivationsUserDetail/o365ActivationsUserDetail.service';
import {
  FilterByBooleanDropDown,
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
import { Moment } from 'moment';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const {
    setSelectedId,
    setShowSelectedListModal,
    setValuesForSelection,
    isMultiple,
    setFilterKeys,
    tableButtons,
  } = props;
  const o365ActivationsUserDetail = useAppSelector(o365ActivationsUserDetailSelector);
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
    return o365ActivationsUserDetailService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    setFilterKeys(ObjectForColumnFilter);
    return FilterWithSwapOption(
      dataIndex,
      o365ActivationsUserDetail.search.tableName,
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
              o365ActivationsUserDetail.search.lookups?.tenants?.length > 0
                ? o365ActivationsUserDetail.search.lookups?.tenants
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
              o365ActivationsUserDetail.search.lookups?.companies?.length > 0
                ? o365ActivationsUserDetail.search.lookups?.companies
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
              o365ActivationsUserDetail.search.lookups?.bus?.length > 0
                ? o365ActivationsUserDetail.search.lookups?.bus
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
              o365ActivationsUserDetail.search.tableName,
              form
            ),
            dataIndex: 'date_added',
            key: 'date_added',
            ellipsis: true,
            render: (date: Moment) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Report Refresh Date</span>,
        column: 'Report Refresh Date',
        sorter: true,
        children: [
          {
            title: FilterByDateSwap(
              'report_refresh_date',
              o365ActivationsUserDetail.search.tableName,
              form,
              null,
              ObjectForColumnFilter,
              true
            ),
            dataIndex: 'report_refresh_date',
            key: 'report_refresh_date',
            ellipsis: true,
            render: (date: Moment) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">User Principal Name</span>,
        column: 'User Principal Name',
        sorter: true,
        children: [
          {
            title: FilterBySwap('user_principal_name', form),
            dataIndex: 'user_principal_name',
            key: 'user_principal_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Display Name</span>,
        column: 'Display Name',
        sorter: true,
        children: [
          {
            title: FilterBySwap('display_name', form),
            dataIndex: 'display_name',
            key: 'display_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Product Type</span>,
        column: 'Product Type',
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
        title: <span className="dragHandler">Last Activated Date</span>,
        column: 'Last Activated Date',
        sorter: true,
        children: [
          {
            title: FilterByDateSwap(
              'last_activated_date',
              o365ActivationsUserDetail.search.tableName,
              form,
              null,
              ObjectForColumnFilter,
              true
            ),
            dataIndex: 'last_activated_date',
            key: 'last_activated_date',
            ellipsis: true,
            render: (date: Moment) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Window</span>,
        column: 'Windows',
        sorter: true,
        children: [
          {
            title: FilterBySwap('window', form),
            dataIndex: 'window',
            key: 'window',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Mac</span>,
        column: 'Mac',
        sorter: true,
        children: [
          {
            title: FilterBySwap('mac', form),
            dataIndex: 'mac',
            key: 'mac',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Windows 10 Mobile</span>,
        column: 'Windows 10 Mobile',
        sorter: true,
        children: [
          {
            title: FilterBySwap('windows_10_mobile', form),
            dataIndex: 'windows_10_mobile',
            key: 'windows_10_mobile',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">iOS</span>,
        column: 'iOS',
        sorter: true,
        children: [
          {
            title: FilterBySwap('ios', form),
            dataIndex: 'ios',
            key: 'ios',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Android</span>,
        column: 'Android',
        sorter: true,
        children: [
          {
            title: FilterBySwap('android', form),
            dataIndex: 'android',
            key: 'android',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Activated On Shared Computer</span>,
        column: 'Activated On Shared Computer',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'activated_on_shared_computer',
              o365ActivationsUserDetail.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'activated_on_shared_computer',
            key: 'activated_on_shared_computer',
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

  const removeO365ActivationsUserDetail = (id: number) => {
    dispatch(deleteO365ActivationsUserDetail(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.O365ActivationsUserDetail}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/o365/o365-activations-user-detail/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.O365ActivationsUserDetail}>
        <Popconfirm
          title="Delete Record?"
          onConfirm={() => removeO365ActivationsUserDetail(data.id)}
        >
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
        showAddButton={ability.can(Action.Add, Page.O365ActivationsUserDetail)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={o365ActivationsUserDetailSelector}
        searchTableData={searchO365ActivationsUserDetail}
        clearTableDataMessages={clearO365ActivationsUserDetailMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.O365ActivationsUserDetail)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
