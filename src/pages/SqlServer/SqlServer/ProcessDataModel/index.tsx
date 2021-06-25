import { Button, Checkbox, Col, Form, Input, Modal, Row, Select, Spin, Switch } from 'antd';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { Messages } from '../../../../common/constants/messages';
import { ILookup } from '../../../../services/common/common.model';
import { ISqlServer } from '../../../../services/sqlServer/sqlServer.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getBULookup,
  getCompanyLookup,
  getTenantLookup,
} from '../../../../store/common/common.action';
import {
  clearBULookUp,
  clearCompanyLookUp,
  commonSelector,
} from '../../../../store/common/common.reducer';
import { saveSqlServer, getSqlServerById } from '../../../../store/sqlServer/sqlServer.action';
import {
  sqlServerSelector,
  clearSqlServerMessages,
  clearSqlServerGetById,
} from '../../../../store/sqlServer/sqlServer.reducer';
import './processData.style.scss';
import { IProcessDataModalProps } from './processData.model';

const { Option } = Select;

const validateMessages = {
  required: Messages.FIELD_REQUIRED,
};

const ProcessDataModal: React.FC<IProcessDataModalProps> = (props) => {
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();

  const { id, showModal, handleModalClose, refreshDataTable } = props;

  const [form] = Form.useForm();

//   const initialValues: ISqlServer = {
//     bu_id: null,
//     company_id: null,

//   };

  const onFinish = (values: any) => {
    console.log(values)
  };

  const handleCompanyChange = (companyId: number) => {
    form.setFieldsValue({ company_id: companyId, bu_id: null });
    if (companyId) {
      dispatch(getBULookup(companyId));
    } else {
      dispatch(clearBULookUp());
    }
  };

  const handleBUChange = (buId: number) => {
    form.setFieldsValue({ bu_id: buId });
  };

  useEffect(() => {
    dispatch(getCompanyLookup(40));   
    return () => {
      dispatch(clearSqlServerGetById());
      dispatch(clearCompanyLookUp());
      dispatch(clearBULookUp());
    };
  }, [dispatch]);

  return (
    <>
      <Modal
        wrapClassName="custom-modal"
        title="Process Data"
        centered
        visible={true}
        onCancel={handleModalClose}
        footer={false}
      >
        <Form
            form={form}
            name="processData"
            // initialValues={initialValues}
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Row gutter={[30, 15]} className="form-label-hide">              
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Company Name</label>
                  <Form.Item
                    name="company_id"
                    className="m-0"
                    label="Company"
                    rules={[{ required: true }]}
                  >
                    <Select
                      suffixIcon={
                        <img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />
                      }
                      onChange={handleCompanyChange}
                      allowClear
                      notFoundContent={
                        commonLookups.companyLookup.data.length === 0 ? <Spin size="small" /> : null
                      }
                    >
                      {commonLookups.companyLookup.data.map((option: ILookup) => (
                        <Option key={option.id} value={option.id}>
                          {option.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">BU Name</label>
                  <Form.Item name="bu_id" className="m-0" label="BU">
                    <Select
                      suffixIcon={
                        <img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />
                      }
                      onChange={handleBUChange}
                      allowClear
                      notFoundContent={
                        commonLookups.buLookup.data.length === 0 ? <Spin size="small" /> : null
                      }
                    >
                      {commonLookups.buLookup.data.map((option: ILookup) => (
                        <Option key={option.id} value={option.id}>
                          {option.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Set Device States</label>
                  <Form.Item name="SetDeviceStates" className="m-0">
                    <Switch className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">SetDeviceStatesIncNonProd</label>
                  <Form.Item name="SetDeviceStatesIncNonProd" className="m-0">
                    <Switch className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">SetDeviceStatesByKeyWord</label>
                  <Form.Item name="SetDeviceStatesByKeyWord" className="m-0">
                    <Switch className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">XRefAd</label>
                  <Form.Item name="XRefAd" className="m-0">
                    <Switch className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">XRefAzure</label>
                  <Form.Item name="XRefAzure" className="m-0">
                    <Switch className="form-control" />
                  </Form.Item>
                </div>
              </Col>
             
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">SetDesktopsNonProd</label>
                  <Form.Item name="SetDesktopsNonProd" className="m-0">
                    <Switch className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">UpdateRVTools_VM</label>
                  <Form.Item name="UpdateRVTools_VM" className="m-0">
                    <Switch className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">SetDesktopsNonProd</label>
                  <Form.Item name="SetDesktopsNonProd" className="m-0">
                    <Switch className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">UpdateRVTools_Host</label>
                  <Form.Item name="UpdateRVTools_Host" className="m-0">
                    <Switch className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">ApplyOverrides</label>
                  <Form.Item name="ApplyOverrides" className="m-0">
                    <Switch className="form-control" />
                  </Form.Item>
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
              <Button key="back" onClick={handleModalClose}>
                Cancel
              </Button>
            </div>
          </Form>
        {/* )} */}
      </Modal>
    </>
  );
};
export default ProcessDataModal;
