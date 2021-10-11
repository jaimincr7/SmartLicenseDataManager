import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/app.hooks';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Col, Row } from 'antd';
import { Can } from '../../../common/ability';
import { Action, Page } from '../../../common/constants/pageAction';
import BreadCrumbs from '../../../common/components/Breadcrumbs';
import DeleteDatasetModal from '../../../common/components/DeleteDatasetModal';
import { IConfigurationProps } from './configuration.model';
import MainTable from './MainTable';
import AddConfigurationModal from './AddConfigurationModal';
import {
  clearConfiguration,
  configurationSelector,
} from '../../../store/powerBiReports/configuration/configuration.reducer';

const Configuration: React.FC<IConfigurationProps> = (props) => {
  const configuration = useAppSelector(configurationSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  const { id: urlId } = props.match?.params;

  const [addModalVisible, setAddModalVisible] = React.useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
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
      dispatch(clearConfiguration());
    };
  }, []);

  const refreshDataTable = () => {
    dataTableRef?.current.refreshData();
  };

  return (
    <div className="configuration">
      <div className="title-block">
        <h4 className="p-0">
          <BreadCrumbs pageName={Page.PowerBIConfig} />
        </h4>
      </div>
      <div className="main-card">
        <div className="input-btns-title">
          <Row gutter={[10, 4]}>
            <Can I={Action.ImportToExcel} a={Page.PowerBIConfig}>
              <Col>
                <Button
                  className="btn-icon"
                  onClick={() =>
                    history.push(
                      `/data-input/configurationlk-import/${configuration.search.tableName}`
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
            <Can I={Action.DeleteData} a={Page.PowerBIConfig}>
              <Col>
                <Button
                  className="btn-icon"
                  onClick={() => setDeleteModalVisible(true)}
                  icon={
                    <em className="anticon">
                      <img src={`${process.env.PUBLIC_URL}/assets/images/ic-delete.svg`} alt="" />
                    </em>
                  }
                >
                  Delete Dataset
                </Button>
              </Col>
            </Can>
          </Row>
        </div>
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
        />
      </div>
      {addModalVisible && (
        <AddConfigurationModal
          showModal={addModalVisible}
          isMultiple={false}
          handleModalClose={() => {
            setAddModalVisible(false);
            history.push('/power-bi-reports/config');
          }}
          id={id}
          refreshDataTable={() => refreshDataTable()}
        />
      )}
      {showSelectedListModal && (
        <AddConfigurationModal
          showModal={showSelectedListModal}
          valuesForSelection={valuesForSelection}
          isMultiple={true}
          handleModalClose={() => {
            setShowSelectedListModal(false);
            history.push('/power-bi-reports/config');
          }}
          id={id}
          refreshDataTable={() => refreshDataTable()}
        />
      )}
      {deleteModalVisible && (
        <DeleteDatasetModal
          showModal={deleteModalVisible}
          handleModalClose={() => setDeleteModalVisible(false)}
          tableName={configuration.search.tableName}
          refreshDataTable={() => refreshDataTable()}
        />
      )}
    </div>
  );
};

export default Configuration;
