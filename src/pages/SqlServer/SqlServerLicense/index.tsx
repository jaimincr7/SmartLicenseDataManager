import { useEffect, useRef } from 'react';
import { useAppDispatch } from '../../../store/app.hooks';
import React from 'react';
import GlobalSearch from '../../../common/components/globalSearch/GlobalSearch';
import { useHistory } from 'react-router-dom';
import { Row, Col, Button } from 'antd';
import { ISqlServerLicenseProps } from './sqlServerLicense.model';
import { clearSqlServerLicense } from '../../../store/sqlServer/sqlServerLicense/sqlServerLicense.reducer';
import AddSqlServerLicenseModal from './AddSqlServerLicenseModal';
import ReRunAllScenariosModal from './ReRunAllScenariosModal';
import MainTable from './MainTable';
import { Can } from '../../../common/ability';
import { Action, Page } from '../../../common/constants/pageAction';
import BreadCrumbs from '../../../common/components/Breadcrumbs';

const SqlServerLicense: React.FC<ISqlServerLicenseProps> = (props) => {
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  const { id: urlId } = props.match?.params;

  const [addModalVisible, setAddModalVisible] = React.useState(false);
  const [runAllScenariosModalVisible, setRunAllScenariosModalVisible] = React.useState(false);

  const [id, setId] = React.useState(0);

  useEffect(() => {
    if (+urlId > 0) {
      setAddModalVisible(true);
      setId(+urlId);
    }
  }, [+urlId]);

  useEffect(() => {
    return () => {
      dispatch(clearSqlServerLicense());
    };
  }, []);

  const refreshDataTable = () => {
    dataTableRef?.current.refreshData();
  };

  return (
    <div className="sqlServer">
      <div className="title-block">
        <h4 className="p-0">
          <BreadCrumbs pageName={Page.SqlServerLicense} />
        </h4>
        <div className="right-title">
          <GlobalSearch />
        </div>
      </div>
      <div className="main-card">
        <div className="input-btns-title">
          <Row gutter={[10, 4]}>
            <Can I={Action.Add} a={Page.SqlServerLicense}>
              <Col>
                <Button
                  onClick={() => {
                    setId(0);
                    setAddModalVisible(true);
                  }}
                  icon={
                    <em className="anticon">
                      <img
                        src={`${process.env.PUBLIC_URL}/assets/images/ic-run-license.svg`}
                        alt=""
                      />
                    </em>
                  }
                >
                  Run License Scenario
                </Button>
              </Col>
            </Can>
            <Can I={Action.RunAllLicenseScenario} a={Page.SqlServerLicense}>
              <Col>
                <Button
                  onClick={() => {
                    setRunAllScenariosModalVisible(true);
                  }}
                  icon={
                    <em className="anticon">
                      <img
                        src={`${process.env.PUBLIC_URL}/assets/images/ic-re-run-license.svg`}
                        alt=""
                      />
                    </em>
                  }
                >
                  Re-Run All License Scenarios
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
        <AddSqlServerLicenseModal
          showModal={addModalVisible}
          handleModalClose={() => {
            setAddModalVisible(false);
            history.push('/sql-server/license');
          }}
          id={id}
          refreshDataTable={() => refreshDataTable()}
        />
      )}
      {runAllScenariosModalVisible && (
        <ReRunAllScenariosModal
          showModal={runAllScenariosModalVisible}
          handleModalClose={() => setRunAllScenariosModalVisible(false)}
        />
      )}
    </div>
  );
};

export default SqlServerLicense;
