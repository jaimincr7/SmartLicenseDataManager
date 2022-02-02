import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import { FilterWithSwapOption } from '../../../../common/components/DataTable/DataTableFilters';
import { IMainTable, ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import DataTable from '../../../../common/components/DataTable';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import {
  deleteCmdbOsNormalization,
  searchCmdbOsNormalization,
} from '../../../../store/cmdb/osNormalization/osNormalization.action';
import {
  clearCmdbOsNormalizationMessages,
  cmdbOsNormalizationSelector,
  setTableColumnSelection,
} from '../../../../store/cmdb/osNormalization/osNormalization.reducer';
import OsNormalizationService from '../../../../services/cmdb/osNormalization/osNormalization.service';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const {
    setSelectedId,
    setShowSelectedListModal,
    setValuesForSelection,
    isMultiple,
    tableButtons,
  } = props;
  const cmdbOsNormalization = useAppSelector(cmdbOsNormalizationSelector);
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
    return OsNormalizationService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(
      dataIndex,
      cmdbOsNormalization.search.tableName,
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
        title: <span className="dragHandler">Operating System</span>,
        column: 'Operating System (Raw)',
        sorter: true,
        children: [
          {
            title: FilterBySwap('operating_system_raw', form),
            dataIndex: 'operating_system_raw',
            key: 'operating_system_raw',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Device Type</span>,
        column: 'Device Type',
        sorter: true,
        children: [
          {
            title: FilterBySwap('device_type', form),
            dataIndex: 'device_type',
            key: 'device_type',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Family</span>,
        column: 'Family',
        sorter: true,
        children: [
          {
            title: FilterBySwap('family', form),
            dataIndex: 'family',
            key: 'family',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Publisher</span>,
        column: 'Publisher',
        sorter: true,
        children: [
          {
            title: FilterBySwap('publisher', form),
            dataIndex: 'publisher',
            key: 'publisher',
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
        title: <span className="dragHandler">Edition Index</span>,
        column: 'Edition index',
        sorter: true,
        children: [
          {
            title: FilterBySwap('edition_index', form),
            dataIndex: 'edition_index',
            key: 'edition_index',
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
        title: <span className="dragHandler">Version Index</span>,
        column: 'Version Index',
        sorter: true,
        children: [
          {
            title: FilterBySwap('version_index', form),
            dataIndex: 'version_index',
            key: 'version_index',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeCmdbOsNormalization = (id: number) => {
    dispatch(deleteCmdbOsNormalization(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.CmdbOsNormalization}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/cmdb/cmdb-os-normalization/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.CmdbOsNormalization}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeCmdbOsNormalization(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.CmdbOsNormalization)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={cmdbOsNormalizationSelector}
        searchTableData={searchCmdbOsNormalization}
        clearTableDataMessages={clearCmdbOsNormalizationMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.CmdbOsNormalization)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        globalSearchExist={false}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
