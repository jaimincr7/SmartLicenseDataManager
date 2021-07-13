import { useEffect, useRef } from 'react';
import { useAppDispatch } from '../../../store/app.hooks';
import { IBUProps } from './bu.model';
import React from 'react';
import AddBUModal from './AddBUModal';
import { useHistory } from 'react-router-dom';
import MainTable from './MainTable';
import { clearBU } from '../../../store/master/bu/bu.reducer';

const BU: React.FC<IBUProps> = (props) => {
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  const { id: urlId } = props.match?.params;

  const [addModalVisible, setAddModalVisible] = React.useState(false);

  const [id, setId] = React.useState(0);

  useEffect(() => {
    if (+urlId > 0) {
      setAddModalVisible(true);
      setId(+urlId);
    }
  }, [+urlId]);

  useEffect(() => {
    return () => {
      dispatch(clearBU());
    };
  }, []);

  const refreshDataTable = () => {
    dataTableRef?.current.refreshData();
  };

  return (
    <div className="bu">
      <div className="title-block">
        <h4 className="p-0">BU</h4>
      </div>
      <div className="main-card">
        <MainTable
          ref={dataTableRef}
          setSelectedId={(id) => {
            setId(id);
            setAddModalVisible(true);
          }}
        />
      </div>
      {addModalVisible && (
        <AddBUModal
          showModal={addModalVisible}
          handleModalClose={() => {
            setAddModalVisible(false);
            history.push('/user/bu');
          }}
          id={id}
          refreshDataTable={() => refreshDataTable()}
        />
      )}
    </div>
  );
};

export default BU;
