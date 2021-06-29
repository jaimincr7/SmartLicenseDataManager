import { useEffect, useRef } from 'react';
import { useAppDispatch } from '../../../store/app.hooks';
import { clearSqlServer } from '../../../store/sqlServer/sqlServer.reducer';
import { ISqlServerProps } from './sqlServer.model';
import './sqlServer.style.scss';
import React from 'react';
import DataTable from './components/DataTable';
import GlobalSearch from '../../../common/components/globalSearch/GlobalSearch';
import AddSqlServerModal from './AddSqlServer';
import { useHistory } from 'react-router-dom';
import { Row, Col, Button } from 'antd';
import ProcessDataModal from './ProcessDataModal';
import DeleteDatasetModal from './DeleteDatasetModal';
import { DeleteOutlined, FileExcelOutlined, RadiusSettingOutlined } from '@ant-design/icons';

const SqlServer: React.FC<ISqlServerProps> = (props) => {
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
      dispatch(clearSqlServer());
    };
  }, []);

  const refreshDataTable = () => {
    dataTableRef?.current.refreshData();
  };

  return (
    <div className="sqlServer">
      <div className="title-block">
        <h4 className="p-0">Sql Server</h4>
        <div className="right-title">
          <GlobalSearch />
        </div>
      </div>
      <div className="main-card">
        <div className="input-btns-title">
          <Row gutter={[30, 15]}>
            <Col xs={24} md={24} lg={6}>
              <div className="btns-block">
                <Button
                  onClick={() => setProcessModalVisible(true)}
                  icon={<RadiusSettingOutlined />}
                >
                  Process Data
                </Button>
                <Button
                  onClick={() => history.push('/sql-server/update-from-excel')}
                  icon={<FileExcelOutlined />}
                >
                  Update from Excel
                </Button>
                <Button onClick={() => setDeleteModalVisible(true)} icon={<DeleteOutlined />}>
                  Delete Dataset
                </Button>
              </div>
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
        <AddSqlServerModal
          showModal={addModalVisible}
          handleModalClose={() => {
            setAddModalVisible(false);
            history.push('/sql-server');
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
        />
      )}
    </div>
  );
};

export default SqlServer;
