import { Popconfirm } from 'antd';
import _ from 'lodash';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  FilterByDateSwap,
  FilterByDropdown,
  FilterWithSwapOption,
} from '../../../../common/components/DataTable/DataTableFilters';
import { IMainTable, ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import DataTable from '../../../../common/components/DataTable';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import contractAgreementService from '../../../../services/cms/contractAgreement/contractAgreement.service';
import {
  clearCmsContractAgreementMessages,
  cmsContractAgreementSelector,
  setTableColumnSelection,
} from '../../../../store/cms/contractAgreement/contractAgreement.reducer';
import {
  deleteCmsContractAgreement,
  searchCmsContractAgreement,
} from '../../../../store/cms/contractAgreement/contractAgreement.action';
import { globalSearchSelector } from '../../../../store/globalSearch/globalSearch.reducer';
import { showDateFromApi } from '../../../../common/helperFunction';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const {
    setSelectedId,
    setShowSelectedListModal,
    setValuesForSelection,
    isMultiple,
    tableButtons,
  } = props;
  const cmsContractAgreement = useAppSelector(cmsContractAgreementSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();
  const globalFilters = useAppSelector(globalSearchSelector);
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
    return contractAgreementService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(
      dataIndex,
      cmsContractAgreement.search.tableName,
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
        title: <span className="dragHandler">Tenant Name</span>,
        column: 'TenantId',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'tenant_id',
              cmsContractAgreement.search.lookups?.tenants?.length > 0
                ? cmsContractAgreement.search.lookups?.tenants
                : globalFilters?.globalTenantLookup?.data
            ),
            dataIndex: 'tenant_name',
            key: 'tenant_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Company Name</span>,
        column: 'CompanyId',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'company_id',
              cmsContractAgreement.search.lookups?.companies?.length > 0
                ? cmsContractAgreement.search.lookups?.companies
                : globalFilters?.globalCompanyLookup?.data
            ),
            dataIndex: 'company_name',
            key: 'company_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Bu Name</span>,
        column: 'BU_Id',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'bu_id',
              cmsContractAgreement.search.lookups?.bus?.length > 0
                ? cmsContractAgreement.search.lookups?.bus
                : globalFilters?.globalBULookup?.data
            ),
            dataIndex: 'bu_name',
            key: 'bu_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Contractual Owner Contact</span>,
        column: 'Contractual Owner Contact ID',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'contractual_owner_contact_id',
              cmsContractAgreement.search.lookups?.cms_contacts
            ),
            dataIndex: 'cms_contact_name',
            key: 'cms_contact_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Trigger Type</span>,
        column: 'Trigger Type ID',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'trigger_type_id',
              cmsContractAgreement.search.lookups?.cms_trigger_types
            ),
            dataIndex: 'cms_trigger_type_name',
            key: 'cms_trigger_type_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Vendor</span>,
        column: 'Vendor ID',
        sorter: true,
        children: [
          {
            title: FilterByDropdown('vendor_id', cmsContractAgreement.search.lookups?.cms_vendors),
            dataIndex: 'cms_vendor_name',
            key: 'cms_vendor_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Publisher</span>,
        column: 'Publisher ID',
        sorter: true,
        children: [
          {
            title: FilterByDropdown(
              'publisher_id',
              cmsContractAgreement.search.lookups?.cms_publishers
            ),
            dataIndex: 'cms_publisher_name',
            key: 'cms_publisher_name',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Start Date</span>,
        column: 'Start Date',
        sorter: true,
        children: [
          {
            title: FilterByDateSwapTable('start_date', cmsContractAgreement.search.tableName, form),
            dataIndex: 'start_date',
            key: 'start_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">End Date</span>,
        column: 'End Date',
        sorter: true,
        children: [
          {
            title: FilterByDateSwapTable('end_date', cmsContractAgreement.search.tableName, form),
            dataIndex: 'end_date',
            key: 'end_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Transaction Date</span>,
        column: 'Transaction Date',
        sorter: true,
        children: [
          {
            title: FilterByDateSwapTable(
              'transaction_date',
              cmsContractAgreement.search.tableName,
              form
            ),
            dataIndex: 'transaction_date',
            key: 'transaction_date',
            ellipsis: true,
            render: (date: Date) => (!_.isNull(date) ? showDateFromApi(date) : ''),
          },
        ],
      },
      {
        title: <span className="dragHandler">Contract Number</span>,
        column: 'Contract Number',
        sorter: true,
        children: [
          {
            title: FilterBySwap('contract_number', form),
            dataIndex: 'contract_number',
            key: 'contract_number',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Contract Name</span>,
        column: 'Contract Name',
        sorter: true,
        children: [
          {
            title: FilterBySwap('contract_name', form),
            dataIndex: 'contract_name',
            key: 'contract_name',
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
    ];
  };

  const removeCmsContractAgreement = (id: number) => {
    dispatch(deleteCmsContractAgreement(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.CmsContractAgreement}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/cms/cms-contract-agreement/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.CmsContractAgreement}>
        <Popconfirm title="Delete Record?" onConfirm={() => removeCmsContractAgreement(data.id)}>
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
        showAddButton={ability.can(Action.Add, Page.CmsContractAgreement)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={cmsContractAgreementSelector}
        searchTableData={searchCmsContractAgreement}
        clearTableDataMessages={clearCmsContractAgreementMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.CmsContractAgreement)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
