import { Button, Col, DatePicker, Form, Modal, Row, Select, Spin } from 'antd';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { Messages } from '../../../../common/constants/messages';
import { ILookup } from '../../../../services/common/common.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import { getBULookup, getCompanyLookup } from '../../../../store/common/common.action';
import { clearBULookUp, commonSelector } from '../../../../store/common/common.reducer';
import { deleteDataset } from '../../../../store/sqlServer/sqlServer.action';
import {
  clearSqlServerMessages,
  sqlServerSelector,
} from '../../../../store/sqlServer/sqlServer.reducer';
import { IDeleteDatasetModalProps } from './deleteDataset.modal';
import './deleteDataset.style.scss';

const { Option } = Select;

const validateMessages = {
  required: Messages.FIELD_REQUIRED,
};

const DeleteDatasetModal: React.FC<IDeleteDatasetModalProps> = (props) => {
  const sqlServers = useAppSelector(sqlServerSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();

  const { showModal, handleModalClose } = props;

  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    dispatch(deleteDataset(values));
  };

  useEffect(() => {
    if (sqlServers.deleteDataset.messages.length > 0) {
      if (sqlServers.deleteDataset.hasErrors) {
        toast.error(sqlServers.deleteDataset.messages.join(' '));
      } else {
        toast.success(sqlServers.deleteDataset.messages.join(' '));
        handleModalClose();
      }
      dispatch(clearSqlServerMessages());
    }
  }, [sqlServers.deleteDataset.messages]);

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
      dispatch(clearBULookUp());
    };
  }, [dispatch]);

  return (
    <>
      <Modal
        wrapClassName="custom-modal"
        title="Delete Dataset"
        centered
        visible={showModal}
        onCancel={handleModalClose}
        footer={false}
      >
        <Form
          form={form}
          name="deleteDataset"
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
                  label="Company Name"
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
                <Form.Item
                  name="bu_id"
                  className="m-0"
                  label="BU Name"
                  rules={[{ required: true }]}
                >
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
                <label className="label">Dataset Date</label>
                <Form.Item
                  name="date_added"
                  label="Dataset Date"
                  className="m-0"
                  rules={[{ required: true }]}
                >
                  <DatePicker className="w-100" />
                </Form.Item>
              </div>
            </Col>
          </Row>
          <div className="btns-block modal-footer">
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              loading={sqlServers.deleteDataset.loading}
            >
              Delete
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
export default DeleteDatasetModal;
