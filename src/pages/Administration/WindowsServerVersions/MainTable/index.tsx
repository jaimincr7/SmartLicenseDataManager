import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
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
  clearConfigWindowsServerVersionsMessages,
  configWindowsServerVersionsSelector,
  setTableColumnSelection,
} from '../../../../store/master/windowsServerVersions/windowsServerVersions.reducer';
import {
  deleteConfigWindowsServerVersions,
  searchConfigWindowsServerVersions,
} from '../../../../store/master/windowsServerVersions/windowsServerVersions.action';
import configWindowsServerVersionsService from '../../../../services/master/windowsServerVersions/windowsServerVersions.service';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const { setSelectedId, setShowSelectedListModal, setValuesForSelection, isMultiple } = props;
  const configWindowsServerVersions = useAppSelector(configWindowsServerVersionsSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

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
    return configWindowsServerVersionsService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(dataIndex, configWindowsServerVersions.search.tableName, form);
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
        title: <span className="dragHandler">Support Type</span>,
        column: 'SupportTypeId',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'support_type_id',
              configWindowsServerVersions.search.lookups?.support_types
            ),
            dataIndex: 'support_type_name',
            key: 'support_type_name',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeConfigWindowsServerVersions = (id: number) => {
    dispatch(deleteConfigWindowsServerVersions(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.ConfigWindowsServerVersions}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/administration/config-windows-server-versions/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.ConfigWindowsServerVersions}>
        <Popconfirm
          title="Delete Record?"
          onConfirm={() => removeConfigWindowsServerVersions(data.id)}
        >
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
        showAddButton={ability.can(Action.Add, Page.ConfigWindowsServerVersions)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={configWindowsServerVersionsSelector}
        searchTableData={searchConfigWindowsServerVersions}
        clearTableDataMessages={clearConfigWindowsServerVersionsMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
      />
    </>
  );
};

export default forwardRef(MainTable);
