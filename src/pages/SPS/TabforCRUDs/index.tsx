import { Tabs } from 'antd';
import React , { useEffect } from 'react';
import SpsApiInjectionParamV2 from '../ApiInjectionParamV2';
import SpsApiInjectionValueParamV2 from '../ApiInjectionValueParamV2';
import SpsApiOauthV2 from '../ApiOauthV2';
//import SpsApiInjectionParamV2 from '../ApiInjectionParamV2';
import SpsApiTokenConfigOptionsV2 from '../ApiTokenConfigOptionsV2';

const { TabPane } = Tabs;

const TabforCRUDs = (props) => {

    const { id: urlId } = props.match?.params;
    const [typeId, setTypeId] = React.useState(null);

    useEffect(() => {
        if (+urlId > 0) {
            setTypeId(urlId);
        }
    }, [+urlId]);

    return (
        <div className="main-card">
            <Tabs defaultActiveKey="1">
                <TabPane tab="Token Config Options" key="1">
                    <SpsApiTokenConfigOptionsV2 isTabbed={true} typeId={typeId}/>
                </TabPane>
                <TabPane tab="Injection Param" key="2">
                    <SpsApiInjectionParamV2 isTabbed={true} typeId={typeId}/>
                </TabPane>
                <TabPane tab="OAuth" key="3">
                    <SpsApiOauthV2 isTabbed={true} typeId={typeId}/>
                </TabPane>
                <TabPane tab="Injection Value" key="4">
                    <SpsApiInjectionValueParamV2 isTabbed={true} typeId={typeId}/>
                </TabPane>
            </Tabs>
        </div>
    );
};

export default TabforCRUDs;
