import { Tabs } from 'antd';
//import SpsApiInjectionParamV2 from '../ApiInjectionParamV2';
import SpsApiTokenConfigOptionsV2 from '../ApiTokenConfigOptionsV2';

const { TabPane } = Tabs;

const TabforCRUDs = () => {

    return (
        <div className="main-card">
            <Tabs defaultActiveKey="1" >
                <TabPane tab="Token Config Options" key="1">
                    {/*1st Page of TAB*/}
                    <SpsApiTokenConfigOptionsV2 isTabbed={true}/>
                </TabPane>
                <TabPane tab="Injection Param" key="2">
                    2nd Page of TAB
                    {/*<SpsApiInjectionParamV2/>*/}
                </TabPane>
            </Tabs>
        </div>
    );

};

export default TabforCRUDs;