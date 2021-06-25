import { useEffect, useRef } from 'react';
import { useAppDispatch } from '../../../store/app.hooks';
import { clearSqlServer } from '../../../store/sqlServer/sqlServer.reducer';
import { ISqlServerProps } from './sqlServer.model';
import './sqlServer.style.scss';
import React from 'react';
import DataTable from './components/DataTable';
import GlobalSearch from '../../../common/components/globalSearch/GlobalSearch';
import AddSqlServerModal from './AddSqlServer';
import { useHistory } from 'react-router-dom';
import { Row, Col, Button, Modal, Form, Input, Select, Spin, Switch,DatePicker } from 'antd';
import ProcessDataModal from './ProcessDataModel';

const SqlServer: React.FC<ISqlServerProps> = (props) => {
  const dispatch = useAppDispatch();
  const dataTableRef = useRef(null);
  const history = useHistory();

  const { id: urlId } = props.match?.params;

  const [addModalVisible, setAddModalVisible] = React.useState(false);

  const [processModalVisible, setProcessModalVisible] = React.useState(false);
  const [id, setId] = React.useState(0);

  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  const [form] = Form.useForm();
  const { Option } = Select;

  useEffect(() => {
    if (+urlId > 0) {
      setAddModalVisible(true);
      setId(+urlId);
    }
  }, [+urlId]);

  useEffect(() => {
    return () => {
      dispatch(clearSqlServer());
    };
  }, []);

  const refreshDataTable = () => {
    dataTableRef?.current.refreshData();
  };

  return (
    <div className="sqlServer">
      <div className="title-block">
        <h4 className="p-0">Sql Server</h4>
        <div className="right-title">
          <GlobalSearch />
        </div>
      </div>
      <div className="main-card">
      <div className="input-btns-title">
          <Row gutter={[30, 15]}>            
            <Col xs={24} md={24} lg={6}>
              <div className="btns-block">
                <Button type="primary" onClick={()=> setProcessModalVisible(true)}>Process Data</Button>
                <Button type="primary" onClick={()=> setDeleteModalVisible(true)}>Delete Data</Button>
              </div>
            </Col>
          </Row>
        </div>
        <DataTable
          ref={dataTableRef}
          setSelectedId={(id) => {
            setId(id);
            setAddModalVisible(true);
          }}
        />
      </div>
      {addModalVisible && (
        <AddSqlServerModal
          showModal={addModalVisible}
          handleModalClose={() => {
            setAddModalVisible(false);
            history.push('/sql-server');
          }}
          id={id}
          refreshDataTable={() => refreshDataTable()}
        />
      )}
      {processModalVisible && (
        <ProcessDataModal
          showModal={processModalVisible}
          handleModalClose={() => {
            setProcessModalVisible(false);
            history.push('/sql-server');
          }}
          id={id}
          refreshDataTable={() => refreshDataTable()}
        />
      )}



      {/* modal for delete */}
       <Modal
        wrapClassName="custom-modal"
        title="Delete Set Data"
        centered
        visible={deleteModalVisible}
        onCancel={()=> setDeleteModalVisible(false)}
        footer={false}
      >
        <Form
            form={form}
            name="processData"
          >
            <Row gutter={[30, 15]} className="form-label-hide">              
              <Col xs={24} sm={12} md={8}>
                  <div className="form-group m-0">
                    <label className="label">Company Name</label>
                    <Select
                      suffixIcon={
                        <img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />
                      }
                    >
                      <Option value="1">John Smith</Option>
                      <Option value="2">John Smith</Option>
                      <Option value="3">John Smith</Option>
                    </Select>
                  </div> 
              </Col>
               <Col xs={24} sm={12} md={8}>
                  <div className="form-group m-0">
                    <label className="label">BuName</label>
                    <Select
                      suffixIcon={
                        <img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />
                      }
                    >
                      <Option value="1">John Smith</Option>
                      <Option value="2">John Smith</Option>
                      <Option value="3">John Smith</Option>
                    </Select>
                  </div> 
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Dataset Date</label>
                  <DatePicker className="w-100" />
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                // loading={sqlServers.save.loading}
              >
                Process
              </Button>
              <Button key="back" onClick={()=> setDeleteModalVisible(false)}>
                Cancel
              </Button>
            </div>
          </Form>
      </Modal>
  {/* delete modal design */}
    </div>
  );
};

export default SqlServer;
