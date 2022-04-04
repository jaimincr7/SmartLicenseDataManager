import { Checkbox, Popconfirm } from 'antd';
import _ from 'lodash';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  FilterByBooleanDropDown,
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { AlignType } from 'rc-table/lib/interface';
import { IMainTable, ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import DataTable from '../../../../common/components/DataTable';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import {
  clearSpsApiTokenConfigOptionsV2Messages,
  spsApiTokenConfigOptionsV2Selector,
  setTableColumnSelection,
} from '../../../../store/sps/apiTokenConfigOptionsV2/apiTokenConfigOptionsV2.reducer';
import {
  deleteSpsApiTokenConfigOptionsV2,
  searchSpsApiTokenConfigOptionsV2,
} from '../../../../store/sps/apiTokenConfigOptionsV2/apiTokenConfigOptionsV2.action';
import spsApiTokenConfigOptionsV2Service from '../../../../services/sps/apiTokenConfigOptionsV2/apiTokenConfigOptionsV2.service';
import AddSpsApiTokenConfigOptionsV2Modal from '../AddApiTokenConfigOptionsV2Modal';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const {
    setSelectedId,
    setShowSelectedListModal,
    setValuesForSelection,
    isMultiple,
    tableButtons,
    isTabbed,
    addModalVisible,
    setAddModalVisible,
  } = props;
  const spsApiTokenConfigOptionsV2 = useAppSelector(spsApiTokenConfigOptionsV2Selector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();
  const [ObjectForColumnFilter, setObjectForColumnFilter] = useState({});

  useImperativeHandle(ref, () => ({
    refreshData() {
      dataTableRef?.current.refreshData();
    },
  }));

  const refreshDataTable = () => {
    dataTableRef?.current.refreshData();
  };

  useEffect(() => {
    if (isMultiple) {
      dataTableRef?.current.getValuesForSelection();
    }
  }, [isMultiple]);

  const exportExcelFile = (searchData: ISearch) => {
    return spsApiTokenConfigOptionsV2Service.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(
      dataIndex,
      spsApiTokenConfigOptionsV2.search.tableName,
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
      // {
      //   title: <span className="dragHandler">API Type</span>,
      //   column: 'API_TypeId',
      //   sorter: true,
      //   children: [
      //     {
      //       title: FilterBySwap('type', form),
      //       dataIndex: 'type',
      //       key: 'type',
      //       ellipsis: true,
      //     },
      //   ],
      // },
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
        title: <span className="dragHandler">API Type</span>,
        column: 'API_Type',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'api_type_id',
              spsApiTokenConfigOptionsV2.search.lookups?.sps_api_types
            ),
            dataIndex: 'sps_api_types_names',
            key: 'sps_api_types_names',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Value</span>,
        column: 'Value',
        sorter: true,
        children: [
          {
            title: FilterBySwap('value', form),
            dataIndex: 'value',
            key: 'value',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Type</span>,
        column: 'Type',
        sorter: true,
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
        title: <span className="dragHandler">Is Env Var</span>,
        column: 'IsEnvVar',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_env_var',
              spsApiTokenConfigOptionsV2.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_env_var',
            key: 'is_env_var',
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
    ];
  };

  const removeSpsApiTokenConfigOptionsV2 = (id: number) => {
    dispatch(deleteSpsApiTokenConfigOptionsV2(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.SpsApiTokenConfigOptionsV2}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            {
              isTabbed ? (
                <AddSpsApiTokenConfigOptionsV2Modal
                  showModal={addModalVisible}
                  isMultiple={false}
                  handleModalClose={() => {
                    setAddModalVisible(false);
                    {
                      props.isTabbed ? null : history.push('/sps/sps-api-token-config-options-v2');
                    }
                  }}
                  id={data.id}
                  refreshDataTable={() => refreshDataTable()}
                />
              ) : (
                history.push(`/sps/sps-api-token-config-options-v2/${data.id}`)
              );
            }
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.SpsApiTokenConfigOptionsV2}>
        <Popconfirm
          title="Delete Record?"
          onConfirm={() => removeSpsApiTokenConfigOptionsV2(data.id)}
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
        globalSearchExist={false}
        showAddButton={ability.can(Action.Add, Page.SpsApiTokenConfigOptionsV2)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={spsApiTokenConfigOptionsV2Selector}
        searchTableData={searchSpsApiTokenConfigOptionsV2}
        clearTableDataMessages={clearSpsApiTokenConfigOptionsV2Messages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.SpsApiTokenConfigOptionsV2)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
