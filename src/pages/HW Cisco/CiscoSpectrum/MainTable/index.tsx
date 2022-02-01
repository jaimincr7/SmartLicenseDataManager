import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import {
  setTableColumnSelection,
  clearCiscoSpectrumMessages,
  ciscoSpectrumSelector,
} from '../../../../store/hwCisco/ciscoSpectrum/ciscoSpectrum.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  deleteCiscoSpectrum,
  searchCiscoSpectrum,
} from '../../../../store/hwCisco/ciscoSpectrum/ciscoSpectrum.action';
import _ from 'lodash';
import ciscoSpectrumService from '../../../../services/hwCisco/ciscoSpectrum/ciscoSpectrum.service';
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
    setFilterKeys,
    tableButtons,
  } = props;
  const ciscoSpectrum = useAppSelector(ciscoSpectrumSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const globalFilters = useAppSelector(globalSearchSelector);
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
    return ciscoSpectrumService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    setFilterKeys(ObjectForColumnFilter);
    return FilterWithSwapOption(
      dataIndex,
      ciscoSpectrum.search.tableName,
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
              ciscoSpectrum.search.lookups?.tenants?.length > 0
                ? ciscoSpectrum.search.lookups?.tenants
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
              ciscoSpectrum.search.lookups?.companies?.length > 0
                ? ciscoSpectrum.search.lookups?.companies
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
              ciscoSpectrum.search.lookups?.bus?.length > 0
                ? ciscoSpectrum.search.lookups?.bus
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
            title: FilterByDateSwapTable('date_added', ciscoSpectrum.search.tableName, form),
            dataIndex: 'date_added',
            key: 'date_added',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Source</span>,
        column: 'Source',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('source', form),
            dataIndex: 'source',
            key: 'source',
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
        title: <span className="dragHandler">Name</span>,
        column: 'Name',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Network Address</span>,
        column: 'Network Address',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('network_address', form),
            dataIndex: 'network_address',
            key: 'network_address',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">MAC Address</span>,
        column: 'MAC Address',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('mac_address', form),
            dataIndex: 'mac_address',
            key: 'mac_address',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Serial Number</span>,
        column: 'Serial Number',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('serial_number', form),
            dataIndex: 'serial_number',
            key: 'serial_number',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Last Successful Poll</span>,
        column: 'Last Successful Poll',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('last_successful_poll', form),
            dataIndex: 'last_successful_poll',
            key: 'last_successful_poll',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Running Firmware Tooltip</span>,
        column: 'Running Firmware_tooltip',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('running_firmware_tooltip', form),
            dataIndex: 'running_firmware_tooltip',
            key: 'running_firmware_tooltip',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Type</span>,
        column: 'Type',
        sorter: true,
        ellipsis: true,
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
        title: <span className="dragHandler">Notes</span>,
        column: 'Notes',
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
      {
        title: <span className="dragHandler">Device Family</span>,
        column: 'Device Family',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('device_family', form),
            dataIndex: 'device_family',
            key: 'device_family',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Last Capture</span>,
        column: 'Last Capture',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('last_capture', form),
            dataIndex: 'last_capture',
            key: 'last_capture',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Manufacturer</span>,
        column: 'Manufacturer',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('manufacturer', form),
            dataIndex: 'manufacturer',
            key: 'manufacturer',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Model Type Name</span>,
        column: 'Model Type Name',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('model_type_name', form),
            dataIndex: 'model_type_name',
            key: 'model_type_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Model Class</span>,
        column: 'Model Class',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('model_class', form),
            dataIndex: 'model_class',
            key: 'model_class',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Violated NCM Policies</span>,
        column: 'Violated NCM Policies',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('violated_ncm_policies', form),
            dataIndex: 'violated_ncm_policies',
            key: 'violated_ncm_policies',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Topology Container Tooltip</span>,
        column: 'Topology Container_tooltip',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('topology_container_tooltip', form),
            dataIndex: 'topology_container_tooltip',
            key: 'topology_container_tooltip',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Creation Time</span>,
        column: 'Creation Time',
        sorter: true,
        ellipsis: true,
        children: [
          {
            title: FilterBySwap('creation_time', form),
            dataIndex: 'creation_time',
            key: 'creation_time',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeCiscoSpectrum = (id: number) => {
    dispatch(deleteCiscoSpectrum(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.HwCiscoSpectrum}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/hw-cisco/cisco-spectrum/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.HwCiscoSpectrum}>
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
        showAddButton={ability.can(Action.Add, Page.HwCiscoSpectrum)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={ciscoSpectrumSelector}
        searchTableData={searchCiscoSpectrum}
        clearTableDataMessages={clearCiscoSpectrumMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.HwCiscoSpectrum)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
