import { useEffect, useRef } from 'react';
import { useAppDispatch } from '../../../store/app.hooks';
import { ISPSAPIsProps } from './apis.model';
import React from 'react';
import GlobalSearch from '../../../common/components/globalSearch/GlobalSearch';
import MainTable from './MainTable';
import { Page } from '../../../common/constants/pageAction';
import BreadCrumbs from '../../../common/components/Breadcrumbs';
import { clearSPS } from '../../../store/sps/spsAPI/spsApi.reducer';
import AddApiModal from './AddApiModal/index';
import { useHistory } from 'react-router-dom';

const SPSAPIs: React.FC<ISPSAPIsProps> = (props) => {
  const { id: urlId } = props.match?.params;
  const [addModalVisible, setAddModalVisible] = React.useState(false);
  const [id, setId] = React.useState(0);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  useEffect(() => {
    if (+urlId > 0) {
      setAddModalVisible(true);
      setId(+urlId);
    }
  }, [+urlId]);

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
          setSelectedId={(id) => {
            setAddModalVisible(true);
            setId(id);
          }}
        />
      </div>
      {addModalVisible && (
        <AddApiModal
          showModal={addModalVisible}
          handleModalClose={() => {
            setAddModalVisible(false);
            history.push('/sps/sps-api');
          }}
          id={id}
          refreshDataTable={() => refreshDataTable()}
        />
      )}
    </div>
  );
};

export default SPSAPIs;
