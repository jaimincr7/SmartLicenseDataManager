import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/app.hooks';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { IApiColMappingProps } from './apiColMapping.model';
import { Button, Col, Row } from 'antd';
import MainTable from './MainTable';
import { Can } from '../../../common/ability';
import { Action, Page } from '../../../common/constants/pageAction';
import BreadCrumbs from '../../../common/components/Breadcrumbs';
import DeleteDatasetModal from '../../../common/components/DeleteDatasetModal';
import {
  apiColumnMappingSelector,
  clearApiColMapping,
} from '../../../store/sps/apiColumnMapping/apiColMapping.reducer';

const APIColumnMappings: React.FC<IApiColMappingProps> = () => {
  const apiColMap = useAppSelector(apiColumnMappingSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);

  useEffect(() => {
    return () => {
      dispatch(clearApiColMapping());
    };
  }, []);

  const refreshDataTable = () => {
    dataTableRef?.current.refreshData();
  };

  return (
    <div className="sqlServer">
      <div className="title-block">
        <h4 className="p-0">
          <BreadCrumbs pageName={Page.ConfigSPSColMapping} />
        </h4>
        {/* <div className="right-title">
          <GlobalSearch />
        </div> */}
      </div>
      <div className="main-card">
        <div className="input-btns-title">
          <Row gutter={[10, 4]}>
            <Can I={Action.ImportToExcel} a={Page.ConfigSPSColMapping}>
              <Col>
                <Button
                  className="btn-icon"
                  onClick={() =>
                    history.push(`/data-input/bulk-import/${apiColMap.search.tableName}`)
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
            <Can I={Action.DeleteData} a={Page.ConfigSPSColMapping}>
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
            id === 0
              ? history.push('/administration/config-sps-api-column-mapping/add')
              : history.push(`/administration/config-sps-api-column-mapping/add/${id}`);
          }}
        />
      </div>
      {deleteModalVisible && (
        <DeleteDatasetModal
          showModal={deleteModalVisible}
          handleModalClose={() => setDeleteModalVisible(false)}
          tableName={apiColMap.search.tableName}
          refreshDataTable={() => refreshDataTable()}
        />
      )}
    </div>
  );
};

export default APIColumnMappings;
