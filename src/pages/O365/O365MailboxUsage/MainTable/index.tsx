import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import moment from 'moment';
import { Common } from '../../../../common/constants/common';
import _ from 'lodash';
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
import {
  deleteO365MailboxUsage,
  searchO365MailboxUsage,
} from '../../../../store/o365/o365MailboxUsage/o365MailboxUsage.action';
import {
  clearO365MailboxUsageMessages,
  o365MailboxUsageSelector,
  setTableColumnSelection,
} from '../../../../store/o365/o365MailboxUsage/o365MailboxUsage.reducer';
import o365MailboxUsageService from '../../../../services/o365/o365MailboxUsage/o365MailboxUsage.service';
import { IMainTable } from './mainTable.model';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const { setSelectedId } = props;
  const o365MailboxUsage = useAppSelector(o365MailboxUsageSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const exportExcelFile = (searchData: ISearch) => {
    return o365MailboxUsageService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(dataIndex, o365MailboxUsage.search.tableName, form);
  };

  const getTableColumns = (form) => {
    return [
      {
        title: <span className="dragHandler"> Tenant Name </span>,
        column: 'TenantId',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('tenant_id', o365MailboxUsage.search.lookups?.tenants),
            dataIndex: 'tenant_name',
            key: 'tenant_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler"> Company Name </span> ,
        column: 'CompanyId',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('company_id', o365MailboxUsage.search.lookups?.companies),
            dataIndex: 'company_name',
            key: 'company_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler"> Bu Name </span>,
        column: 'BU_Id',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('bu_id', o365MailboxUsage.search.lookups?.bus),
            dataIndex: 'bu_name',
            key: 'bu_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler"> Date Added </span>,
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
        title: <span className="dragHandler"> User Principal Name </span>,
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
        title: <span className="dragHandler"> Display Name </span>,
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
        title: <span className="dragHandler"> Report Refresh Date </span>,
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
        title: <span className="dragHandler"> Created Date </span>,
        column: 'Created Date',
        sorter: true,
        children: [
          {
            title: FilterByDate('created_date'),
            dataIndex: 'created_date',
            key: 'created_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Deleted Date</span>,
        column: 'Deleted Date',
        sorter: true,
        children: [
          {
            title: FilterByDate('deleted_date'),
            dataIndex: 'deleted_date',
            key: 'deleted_date',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Last Activity Date</span>,
        column: 'Last Activity Date',
        sorter: true,
        children: [
          {
            title: FilterByDate('last_activity_date'),
            dataIndex: 'last_activity_date',
            key: 'last_activity_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Item Count</span>,
        column: 'Item Count',
        sorter: true,
        children: [
          {
            title: FilterBySwap('item_count', form),
            dataIndex: 'item_count',
            key: 'item_count',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Storage Used (Byte)</span>,
        column: 'Storage Used (Byte)',
        sorter: true,
        children: [
          {
            title: FilterBySwap('storage_used_byte', form),
            dataIndex: 'storage_used_byte',
            key: 'storage_used_byte',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Issue Warning Quota (Byte)</span>,
        column: 'Issue Warning Quota (Byte)',
        sorter: true,
        children: [
          {
            title: FilterBySwap('issue_warning_quota_byte', form),
            dataIndex: 'issue_warning_quota_byte',
            key: 'issue_warning_quota_byte',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Prohibit Send Quota (Byte)</span>,
        column: 'Prohibit Send Quota (Byte)',
        sorter: true,
        children: [
          {
            title: FilterBySwap('prohibit_send_quota_byte', form),
            dataIndex: 'prohibit_send_quota_byte',
            key: 'prohibit_send_quota_byte',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Prohibit Send/Recieve Quota (Byte)</span>,
        column: 'Prohibit Send/Recieve Quota (Byte)',
        sorter: true,
        children: [
          {
            title: FilterBySwap('prohibit_send_receive_quota_byte', form),
            dataIndex: 'prohibit_send_receive_quota_byte',
            key: 'prohibit_send_receive_quota_byte',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Delted Item Count</span> ,
        column: 'Delted Item Count',
        sorter: true,
        children: [
          {
            title: FilterBySwap('deleted_item_count', form),
            dataIndex: 'deleted_item_count',
            key: 'deleted_item_count',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Delted Item Size (Byte)</span>,
        column: 'Delted Item Size (Byte)',
        sorter: true,
        children: [
          {
            title: FilterBySwap('deleted_item_size_byte', form),
            dataIndex: 'deleted_item_size_byte',
            key: 'deleted_item_size_byte',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Report Period</span>,
        column: 'Report Period',
        sorter: true,
        children: [
          {
            title: FilterBySwap('report_period', form),
            dataIndex: 'report_period',
            key: 'report_period',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Is Deleted</span>,
        column: 'Is Deleted',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('is_deleted', o365MailboxUsage.search.lookups?.booleanLookup),
            dataIndex: 'is_deleted',
            key: 'is_deleted',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
    ];
  };

  const removeO365MailboxUsage = (id: number) => {
    dispatch(deleteO365MailboxUsage(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.O365MailboxUsage}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/o365/o365-mailbox-usage/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.O365MailboxUsage}>
        <Popconfirm title="Sure to delete?" onConfirm={() => removeO365MailboxUsage(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.O365MailboxUsage)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={o365MailboxUsageSelector}
        searchTableData={searchO365MailboxUsage}
        clearTableDataMessages={clearO365MailboxUsageMessages}
        setTableColumnSelection={setTableColumnSelection}
      />
    </>
  );
};

export default forwardRef(MainTable);
