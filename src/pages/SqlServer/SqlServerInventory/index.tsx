import { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../../../store/app.hooks';
import {
  clearSqlServerInventory,
  sqlServerInventorySelector,
} from '../../../store/sqlServer/sqlServerInventory/sqlServerInventory.reducer';
import { ISqlServerInventoryProps } from './sqlServerInventory.model';
import React from 'react';
import GlobalSearch from '../../../common/components/globalSearch/GlobalSearch';
import AddSqlServerInventoryModal from './AddSqlServerInventoryModal';
import { useHistory } from 'react-router-dom';
import { Row, Col, Button } from 'antd';
import ProcessDataModal from './ProcessDataModal';
import DeleteDatasetModal from '../../../common/components/DeleteDatasetModal';
import MainTable from './MainTable';
import { Can } from '../../../common/ability';
import { Action, Page } from '../../../common/constants/pageAction';
import BreadCrumbs from '../../../common/components/Breadcrumbs';

const SqlServerInventory: React.FC<ISqlServerInventoryProps> = (props) => {
  const sqlServerInventory = useAppSelector(sqlServerInventorySelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  const { id: urlId } = props.match?.params;

  const [addModalVisible, setAddModalVisible] = React.useState(false);
  const [processModalVisible, setProcessModalVisible] = React.useState(false);
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
      dispatch(clearSqlServerInventory());
    };
  }, []);

  const refreshDataTable = () => {
    dataTableRef?.current.refreshData();
  };

  return (
    <div className="sqlServer">
      <div className="title-block">
        <BreadCrumbs pageName={Page.SqlServerInventory} />
        <div className="right-title">
          <GlobalSearch />
        </div>
      </div>
      <div className="main-card">
        <div className="input-btns-title">
          <Row gutter={[10, 4]}>
            <Can I={Action.ProcessData} a={Page.SqlServerInventory}>
              <Col>
                <Button
                  className="btn-icon"
                  onClick={() => setProcessModalVisible(true)}
                  icon={
                    <em className="anticon">
                      <img
                        src={`${process.env.PUBLIC_URL}/assets/images/ic-process-data.svg`}
                        alt=""
                      />
                    </em>
                  }
                >
                  Process Data
                </Button>
              </Col>
            </Can>
            <Can I={Action.ImportToExcel} a={Page.SqlServerInventory}>
              <Col>
                <Button
                  className="btn-icon"
                  onClick={() =>
                    history.push(`/data-input/bulk-import/${sqlServerInventory.search.tableName}`)
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
            <Can I={Action.DeleteData} a={Page.SqlServerInventory}>
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
        <AddSqlServerInventoryModal
          showModal={addModalVisible}
          handleModalClose={() => {
            setAddModalVisible(false);
            history.push('/sql-server/inventory');
          }}
          id={id}
          refreshDataTable={() => refreshDataTable()}
        />
      )}
      {processModalVisible && (
        <ProcessDataModal
          showModal={processModalVisible}
          handleModalClose={() => setProcessModalVisible(false)}
        />
      )}
      {deleteModalVisible && (
        <DeleteDatasetModal
          showModal={deleteModalVisible}
          handleModalClose={() => setDeleteModalVisible(false)}
          tableName={sqlServerInventory.search.tableName}
          refreshDataTable={() => refreshDataTable()}
        />
      )}
    </div>
  );
};

export default SqlServerInventory;
