import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
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
import _ from 'lodash';
import o365ReservationsService from '../../../../services/o365/o365Reservations/o365Reservations.service';
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
    tableButtons,
    setFilterKeys,
  } = props;
  const o365Reservations = useAppSelector(o365ReservationsSelector);
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
    return o365ReservationsService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    setFilterKeys(ObjectForColumnFilter);
    return FilterWithSwapOption(
      dataIndex,
      o365Reservations.search.tableName,
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
              o365Reservations.search.lookups?.tenants?.length > 0
                ? o365Reservations.search.lookups?.tenants
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
              o365Reservations.search.lookups?.companies?.length > 0
                ? o365Reservations.search.lookups?.companies
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
              o365Reservations.search.lookups?.bus?.length > 0
                ? o365Reservations.search.lookups?.bus
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
            title: FilterByDateSwapTable('date_added', o365Reservations.search.tableName, form),
            dataIndex: 'date_added',
            key: 'date_added',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Reservation ID</span>,
        column: 'Reservation ID',
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
        title: <span className="dragHandler">License ID</span>,
        column: 'License ID',
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
        title: <span className="dragHandler">Organization</span>,
        column: 'Organization',
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
        title: <span className="dragHandler">Service</span>,
        column: 'Service',
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
        title: <span className="dragHandler">Licenses</span>,
        column: 'Licenses',
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
        title: <span className="dragHandler">Action</span>,
        column: 'Action',
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
        title: <span className="dragHandler">Requestor</span>,
        column: 'Requestor',
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
        title: <span className="dragHandler">Usage Date</span>,
        column: 'Usage Date',
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
        title: <span className="dragHandler">Usage Country</span>,
        column: 'Usage Country',
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
        title: <span className="dragHandler">Status</span>,
        column: 'Status',
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
        <Popconfirm title="Delete Record?" onConfirm={() => removeO365Reservations(data.id)}>
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
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.O365Reservations)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
