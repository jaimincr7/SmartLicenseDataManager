import { Button, Tabs } from 'antd';
import React, { useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import { getSqlServerLicenseById } from '../../../../store/sqlServer/sqlServerLicense/sqlServerLicense.action';
import {
  clearSqlServerLicenseGetById,
  sqlServerLicenseSelector,
} from '../../../../store/sqlServer/sqlServerLicense/sqlServerLicense.reducer';
import DetailDataTable from './Details/DetailDataTable';
import { IEditSqlServerLicenseProps } from './editSqlServerLicense.model';
import Scenarios from './Scenarios/Scenarios';

const { TabPane } = Tabs;

const EditSqlServerLicense: React.FC<IEditSqlServerLicenseProps> = (props) => {
  const sqlServerLicense = useAppSelector(sqlServerLicenseSelector);
  const dispatch = useAppDispatch();
  const history = useHistory();

  const { id: licenseId } = props.match?.params;

  const notes: string =
    sqlServerLicense.getById.data && sqlServerLicense.getById.data.notes
      ? sqlServerLicense.getById.data.notes
      : '';
  const title = useMemo(() => {
    return notes ? `Edit Sql Server License (${notes})` : 'Edit Sql Server License';
  }, [notes]);

  useEffect(() => {
    if (+licenseId > 0) {
      dispatch(getSqlServerLicenseById(+licenseId));
    }
    return () => {
      dispatch(clearSqlServerLicenseGetById());
    };
  }, [dispatch]);

  return (
    <>
      <div className="sqlServer">
        <div className="title-block">
          <h4 className="p-0">{title}</h4>
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
          <Tabs defaultActiveKey="Scenario">
            <TabPane tab="Scenario" key="Scenario">
              <Scenarios licenseId={+licenseId} />
            </TabPane>
            <TabPane tab="Detail" key="Detail">
              <DetailDataTable licenseId={+licenseId} />
            </TabPane>
          </Tabs>
        </div>
      </div>
    </>
  );
};
export default EditSqlServerLicense;
