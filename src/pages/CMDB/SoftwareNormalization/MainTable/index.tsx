import { Popconfirm } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import { FilterWithSwapOption } from '../../../../common/components/DataTable/DataTableFilters';
import { IMainTable, ISearch } from '../../../../common/models/common';
import { useHistory } from 'react-router-dom';
import DataTable from '../../../../common/components/DataTable';
import ability, { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import {
  deleteCmdbSoftwareNormalization,
  searchCmdbSoftwareNormalization,
} from '../../../../store/cmdb/softwareNormalization/softwareNormalization.action';
import {
  clearCmdbSoftwareNormalizationMessages,
  cmdbSoftwareNormalizationSelector,
  setTableColumnSelection,
} from '../../../../store/cmdb/softwareNormalization/softwareNormalization.reducer';
import SoftwareNormalizationService from '../../../../services/cmdb/softwareNormalization/softwareNormalization.service';

const MainTable: React.ForwardRefRenderFunction<unknown, IMainTable> = (props, ref) => {
  const {
    setSelectedId,
    setShowSelectedListModal,
    setValuesForSelection,
    isMultiple,
    tableButtons,
  } = props;
  const cmdbSoftwareNormalization = useAppSelector(cmdbSoftwareNormalizationSelector);
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
    return SoftwareNormalizationService.exportExcelFile(searchData);
  };

  const FilterBySwap = (dataIndex: string, form) => {
    return FilterWithSwapOption(
      dataIndex,
      cmdbSoftwareNormalization.search.tableName,
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
        title: <span className="dragHandler">Software Title</span>,
        column: 'SoftwareTitle',
        sorter: true,
        children: [
          {
            title: FilterBySwap('software_title', form),
            dataIndex: 'software_title',
            key: 'software_title',
            ellipsis: true,
          },
        ],
      },
      {
        title: <span className="dragHandler">Licensable</span>,
        column: 'Licensable',
        sorter: true,
        children: [
          {
            title: FilterBySwap('licensable', form),
            dataIndex: 'licensable',
            key: 'licensable',
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
        title: <span className="dragHandler">Product</span>,
        column: 'Product',
        sorter: true,
        children: [
          {
            title: FilterBySwap('product', form),
            dataIndex: 'product',
            key: 'product',
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
    ];
  };

  const removeCmdbSoftwareNormalization = (id: number) => {
    dispatch(deleteCmdbSoftwareNormalization(id));
  };
  const tableAction = (_, data: any) => (
    <div className="btns-block">
      <Can I={Action.Update} a={Page.CmdbSoftwareNormalization}>
        <a
          className="action-btn"
          onClick={() => {
            setSelectedId(data.id);
            history.push(`/cmdb/cmdb-software-normalization/${data.id}`);
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
        </a>
      </Can>
      <Can I={Action.Delete} a={Page.CmdbSoftwareNormalization}>
        <Popconfirm
          title="Delete Record?"
          onConfirm={() => removeCmdbSoftwareNormalization(data.id)}
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
        showAddButton={ability.can(Action.Add, Page.CmdbSoftwareNormalization)}
        setSelectedId={setSelectedId}
        tableAction={tableAction}
        exportExcelFile={exportExcelFile}
        getTableColumns={getTableColumns}
        reduxSelector={cmdbSoftwareNormalizationSelector}
        searchTableData={searchCmdbSoftwareNormalization}
        clearTableDataMessages={clearCmdbSoftwareNormalizationMessages}
        setTableColumnSelection={setTableColumnSelection}
        setShowSelectedListModal={setShowSelectedListModal}
        setValuesForSelection={setValuesForSelection}
        showBulkUpdate={ability.can(Action.Update, Page.CmdbSoftwareNormalization)}
        setObjectForColumnFilter={setObjectForColumnFilter}
        globalSearchExist={false}
        tableButtons={tableButtons}
      />
    </>
  );
};

export default forwardRef(MainTable);
