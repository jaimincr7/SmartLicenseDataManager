import { useEffect, useRef } from 'react';
import { useAppDispatch } from '../../../store/app.hooks';
import { ISPSAPIsProps } from './apis.model';
import React from 'react';
import GlobalSearch from '../../../common/components/globalSearch/GlobalSearch';
import MainTable from './MainTable';
import { Page } from '../../../common/constants/pageAction';
import BreadCrumbs from '../../../common/components/Breadcrumbs';
import { clearSPS } from '../../../store/sps/spsAPI/spsApi.reducer';

const SPSAPIsCall: React.FC<ISPSAPIsProps> = () => {
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);

  useEffect(() => {
    return () => {
      dispatch(clearSPS());
    };
  }, []);

  return (
    <div className="sqlServer">
      <div className="title-block">
        <h4 className="p-0">
          <BreadCrumbs pageName={Page.SPSApi} />
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

export default SPSAPIsCall;
