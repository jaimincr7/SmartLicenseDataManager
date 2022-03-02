import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/app.hooks';
import React from 'react';
import GlobalSearch from '../../../common/components/globalSearch/GlobalSearch';
import { useHistory } from 'react-router-dom';
import { Button } from 'antd';
import { IWindowsServerLicenseProps } from './windowsServerLicense.model';
import {
  clearWindowsServerLicense,
  windowsServerLicenseSelector,
} from '../../../store/windowsServer/windowsServerLicense/windowsServerLicense.reducer';
import AddWindowsServerLicenseModal from './AddWindowsServerLicenseModal';
import ReRunAllScenariosModal from './ReRunAllScenariosModal';
import MainTable from './MainTable';
import { Can } from '../../../common/ability';
import { Action, Page } from '../../../common/constants/pageAction';
import BreadCrumbs from '../../../common/components/Breadcrumbs';
import DeleteDatasetModal from '../../../common/components/DeleteDatasetModal';

const WindowsServerLicense: React.FC<IWindowsServerLicenseProps> = (props) => {
  const license = useAppSelector(windowsServerLicenseSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  const { id: urlId } = props.match?.params;

  const [addModalVisible, setAddModalVisible] = React.useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  const [runAllScenariosModalVisible, setRunAllScenariosModalVisible] = React.useState(false);
  const [showSelectedListModal, setShowSelectedListModal] = React.useState(false);
  const [filterKeys, setFilterKeys] = React.useState({});
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
      dispatch(clearWindowsServerLicense());
    };
  }, []);

  const refreshDataTable = () => {
    dataTableRef?.current.refreshData();
  };

  const tableButtons = () => (
    <>
      <Can I={Action.Add} a={Page.WindowsServerLicense}>
        <Button
          onClick={() => {
            setId(0);
            setAddModalVisible(true);
          }}
          icon={
            <em className="anticon">
              <img src={`${process.env.PUBLIC_URL}/assets/images/ic-run-license.svg`} alt="" />
            </em>
          }
        >
          Run License Scenario
        </Button>
      </Can>
      <Can I={Action.RunAllLicenseScenario} a={Page.WindowsServerLicense}>
        <Button
          disabled={license.search.loading}
          onClick={() => {
            setRunAllScenariosModalVisible(true);
          }}
          icon={
            <em className="anticon">
              <img src={`${process.env.PUBLIC_URL}/assets/images/ic-re-run-license.svg`} alt="" />
            </em>
          }
        >
          Re-Run All License Scenarios
        </Button>
      </Can>
      <Can I={Action.DeleteData} a={Page.WindowsServerLicense}>
        <Button
          className="btn-icon mr-1"
          onClick={() => setDeleteModalVisible(true)}
          disabled={license.search.loading}
          icon={
            <em className="anticon">
              <img src={`${process.env.PUBLIC_URL}/assets/images/ic-delete.svg`} alt="" />
            </em>
          }
        >
          Delete Dataset
        </Button>
      </Can>
    </>
  );

  return (
    <div className="windowsServer">
      <div className="title-block">
        <h4 className="p-0">
          <BreadCrumbs pageName={Page.WindowsServerLicense} />
        </h4>
        <div className="right-title">
          <GlobalSearch />
        </div>
      </div>
      <div className="main-card">
        {/* <div className="input-btns-title">
          <Row gutter={[10, 4]}>
            <Can I={Action.Add} a={Page.WindowsServerLicense}>
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
            <Can I={Action.RunAllLicenseScenario} a={Page.WindowsServerLicense}>
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
          setFilterKeys={setFilterKeys}
          tableButtons={tableButtons}
        />
      </div>
      {addModalVisible && (
        <AddWindowsServerLicenseModal
          showModal={addModalVisible}
          isMultiple={false}
          handleModalClose={() => {
            setAddModalVisible(false);
            history.push('/windows-server/license');
          }}
          filterKeys={filterKeys}
          id={id}
          refreshDataTable={() => refreshDataTable()}
          tableName={license.search.tableName}
        />
      )}
      {showSelectedListModal && (
        <AddWindowsServerLicenseModal
          showModal={showSelectedListModal}
          valuesForSelection={valuesForSelection}
          isMultiple={true}
          handleModalClose={() => {
            setShowSelectedListModal(false);
            history.push('/windows-server/license');
          }}
          id={id}
          refreshDataTable={() => refreshDataTable()}
        />
      )}
      {deleteModalVisible && (
        <DeleteDatasetModal
          showModal={deleteModalVisible}
          handleModalClose={() => setDeleteModalVisible(false)}
          tableName={license.search.tableName}
          refreshDataTable={() => refreshDataTable()}
          filterKeys={filterKeys}
        />
      )}
      {runAllScenariosModalVisible && (
        <ReRunAllScenariosModal
          showModal={runAllScenariosModalVisible}
          filterKeys={filterKeys}
          handleModalClose={() => setRunAllScenariosModalVisible(false)}
        />
      )}
    </div>
  );
};

export default WindowsServerLicense;
