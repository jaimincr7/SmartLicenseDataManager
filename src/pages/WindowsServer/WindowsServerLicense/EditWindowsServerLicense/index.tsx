import { Button, Tabs } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import GlobalSearch from '../../../../common/components/globalSearch/GlobalSearch';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import { getWindowsServerLicenseById } from '../../../../store/windowsServer/windowsServerLicense/windowsServerLicense.action';
import {
  clearWindowsServerLicenseGetById,
  windowsServerLicenseSelector,
} from '../../../../store/windowsServer/windowsServerLicense/windowsServerLicense.reducer';
import DetailDataTable from './Details/DetailDataTable';
import { IEditWindowsServerLicenseProps } from './editWindowsServerLicense.model';
import Scenarios from './Scenarios/Scenarios';

const { TabPane } = Tabs;

const EditWindowsServerLicense: React.FC<IEditWindowsServerLicenseProps> = (props) => {
  const windowsServerLicense = useAppSelector(windowsServerLicenseSelector);
  const dispatch = useAppDispatch();
  const history = useHistory();
  const [tab, setTab] = useState(false);

  const { id: licenseId } = props.match?.params;

  const notes: string =
    windowsServerLicense.getById.data && windowsServerLicense.getById.data.notes
      ? windowsServerLicense.getById.data.notes
      : '';
  const title = useMemo(() => {
    return notes ? `Edit Windows Server License (${notes})` : 'Edit Windows Server License';
  }, [notes]);

  useEffect(() => {
    if (+licenseId > 0) {
      dispatch(getWindowsServerLicenseById(+licenseId));
    }
    return () => {
      dispatch(clearWindowsServerLicenseGetById());
    };
  }, [dispatch]);

  return (
    <>
      <div className="windowsServer">
        <div className="title-block">
          <h4 className="p-0">{title}</h4>
          <div className="right-title">
            {tab && (<GlobalSearch />)}
          </div>
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
          <Tabs defaultActiveKey="Scenario" onChange={() => setTab(!tab) }>
            <TabPane tab="Scenario" key="Scenario">
              <Scenarios licenseId={+licenseId} />
            </TabPane>
            <TabPane tab="Detail" key="Detail" >
              <DetailDataTable licenseId={+licenseId} />
            </TabPane>
          </Tabs>
        </div>
      </div>
    </>
  );
};
export default EditWindowsServerLicense;
