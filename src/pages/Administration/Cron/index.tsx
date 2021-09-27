import { useEffect, useRef } from 'react';
import { ICronProps } from './cron.model';
import React from 'react';
import GlobalSearch from '../../../common/components/globalSearch/GlobalSearch';
import MainTable from './MainTable';
import { Page } from '../../../common/constants/pageAction';
import BreadCrumbs from '../../../common/components/Breadcrumbs';

const Cron: React.FC<ICronProps> = () => {
  const dataTableRef = useRef(null);

  useEffect(() => {
    return () => {
      //dispatch(clearSPS());
    };
  }, []);

  return (
    <div className="sqlServer">
      <div className="title-block">
        <h4 className="p-0">
          <BreadCrumbs pageName={Page.Cron} />
        </h4>
        <div className="right-title">
          <GlobalSearch />
        </div>
      </div>
      <div className="main-card">
        <MainTable
          ref={dataTableRef}
        />
      </div>
    </div>
  );
};

export default Cron;
