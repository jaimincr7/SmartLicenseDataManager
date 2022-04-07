import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import {
  setTableColumnSelection,
  clearBackgroundProcessesMessages,
  backgroundProcessesSelector,
} from '../../../../store/backgroundProcesses/backgroundProcesses.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  deleteBackgroundProcesses,
  searchBackgroundProcesses,
} from '../../../../store/backgroundProcesses/backgroundProcesses.action';
import _ from 'lodash';
import {
  FilterByDateSwap,
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { IMainTable } from '../../../../common/models/common';
import DataTable from '../../../../common/components/DataTable';
import { Can } from '../../../../common/ability';
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
  } = props;
  const backgroundProcesses = useAppSelector(backgroundProcessesSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const globalFilters = useAppSelector(globalSearchSelector);
  const [ObjectForColumnFilter, setObjectForColumnFilter] = useState({});

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const FilterByDateSwapTable = (dataIndex: string, tableName: string, form: any) => {
    return FilterByDateSwap(dataIndex, tableName, form, null, ObjectForColumnFilter);
  };

  useEffect(() => {
    if (isMultiple) {
      dataTableRef?.current.getValuesForSelection();
    }
  }, [isMultiple]);

  const FilterBySwap = (dataIndex: string, form, columnWidthOpt?: boolean) => {
    return FilterWithSwapOption(
      dataIndex,
      backgroundProcesses.search.tableName,
      form,
      null,
      ObjectForColumnFilter,
      null,
      columnWidthOpt === undefined ? false : columnWidthOpt
    );
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
            title: FilterBySwap('id', form, true),
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
              backgroundProcesses.search.lookups?.tenants?.length > 0
                ? backgroundProcesses.search.lookups?.tenants
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
              backgroundProcesses.search.lookups?.companies?.length > 0
                ? backgroundProcesses.search.lookups?.companies
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
              backgroundProcesses.search.lookups?.bus?.length > 0
                ? backgroundProcesses.search.lookups?.bus
                : globalFilters?.globalBULookup?.data
            ),
            dataIndex: 'bu_name',
            key: 'bu_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Type</span>,
        column: 'Type',
        sorter: true,
        children: [
          {
            title: FilterBySwap('type', form),
            dataIndex: 'type',
            key: 'type',
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
            title: FilterBySwap('status', form, true),
            dataIndex: 'status',
            key: 'status',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Comment</span>,
        column: 'Comment',
        sorter: true,
        children: [
          {
            title: FilterBySwap('comment', form),
            dataIndex: 'comment',
            key: 'comment',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">User Id</span>,
        column: 'UserId',
        sorter: true,
        children: [
          {
            title: FilterBySwap('user_id', form),
            dataIndex: 'user_id',
            key: 'user_id',
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
            title: FilterByDateSwapTable('date_added', backgroundProcesses.search.tableName, form),
            dataIndex: 'date_added',
            key: 'date_added',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Start</span>,
        column: 'StartDate',
        sorter: true,
        children: [
          {
            title: FilterByDateSwapTable('start_date', backgroundProcesses.search.tableName, form),
            dataIndex: 'start_date',
            key: 'start_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Complete</span>,
        column: 'CompleteDate',
        sorter: true,
        children: [
          {
            title: FilterByDateSwapTable(
              'complete_date',
              backgroundProcesses.search.tableName,
              form
            ),
            dataIndex: 'complete_date',
            key: 'complete_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
    ];
  };

  const removeBackgroundProcessess = (id: number) => {
    dispatch(deleteBackgroundProcesses(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      {/* <Can I={Action.Update} a={Page.BackgroundProcesses}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/ad/ad-devices-exclusions/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can> */}
      <Can I={Action.Delete} a={Page.BackgroundProcesses}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeBackgroundProcessess(data.id)}>
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
        showDelete={false}
        hideExportButton={true}
        showBulkUpdate={false}
        hideShowHideButton={true}
        disableRowSelection={true}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        getTableColumns={getTableColumns}
        reduxSelector={backgroundProcessesSelector}
        searchTableData={searchBackgroundProcesses}
        clearTableDataMessages={clearBackgroundProcessesMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        setObjectForColumnFilter={setObjectForColumnFilter}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
