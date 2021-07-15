import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/app.hooks';
import { ITenantProps } from './tenant.model';
import React from 'react';
import AddTenantModal from './AddTenantModal';
import { useHistory } from 'react-router-dom';
import MainTable from './MainTable';
import { clearTenant, tenantSelector } from '../../../store/master/tenant/tenant.reducer';
import { Row, Col, Button } from 'antd';
import { Can } from '../../../common/ability';
import { Action, Page } from '../../../common/constants/pageAction';

const Tenant: React.FC<ITenantProps> = (props) => {
  const tenant = useAppSelector(tenantSelector);
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
      dispatch(clearTenant());
    };
  }, []);

  const refreshDataTable = () => {
    dataTableRef?.current.refreshData();
  };

  return (
    <div className="tenant">
      <div className="title-block">
        <h4 className="p-0">Tenant</h4>
      </div>
      <div className="main-card">
        <div className="input-btns-title">
          <Row gutter={[10, 4]}>
            <Can I={Action.ImportToExcel} a={Page.Tenant}>
              <Col>
                <Button
                  className="btn-icon"
                  onClick={() => history.push(`/data-input/bulk-import/${tenant.search.tableName}`)}
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
        <AddTenantModal
          showModal={addModalVisible}
          handleModalClose={() => {
            setAddModalVisible(false);
            history.push('/user/tenant');
          }}
          id={id}
          refreshDataTable={() => refreshDataTable()}
        />
      )}
    </div>
  );
};

export default Tenant;
