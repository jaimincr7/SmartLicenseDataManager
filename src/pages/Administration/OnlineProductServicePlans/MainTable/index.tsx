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
  clearConfigOnlineProductServicePlansMessages,
  configOnlineProductServicePlansSelector,
  setTableColumnSelection,
} from '../../../../store/master/onlineProductServicePlans/onlineProductServicePlans.reducer';
import {
  deleteConfigOnlineProductServicePlans,
  searchConfigOnlineProductServicePlans,
} from '../../../../store/master/onlineProductServicePlans/onlineProductServicePlans.action';
import configOnlineProductServicePlansService from '../../../../services/master/onlineProductServicePlans/onlineProductServicePlans.service';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const {
    setSelectedId,
    setShowSelectedListModal,
    setValuesForSelection,
    isMultiple,
    tableButtons,
  } = props;
  const configOnlineProductServicePlans = useAppSelector(configOnlineProductServicePlansSelector);
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
    return configOnlineProductServicePlansService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(
      dataIndex,
      configOnlineProductServicePlans.search.tableName,
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
        title: <span className="dragHandler">Product</span>,
        column: 'ProductId',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'product_id',
              configOnlineProductServicePlans.search.lookups?.online_products
            ),
            dataIndex: 'online_product_name',
            key: 'online_product_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Service Plan</span>,
        column: 'ServicePlanId',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'service_plan_id',
              configOnlineProductServicePlans.search.lookups?.online_service_plans
            ),
            dataIndex: 'online_service_plan_name',
            key: 'online_service_plan_name',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeConfigOnlineProductServicePlans = (id: number) => {
    dispatch(deleteConfigOnlineProductServicePlans(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.ConfigOnlineProductServicePlans}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/administration/config-online-product-service-plans/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.ConfigOnlineProductServicePlans}>
        <Popconfirm
          title="Delete Record?"
          onConfirm={() => removeConfigOnlineProductServicePlans(data.id)}
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
        showAddButton={ability.can(Action.Add, Page.ConfigOnlineProductServicePlans)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={configOnlineProductServicePlansSelector}
        searchTableData={searchConfigOnlineProductServicePlans}
        clearTableDataMessages={clearConfigOnlineProductServicePlansMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        showBulkUpdate={ability.can(Action.Update, Page.ConfigOnlineProductServicePlans)}
        setValuesForSelection={setValuesForSelection}
        setObjectForColumnFilter={setObjectForColumnFilter}
        globalSearchExist={false}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
