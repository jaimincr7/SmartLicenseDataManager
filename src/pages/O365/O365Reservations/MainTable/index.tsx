import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  setTableColumnSelection,
  clearO365ReservationsMessages,
  o365ReservationsSelector,
} from '../../../../store/o365/o365Reservations/o365Reservations.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  deleteO365Reservations,
  searchO365Reservations,
} from '../../../../store/o365/o365Reservations/o365Reservations.action';
import { IMainTable } from './mainTable.model';
import _ from 'lodash';
import o365ReservationsService from '../../../../services/o365/o365Reservations/o365Reservations.service';
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
  const o365Reservations = useAppSelector(o365ReservationsSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const exportExcelFile = (searchData: ISearch) => {
    return o365ReservationsService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(dataIndex, o365Reservations.search.tableName, form);
  };

  const getTableColumns = (form) => {
    return [
      {
        title: 'Tenant Name',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('tenant_id', o365Reservations.search.lookups?.tenants),
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
            title: FilterByDropdown('company_id', o365Reservations.search.lookups?.companies),
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
            title: FilterByDropdown('bu_id', o365Reservations.search.lookups?.bus),
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
        title: 'Reservation ID',
        sorter: true,
        children: [
          {
            title: FilterBySwap('reservation_id', form),
            dataIndex: 'reservation_id',
            key: 'reservation_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'License ID',
        sorter: true,
        children: [
          {
            title: FilterBySwap('license_id', form),
            dataIndex: 'license_id',
            key: 'license_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Organization',
        sorter: true,
        children: [
          {
            title: FilterBySwap('organization', form),
            dataIndex: 'organization',
            key: 'organization',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Service',
        sorter: true,
        children: [
          {
            title: FilterBySwap('service', form),
            dataIndex: 'service',
            key: 'service',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Licenses',
        sorter: true,
        children: [
          {
            title: FilterBySwap('licenses', form),
            dataIndex: 'licenses',
            key: 'licenses',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Action',
        sorter: true,
        children: [
          {
            title: FilterBySwap('action', form),
            dataIndex: 'action',
            key: 'action',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Requestor',
        sorter: true,
        children: [
          {
            title: FilterBySwap('requestor', form),
            dataIndex: 'requestor',
            key: 'requestor',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Usage Date',
        sorter: true,
        children: [
          {
            title: FilterBySwap('usage_date', form),
            dataIndex: 'usage_date',
            key: 'usage_date',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Usage Country',
        sorter: true,
        children: [
          {
            title: FilterBySwap('usage_country', form),
            dataIndex: 'usage_country',
            key: 'usage_country',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Status',
        sorter: true,
        children: [
          {
            title: FilterBySwap('status', form),
            dataIndex: 'status',
            key: 'status',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeO365Reservations = (id: number) => {
    dispatch(deleteO365Reservations(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.O365Reservations}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/o365/o365-reservations/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.O365Reservations}>
        <Popconfirm title="Sure to delete?" onConfirm={() => removeO365Reservations(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.O365Reservations)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={o365ReservationsSelector}
        searchTableData={searchO365Reservations}
        clearTableDataMessages={clearO365ReservationsMessages}
        setTableColumnSelection={setTableColumnSelection}
      />
    </>
  );
};

export default forwardRef(MainTable);