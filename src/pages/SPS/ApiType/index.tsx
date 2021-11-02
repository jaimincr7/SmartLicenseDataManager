import { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../../../store/app.hooks';
import { ISpsApiTypeProps } from './apiType.model';
import React from 'react';
import MainTable from './MainTable/index';
import { useHistory } from 'react-router-dom';
import { Button } from 'antd';
import DeleteDatasetModal from '../../../common/components/DeleteDatasetModal';
import { Can } from '../../../common/ability';
import { Action, Page } from '../../../common/constants/pageAction';
import BreadCrumbs from '../../../common/components/Breadcrumbs';
import AddSpsApiTypeModal from './AddApiTypeModal';
import { clearSpsApiType, spsApiTypeSelector } from '../../../store/sps/apiType/apiType.reducer';

const SpsApiType: React.FC<ISpsApiTypeProps> = (props) => {
  const spsApiType = useAppSelector(spsApiTypeSelector);
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
      dispatch(clearSpsApiType());
    };
  }, []);

  const refreshDataTable = () => {
    dataTableRef?.current.refreshData();
  };

  const tableButtons = () => (
    <>
    <Can I={Action.ImportToExcel} a={Page.SpsApiType}>
        <Button
          className="btn-icon"
          onClick={() =>
            history.push(
              `/data-input/bulk-import/${encodeURIComponent(
                spsApiType.search.tableName
              )}`
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
    <div className="sqlServer">
      <div className="title-block">
        <h4 className="p-0">
          <BreadCrumbs pageName={Page.SpsApiType} />
        </h4>
      </div>
      <div className="main-card">
        {/* <div className="input-btns-title">
          <Row gutter={[10, 4]}>
            <Can I={Action.ImportToExcel} a={Page.SpsApiType}>
              <Col>
                <Button
                  className="btn-icon"
                  onClick={() =>
                    history.push(
                      `/data-input/bulk-import/${encodeURIComponent(spsApiType.search.tableName)}`
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
        <AddSpsApiTypeModal
          showModal={addModalVisible}
          isMultiple={false}
          handleModalClose={() => {
            setAddModalVisible(false);
            history.push('/sps/sps-api-type');
          }}
          id={id}
          refreshDataTable={() => refreshDataTable()}
        />
      )}
      {showSelectedListModal && (
        <AddSpsApiTypeModal
          showModal={showSelectedListModal}
          valuesForSelection={valuesForSelection}
          isMultiple={true}
          handleModalClose={() => {
            setShowSelectedListModal(false);
            history.push('/sps/sps-api-type');
          }}
          id={id}
          refreshDataTable={() => refreshDataTable()}
        />
      )}
      {deleteModalVisible && (
        <DeleteDatasetModal
          showModal={deleteModalVisible}
          handleModalClose={() => setDeleteModalVisible(false)}
          tableName={spsApiType.search.tableName}
          refreshDataTable={() => refreshDataTable()}
        />
      )}
    </div>
  );
};

export default SpsApiType;
