import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/app.hooks';
import { ICurrencyProps } from './currency.model';
import React from 'react';
import AddCurrencyModal from './AddCurrencyModal';
import { useHistory } from 'react-router-dom';
import MainTable from './MainTable';
import { clearCurrency, currencySelector } from '../../../store/master/currency/currency.reducer';
import { Row, Col, Button } from 'antd';
import { Can } from '../../../common/ability';
import { Action, Page } from '../../../common/constants/pageAction';
import BreadCrumbs from '../../../common/components/Breadcrumbs';

const Currency: React.FC<ICurrencyProps> = (props) => {
  const currency = useAppSelector(currencySelector);
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
      dispatch(clearCurrency());
    };
  }, []);

  const refreshDataTable = () => {
    dataTableRef?.current.refreshData();
  };

  return (
    <div className="currency">
      <div className="title-block">
        <h4 className="p-0">
          <BreadCrumbs pageName={Page.Currency} />
        </h4>
      </div>
      <div className="main-card">
        <div className="input-btns-title">
          <Row gutter={[10, 4]}>
            <Can I={Action.ImportToExcel} a={Page.Currency}>
              <Col>
                <Button
                  className="btn-icon"
                  onClick={() =>
                    history.push(
                      `/data-input/bulk-import/${encodeURIComponent(currency.search.tableName)}`
                    )
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
                  Import
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
        <AddCurrencyModal
          showModal={addModalVisible}
          handleModalClose={() => {
            setAddModalVisible(false);
            history.push('/administration/currency');
          }}
          id={id}
          refreshDataTable={() => refreshDataTable()}
        />
      )}
    </div>
  );
};

export default Currency;
