import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import _ from 'lodash';
import {
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { IMainTable, ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import DataTable from '../../../../common/components/DataTable';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import {
  adUsersExclusionsSelector,
  clearAdUsersExclusionMessages,
  setTableColumnSelection,
} from '../../../../store/ad/adUsersExclusions/adUsersExclusions.reducer';
import adUsersExclusionsService from '../../../../services/ad/adUsersExclusions/adUsersExclusions.service';
import {
  deleteAdUsersExclusion,
  searchAdUsersExclusion,
} from '../../../../store/ad/adUsersExclusions/adUsersExclusions.action';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const { setSelectedId } = props;
  const AdUsersExclusions = useAppSelector(adUsersExclusionsSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const exportExcelFile = (searchData: ISearch) => {
    return adUsersExclusionsService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(dataIndex, AdUsersExclusions.search.tableName, form);
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
            title: FilterByDropdown('tenant_id', AdUsersExclusions.search.lookups?.tenants),
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
            title: FilterByDropdown('company_id', AdUsersExclusions.search.lookups?.companies),
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
            title: FilterByDropdown('bu_id', AdUsersExclusions.search.lookups?.bus),
            dataIndex: 'bu_name',
            key: 'bu_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Field</span>,
        column: 'Field',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterByDropdown('field', AdUsersExclusions.search.lookups?.fields),
            dataIndex: 'field',
            key: 'field',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Condition</span>,
        column: 'Condition',
        sorter: true,
        children: [
          {
            title: FilterBySwap('condition', form),
            dataIndex: 'condition',
            key: 'condition',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Value</span>,
        column: 'Value',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('value', form),
            dataIndex: 'value',
            key: 'value',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Instance Count</span>,
        column: 'InstanceCount',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('instance_count', form),
            dataIndex: 'instance_count',
            key: 'instance_count',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Enabled</span>,
        column: 'Enabled',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('enabled', form),
            dataIndex: 'enabled',
            key: 'enabled',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Decom</span>,
        column: 'Decom',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('decom', form),
            dataIndex: 'decom',
            key: 'decom',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
    ];
  };

  const removeCiscoSpectrum = (id: number) => {
    dispatch(deleteAdUsersExclusion(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.AdUsersExclusions}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/ad/ad-users-exclusions/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.AdUsersExclusions}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeCiscoSpectrum(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.AdUsersExclusions)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={adUsersExclusionsSelector}
        searchTableData={searchAdUsersExclusion}
        clearTableDataMessages={clearAdUsersExclusionMessages}
        setTableColumnSelection={setTableColumnSelection}
      />
    </>
  );
};

export default forwardRef(MainTable);
