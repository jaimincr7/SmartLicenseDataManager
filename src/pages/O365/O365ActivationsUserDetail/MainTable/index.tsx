import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
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
import { IMainTable } from './mainTable.model';
import _ from 'lodash';
import o365ActivationsUserDetailService from '../../../../services/o365/o365ActivationsUserDetail/o365ActivationsUserDetail.service';
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
import moment from 'moment';
import { Common } from '../../../../common/constants/common';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const { setSelectedId } = props;
  const o365ActivationsUserDetail = useAppSelector(o365ActivationsUserDetailSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const exportExcelFile = (searchData: ISearch) => {
    return o365ActivationsUserDetailService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(dataIndex, o365ActivationsUserDetail.search.tableName, form);
  };

  const getTableColumns = (form) => {
    return [
      {
        title: <span className="dragHandler">Tenant Name</span>,
        column: 'TenantId',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('tenant_id', o365ActivationsUserDetail.search.lookups?.tenants),
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
              o365ActivationsUserDetail.search.lookups?.companies
            ),
            dataIndex: 'company_name',
            key: 'company_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Bu Name</span>,
        column: 'Bu_Id',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('bu_id', o365ActivationsUserDetail.search.lookups?.bus),
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
            title: FilterByDate('date_added'),
            dataIndex: 'date_added',
            key: 'date_added',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Report Refresh Date</span>,
        column: 'Report Refresh Date',
        sorter: true,
        children: [
          {
            title: FilterByDate('report_refresh_date'),
            dataIndex: 'report_refresh_date',
            key: 'report_refresh_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
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
            title: FilterByDate('last_activated_date'),
            dataIndex: 'last_activated_date',
            key: 'last_activated_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Window</span>,
        column: 'Window',
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
            title: FilterByDropdown(
              'activated_on_shared_computer',
              o365ActivationsUserDetail.search.lookups?.booleanLookup
            ),
            dataIndex: 'activated_on_shared_computer',
            key: 'activated_on_shared_computer',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
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
          title="Sure to delete?"
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
      />
    </>
  );
};

export default forwardRef(MainTable);