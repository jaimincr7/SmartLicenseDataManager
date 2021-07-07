import { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../../../store/app.hooks';
import { IAdDevicesProps } from './adDevices.model';
import React from 'react';
import DataTable from './components/DataTable';
import GlobalSearch from '../../../common/components/globalSearch/GlobalSearch';
import { useHistory } from 'react-router-dom';
import { Row, Col, Button } from 'antd';
import AddAdDeviceModal from './AddAdDeviceModal';
import ProcessDataModal from './ProcessDataModal';
import { adDevicesSelector, clearAdDevices } from '../../../store/adDevices/adDevices.reducer';

const AdDevices: React.FC<IAdDevicesProps> = (props) => {
  const adDevices = useAppSelector(adDevicesSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  const { id: urlId } = props.match?.params;

  const [addModalVisible, setAddModalVisible] = React.useState(false);
  const [processModalVisible, setProcessModalVisible] = React.useState(false);

  const [id, setId] = React.useState(0);

  useEffect(() => {
    if (+urlId > 0) {
      setAddModalVisible(true);
      setId(+urlId);
    }
  }, [+urlId]);

  useEffect(() => {
    return () => {
      dispatch(clearAdDevices());
    };
  }, []);

  const refreshDataTable = () => {
    dataTableRef?.current.refreshData();
  };

  return (
    <div className="ad">
      <div className="title-block">
        <h4 className="p-0">Ad Devices</h4>
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
                  history.push(`/data-input/bulk-import/${adDevices.search.tableName}`)
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
        <AddAdDeviceModal
          showModal={addModalVisible}
          handleModalClose={() => {
            setAddModalVisible(false);
            history.push('/ad/ad-devices');
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
    </div>
  );
};

export default AdDevices;
