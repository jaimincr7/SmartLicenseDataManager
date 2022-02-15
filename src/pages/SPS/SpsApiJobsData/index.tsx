import { useRef } from 'react';
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { ISpsApiJobsProps } from './spsApiJobsData.model';
import MainTable from './MainTable';
import { Page } from '../../../common/constants/pageAction';
import BreadCrumbs from '../../../common/components/Breadcrumbs';
import { Button } from 'antd';

const SpsApiJobs: React.FC<ISpsApiJobsProps> = () => {
  const history = useHistory();
  const dataTableRef = useRef(null);

  const { id: api_job_id } = useParams<{ id?: string }>();

  {
    /*const refreshDataTable = () => {
    dataTableRef?.current.refreshData();
  };*/
  }

  return (
    <div className="sps">
      <div className="title-block">
        <h4 className="p-0">
          <BreadCrumbs pageName={Page.SpsApiJobsData} />
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

export default SpsApiJobs;
