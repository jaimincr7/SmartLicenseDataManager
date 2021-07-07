import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/app.hooks';
import {
  clearSqlServerEntitlements,
  sqlServerEntitlementsSelector,
} from '../../../store/sqlServerEntitlements/sqlServerEntitlements.reducer';
import React from 'react';
import DataTable from './components/DataTable';
import GlobalSearch from '../../../common/components/globalSearch/GlobalSearch';
import AddSqlServerEntitlementsModal from './AddSqlServerEntitlementsModal';
import { useHistory } from 'react-router-dom';
import { ISqlServerEntitlementsProps } from './sqlServerEntitlements.model';
import { Button, Col, Row } from 'antd';

const SqlServerEntitlements: React.FC<ISqlServerEntitlementsProps> = (props) => {
  const sqlServerEntitlements = useAppSelector(sqlServerEntitlementsSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  const { id: urlId } = props.match?.params;

  const [addModalVisible, setAddModalVisible] = React.useState(false);
  const [id, setId] = React.useState(0);

  useEffect(() => {
    if (+urlId > 0) {
      setAddModalVisible(true);
      setId(+urlId);
    }
  }, [+urlId]);

  useEffect(() => {
    return () => {
      dispatch(clearSqlServerEntitlements());
    };
  }, []);

  const refreshDataTable = () => {
    dataTableRef?.current.refreshData();
  };

  return (
    <div className="sqlServer">
      <div className="title-block">
        <h4 className="p-0">Sql Server Entitlements</h4>
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
                onClick={() =>
                  history.push(`/data-input/bulk-import/${sqlServerEntitlements.search.tableName}`)
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
        <AddSqlServerEntitlementsModal
          showModal={addModalVisible}
          handleModalClose={() => {
            setAddModalVisible(false);
            history.push('/sql-server/entitlements');
          }}
          id={id}
          refreshDataTable={() => refreshDataTable()}
        />
      )}
    </div>
  );
};

export default SqlServerEntitlements;
