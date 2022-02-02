import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  FilterByDateSwap,
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import _ from 'lodash';
import { IMainTable, ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import DataTable from '../../../../common/components/DataTable';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import contractAgreementAttachmentService from '../../../../services/cms/contractAgreementAttachment/contractAgreementAttachment.service';
import {
  clearCmsContractAgreementAttachmentMessages,
  cmsContractAgreementAttachmentSelector,
  setTableColumnSelection,
} from '../../../../store/cms/contractAgreementAttachment/contractAgreementAttachment.reducer';
import {
  deleteCmsContractAgreementAttachment,
  searchCmsContractAgreementAttachment,
} from '../../../../store/cms/contractAgreementAttachment/contractAgreementAttachment.action';
import { showDateFromApi } from '../../../../common/helperFunction';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const {
    setSelectedId,
    setShowSelectedListModal,
    setValuesForSelection,
    isMultiple,
    tableButtons,
  } = props;
  const cmsContractAgreementAttachment = useAppSelector(cmsContractAgreementAttachmentSelector);
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
    return contractAgreementAttachmentService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(
      dataIndex,
      cmsContractAgreementAttachment.search.tableName,
      form,
      null,
      ObjectForColumnFilter
    );
  };

  const FilterByDateSwapTable = (dataIndex: string, tableName: string, form: any) => {
    return FilterByDateSwap(dataIndex, tableName, form, null, ObjectForColumnFilter);
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
        title: <span className="dragHandler">Contract/Agreement</span>,
        column: 'Contract/Agreement ID',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'contract_agreement_id',
              cmsContractAgreementAttachment.search.lookups?.contracts
            ),
            dataIndex: 'contract_name',
            key: 'contract_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">User</span>,
        column: 'User Id',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'user_id',
              cmsContractAgreementAttachment.search.lookups?.users
            ),
            dataIndex: 'user_name',
            key: 'user_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Date Added</span>,
        column: 'Date Added',
        sorter: true,
        children: [
          {
            title: FilterByDateSwapTable(
              'date_added',
              cmsContractAgreementAttachment.search.tableName,
              form
            ),
            dataIndex: 'date_added',
            key: 'date_added',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Original Name</span>,
        column: 'OriginalName',
        sorter: true,
        children: [
          {
            title: FilterBySwap('original_name', form),
            dataIndex: 'original_name',
            key: 'original_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">File Path</span>,
        column: 'File Path',
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
        title: <span className="dragHandler">FileName</span>,
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
    ];
  };

  const removeCmsContractAgreementAttachment = (id: number) => {
    dispatch(deleteCmsContractAgreementAttachment(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.CmsContractAgreementAttachment}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/cms/cms-contract-agreement-attachment/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.CmsContractAgreementAttachment}>
        <Popconfirm
          title="Delete Record?"
          onConfirm={() => removeCmsContractAgreementAttachment(data.id)}
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
        showAddButton={ability.can(Action.Add, Page.CmsContractAgreementAttachment)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={cmsContractAgreementAttachmentSelector}
        searchTableData={searchCmsContractAgreementAttachment}
        clearTableDataMessages={clearCmsContractAgreementAttachmentMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.CmsContractAgreementAttachment)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        globalSearchExist={false}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
