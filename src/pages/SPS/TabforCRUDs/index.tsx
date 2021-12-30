import { Button, Tabs } from 'antd';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import GlobalSearch from '../../../common/components/globalSearch/GlobalSearch';
import SpsApiInjectionParamV2 from '../ApiInjectionParamV2';
import SpsApiOauthV2 from '../ApiOauthV2';
import SpsApiTokenConfigOptionsV2 from '../ApiTokenConfigOptionsV2';

const { TabPane } = Tabs;

const TabforCRUDs = (props) => {
  const { id: urlId } = props.match?.params;
  const history = useHistory();
  const [typeId, setTypeId] = React.useState(null);

  useEffect(() => {
    if (+urlId > 0) {
      setTypeId(urlId);
    }
  }, [+urlId]);

  return (
    <>
      <div className="update-excel-page">
        <div className="title-block">
          <h4 className="right-title">
            <GlobalSearch />
          </h4>
          <div className="btns-block">
            <Button
              className="btn-icon"
              type="primary"
              onClick={() => history.goBack()}
              icon={
                <em className="anticon">
                  <img src={`${process.env.PUBLIC_URL}/assets/images/ic-left-arrow.svg`} alt="" />
                </em>
              }
            >
              Back
            </Button>
          </div>
        </div>
        <div className="main-card">
          <Tabs defaultActiveKey="1">
            <TabPane tab="Token Config Options" key="1">
              <SpsApiTokenConfigOptionsV2 isTabbed={true} typeId={typeId} />
            </TabPane>
            <TabPane tab="Injection Param" key="2">
              <SpsApiInjectionParamV2 isTabbed={true} typeId={typeId} />
            </TabPane>
            <TabPane tab="OAuth" key="3">
              <SpsApiOauthV2 isTabbed={true} typeId={typeId} />
            </TabPane>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default TabforCRUDs;
