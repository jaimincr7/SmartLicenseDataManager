import { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../../../store/app.hooks';
import {
  clearSqlServerInventory,
  sqlServerInventorySelector,
} from '../../../store/sqlServer/sqlServerInventory/sqlServerInventory.reducer';
import { ISqlServerInventoryProps } from './sqlServerInventory.model';
import React from 'react';
import DataTable from './components/DataTable';
import GlobalSearch from '../../../common/components/globalSearch/GlobalSearch';
import AddSqlServerInventoryModal from './AddSqlServerInventoryModal';
import { useHistory } from 'react-router-dom';
import { Row, Col, Button } from 'antd';
import ProcessDataModal from './ProcessDataModal';
import DeleteDatasetModal from '../../../common/components/DeleteDatasetModal';

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
        <h4 className="p-0">Sql Server Inventory</h4>
        <div className="right-title">
          <GlobalSearch />
        </div>
      </div>
      <div className="main-card">
        <div className="input-btns-title">
          <Row gutter={[10, 4]}>
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
          </Row>
        </div>
        <DataTable
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