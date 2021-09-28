import { useRef } from 'react';
import React from 'react';
import GlobalSearch from '../../../common/components/globalSearch/GlobalSearch';
import { useParams } from 'react-router-dom';
import { ICronViewLogProps } from './cronViewLog.model';
import MainTable from './MainTable';
import { Page } from '../../../common/constants/pageAction';
import BreadCrumbs from '../../../common/components/Breadcrumbs';

const CronViewLog: React.FC<ICronViewLogProps> = () => {
  const dataTableRef = useRef(null);

  const { id: job_id } = useParams<{ id?: string }>();

  {
    /*const refreshDataTable = () => {
    dataTableRef?.current.refreshData();
  };*/
  }

  return (
    <div className="sps">
      <div className="title-block">
        <h4 className="p-0">
          <BreadCrumbs pageName={Page.CronViewLogData} />
        </h4>
        <div className="right-title">
          <GlobalSearch />
        </div>
      </div>
      <div className="main-card">
        <MainTable ref={dataTableRef} job_id={+job_id} />
      </div>
    </div>
  );
};

export default CronViewLog;
