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
  clearSpsApiInjectionParamV2Messages,
  spsApiInjectionParamV2Selector,
  setTableColumnSelection,
} from '../../../../store/sps/apiInjectionParamV2/apiInjectionParamV2.reducer';
import {
  deleteSpsApiInjectionParamV2,
  searchSpsApiInjectionParamV2,
} from '../../../../store/sps/apiInjectionParamV2/apiInjectionParamV2.action';
import spsApiInjectionParamV2Service from '../../../../services/sps/apiInjectionParamV2/apiInjectionParamV2.service';
import AddSpsApiInjectionParamV2Modal from '../AddApiInjectionParamV2Modal';

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
  const spsApiInjectionParamV2 = useAppSelector(spsApiInjectionParamV2Selector);
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
    return spsApiInjectionParamV2Service.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(
      dataIndex,
      spsApiInjectionParamV2.search.tableName,
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
        title: <span className="dragHandler">Param</span>,
        column: 'Param',
        sorter: true,
        children: [
          {
            title: FilterBySwap('param', form),
            dataIndex: 'param',
            key: 'param',
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
              spsApiInjectionParamV2.search.lookups?.sps_api_types
            ),
            dataIndex: 'sps_api_types_names',
            key: 'sps_api_types_names',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">ParamId</span>,
        column: 'ParamId',
        sorter: true,
        children: [
          {
            title: FilterBySwap('param_id', form),
            dataIndex: 'param_id',
            key: 'param_id',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Is Masked</span>,
        column: 'IsMasked',
        sorter: true,
        children: [
          {
            title: FilterByBooleanDropDown(
              'is_masked',
              spsApiInjectionParamV2.search.tableName,
              ObjectForColumnFilter
            ),
            dataIndex: 'is_masked',
            key: 'is_masked',
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

  const removeSpsApiInjectionParamV2 = (id: number) => {
    dispatch(deleteSpsApiInjectionParamV2(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.SpsApiInjectionParamV2}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            {
              isTabbed ? (
                <AddSpsApiInjectionParamV2Modal
                  showModal={addModalVisible}
                  isMultiple={false}
                  handleModalClose={() => {
                    setAddModalVisible(false);
                    {
                      props.isTabbed ? null : history.push('/sps/sps-api-injection-param-v2');
                    }
                  }}
                  id={data.id}
                  refreshDataTable={() => refreshDataTable()}
                />
              ) : (
                history.push(`/sps/sps-api-injection-param-v2/${data.id}`)
              );
            }
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.SpsApiInjectionParamV2}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeSpsApiInjectionParamV2(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.SpsApiInjectionParamV2)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={spsApiInjectionParamV2Selector}
        searchTableData={searchSpsApiInjectionParamV2}
        clearTableDataMessages={clearSpsApiInjectionParamV2Messages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.SpsApiInjectionParamV2)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
