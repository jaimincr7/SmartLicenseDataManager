import { useEffect, useRef } from 'react';
import { useAppDispatch } from '../../../store/app.hooks';
import './adUsers.style.scss';
import React from 'react';
import DataTable from './components/DataTable';
import GlobalSearch from '../../../common/components/globalSearch/GlobalSearch';
import { useHistory } from 'react-router-dom';
import { Row, Col, Button } from 'antd';
import { clearAdUsers } from '../../../store/adUsers/adUsers.reducer';
import { IAdUsersProps } from './adUers.model';
import AddAdUserModal from './AddAdUsers';

const AdUsers: React.FC<IAdUsersProps> = (props) => {
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
      dispatch(clearAdUsers());
    };
  }, []);

  const refreshDataTable = () => {
    dataTableRef?.current.refreshData();
  };

  return (
    <div className="sqlServer">
      <div className="title-block">
        <h4 className="p-0">Ad Users</h4>
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
                onClick={() => history.push('/ad/ad-users/update-from-excel')}
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
        <AddAdUserModal
          showModal={addModalVisible}
          handleModalClose={() => {
            setAddModalVisible(false);
            history.push('/ad/ad-users');
          }}
          id={id}
          refreshDataTable={() => refreshDataTable()}
        />
      )}
    </div>
  );
};

export default AdUsers;