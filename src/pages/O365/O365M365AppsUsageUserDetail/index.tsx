import { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../../../store/app.hooks';
import React from 'react';
import GlobalSearch from '../../../common/components/globalSearch/GlobalSearch';
import { useHistory } from 'react-router-dom';
import { Button } from 'antd';
import { IO365M365AppsUsageUserDetailProps } from './o365M365AppsUsageUserDetail.model';
import {
  o365M365AppsUsageUserDetailSelector,
  clearO365M365AppsUsageUserDetail,
} from '../../../store/o365/o365M365AppsUsageUserDetail/o365M365AppsUsageUserDetail.reducer';
import AddO365M365AppsUsageUserDetailModal from './AddO365M365AppsUsageUserDetailModal';
import MainTable from './MainTable';
import { Can } from '../../../common/ability';
import { Action, Page } from '../../../common/constants/pageAction';
import BreadCrumbs from '../../../common/components/Breadcrumbs';
import DeleteDatasetModal from '../../../common/components/DeleteDatasetModal';
import ProcessDataModal from '../O365Users/ProcessDataModal';

const O365M365AppsUsageUserDetail: React.FC<IO365M365AppsUsageUserDetailProps> = (props) => {
  const o365M365AppsUsageUserDetail = useAppSelector(o365M365AppsUsageUserDetailSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();
  const [filterKeys, setFilterKeys] = React.useState({});

  const { id: urlId } = props.match?.params;

  const [addModalVisible, setAddModalVisible] = React.useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  const [showSelectedListModal, setShowSelectedListModal] = React.useState(false);
  const [processModalVisible, setProcessModalVisible] = React.useState(false);
  const [valuesForSelection, setValuesForSelection] = React.useState(null);

  const [id, setId] = React.useState(0);

  useEffect(() => {
    if (+urlId > 0) {
      setAddModalVisible(true);
      setId(+urlId);
    }
  }, [+urlId]);

  useEffect(() => {
    setShowSelectedListModal(false);
    return () => {
      dispatch(clearO365M365AppsUsageUserDetail());
    };
  }, []);

  const refreshDataTable = () => {
    dataTableRef?.current.refreshData();
  };

  const tableButtons = () => (
    <>
      <Can I={Action.ImportToExcel} a={Page.O365M365AppsUsageUserDetail}>
        <Button
          className="btn-icon"
          onClick={() =>
            history.push(
              `/data-input/bulk-import/${encodeURIComponent(
                o365M365AppsUsageUserDetail.search.tableName
              )}`
            )
          }
          icon={
            <em className="anticon">
              <img
                src={`${process.env.PUBLIC_URL}/assets/images/ic-file-excel-outlined.svg`}
                alt=""
              />
            </em>
          }
        >
          Import
        </Button>
      </Can>
      <Can I={Action.ProcessData} a={Page.O365M365AppsUsageUserDetail}>
        <Button
          className="btn-icon"
          disabled={o365M365AppsUsageUserDetail.search.loading}
          onClick={() => setProcessModalVisible(true)}
          icon={
            <em className="anticon">
              <img src={`${process.env.PUBLIC_URL}/assets/images/ic-process-data.svg`} alt="" />
            </em>
          }
        >
          Process Data
        </Button>
      </Can>
      <Can I={Action.DeleteData} a={Page.O365M365AppsUsageUserDetail}>
        <Button
          className="btn-icon mr-1"
          onClick={() => setDeleteModalVisible(true)}
          disabled={o365M365AppsUsageUserDetail.search.loading}
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
    <div className="ad">
      <div className="title-block">
        <h4 className="p-0">
          <BreadCrumbs pageName={Page.O365M365AppsUsageUserDetail} />
        </h4>
        <div className="right-title">
          <GlobalSearch />
        </div>
      </div>
      <div className="main-card">
        {/* <div className="input-btns-title">
          <Row gutter={[10, 4]}>
            <Can I={Action.ImportToExcel} a={Page.O365M365AppsUsageUserDetail}>
              <Col>
                <Button
                  className="btn-icon"
                  onClick={() =>
                    history.push(
                      `/data-input/bulk-import/${o365M365AppsUsageUserDetail.search.tableName}`
                    )
                  }
                  icon={
                    <em className="anticon">
                      <img
                        src={`${process.env.PUBLIC_URL}/assets/images/ic-file-excel-outlined.svg`}
                        alt=""
                      />
                    </em>
                  }
                >
                  Import
                </Button>
              </Col>
            </Can>
            <Can I={Action.DeleteData} a={Page.O365M365AppsUsageUserDetail}>
              <Col>
                <Button
                  className="btn-icon"
                  onClick={() => setDeleteModalVisible(true)}
                  icon={
                    <em className="anticon">
                      <img src={`${process.env.PUBLIC_URL}/assets/images/ic-delete.svg`} alt="" />
                    </em>
                  }
                >
                  Delete Dataset
                </Button>
              </Col>
            </Can>
          </Row>
        </div> */}
        <MainTable
          ref={dataTableRef}
          isMultiple={showSelectedListModal}
          setValuesForSelection={setValuesForSelection}
          setShowSelectedListModal={(state) => {
            setId(0);
            setShowSelectedListModal(state);
          }}
          setSelectedId={(id) => {
            setId(id);
            setAddModalVisible(true);
          }}
          setFilterKeys={setFilterKeys}
          tableButtons={tableButtons}
        />
      </div>
      {addModalVisible && (
        <AddO365M365AppsUsageUserDetailModal
          showModal={addModalVisible}
          isMultiple={false}
          handleModalClose={() => {
            setAddModalVisible(false);
            history.push('/o365/o365-m365-apps-usage-user-detail');
          }}
          id={id}
          refreshDataTable={() => refreshDataTable()}
        />
      )}
      {showSelectedListModal && (
        <AddO365M365AppsUsageUserDetailModal
          showModal={showSelectedListModal}
          valuesForSelection={valuesForSelection}
          isMultiple={true}
          handleModalClose={() => {
            setShowSelectedListModal(false);
            history.push('/o365/o365-m365-apps-usage-user-detail');
          }}
          id={id}
          refreshDataTable={() => refreshDataTable()}
        />
      )}
      {deleteModalVisible && (
        <DeleteDatasetModal
          showModal={deleteModalVisible}
          handleModalClose={() => setDeleteModalVisible(false)}
          tableName={o365M365AppsUsageUserDetail.search.tableName}
          refreshDataTable={() => refreshDataTable()}
          filterKeys={filterKeys}
        />
      )}
      {processModalVisible && (
        <ProcessDataModal
          showModal={processModalVisible}
          handleModalClose={() => setProcessModalVisible(false)}
          refreshDataTable={() => refreshDataTable()}
          filterKeys={filterKeys}
          tableName={o365M365AppsUsageUserDetail.search.tableName}
        />
      )}
    </div>
  );
};

export default O365M365AppsUsageUserDetail;
