import { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../../../store/app.hooks';
import React from 'react';
import GlobalSearch from '../../../common/components/globalSearch/GlobalSearch';
import { useHistory } from 'react-router-dom';
import { Row, Col, Button } from 'antd';
import { IAdDevicesExclusionsProps } from './adDevicesExclusion.model';
import {
  adDevicesExclusionsSelector,
  clearAdDevicesExclusions,
} from '../../../store/ad/adDevicesExclusions/adDevicesExclusions.reducer';
import AddAdDevicesExclusionsModal from './AddAdDeviceExclusionModal';
import MainTable from './MainTable';

const AdDevicesExclusions: React.FC<IAdDevicesExclusionsProps> = (props) => {
  const adDevicesExclusions = useAppSelector(adDevicesExclusionsSelector);
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
      dispatch(clearAdDevicesExclusions());
    };
  }, []);

  const refreshDataTable = () => {
    dataTableRef?.current.refreshData();
  };

  return (
    <div className="ad">
      <div className="title-block">
        <h4 className="p-0">Ad Devices Exclusions</h4>
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
                  history.push(`/data-input/bulk-import/${adDevicesExclusions.search.tableName}`)
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
        <MainTable
          ref={dataTableRef}
          setSelectedId={(id) => {
            setId(id);
            setAddModalVisible(true);
          }}
        />
      </div>
      {addModalVisible && (
        <AddAdDevicesExclusionsModal
          showModal={addModalVisible}
          handleModalClose={() => {
            setAddModalVisible(false);
            history.push('/ad/ad-devices-exclusions');
          }}
          id={id}
          refreshDataTable={() => refreshDataTable()}
        />
      )}
    </div>
  );
};

export default AdDevicesExclusions;
