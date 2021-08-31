import { useEffect, useRef } from 'react';
import { useAppDispatch } from '../../../store/app.hooks';
import { ISPSAPIsProps } from './apis.model';
import React from 'react';
import GlobalSearch from '../../../common/components/globalSearch/GlobalSearch';
import MainTable from './MainTable';
import { Page } from '../../../common/constants/pageAction';
import BreadCrumbs from '../../../common/components/Breadcrumbs';
import { clearSPS } from '../../../store/sps/spsAPI/spsApi.reducer';
import CallApiModal from './CallApiModal';

const SPSAPIs: React.FC<ISPSAPIsProps> = () => {
  const [callModalVisible, setCallModalVisible] = React.useState(false);
  const [id, setId] = React.useState(0);
  const [params, setParams] = React.useState({});
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);

  useEffect(() => {
    return () => {
      dispatch(clearSPS());
    };
  }, []);

  const refreshDataTable = () => {
    dataTableRef?.current.refreshData();
  };

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
        <MainTable
          ref={dataTableRef}
          setSelectedId={(id, params) => {
            setParams(params);
            setId(id);
            setCallModalVisible(true);
          }}
        />
      </div>
      {callModalVisible && (
        <CallApiModal
          showModal={callModalVisible}
          params={params}
          handleModalClose={() => {
            setCallModalVisible(false);
          }}
          id={id}
          refreshDataTable={() => refreshDataTable()}
        />
      )}
    </div>
  );
};

export default SPSAPIs;
