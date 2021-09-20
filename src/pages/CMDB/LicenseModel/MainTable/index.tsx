import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import _ from 'lodash';
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
  deleteCmdbLicenseModel,
  searchCmdbLicenseModel,
} from '../../../../store/cmdb/licenseModel/licenseModel.action';
import {
  clearCmdbLicenseModelMessages,
  cmdbLicenseModelSelector,
  setTableColumnSelection,
} from '../../../../store/cmdb/licenseModel/licenseModel.reducer';
import licenseModelService from '../../../../services/cmdb/licenseModel/licenseModel.service';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const { setSelectedId } = props;
  const cmdbLicenseModel = useAppSelector(cmdbLicenseModelSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const exportExcelFile = (searchData: ISearch) => {
    return licenseModelService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(dataIndex, cmdbLicenseModel.search.tableName, form);
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
        title: <span className="dragHandler">Description</span>,
        column: 'Description',
        sorter: true,
        children: [
          {
            title: FilterBySwap('description', form),
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Metric</span>,
        column: 'Metric',
        sorter: true,
        children: [
          {
            title: FilterBySwap('metric', form),
            dataIndex: 'metric',
            key: 'metric',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Minimum</span>,
        column: 'Minimum',
        sorter: true,
        children: [
          {
            title: FilterBySwap('minimum', form),
            dataIndex: 'minimum',
            key: 'minimum',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Is Downgradable</span>,
        column: 'IsDowngradable',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'is_down_gradable',
              cmdbLicenseModel.search.lookups?.booleanLookup
            ),
            dataIndex: 'is_down_gradable',
            key: 'is_down_gradable',
            ellipsis: true,
            render: (value: boolean) => (!_.isNull(value) ? (value ? 'Yes' : 'No') : ''),
          },
        ],
      },
    ];
  };

  const removeCmdbLicenseModel = (id: number) => {
    dispatch(deleteCmdbLicenseModel(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.CmdbLicenseModel}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/cmdb/cmdb-license-model/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.CmdbLicenseModel}>
        <Popconfirm title="Sure to delete?" onConfirm={() => removeCmdbLicenseModel(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.CmdbLicenseModel)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={cmdbLicenseModelSelector}
        searchTableData={searchCmdbLicenseModel}
        clearTableDataMessages={clearCmdbLicenseModelMessages}
        setTableColumnSelection={setTableColumnSelection}
      />
    </>
  );
};

export default forwardRef(MainTable);
