import { Button, Col, DatePicker, Form, Modal, Row, Select, Spin } from 'antd';
import { useEffect } from 'react';
import { Messages } from '../../../../common/constants/messages';
import { ILookup } from '../../../../services/common/common.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import { getAllCompanyLookup, getBULookup } from '../../../../store/common/common.action';
import { clearBULookUp, commonSelector } from '../../../../store/common/common.reducer';
import { IReRunAllScenariosModalProps } from './reRunAllScenarios.model';
import { reRunAllScenarios } from '../../../../store/sqlServer/sqlServerLicense/sqlServerLicense.action';
import { toast } from 'react-toastify';
import {
  clearSqlServerLicenseReRunAllScenariosMessages,
  sqlServerLicenseSelector,
} from '../../../../store/sqlServer/sqlServerLicense/sqlServerLicense.reducer';
import moment from 'moment';

const { Option } = Select;

const validateMessages = {
  required: Messages.FIELD_REQUIRED,
};

const ReRunAllScenariosModal: React.FC<IReRunAllScenariosModalProps> = (props) => {
  const sqlServersLicense = useAppSelector(sqlServerLicenseSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();

  const { showModal, handleModalClose } = props;

  const [form] = Form.useForm();

  const initialValues = {
    company_id: null,
    bu_id: null,
    selected_date: moment(),
  };

  const onFinish = (values: any) => {
    dispatch(reRunAllScenarios(values));
  };

  useEffect(() => {
    if (sqlServersLicense.reRunAllScenarios.messages.length > 0) {
      if (sqlServersLicense.reRunAllScenarios.hasErrors) {
        toast.error(sqlServersLicense.reRunAllScenarios.messages.join(' '));
      } else {
        toast.success(sqlServersLicense.reRunAllScenarios.messages.join(' '));
        handleModalClose();
      }
      dispatch(clearSqlServerLicenseReRunAllScenariosMessages());
    }
  }, [sqlServersLicense.reRunAllScenarios.messages]);

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
    dispatch(getAllCompanyLookup());
    return () => {
      dispatch(clearBULookUp());
    };
  }, [dispatch]);

  return (
    <>
      <Modal
        wrapClassName="custom-modal"
        title="Re-Run Scenarios"
        centered
        visible={showModal}
        onCancel={handleModalClose}
        footer={false}
      >
        <Form
          form={form}
          name="reRunAllScenarios"
          initialValues={initialValues}
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
                    placeholder="Select Company Name"
                    suffixIcon={
                      <img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />
                    }
                    onChange={handleCompanyChange}
                    allowClear
                    notFoundContent={
                      commonLookups.allCompanyLookup.data.length === 0 ? (
                        <Spin size="small" />
                      ) : null
                    }
                  >
                    {commonLookups.allCompanyLookup.data.map((option: ILookup) => (
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
                <Form.Item name="bu_id" className="m-0" label="BU" rules={[{ required: true }]}>
                  <Select
                    placeholder="Select BU Name"
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
                <label className="label">Selected Date</label>
                <Form.Item
                  name="selected_date"
                  label="Selected Date"
                  className="m-0"
                  rules={[{ required: true }]}
                >
                  <DatePicker className="w-100" />
                </Form.Item>
              </div>
            </Col>
          </Row>
          <div className="btns-block modal-footer pt-lg">
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              loading={sqlServersLicense.reRunAllScenarios.loading}
            >
              Process
            </Button>
            <Button key="back" onClick={handleModalClose}>
              Cancel
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};
export default ReRunAllScenariosModal;
