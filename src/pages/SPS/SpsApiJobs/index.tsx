import { useEffect, useRef } from 'react';
import { useAppDispatch } from '../../../store/app.hooks';
import React from 'react';
import GlobalSearch from '../../../common/components/globalSearch/GlobalSearch';
import { ISpsApiJobsProps } from './spsApiJobs.model';
import { clearSpsApiJobs } from '../../../store/sps/spsApiJobs/spsApiJobs.reducer';
import MainTable from './MainTable';
import { Page } from '../../../common/constants/pageAction';
import BreadCrumbs from '../../../common/components/Breadcrumbs';

const SpsApiJobs: React.FC<ISpsApiJobsProps> = () => {
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);

  useEffect(() => {
    return () => {
      dispatch(clearSpsApiJobs());
    };
  }, []);

  return (
    <div className="sps">
      <div className="title-block">
        <h4 className="p-0">
          <BreadCrumbs pageName={Page.SpsApiJobs} />
        </h4>
        <div className="right-title">
          <GlobalSearch />
        </div>
      </div>
      <div className="main-card">
        <MainTable ref={dataTableRef} />
      </div>
    </div>
  );
};

export default SpsApiJobs;
