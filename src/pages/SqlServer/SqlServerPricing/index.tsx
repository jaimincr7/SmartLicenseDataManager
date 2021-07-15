import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/app.hooks';
import React from 'react';
import GlobalSearch from '../../../common/components/globalSearch/GlobalSearch';
import { useHistory } from 'react-router-dom';
import { Row, Col, Button } from 'antd';
import {
  clearSqlServerPricing,
  sqlServerPricingSelector,
} from '../../../store/sqlServer/sqlServerPricing/sqlServerPricing.reducer';
import { ISqlServerPricingProps } from './sqlServerPricing.model';
import AddSqlServerPricingModal from './AddSqlServerPricingModal';
import MainTable from './MainTable';
import { Can } from '../../../common/ability';
import { Action, Page } from '../../../common/constants/pageAction';

const SqlServerPricing: React.FC<ISqlServerPricingProps> = (props) => {
  const sqlServerPricing = useAppSelector(sqlServerPricingSelector);
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
      dispatch(clearSqlServerPricing());
    };
  }, []);

  const refreshDataTable = () => {
    dataTableRef?.current.refreshData();
  };

  return (
    <div className="sqlServer">
      <div className="title-block">
        <h4 className="p-0">Sql Server Pricing</h4>
        <div className="right-title">
          <GlobalSearch />
        </div>
      </div>
      <div className="main-card">
        <div className="input-btns-title">
          <Row gutter={[10, 4]}>
            <Can I={Action.ImportToExcel} a={Page.SqlServerPricing}>
              <Col>
                <Button
                  className="btn-icon"
                  onClick={() =>
                    history.push(`/data-input/bulk-import/${sqlServerPricing.search.tableName}`)
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
        <AddSqlServerPricingModal
          showModal={addModalVisible}
          handleModalClose={() => {
            setAddModalVisible(false);
            history.push('/sql-server/pricing');
          }}
          id={id}
          refreshDataTable={() => refreshDataTable()}
        />
      )}
    </div>
  );
};

export default SqlServerPricing;
