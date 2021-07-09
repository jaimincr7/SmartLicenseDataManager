import { useEffect, useRef } from 'react';
import { useAppDispatch } from '../../../store/app.hooks';
import React from 'react';
import GlobalSearch from '../../../common/components/globalSearch/GlobalSearch';
import { useHistory } from 'react-router-dom';
import { Row, Col, Button } from 'antd';
import { IWindowsServerLicenseProps } from './windowsServerLicense.model';
import { clearWindowsServerLicense } from '../../../store/windowsServer/windowsServerLicense/windowsServerLicense.reducer';
import AddWindowsServerLicenseModal from './AddWindowsServerLicenseModal';
import ReRunAllScenariosModal from './ReRunAllScenariosModal';
import MainTable from './MainTable';

const WindowsServerLicense: React.FC<IWindowsServerLicenseProps> = (props) => {
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
      dispatch(clearWindowsServerLicense());
    };
  }, []);

  const refreshDataTable = () => {
    dataTableRef?.current.refreshData();
  };

  return (
    <div className="windowsServer">
      <div className="title-block">
        <h4 className="p-0">Windows Server License</h4>
        <div className="right-title">
          <GlobalSearch />
        </div>
      </div>
      <div className="main-card">
        <div className="input-btns-title">
          <Row gutter={[10, 4]}>
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
        <AddWindowsServerLicenseModal
          showModal={addModalVisible}
          handleModalClose={() => {
            setAddModalVisible(false);
            history.push('/windows-server/license');
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

export default WindowsServerLicense;
