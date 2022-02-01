import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
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
import _ from 'lodash';
import azureRateCardService from '../../../../services/azure/azureRateCard/azureRateCard.service';
import {
  FilterByDateSwap,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { IMainTable, ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import DataTable from '../../../../common/components/DataTable';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import { showDateFromApi } from '../../../../common/helperFunction';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const {
    setSelectedId,
    setShowSelectedListModal,
    setValuesForSelection,
    isMultiple,
    tableButtons,
  } = props;
  const azureRateCard = useAppSelector(azureRateCardSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();
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
    return azureRateCardService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(
      dataIndex,
      azureRateCard.search.tableName,
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
        title: <span className="dragHandler">Date Added</span>,
        column: 'Date Added',
        sorter: true,
        children: [
          {
            title: FilterByDateSwapTable('date_added', azureRateCard.search.tableName, form),
            dataIndex: 'date_added',
            key: 'date_added',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Effective Date</span>,
        column: 'EffectiveDate',
        sorter: true,
        children: [
          {
            title: FilterByDateSwapTable('effective_date', azureRateCard.search.tableName, form),
            dataIndex: 'effective_date',
            key: 'effective_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">MeterId</span>,
        column: 'MeterId',
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
        title: <span className="dragHandler">Meter Name</span>,
        column: 'MeterName',
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
        title: <span className="dragHandler">Meter Category</span>,
        column: 'MeterCategory',
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
        title: <span className="dragHandler">Meter Sub-Category</span>,
        column: 'MeterSubCategory',
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
        title: <span className="dragHandler">Meter Region</span>,
        column: 'MeterRegion',
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
        title: <span className="dragHandler">Meter Rates</span>,
        column: 'MeterRates',
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
        title: <span className="dragHandler">Meter Status</span>,
        column: 'MeterStatus',
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
        title: <span className="dragHandler">Meter Tags</span>,
        column: 'MeterTags',
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
        title: <span className="dragHandler">Included Quantity</span>,
        column: 'IncludedQuantity',
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
        title: <span className="dragHandler">Unit</span>,
        column: 'Unit',
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
        <Popconfirm title="Delete Record?" onConfirm={() => removeAzureRateCard(data.id)}>
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
        globalSearchExist={false}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        showBulkUpdate={ability.can(Action.Update, Page.AzureRateCard)}
        setValuesForSelection={setValuesForSelection}
        setObjectForColumnFilter={setObjectForColumnFilter}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
