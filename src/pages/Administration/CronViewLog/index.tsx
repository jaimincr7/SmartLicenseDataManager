import { useRef } from 'react';
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { ICronViewLogProps } from './cronViewLog.model';
import MainTable from './MainTable';
import { Page } from '../../../common/constants/pageAction';
import BreadCrumbs from '../../../common/components/Breadcrumbs';
import { Button } from 'antd';

const CronViewLog: React.FC<ICronViewLogProps> = () => {
  const dataTableRef = useRef(null);
  const history = useHistory();

  const { id: api_job_id } = useParams<{ id?: string }>();

  return (
    <div className="sps">
      <div className="title-block">
        <h4 className="p-0">
          <BreadCrumbs pageName={Page.CronViewLogData} />
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
        <MainTable ref={dataTableRef} api_job_id={+api_job_id} />
      </div>
    </div>
  );
};

export default CronViewLog;
