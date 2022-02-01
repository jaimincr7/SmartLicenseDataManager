import { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../../../store/app.hooks';
import { IO365ProductListProps } from './o365ProductList.model';
import React from 'react';
import GlobalSearch from '../../../common/components/globalSearch/GlobalSearch';
import { useHistory } from 'react-router-dom';
import { Button } from 'antd';
import AddO365ProductListModal from './AddO365ProductListModal';
import MainTable from './MainTable';
import { Can } from '../../../common/ability';
import { Action, Page } from '../../../common/constants/pageAction';
import {
  clearO365ProductList,
  o365ProductListSelector,
} from '../../../store/o365/o365ProductList/o365ProductList.reducer';
import BreadCrumbs from '../../../common/components/Breadcrumbs';
import ProcessDataModal from '../O365Users/ProcessDataModal';
import DeleteDatasetModal from '../../../common/components/DeleteDatasetModal';

const O365ProductList: React.FC<IO365ProductListProps> = (props) => {
  const o365ProductList = useAppSelector(o365ProductListSelector);
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  const { id: urlId } = props.match?.params;

  const [addModalVisible, setAddModalVisible] = React.useState(false);

  const [filterKeys, setFilterKeys] = React.useState({});
  const [id, setId] = React.useState(0);
  const [processModalVisible, setProcessModalVisible] = React.useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  const [showSelectedListModal, setShowSelectedListModal] = React.useState(false);
  const [valuesForSelection, setValuesForSelection] = React.useState(null);

  useEffect(() => {
    if (+urlId > 0) {
      setAddModalVisible(true);
      setId(+urlId);
    }
  }, [+urlId]);

  useEffect(() => {
    setShowSelectedListModal(false);
    return () => {
      dispatch(clearO365ProductList());
    };
  }, []);

  const refreshDataTable = () => {
    dataTableRef?.current.refreshData();
  };

  const tableButtons = () => (
    <>
      <Can I={Action.ImportToExcel} a={Page.O365ProductList}>
        <Button
          className="btn-icon"
          onClick={() =>
            history.push(
              `/data-input/bulk-import/${encodeURIComponent(o365ProductList.search.tableName)}`
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
      <Can I={Action.ProcessData} a={Page.O365ProductList}>
        <Button
          className="btn-icon"
          disabled={o365ProductList.search.loading}
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
      <Can I={Action.DeleteData} a={Page.O365ProductList}>
        <Button
          className="btn-icon mr-1"
          onClick={() => setDeleteModalVisible(true)}
          disabled={o365ProductList.search.loading}
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
          <BreadCrumbs pageName={Page.O365ProductList} />
        </h4>
        <div className="right-title">
          <GlobalSearch />
        </div>
      </div>
      <div className="main-card">
        {/* <div className="input-btns-title">
          <Row gutter={[10, 4]}>
            <Can I={Action.ImportToExcel} a={Page.O365ProductList}>
              <Col>
                <Button
                  className="btn-icon"
                  onClick={() =>
                    history.push(
                      `/data-input/bulk-import/${encodeURIComponent(
                        o365ProductList.search.tableName
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
        <AddO365ProductListModal
          showModal={addModalVisible}
          isMultiple={false}
          handleModalClose={() => {
            setAddModalVisible(false);
            history.push('/o365/o365-product-list');
          }}
          id={id}
          refreshDataTable={() => refreshDataTable()}
        />
      )}
      {showSelectedListModal && (
        <AddO365ProductListModal
          showModal={showSelectedListModal}
          valuesForSelection={valuesForSelection}
          isMultiple={true}
          handleModalClose={() => {
            setShowSelectedListModal(false);
            history.push('/o365/o365-product-list');
          }}
          id={id}
          refreshDataTable={() => refreshDataTable()}
        />
      )}
      {processModalVisible && (
        <ProcessDataModal
          showModal={processModalVisible}
          handleModalClose={() => setProcessModalVisible(false)}
          refreshDataTable={() => refreshDataTable()}
          filterKeys={filterKeys}
          tableName={o365ProductList.search.tableName}
        />
      )}
      {deleteModalVisible && (
        <DeleteDatasetModal
          showModal={deleteModalVisible}
          handleModalClose={() => setDeleteModalVisible(false)}
          tableName={o365ProductList.search.tableName}
          refreshDataTable={() => refreshDataTable()}
          filterKeys={filterKeys}
        />
      )}
    </div>
  );
};

export default O365ProductList;
