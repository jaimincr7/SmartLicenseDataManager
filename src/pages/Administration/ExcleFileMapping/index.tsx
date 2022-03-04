import { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../../../store/app.hooks';
import React from 'react';
import GlobalSearch from '../../../common/components/globalSearch/GlobalSearch';
import { useHistory } from 'react-router-dom';
import { Button } from 'antd';
import { IExcelFileMappingProps } from './excelFileMapping.model';
import {
  excelFileMappingSelector,
  clearExcelFileMapping,
} from '../../../store/master/excelFileMapping/excelFileMapping.reducer';
import AddExcelFileMappingModal from './AddExcelFileMappingModal';
import MainTable from './MainTable';
import { Can } from '../../../common/ability';
import { Action, Page } from '../../../common/constants/pageAction';
import BreadCrumbs from '../../../common/components/Breadcrumbs';
import DeleteDatasetModal from '../../../common/components/DeleteDatasetModal';

const ExcelFileMapping: React.FC<IExcelFileMappingProps> = (props) => {
  const excelFileMapping = useAppSelector(excelFileMappingSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  const { id: urlId } = props.match?.params;

  const [addModalVisible, setAddModalVisible] = React.useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  const [showSelectedListModal, setShowSelectedListModal] = React.useState(false);
  const [valuesForSelection, setValuesForSelection] = React.useState(null);

  const [id, setId] = React.useState(0);

  useEffect(() => {
    if (+urlId > 0) {
      setAddModalVisible(true);
      setId(+urlId);
    }
  }, [+urlId]);

  useEffect(() => {
    setShowSelectedListModal(false);
    return () => {
      dispatch(clearExcelFileMapping());
    };
  }, []);

  const refreshDataTable = () => {
    dataTableRef?.current.refreshData();
  };

  const tableButtons = () => (
    <>
      <Can I={Action.ImportToExcel} a={Page.ExcelFileMapping}>
        <Button
          className="btn-icon"
          onClick={() =>
            history.push(
              `/data-input/bulk-import/${encodeURIComponent(excelFileMapping.search.tableName)}`
            )
          }
          icon={
            <em className="anticon">
              <img
                src={`${process.env.PUBLIC_URL}/assets/images/ic-file-excel-outlined.svg`}
                alt=""
              />
            </em>
          }
        >
          Import
        </Button>
      </Can>
      <Can I={Action.DeleteData} a={Page.ExcelFileMapping}>
        <Button
          className="btn-icon mr-1"
          onClick={() => setDeleteModalVisible(true)}
          disabled={excelFileMapping.search.loading}
          icon={
            <em className="anticon">
              <img src={`${process.env.PUBLIC_URL}/assets/images/ic-delete.svg`} alt="" />
            </em>
          }
        >
          Delete Dataset
        </Button>
      </Can>
    </>
  );

  return (
    <div className="ad">
      <div className="title-block">
        <h4 className="p-0">
          <BreadCrumbs pageName={Page.ExcelFileMapping} />
        </h4>
        <div className="right-title">
          <GlobalSearch />
        </div>
      </div>
      <div className="main-card">
        <MainTable
          ref={dataTableRef}
          isMultiple={showSelectedListModal}
          setValuesForSelection={setValuesForSelection}
          setShowSelectedListModal={(state) => {
            setId(0);
            setShowSelectedListModal(state);
          }}
          setSelectedId={(id) => {
            setId(id);
            setAddModalVisible(true);
          }}
          tableButtons={tableButtons}
        />
      </div>
      {addModalVisible && (
        <AddExcelFileMappingModal
          showModal={addModalVisible}
          isMultiple={false}
          handleModalClose={() => {
            setAddModalVisible(false);
            history.push('/sql-server/exclusions');
          }}
          id={id}
          refreshDataTable={() => refreshDataTable()}
        />
      )}
      {showSelectedListModal && (
        <AddExcelFileMappingModal
          showModal={showSelectedListModal}
          valuesForSelection={valuesForSelection}
          isMultiple={true}
          handleModalClose={() => {
            setShowSelectedListModal(false);
            history.push('/sql-server/exclusions');
          }}
          id={id}
          refreshDataTable={() => refreshDataTable()}
        />
      )}
      {deleteModalVisible && (
        <DeleteDatasetModal
          showModal={deleteModalVisible}
          handleModalClose={() => setDeleteModalVisible(false)}
          tableName={excelFileMapping.search.tableName}
          refreshDataTable={() => refreshDataTable()}
          isDateAvailable={excelFileMapping.search.data.some((item) => item['date_added'])}
        />
      )}
    </div>
  );
};

export default ExcelFileMapping;
