import { Popconfirm } from 'antd';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import { FilterWithSwapOption } from '../../../../common/components/DataTable/DataTableFilters';
import { IMainTable, ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import DataTable from '../../../../common/components/DataTable';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import {
  clearAgreementTypesMessages,
  agreementTypesSelector,
  setTableColumnSelection,
} from '../../../../store/master/agreementTypes/agreementTypes.reducer';
import {
  deleteAgreementTypes,
  searchAgreementTypes,
} from '../../../../store/master/agreementTypes/agreementTypes.action';
import agreementTypesService from '../../../../services/master/agreementTypes/agreementTypes.service';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const {
    setSelectedId,
    setShowSelectedListModal,
    setValuesForSelection,
    isMultiple,
    tableButtons,
  } = props;
  const agreementTypes = useAppSelector(agreementTypesSelector);
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
      dataTableRef?.current.getNumberOfRecordsForUpdate();
    }
  }, [isMultiple]);

  const exportExcelFile = (searchData: ISearch) => {
    return agreementTypesService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(
      dataIndex,
      agreementTypes.search.tableName,
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
        title: <span className="dragHandler">Agreement Type</span>,
        column: 'AgreementType',
        sorter: true,
        children: [
          {
            title: FilterBySwap('agreement_type', form),
            dataIndex: 'agreement_type',
            key: 'agreement_type',
            ellipsis: true,
          },
        ],
      },
    ];
  };

  const removeAgreementTypes = (id: number) => {
    dispatch(deleteAgreementTypes(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.AgreementTypes}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/administration/agreement-types/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.AgreementTypes}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeAgreementTypes(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.AgreementTypes)}
        setSelectedId={setSelectedId}
        showDelete={false}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={agreementTypesSelector}
        searchTableData={searchAgreementTypes}
        clearTableDataMessages={clearAgreementTypesMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.AgreementTypes)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        globalSearchExist={false}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
