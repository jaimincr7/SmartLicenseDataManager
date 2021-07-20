import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  clearWindowsServerLicenseMessages,
  windowsServerLicenseSelector,
} from '../../../../store/windowsServer/windowsServerLicense/windowsServerLicense.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  deleteWindowsServerLicense,
  searchWindowsServerLicense,
} from '../../../../store/windowsServer/windowsServerLicense/windowsServerLicense.action';
import { IMainTable } from './mainTable.model';
import moment from 'moment';
import { Common } from '../../../../common/constants/common';
import _ from 'lodash';
import windowsServerLicenseService from '../../../../services/windowsServer/windowsServerLicense/windowsServerLicense.service';
import {
  FilterByDate,
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import DataTable from '../../../../common/components/DataTable';
import { setTableColumnSelection } from '../../../../store/windowsServer/windowsServerLicense/windowsServerLicense.reducer';
import { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const { setSelectedId } = props;
  const windowsServerLicense = useAppSelector(windowsServerLicenseSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const exportExcelFile = (searchData: ISearch) => {
    return windowsServerLicenseService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(dataIndex, windowsServerLicense.search.tableName, form);
  };

  const getTableColumns = (form) => {
    return [
      {
        title: 'Tenant Name',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown('tenant_id', windowsServerLicense.search.lookups?.tenants),
            dataIndex: 'tenant_name',
            key: 'tenant_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Company Name',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown('company_id', windowsServerLicense.search.lookups?.companies),
            dataIndex: 'company_name',
            key: 'company_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Bu Name',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown('bu_id', windowsServerLicense.search.lookups?.bus),
            dataIndex: 'bu_name',
            key: 'bu_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Date Added',
        sorter: true,
        ellipsis: true,
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
        title: 'Agreement Type',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown(
              'opt_agreement_type',
              windowsServerLicense.search.lookups?.agreementTypes
            ),
            dataIndex: 'agreement_type',
            key: 'agreement_type',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Default to Data Center on Hosts',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown(
              'opt_default_to_data_center_on_hosts',
              windowsServerLicense.search.lookups?.booleanLookup
            ),
            dataIndex: 'opt_default_to_data_center_on_hosts',
            key: 'opt_default_to_data_center_on_hosts',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Entitlements',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown(
              'opt_entitlements',
              windowsServerLicense.search.lookups?.booleanLookup
            ),
            dataIndex: 'opt_entitlements',
            key: 'opt_entitlements',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Exclude Non-Prod',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown(
              'opt_exclude_non_prod',
              windowsServerLicense.search.lookups?.booleanLookup
            ),
            dataIndex: 'opt_exclude_non_prod',
            key: 'opt_exclude_non_prod',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Notes',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('notes', form),
            dataIndex: 'notes',
            key: 'notes',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeWindowsServerLicense = (id: number) => {
    dispatch(deleteWindowsServerLicense(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.View} a={Page.WindowsServerLicenseDetail}>
        <a
          title=""
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/windows-server/license/edit/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-eye.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Update} a={Page.WindowsServerLicense}>
        <a
          hidden
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/windows-server/license/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.WindowsServerLicense}>
        <Popconfirm title="Sure to delete?" onConfirm={() => removeWindowsServerLicense(data.id)}>
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
        showAddButton={false}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={windowsServerLicenseSelector}
        searchTableData={searchWindowsServerLicense}
        clearTableDataMessages={clearWindowsServerLicenseMessages}
        setTableColumnSelection={setTableColumnSelection}
      />
    </>
  );
};

export default forwardRef(MainTable);
