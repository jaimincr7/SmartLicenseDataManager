import { Button, Col, Form, Modal, Row, Select, DatePicker } from 'antd';
import { useEffect } from 'react';
import { ILookup } from '../../../../services/common/common.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import { getAllCompanyLookup, getBULookup } from '../../../../store/common/common.action';
import { clearBULookUp, commonSelector } from '../../../../store/common/common.reducer';
import { IProcessDataModalProps } from './processData.model';
import { toast } from 'react-toastify';
import moment from 'moment';
import {
  adDevicesSelector,
  clearAdDeviceMessages,
} from '../../../../store/ad/adDevices/adDevices.reducer';
import { processData } from '../../../../store/ad/adDevices/adDevices.action';
import { validateMessages } from '../../../../common/constants/common';

const { Option } = Select;

const ProcessDataModal: React.FC<IProcessDataModalProps> = (props) => {
  const adDevices = useAppSelector(adDevicesSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();

  const { showModal, handleModalClose } = props;

  const [form] = Form.useForm();

  const initialValues = {
    company_id: null,
    bu_id: null,
    date_added: moment(),
  };

  const onFinish = (values: any) => {
    dispatch(processData(values));
  };

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current > moment().endOf('day');
  };

  useEffect(() => {
    if (adDevices.processData.messages.length > 0) {
      if (adDevices.processData.hasErrors) {
        toast.error(adDevices.processData.messages.join(' '));
      } else {
        toast.success(adDevices.processData.messages.join(' '));
        handleModalClose();
      }
      dispatch(clearAdDeviceMessages());
    }
  }, [adDevices.processData.messages]);

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
        title="Process Data"
        centered
        visible={showModal}
        onCancel={handleModalClose}
        footer={false}
      >
        <Form
          form={form}
          name="processData"
          initialValues={initialValues}
          onFinish={onFinish}
          validateMessages={validateMessages}
        >
          <Row gutter={[30, 15]} className="form-label-hide">
            <Col xs={24} sm={12} md={8}>
              <div className="form-group m-0">
                <label className="label">Company</label>
                <Form.Item
                  name="company_id"
                  className="m-0"
                  label="Company"
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder="Select Company"
                    loading={commonLookups.allCompanyLookup.loading}
                    onChange={handleCompanyChange}
                    allowClear
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
                <label className="label">BU</label>
                <Form.Item name="bu_id" className="m-0" label="BU" rules={[{ required: true }]}>
                  <Select
                    placeholder="Select BU"
                    loading={commonLookups.buLookup.loading}
                    onChange={handleBUChange}
                    allowClear
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
                <label className="label">Date Added</label>
                <Form.Item
                  name="date_added"
                  label="Date Added"
                  className="m-0"
                  rules={[{ required: true }]}
                >
                  <DatePicker className="w-100" disabledDate={disabledDate} />
                </Form.Item>
              </div>
            </Col>
          </Row>
          <div className="btns-block modal-footer pt-lg">
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              loading={adDevices.processData.loading}
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
export default ProcessDataModal;
