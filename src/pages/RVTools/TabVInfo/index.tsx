import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/app.hooks';
import React from 'react';
import GlobalSearch from '../../../common/components/globalSearch/GlobalSearch';
import { useHistory } from 'react-router-dom';
import { Row, Col, Button } from 'antd';
import { ITabVInfoProps } from './tabVInfo.model';
import { clearTabVInfo, tabVInfoSelector } from '../../../store/rvTools/tabVInfo/tabVInfo.reducer';
import AddTabVInfoModal from './AddTabVInfoModal';
import MainTable from './MainTable';
import { Can } from '../../../common/ability';
import { Action, Page } from '../../../common/constants/pageAction';
import BreadCrumbs from '../../../common/components/Breadcrumbs';
import DeleteDatasetModal from '../../../common/components/DeleteDatasetModal';

const TabVInfo: React.FC<ITabVInfoProps> = (props) => {
  const tabVInfo = useAppSelector(tabVInfoSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  const { id: urlId } = props.match?.params;

  const [addModalVisible, setAddModalVisible] = React.useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  const [id, setId] = React.useState(0);

  useEffect(() => {
    if (+urlId > 0) {
      setAddModalVisible(true);
      setId(+urlId);
    }
  }, [+urlId]);

  useEffect(() => {
    return () => {
      dispatch(clearTabVInfo());
    };
  }, []);

  const refreshDataTable = () => {
    dataTableRef?.current.refreshData();
  };

  return (
    <div className="sqlServer">
      <div className="title-block">
        <h4 className="p-0">
          <BreadCrumbs pageName={Page.TabVInfo} />
        </h4>
        <div className="right-title">
          <GlobalSearch />
        </div>
      </div>
      <div className="main-card">
        <div className="input-btns-title">
          <Row gutter={[10, 4]}>
            <Can I={Action.ImportToExcel} a={Page.TabVInfo}>
              <Col>
                <Button
                  className="btn-icon"
                  onClick={() =>
                    history.push(`/data-input/bulk-import/${tabVInfo.search.tableName}`)
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
                  Update from Excel
                </Button>
              </Col>
            </Can>
            <Can I={Action.DeleteData} a={Page.TabVInfo}>
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
          setSelectedId={(id) => {
            setId(id);
            setAddModalVisible(true);
          }}
        />
      </div>
      {addModalVisible && (
        <AddTabVInfoModal
          showModal={addModalVisible}
          handleModalClose={() => {
            setAddModalVisible(false);
            history.push('/rv-tools/tab-v-info');
          }}
          id={id}
          refreshDataTable={() => refreshDataTable()}
        />
      )}
      {deleteModalVisible && (
        <DeleteDatasetModal
          showModal={deleteModalVisible}
          handleModalClose={() => setDeleteModalVisible(false)}
          tableName={tabVInfo.search.tableName}
          refreshDataTable={() => refreshDataTable()}
        />
      )}
    </div>
  );
};

export default TabVInfo;