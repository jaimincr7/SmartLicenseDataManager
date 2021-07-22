import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  setTableColumnSelection,
  clearAzureRateCardMessages,
  azureRateCardSelector,
} from '../../../../store/azure/azureRateCard/azureRateCard.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  deleteAzureRateCard,
  searchAzureRateCard,
} from '../../../../store/azure/azureRateCard/azureRateCard.action';
import { IMainTable } from './mainTable.model';
import moment from 'moment';
import { Common } from '../../../../common/constants/common';
import _ from 'lodash';
import azureRateCardService from '../../../../services/azure/azureRateCard/azureRateCard.service';
import {
  FilterByDate,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import DataTable from '../../../../common/components/DataTable';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const { setSelectedId } = props;
  const azureRateCard = useAppSelector(azureRateCardSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const exportExcelFile = (searchData: ISearch) => {
    return azureRateCardService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(dataIndex, azureRateCard.search.tableName, form);
  };

  const getTableColumns = (form) => {
    return [
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
        title: 'Effective Date',
        sorter: true,
        children: [
          {
            title: FilterByDate('effective_date'),
            dataIndex: 'effective_date',
            key: 'effective_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: 'MeterId',
        sorter: true,
        children: [
          {
            title: FilterBySwap('meter_id', form),
            dataIndex: 'meter_id',
            key: 'meter_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Meter Name',
        sorter: true,
        children: [
          {
            title: FilterBySwap('meter_name', form),
            dataIndex: 'meter_name',
            key: 'meter_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Meter Category',
        sorter: true,
        children: [
          {
            title: FilterBySwap('meter_category', form),
            dataIndex: 'meter_category',
            key: 'meter_category',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Meter Sub-Category',
        sorter: true,
        children: [
          {
            title: FilterBySwap('meter_sub_category', form),
            dataIndex: 'meter_sub_category',
            key: 'meter_sub_category',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Meter Region',
        sorter: true,
        children: [
          {
            title: FilterBySwap('meter_region', form),
            dataIndex: 'meter_region',
            key: 'meter_region',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Meter Rates',
        sorter: true,
        children: [
          {
            title: FilterBySwap('meter_rates', form),
            dataIndex: 'meter_rates',
            key: 'meter_rates',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Meter Status',
        sorter: true,
        children: [
          {
            title: FilterBySwap('meter_status', form),
            dataIndex: 'meter_status',
            key: 'meter_status',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Meter Tags',
        sorter: true,
        children: [
          {
            title: FilterBySwap('meter_tags', form),
            dataIndex: 'meter_tags',
            key: 'meter_tags',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Included Quantity',
        sorter: true,
        children: [
          {
            title: FilterBySwap('included_quantity', form),
            dataIndex: 'included_quantity',
            key: 'included_quantity',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Unit',
        sorter: true,
        children: [
          {
            title: FilterBySwap('unit', form),
            dataIndex: 'unit',
            key: 'unit',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeAzureRateCard = (id: number) => {
    dispatch(deleteAzureRateCard(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.AzureRateCard}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/azure/azure-rate-card/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.AzureRateCard}>
        <Popconfirm title="Sure to delete?" onConfirm={() => removeAzureRateCard(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.AzureRateCard)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={azureRateCardSelector}
        searchTableData={searchAzureRateCard}
        clearTableDataMessages={clearAzureRateCardMessages}
        setTableColumnSelection={setTableColumnSelection}
      />
    </>
  );
};

export default forwardRef(MainTable);
