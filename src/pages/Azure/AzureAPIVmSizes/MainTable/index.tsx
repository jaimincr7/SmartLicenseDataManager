import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  setTableColumnSelection,
  clearAzureAPIVmSizesMessages,
  azureAPIVmSizesSelector,
} from '../../../../store/azure/azureAPIVmSizes/azureAPIVmSizes.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  deleteAzureAPIVmSizes,
  searchAzureAPIVmSizes,
} from '../../../../store/azure/azureAPIVmSizes/azureAPIVmSizes.action';
import { IMainTable } from './mainTable.model';
import moment from 'moment';
import { Common } from '../../../../common/constants/common';
import _ from 'lodash';
import azureAPIVmSizesService from '../../../../services/azure/azureAPIVmSizes/azureAPIVmSizes.service';
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
  const azureAPIVmSizes = useAppSelector(azureAPIVmSizesSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const exportExcelFile = (searchData: ISearch) => {
    return azureAPIVmSizesService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(dataIndex, azureAPIVmSizes.search.tableName, form);
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
        title: 'Name',
        sorter: true,
        children: [
          {
            title: FilterBySwap('name', form),
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Max Data Disk Count',
        sorter: true,
        children: [
          {
            title: FilterBySwap('max_data_disk_count', form),
            dataIndex: 'max_data_disk_count',
            key: 'max_data_disk_count',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Memory In GB',
        sorter: true,
        children: [
          {
            title: FilterBySwap('memory_in_gb', form),
            dataIndex: 'memory_in_gb',
            key: 'memory_in_gb',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Number Of Cores',
        sorter: true,
        children: [
          {
            title: FilterBySwap('number_of_cores', form),
            dataIndex: 'number_of_cores',
            key: 'number_of_cores',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'OS Disk Size In GB',
        sorter: true,
        children: [
          {
            title: FilterBySwap('os_disk_size_in_gb', form),
            dataIndex: 'os_disk_size_in_gb',
            key: 'os_disk_size_in_gb',
            ellipsis: true,
          },
        ],
      },
      {
        title: 'Resource Disk Size In GB',
        sorter: true,
        children: [
          {
            title: FilterBySwap('resource_disk_size_in_gb', form),
            dataIndex: 'resource_disk_size_in_gb',
            key: 'resource_disk_size_in_gb',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeAzureAPIVmSizes = (id: number) => {
    dispatch(deleteAzureAPIVmSizes(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.AzureAPIVmSizes}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/azure/azure-api-vm-sizes/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.AzureAPIVmSizes}>
        <Popconfirm title="Sure to delete?" onConfirm={() => removeAzureAPIVmSizes(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.AzureAPIVmSizes)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={azureAPIVmSizesSelector}
        searchTableData={searchAzureAPIVmSizes}
        clearTableDataMessages={clearAzureAPIVmSizesMessages}
        setTableColumnSelection={setTableColumnSelection}
      />
    </>
  );
};

export default forwardRef(MainTable);
