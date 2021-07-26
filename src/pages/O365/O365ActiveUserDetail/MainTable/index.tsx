import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  setTableColumnSelection,
  clearO365ActiveUserDetailMessages,
  o365ActiveUserDetailSelector,
} from '../../../../store/o365/o365ActiveUserDetail/o365ActiveUserDetail.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  deleteO365ActiveUserDetail,
  searchO365ActiveUserDetail,
} from '../../../../store/o365/o365ActiveUserDetail/o365ActiveUserDetail.action';
import { IMainTable } from './mainTable.model';
import _ from 'lodash';
import o365ActiveUserDetailService from '../../../../services/o365/o365ActiveUserDetail/o365ActiveUserDetail.service';
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
  const o365ActiveUserDetail = useAppSelector(o365ActiveUserDetailSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const exportExcelFile = (searchData: ISearch) => {
    return o365ActiveUserDetailService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(dataIndex, o365ActiveUserDetail.search.tableName, form);
  };

  const getTableColumns = (form) => {
    return [
      {
        title: 'Tenant Name',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('tenant_id', o365ActiveUserDetail.search.lookups?.tenants),
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
            title: FilterByDropdown('company_id', o365ActiveUserDetail.search.lookups?.companies),
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
            title: FilterByDropdown('bu_id', o365ActiveUserDetail.search.lookups?.bus),
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
        title: 'User Principal Name',
        sorter: true,
        ellipsis: true,
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
        title: 'Display Name',
        sorter: true,
        ellipsis: true,
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
        title: 'Report Refresh Date',
        sorter: true,
        ellipsis: true,
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
        title: 'Deleted Date',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('deleted_date', form),
            dataIndex: 'deleted_date',
            key: 'deleted_date',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Exchange Last Activity Date',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDate('exchange_last_activity_date'),
            dataIndex: 'exchange_last_activity_date',
            key: 'exchange_last_activity_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: 'OneDrive Last Activity Date',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDate('one_drive_last_activity_date'),
            dataIndex: 'one_drive_last_activity_date',
            key: 'one_drive_last_activity_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: 'SharePoint Last Activity Date',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDate('share_point_last_activity_date'),
            dataIndex: 'share_point_last_activity_date',
            key: 'share_point_last_activity_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: 'Skype For Business Last Activity Date',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDate('skype_for_business_last_activity_date'),
            dataIndex: 'skype_for_business_last_activity_date',
            key: 'skype_for_business_last_activity_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: 'Yammer Last Activity Date',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDate('yammer_last_activity_date'),
            dataIndex: 'yammer_last_activity_date',
            key: 'yammer_last_activity_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: 'Teams Last Activity Date',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDate('teams_last_activity_date'),
            dataIndex: 'teams_last_activity_date',
            key: 'teams_last_activity_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: 'Exchange License Assign Date',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDate('exchange_license_assign_date'),
            dataIndex: 'exchange_license_assign_date',
            key: 'exchange_license_assign_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: 'OneDrive License Assign Date',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDate('one_drive_license_assign_date'),
            dataIndex: 'one_drive_license_assign_date',
            key: 'one_drive_license_assign_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: 'SharePoint License Assign Date',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDate('share_point_license_assign_date'),
            dataIndex: 'share_point_license_assign_date',
            key: 'share_point_license_assign_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: 'Skype For Business License Assign Date',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDate('skype_for_business_license_assign_date'),
            dataIndex: 'skype_for_business_license_assign_date',
            key: 'skype_for_business_license_assign_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: 'Yammer License Assign Date',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDate('yammer_license_assign_date'),
            dataIndex: 'yammer_license_assign_date',
            key: 'yammer_license_assign_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: 'Teams License Assign Date',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDate('teams_license_assign_date'),
            dataIndex: 'teams_license_assign_date',
            key: 'teams_license_assign_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: 'Assigned Products',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('assigned_products', form),
            dataIndex: 'assigned_products',
            key: 'assigned_products',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Is Deleted',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown(
              'is_deleted',
              o365ActiveUserDetail.search.lookups?.booleanLookup
            ),
            dataIndex: 'is_deleted',
            key: 'is_deleted',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Has Exchange License',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown(
              'has_exchange_license',
              o365ActiveUserDetail.search.lookups?.booleanLookup
            ),
            dataIndex: 'has_exchange_license',
            key: 'has_exchange_license',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Has OneDrive License',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown(
              'has_one_drive_license',
              o365ActiveUserDetail.search.lookups?.booleanLookup
            ),
            dataIndex: 'has_one_drive_license',
            key: 'has_one_drive_license',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Has SharePoint License',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown(
              'has_share_point_license',
              o365ActiveUserDetail.search.lookups?.booleanLookup
            ),
            dataIndex: 'has_share_point_license',
            key: 'has_share_point_license',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Has Skype For Business License',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown(
              'has_skype_for_business_license',
              o365ActiveUserDetail.search.lookups?.booleanLookup
            ),
            dataIndex: 'has_skype_for_business_license',
            key: 'has_skype_for_business_license',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Has Yammer License',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown(
              'has_yammer_license',
              o365ActiveUserDetail.search.lookups?.booleanLookup
            ),
            dataIndex: 'has_yammer_license',
            key: 'has_yammer_license',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Has Teams License',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown(
              'has_teams_license',
              o365ActiveUserDetail.search.lookups?.booleanLookup
            ),
            dataIndex: 'has_teams_license',
            key: 'has_teams_license',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
    ];
  };

  const removeO365ActiveUserDetail = (id: number) => {
    dispatch(deleteO365ActiveUserDetail(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.O365ActiveUserDetail}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/o365/o365-active-user-detail/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.O365ActiveUserDetail}>
        <Popconfirm title="Sure to delete?" onConfirm={() => removeO365ActiveUserDetail(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.O365ActiveUserDetail)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={o365ActiveUserDetailSelector}
        searchTableData={searchO365ActiveUserDetail}
        clearTableDataMessages={clearO365ActiveUserDetailMessages}
        setTableColumnSelection={setTableColumnSelection}
      />
    </>
  );
};

export default forwardRef(MainTable);
