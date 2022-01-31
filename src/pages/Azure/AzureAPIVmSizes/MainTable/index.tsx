import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
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
import _ from 'lodash';
import azureAPIVmSizesService from '../../../../services/azure/azureAPIVmSizes/azureAPIVmSizes.service';
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
    setFilterKeys,
  } = props;
  const azureAPIVmSizes = useAppSelector(azureAPIVmSizesSelector);
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
    return azureAPIVmSizesService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    setFilterKeys(ObjectForColumnFilter);
    return FilterWithSwapOption(
      dataIndex,
      azureAPIVmSizes.search.tableName,
      form,
      null,
      ObjectForColumnFilter
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
            title: FilterByDateSwap('date_added', azureAPIVmSizes.search.tableName, form),
            dataIndex: 'date_added',
            key: 'date_added',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Name</span>,
        column: 'name',
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
        title: <span className="dragHandler">Max Data Disk Count</span>,
        column: 'maxDataDiskCount',
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
        title: <span className="dragHandler">Memory In GB</span>,
        column: 'memoryInGB',
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
        title: <span className="dragHandler">Number Of Cores</span>,
        column: 'numberOfCores',
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
        title: <span className="dragHandler">OS Disk Size In GB</span>,
        column: 'osDiskSizeInGB',
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
        title: <span className="dragHandler">Resource Disk Size In GB</span>,
        column: 'resourceDiskSizeInGB',
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
        <Popconfirm title="Delete Record?" onConfirm={() => removeAzureAPIVmSizes(data.id)}>
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
        setShowSelectedListModal={setShowSelectedListModal}
        showBulkUpdate={ability.can(Action.Update, Page.AzureAPIVmSizes)}
        setValuesForSelection={setValuesForSelection}
        setObjectForColumnFilter={setObjectForColumnFilter}
        globalSearchExist={false}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
