import { useEffect, useRef } from 'react';
import { ICronProps } from './cron.model';
import React from 'react';
import GlobalSearch from '../../../common/components/globalSearch/GlobalSearch';
import MainTable from './MainTable';
import { Page } from '../../../common/constants/pageAction';
import BreadCrumbs from '../../../common/components/Breadcrumbs';
import AddCronModal from './AddCronModal';
import { useHistory } from 'react-router-dom';
import { useAppDispatch } from '../../../store/app.hooks';
import { clearCompany } from '../../../store/master/company/company.reducer';

const Cron: React.FC<ICronProps> = (props) => {
  const dataTableRef = useRef(null);
  const dispatch = useAppDispatch();
  const history = useHistory();

  const { id: urlId } = props.match?.params;

  const [addModalVisible, setAddModalVisible] = React.useState(false);
  const [id, setId] = React.useState(0);
  const [filterKeys, setFilterKeys] = React.useState({});
  const [showSelectedListModal, setShowSelectedListModal] = React.useState(false);
  const [dropDownFlag, setDropDownFlag] = React.useState(false);
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
      dispatch(clearCompany());
    };
  }, []);

  const refreshDataTable = () => {
    dataTableRef?.current.refreshData();
  };

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
          isMultiple={showSelectedListModal}
          setValuesForSelection={setValuesForSelection}
          setShowSelectedListModal={(state) => {
            setId(0);
            setShowSelectedListModal(state);
          }}
          setFilterKeys={setFilterKeys}
          setSelectedId={(id) => {
            setId(id);
            setAddModalVisible(true);
          }}
          dropDownFlag={dropDownFlag}
          setDropDownFlag={setDropDownFlag}
        />
      </div>
      {addModalVisible && (
        <AddCronModal
          showModal={addModalVisible}
          filterKeys={filterKeys}
          isMultiple={false}
          handleModalClose={() => {
            setAddModalVisible(false);
            history.push('/administration/sps-scheduler');
          }}
          id={id}
          refreshDataTable={() => refreshDataTable()}
        />
      )}
      {showSelectedListModal && (
        <AddCronModal
          showModal={showSelectedListModal}
          valuesForSelection={valuesForSelection}
          isMultiple={true}
          handleModalClose={() => {
            setShowSelectedListModal(false);
            history.push('/administration/sps-scheduler');
          }}
          id={id}
          refreshDataTable={() => refreshDataTable()}
          setDropDownFlag={setDropDownFlag}
        />
      )}
    </div>
  );
};

export default Cron;
