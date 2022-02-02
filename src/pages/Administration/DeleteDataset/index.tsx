import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/app.hooks';
import { IDeleteDatasetProps } from './deleteDataset.model';
import React from 'react';
import AddDeleteDatasetModal from './AddDeleteDatasetModal';
import { useHistory } from 'react-router-dom';
import MainTable from './MainTable';
import {
  deleteDatasetSelector,
  clearDeleteDataset,
} from '../../../store/master/deleteDataset/deleteDataset.reducer';
import { Button } from 'antd';
import { Can } from '../../../common/ability';
import { Action, Page } from '../../../common/constants/pageAction';
import BreadCrumbs from '../../../common/components/Breadcrumbs';

const DeleteDataset: React.FC<IDeleteDatasetProps> = (props) => {
  const deleteDataset = useAppSelector(deleteDatasetSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  const { id: urlId } = props.match?.params;

  const [addModalVisible, setAddModalVisible] = React.useState(false);
  const [id, setId] = React.useState(0);
  const [showSelectedListModal, setShowSelectedListModal] = React.useState(false);
  const [valuesForSelection, setValuesForSelection] = React.useState(null);

  useEffect(() => {
    if (+urlId > 0) {
      setAddModalVisible(true);
      setId(+urlId);
    }
  }, [+urlId]);

  useEffect(() => {
    setShowSelectedListModal(false);
    return () => {
      dispatch(clearDeleteDataset());
    };
  }, []);

  const refreshDataTable = () => {
    dataTableRef?.current.refreshData();
  };

  const tableButtons = () => (
    <>
      <Can I={Action.ImportToExcel} a={Page.DeleteDataset}>
        <Button
          className="btn-icon"
          onClick={() =>
            history.push(
              `/data-input/bulk-import/${encodeURIComponent(deleteDataset.search.tableName)}`
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
    </>
  );

  return (
    <div className="deleteDataset">
      <div className="title-block">
        <h4 className="p-0">
          <BreadCrumbs pageName={Page.DeleteDataset} />
        </h4>
      </div>
      <div className="main-card">
        {/* <div className="input-btns-title">
          <Row gutter={[10, 4]}>
            <Can I={Action.ImportToExcel} a={Page.DeleteDataset}>
              <Col>
                <Button
                  className="btn-icon"
                  onClick={() =>
                    history.push(
                      `/data-input/bulk-import/${encodeURIComponent(deleteDataset.search.tableName)}`
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
              </Col>
            </Can>
          </Row>
        </div> */}
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
        <AddDeleteDatasetModal
          showModal={addModalVisible}
          isMultiple={false}
          handleModalClose={() => {
            setAddModalVisible(false);
            history.push('/administration/config-delete-data-set');
          }}
          id={id}
          refreshDataTable={() => refreshDataTable()}
        />
      )}
      {showSelectedListModal && (
        <AddDeleteDatasetModal
          showModal={showSelectedListModal}
          valuesForSelection={valuesForSelection}
          isMultiple={true}
          handleModalClose={() => {
            setShowSelectedListModal(false);
            history.push('/administration/config-delete-data-set');
          }}
          id={id}
          refreshDataTable={() => refreshDataTable()}
        />
      )}
    </div>
  );
};

export default DeleteDataset;
