import { Button, Col, DatePicker, Form, Modal, Row, Select, Spin } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { ILookup } from '../../../services/common/common.model';
import { useAppDispatch, useAppSelector } from '../../../store/app.hooks';
import {
  deleteDataset,
  getAllCompanyLookup,
  getBULookup,
} from '../../../store/common/common.action';
import {
  clearBULookUp,
  clearDeleteDatasetMessages,
  commonSelector,
} from '../../../store/common/common.reducer';
import { Messages } from '../../constants/messages';
import { IDeleteDatasetModalProps } from './deleteDatasetModal.model';

const { Option } = Select;

const validateMessages = {
  required: Messages.FIELD_REQUIRED,
};

const DeleteDatasetModal: React.FC<IDeleteDatasetModalProps> = (props) => {
  const common = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();

  const { showModal, handleModalClose, refreshDataTable, tableName } = props;

  const [form] = Form.useForm();

  const initialValues = {
    company_id: null,
    bu_id: null,
    date_added: moment(),
  };
  const onFinish = (values: any) => {
    const inputValues = {
      ...values,
      table_name: tableName,
    };
    dispatch(deleteDataset(inputValues));
  };

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current > moment().endOf('day');
  };

  useEffect(() => {
    if (common.deleteDataset.messages.length > 0) {
      if (common.deleteDataset.hasErrors) {
        toast.error(common.deleteDataset.messages.join(' '));
      } else {
        toast.success(common.deleteDataset.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearDeleteDatasetMessages());
    }
  }, [common.deleteDataset.messages]);

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
        title="Delete Dataset"
        centered
        visible={showModal}
        onCancel={handleModalClose}
        footer={false}
      >
        <Form
          form={form}
          name="deleteDataset"
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
                  label="Company Name"
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
                      common.allCompanyLookup.data.length === 0 ? <Spin size="small" /> : null
                    }
                  >
                    {common.allCompanyLookup.data.map((option: ILookup) => (
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
                    placeholder="Select BU Name"
                    suffixIcon={
                      <img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />
                    }
                    onChange={handleBUChange}
                    allowClear
                    notFoundContent={
                      common.buLookup.data.length === 0 ? <Spin size="small" /> : null
                    }
                  >
                    {common.buLookup.data.map((option: ILookup) => (
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
                  <DatePicker className="w-100" disabledDate={disabledDate} />
                </Form.Item>
              </div>
            </Col>
          </Row>
          <div className="btns-block modal-footer">
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              loading={common.deleteDataset.loading}
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
