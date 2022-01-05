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
  clearSpsApiTypeMessages,
  spsApiTypeSelector,
  setTableColumnSelection,
} from '../../../../store/sps/apiType/apiType.reducer';
import { deleteSpsApiType, searchSpsApiType } from '../../../../store/sps/apiType/apiType.action';
import spsApiTypeService from '../../../../services/sps/apiType/apiType.service';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const {
    setSelectedId,
    setShowSelectedListModal,
    setValuesForSelection,
    isMultiple,
    tableButtons,
  } = props;
  const spsApiType = useAppSelector(spsApiTypeSelector);
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
    return spsApiTypeService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(
      dataIndex,
      spsApiType.search.tableName,
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
        title: <span className="dragHandler">API Group</span>,
        column: 'API_GroupId',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('api_group_id', spsApiType.search.lookups?.sps_api_groups),
            dataIndex: 'sps_api_group_name',
            key: 'sps_api_group_name',
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
        title: <span className="dragHandler">Route</span>,
        column: 'Route',
        sorter: true,
        children: [
          {
            title: FilterBySwap('route', form),
            dataIndex: 'route',
            key: 'route',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">URL</span>,
        column: 'URL',
        sorter: true,
        children: [
          {
            title: FilterBySwap('url', form),
            dataIndex: 'url',
            key: 'url',
            ellipsis: true,
          },
        ],
      },
      // {
      //   title: <span className="dragHandler">Base Urls</span>,
      //   column: 'Base Urls',
      //   sorter: true,
      //   children: [
      //     {
      //       title: FilterBySwap('base_urls', form),
      //       dataIndex: 'base_urls',
      //       key: 'base_urls',
      //       ellipsis: true,
      //     },
      //   ],
      // },
    ];
  };

  const removeSpsApiType = (id: number) => {
    dispatch(deleteSpsApiType(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      {/* <a
        className="action-btn"
        onClick={() => {
          setSelectedId(data.id);
          history.push(`/sps/sps-api-type/detail/${data.id}`);
        }}
      >
        <img src={`${process.env.PUBLIC_URL}/assets/images/ic-eye.svg`} alt="" />
      </a> */}
      <Can I={Action.Update} a={Page.SpsApiType}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/sps/sps-api-type/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.SpsApiType}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeSpsApiType(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.SpsApiType)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={spsApiTypeSelector}
        searchTableData={searchSpsApiType}
        clearTableDataMessages={clearSpsApiTypeMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.SpsApiType)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        globalSearchExist={false}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
