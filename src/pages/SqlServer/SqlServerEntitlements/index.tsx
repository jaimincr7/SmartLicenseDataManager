import { useEffect, useRef } from 'react';
import { useAppDispatch } from '../../../store/app.hooks';
import { clearSqlServerEntitlements } from '../../../store/sqlServerEntitlements/sqlServerEntitlements.reducer';
// import './sqlServer.style.scss';
import React from 'react';
import DataTable from './components/DataTable';
import GlobalSearch from '../../../common/components/globalSearch/GlobalSearch';
import AddSqlServerEntitlementsModal from './AddSqlServerEntitlementsModal';
import { useHistory } from 'react-router-dom';
import { ISqlServerEntitlementsProps } from './sqlServerEntitlements.model';

const SqlServerEntitlements: React.FC<ISqlServerEntitlementsProps> = (props) => {
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
    <div className="homePage">
      <div className="title-block">
        <h4 className="p-0">Sql Server Entitlements</h4>
        <div className="right-title">
          <GlobalSearch />
        </div>
      </div>
      <div className="main-card">
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
