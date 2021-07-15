import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  clearAdDevicesExclusionsMessages,
  adDevicesExclusionsSelector,
} from '../../../../store/ad/adDevicesExclusions/adDevicesExclusions.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  deleteAdDevicesExclusions,
  searchAdDevicesExclusions,
} from '../../../../store/ad/adDevicesExclusions/adDevicesExclusions.action';
import { IMainTable } from './mainTable.model';
import _ from 'lodash';
import adDevicesExclusionsService from '../../../../services/ad/adDevicesExclusions/adDevicesExclusions.service';
import {
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import DataTable from '../../../../common/components/DataTable';
import { setTableColumnSelection } from '../../../../store/ad/adDevicesExclusions/adDevicesExclusions.reducer';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const { setSelectedId } = props;
  const adDevicesExclusions = useAppSelector(adDevicesExclusionsSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const exportExcelFile = (searchData: ISearch) => {
    return adDevicesExclusionsService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(dataIndex, adDevicesExclusions.search.tableName, form);
  };

  const getTableColumns = (form) => {
    return [
      {
        title: 'Tenant Name',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('tenant_id', adDevicesExclusions.search.lookups?.tenants),
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
            title: FilterByDropdown('company_id', adDevicesExclusions.search.lookups?.companies),
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
            title: FilterByDropdown('bu_id', adDevicesExclusions.search.lookups?.bus),
            dataIndex: 'bu_name',
            key: 'bu_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Field',
        sorter: true,
        children: [
          {
            title: FilterBySwap('field', form),
            dataIndex: 'field',
            key: 'field',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Condition',
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
        title: 'Value',
        sorter: true,
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
        title: 'Desktop',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('desktop', adDevicesExclusions.search.lookups?.booleanLookup),
            dataIndex: 'desktop',
            key: 'desktop',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Server',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('server', adDevicesExclusions.search.lookups?.booleanLookup),
            dataIndex: 'server',
            key: 'server',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Unknown',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('unknown', adDevicesExclusions.search.lookups?.booleanLookup),
            dataIndex: 'unknown',
            key: 'unknown',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
      {
        title: 'Instance Count',
        sorter: true,
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
        title: 'Decom',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('decom', adDevicesExclusions.search.lookups?.booleanLookup),
            dataIndex: 'decom',
            key: 'decom',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
    ];
  };

  const removeAdDevicesExclusions = (id: number) => {
    dispatch(deleteAdDevicesExclusions(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.ADExclusions}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/ad/ad-devices-exclusions/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.ADExclusions}>
        <Popconfirm title="Sure to delete?" onConfirm={() => removeAdDevicesExclusions(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.ADExclusions)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={adDevicesExclusionsSelector}
        searchTableData={searchAdDevicesExclusions}
        clearTableDataMessages={clearAdDevicesExclusionsMessages}
        setTableColumnSelection={setTableColumnSelection}
      />
    </>
  );
};

export default forwardRef(MainTable);
