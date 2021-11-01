import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
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
  deleteCmdbApplication,
  searchCmdbApplication,
} from '../../../../store/cmdb/application/application.action';
import {
  clearCmdbApplicationMessages,
  cmdbApplicationSelector,
  setTableColumnSelection,
} from '../../../../store/cmdb/application/application.reducer';
import applicationService from '../../../../services/cmdb/application/application.service';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const {
    setSelectedId,
    setShowSelectedListModal,
    setValuesForSelection,
    isMultiple,
    tableButtons,
  } = props;
  const cmdbApplication = useAppSelector(cmdbApplicationSelector);
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
    return applicationService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(
      dataIndex,
      cmdbApplication.search.tableName,
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
        title: <span className="dragHandler">License Model</span>,
        column: 'LicenseModelID',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'license_model_id',
              cmdbApplication.search.lookups?.license_models
            ),
            dataIndex: 'license_model_name',
            key: 'license_model_name',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeCmdbApplication = (id: number) => {
    dispatch(deleteCmdbApplication(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.CmdbApplication}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/cmdb/cmdb-application/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.CmdbApplication}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeCmdbApplication(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.CmdbApplication)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={cmdbApplicationSelector}
        searchTableData={searchCmdbApplication}
        clearTableDataMessages={clearCmdbApplicationMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.CmdbApplication)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        globalSearchExist={false}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
