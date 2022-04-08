import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/app.hooks';
import React from 'react';
import GlobalSearch from '../../../common/components/globalSearch/GlobalSearch';
import { ISpsApiJobsProps } from './spsApiJobs.model';
import {
  clearSpsApiJobs,
  spsApiJobsSelector,
} from '../../../store/sps/spsApiJobs/spsApiJobs.reducer';
import MainTable from './MainTable';
import { Action, Page } from '../../../common/constants/pageAction';
import BreadCrumbs from '../../../common/components/Breadcrumbs';
import { Can } from '../../../common/ability';
import { Button } from 'antd';
import DeleteDatasetModal from '../../../common/components/DeleteDatasetModal';
import { useHistory } from 'react-router-dom';

const SpsApiJobs: React.FC<ISpsApiJobsProps> = () => {
  const spsApiJobs = useAppSelector(spsApiJobsSelector);
  const dispatch = useAppDispatch();
  const history = useHistory();
  const dataTableRef = useRef(null);
  const queryParams = new URLSearchParams(window.location.search);
  const job_id = queryParams.get('job_id');

  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);

  useEffect(() => {
    return () => {
      dispatch(clearSpsApiJobs());
    };
  }, []);

  const refreshDataTable = () => {
    dataTableRef?.current.refreshData();
  };

  const tableButtons = () => (
    <>
      <Can I={Action.DeleteData} a={Page.SpsApiJobs}>
        <Button
          className="btn-icon mr-1"
          onClick={() => setDeleteModalVisible(true)}
          disabled={spsApiJobs.search.loading}
          icon={
            <em className="anticon">
              <img src={`${process.env.PUBLIC_URL}/assets/images/ic-delete.svg`} alt="" />
            </em>
          }
        >
          Delete Dataset
        </Button>
      </Can>
    </>
  );

  return (
    <div className="sps">
      <div className="title-block">
        <h4 className="p-0">
          <BreadCrumbs pageName={Page.SpsApiJobs} />
        </h4>
        <div className="right-title">
          <GlobalSearch />
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
        <MainTable ref={dataTableRef} tableButtons={tableButtons} job_id={+job_id} />
      </div>
      {deleteModalVisible && (
        <DeleteDatasetModal
          showModal={deleteModalVisible}
          handleModalClose={() => setDeleteModalVisible(false)}
          tableName={spsApiJobs.search.tableName}
          refreshDataTable={() => refreshDataTable()}
          isDateAvailable={false}
        />
      )}
    </div>
  );
};

export default SpsApiJobs;
