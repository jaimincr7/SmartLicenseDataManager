import { Checkbox, Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import { AlignType } from 'rc-table/lib/interface';
import _ from 'lodash';
import {
  FilterByBooleanDropDown,
  FilterByDateSwap,
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { IMainTable, ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import DataTable from '../../../../common/components/DataTable';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import {
  ciscoProductSelector,
  clearCiscoProductMessages,
  setTableColumnSelection,
} from '../../../../store/hwCisco/ciscoProduct/ciscoProduct.reducer';
import ciscoProductService from '../../../../services/hwCisco/ciscoProduct/ciscoProduct.service';
import {
  deleteCiscoProduct,
  searchCiscoProduct,
} from '../../../../store/hwCisco/ciscoProduct/ciscoProduct.action';
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
  const ciscoProduct = useAppSelector(ciscoProductSelector);
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
    return ciscoProductService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    setFilterKeys(ObjectForColumnFilter);
    return FilterWithSwapOption(
      dataIndex,
      ciscoProduct.search.tableName,
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
              ciscoProduct.search.lookups?.tenants?.length > 0
                ? ciscoProduct.search.lookups?.tenants
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
              ciscoProduct.search.lookups?.companies?.length > 0
                ? ciscoProduct.search.lookups?.companies
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
              ciscoProduct.search.lookups?.bus?.length > 0
                ? ciscoProduct.search.lookups?.bus
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
            title: FilterByDateSwapTable('date_added', ciscoProduct.search.tableName, form),
            dataIndex: 'date_added',
            key: 'date_added',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Ship Date</span>,
        column: 'Ship Date',
        sorter: true,
        children: [
          {
            title: FilterByDateSwapTable('ship_date', ciscoProduct.search.tableName, form),
            dataIndex: 'ship_date',
            key: 'ship_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Date Data Added</span>,
        column: 'Date Data Added',
        sorter: true,
        children: [
          {
            title: FilterByDateSwapTable('date_data_added', ciscoProduct.search.tableName, form),
            dataIndex: 'date_data_added',
            key: 'date_data_added',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Last Update Date</span>,
        column: 'Last Update Date',
        sorter: true,
        children: [
          {
            title: FilterByDateSwapTable('last_update_date', ciscoProduct.search.tableName, form),
            dataIndex: 'last_update_date',
            key: 'last_update_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Warranty End Date</span>,
        column: 'Warranty End Date',
        sorter: true,
        children: [
          {
            title: FilterByDateSwapTable('warranty_end_date', ciscoProduct.search.tableName, form),
            dataIndex: 'warranty_end_date',
            key: 'warranty_end_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },

      //STRINGS

      {
        title: <span className="dragHandler">Source</span>,
        column: 'Source',
        sorter: true,
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
        title: <span className="dragHandler">UID</span>,
        column: 'UID',
        sorter: true,
        children: [
          {
            title: FilterBySwap('uid', form),
            dataIndex: 'uid',
            key: 'uid',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Current Organization</span>,
        column: 'Current Organization',
        sorter: true,
        children: [
          {
            title: FilterBySwap('current_organization', form),
            dataIndex: 'current_organization',
            key: 'current_organization',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Previous Organization</span>,
        column: 'Previous Organization',
        sorter: true,
        children: [
          {
            title: FilterBySwap('previous_organization', form),
            dataIndex: 'previous_organization',
            key: 'previous_organization',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Responsible Party</span>,
        column: 'Responsible Party',
        sorter: true,
        children: [
          {
            title: FilterBySwap('responsible_party', form),
            dataIndex: 'responsible_party',
            key: 'responsible_party',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Cisco Install Site ID</span>,
        column: 'Cisco Install Site ID',
        sorter: true,
        children: [
          {
            title: FilterBySwap('cisco_install_site_id', form),
            dataIndex: 'cisco_install_site_id',
            key: 'cisco_install_site_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Cisco Ship To ID</span>,
        column: 'Cisco Ship To ID',
        sorter: true,
        children: [
          {
            title: FilterBySwap('cisco_ship_to_id', form),
            dataIndex: 'cisco_ship_to_id',
            key: 'cisco_ship_to_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Product ID</span>,
        column: 'Product ID',
        sorter: true,
        children: [
          {
            title: FilterBySwap('product_id', form),
            dataIndex: 'product_id',
            key: 'product_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Serial Number</span>,
        column: 'Serial Number',
        sorter: true,
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
        title: <span className="dragHandler">Instance ID</span>,
        column: 'Instance ID',
        sorter: true,
        children: [
          {
            title: FilterBySwap('instance_id', form),
            dataIndex: 'instance_id',
            key: 'instance_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Parent SN</span>,
        column: 'Parent SN',
        sorter: true,
        children: [
          {
            title: FilterBySwap('parent_sn', form),
            dataIndex: 'parent_sn',
            key: 'parent_sn',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Parent Instance ID</span>,
        column: 'Parent Instance ID',
        sorter: true,
        children: [
          {
            title: FilterBySwap('parent_instance_id', form),
            dataIndex: 'parent_instance_id',
            key: 'parent_instance_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Parent / Child Relationship</span>,
        column: 'Parent / Child Relationship',
        sorter: true,
        children: [
          {
            title: FilterBySwap('parent_child_relationship', form),
            dataIndex: 'parent_child_relationship',
            key: 'parent_child_relationship',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Collected SN</span>,
        column: 'Collected SN',
        sorter: true,
        children: [
          {
            title: FilterBySwap('collected_sn', form),
            dataIndex: 'collected_sn',
            key: 'collected_sn',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Host ID</span>,
        column: 'HostID',
        sorter: true,
        children: [
          {
            title: FilterBySwap('host_id', form),
            dataIndex: 'host_id',
            key: 'host_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Install Base Status</span>,
        column: 'Install Base Status',
        sorter: true,
        children: [
          {
            title: FilterBySwap('install_base_status', form),
            dataIndex: 'install_base_status',
            key: 'install_base_status',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Replacement SN</span>,
        column: 'Replacement SN',
        sorter: true,
        children: [
          {
            title: FilterBySwap('replacement_sn', form),
            dataIndex: 'replacement_sn',
            key: 'replacement_sn',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Zone Assignment</span>,
        column: 'Zone Assignment',
        sorter: true,
        children: [
          {
            title: FilterBySwap('zone_assignment', form),
            dataIndex: 'zone_assignment',
            key: 'zone_assignment',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Zone Description</span>,
        column: 'Zone Description',
        sorter: true,
        children: [
          {
            title: FilterBySwap('zone_description', form),
            dataIndex: 'zone_description',
            key: 'zone_description',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Software License PAK</span>,
        column: 'Software License PAK',
        sorter: true,
        children: [
          {
            title: FilterBySwap('software_license_pak', form),
            dataIndex: 'software_license_pak',
            key: 'software_license_pak',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Product Relationship</span>,
        column: 'Product Relationship',
        sorter: true,
        children: [
          {
            title: FilterBySwap('product_relationship', form),
            dataIndex: 'product_relationship',
            key: 'product_relationship',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Parent Child Indicator</span>,
        column: 'Parent Child Indicator',
        sorter: true,
        children: [
          {
            title: FilterBySwap('parent_child_indicator', form),
            dataIndex: 'parent_child_indicator',
            key: 'parent_child_indicator',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Minor Follow Parent</span>,
        column: 'Minor Follow Parent',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'minor_follow_parent',
              ciscoProduct.search?.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'minor_follow_parent',
            key: 'minor_follow_parent',
            ellipsis: true,
            render: (value: boolean) =>
              !_.isNull(value) ? (
                value ? (
                  <Checkbox checked disabled />
                ) : (
                  <Checkbox checked={false} disabled />
                )
              ) : (
                ''
              ),
            align: 'center' as AlignType,
          },
        ],
      },
      {
        title: <span className="dragHandler">Discovery System Status</span>,
        column: 'Discovery System Status',
        sorter: true,
        children: [
          {
            title: FilterBySwap('discovery_system_status', form),
            dataIndex: 'discovery_system_status',
            key: 'discovery_system_status',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Notes</span>,
        column: 'Notes',
        sorter: true,
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
        title: <span className="dragHandler">Corrective Action</span>,
        column: 'Corrective Action',
        sorter: true,
        children: [
          {
            title: FilterBySwap('corrective_action', form),
            dataIndex: 'corrective_action',
            key: 'corrective_action',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Product Quantity</span>,
        column: 'Product Quantity',
        sorter: true,
        children: [
          {
            title: FilterBySwap('product_quantity', form),
            dataIndex: 'product_quantity',
            key: 'product_quantity',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Original Data Source</span>,
        column: 'Original Data Source',
        sorter: true,
        children: [
          {
            title: FilterBySwap('original_data_source', form),
            dataIndex: 'original_data_source',
            key: 'original_data_source',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Last Update Data Source</span>,
        column: 'Last Update Data Source',
        sorter: true,
        children: [
          {
            title: FilterBySwap('last_update_data_source', form),
            dataIndex: 'last_update_data_source',
            key: 'last_update_data_source',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Smart Account</span>,
        column: 'Smart Account',
        sorter: true,
        children: [
          {
            title: FilterBySwap('smart_account', form),
            dataIndex: 'smart_account',
            key: 'smart_account',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Warranty Type</span>,
        column: 'Warranty Type',
        sorter: true,
        children: [
          {
            title: FilterBySwap('warranty_type', form),
            dataIndex: 'warranty_type',
            key: 'warranty_type',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Hardware Bill To</span>,
        column: 'Hardware Bill To',
        sorter: true,
        children: [
          {
            title: FilterBySwap('hardware_bill_to', form),
            dataIndex: 'hardware_bill_to',
            key: 'hardware_bill_to',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">PO</span>,
        column: 'PO',
        sorter: true,
        children: [
          {
            title: FilterBySwap('po', form),
            dataIndex: 'po',
            key: 'po',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">SO</span>,
        column: 'SO',
        sorter: true,
        children: [
          {
            title: FilterBySwap('so', form),
            dataIndex: 'so',
            key: 'so',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeCiscoProduct = (id: number) => {
    dispatch(deleteCiscoProduct(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.HwCiscoProduct}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/hw-cisco/cisco-product/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.HwCiscoProduct}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeCiscoProduct(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.HwCiscoProduct)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={ciscoProductSelector}
        searchTableData={searchCiscoProduct}
        clearTableDataMessages={clearCiscoProductMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.HwCiscoProduct)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
