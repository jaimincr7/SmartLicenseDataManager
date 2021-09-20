import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import moment from 'moment';
import { Common } from '../../../../common/constants/common';
import _ from 'lodash';
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
import {
  deleteCmdbSoftware,
  searchCmdbSoftware,
} from '../../../../store/cmdb/software/software.action';
import {
  clearCmdbSoftwareMessages,
  cmdbSoftwareSelector,
  setTableColumnSelection,
} from '../../../../store/cmdb/software/software.reducer';
import softwareService from '../../../../services/cmdb/software/software.service';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const { setSelectedId } = props;
  const cmdbSoftware = useAppSelector(cmdbSoftwareSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const exportExcelFile = (searchData: ISearch) => {
    return softwareService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(dataIndex, cmdbSoftware.search.tableName, form);
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
            title: FilterByDropdown('tenant_id', cmdbSoftware.search.lookups?.tenants),
            dataIndex: 'tenant_name',
            key: 'tenant_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Application</span>,
        column: 'ApplicationID',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('application_id', cmdbSoftware.search.lookups?.applications),
            dataIndex: 'application_name',
            key: 'application_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Device</span>,
        column: 'DeviceId',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('device_id', cmdbSoftware.search.lookups?.devices),
            dataIndex: 'device_name',
            key: 'device_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Name</span>,
        column: 'Name',
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
        title: <span className="dragHandler">Version</span>,
        column: 'Version',
        sorter: true,
        children: [
          {
            title: FilterBySwap('version', form),
            dataIndex: 'version',
            key: 'version',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Edition</span>,
        column: 'Edition',
        sorter: true,
        children: [
          {
            title: FilterBySwap('edition', form),
            dataIndex: 'edition',
            key: 'edition',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Installed Date</span>,
        column: 'InstalledDate',
        sorter: true,
        children: [
          {
            title: FilterByDateSwap('installed_date', cmdbSoftware.search.tableName, form),
            dataIndex: 'installed_date',
            key: 'installed_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Uninstall String</span>,
        column: 'UninstallString',
        sorter: true,
        children: [
          {
            title: FilterBySwap('uninstall_string', form),
            dataIndex: 'uninstall_string',
            key: 'uninstall_string',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">File Name</span>,
        column: 'FileName',
        sorter: true,
        children: [
          {
            title: FilterBySwap('file_name', form),
            dataIndex: 'file_name',
            key: 'file_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">File Path</span>,
        column: 'FilePath',
        sorter: true,
        children: [
          {
            title: FilterBySwap('file_path', form),
            dataIndex: 'file_path',
            key: 'file_path',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Package GUID</span>,
        column: 'PackageGUID',
        sorter: true,
        children: [
          {
            title: FilterBySwap('package_guid', form),
            dataIndex: 'package_guid',
            key: 'package_guid',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Last Scanned</span>,
        column: 'LastScanned',
        sorter: true,
        children: [
          {
            title: FilterBySwap('last_scanned', form),
            dataIndex: 'last_scanned',
            key: 'last_scanned',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeCmdbSoftware = (id: number) => {
    dispatch(deleteCmdbSoftware(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.CmdbSoftware}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/cmdb/cmdb-software/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.CmdbSoftware}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeCmdbSoftware(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.CmdbSoftware)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={cmdbSoftwareSelector}
        searchTableData={searchCmdbSoftware}
        clearTableDataMessages={clearCmdbSoftwareMessages}
        setTableColumnSelection={setTableColumnSelection}
      />
    </>
  );
};

export default forwardRef(MainTable);
