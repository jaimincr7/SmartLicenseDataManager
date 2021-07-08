import { Button, Col, Form, Modal, Row, Select, Spin, Switch, DatePicker } from 'antd';
import { useEffect } from 'react';
import { Messages } from '../../../../common/constants/messages';
import { ILookup } from '../../../../services/common/common.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import { getBULookup, getCompanyLookup } from '../../../../store/common/common.action';
import { clearBULookUp, commonSelector } from '../../../../store/common/common.reducer';
import { IProcessDataModalProps } from './processData.model';
import { processData } from '../../../../store/sqlServerInventory/sqlServerInventory.action';
import {
  clearSqlServerInventoryMessages,
  sqlServerInventorySelector,
} from '../../../../store/sqlServerInventory/sqlServerInventory.reducer';
import { toast } from 'react-toastify';
import moment from 'moment';

const { Option } = Select;

const validateMessages = {
  required: Messages.FIELD_REQUIRED,
};

const ProcessDataModal: React.FC<IProcessDataModalProps> = (props) => {
  const sqlServerInventory = useAppSelector(sqlServerInventorySelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();

  const { showModal, handleModalClose } = props;

  const [form] = Form.useForm();

  const initialValues = {
    company_id: null,
    bu_id: null,
    date_added: moment(),
    set_device_states: false,
    set_device_states_inc_non_prod: false,
    set_device_states_by_keyword: false,
    x_ref_ad: false,
    x_ref_azure: false,
    set_desktop_non_prod: false,
    update_rv_tools_vm: false,
    update_rv_tools_host: false,
    apply_overrides: false,
  };

  const onFinish = (values: any) => {
    dispatch(processData(values));
  };

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current > moment().endOf('day');
  };

  useEffect(() => {
    if (sqlServerInventory.processData.messages.length > 0) {
      if (sqlServerInventory.processData.hasErrors) {
        toast.error(sqlServerInventory.processData.messages.join(' '));
      } else {
        toast.success(sqlServerInventory.processData.messages.join(' '));
        handleModalClose();
      }
      dispatch(clearSqlServerInventoryMessages());
    }
  }, [sqlServerInventory.processData.messages]);

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
                <label className="label">Date Added</label>
                <Form.Item
                  name="date_added"
                  label="Date Added"
                  className="m-0"
                  rules={[{ required: true }]}
                >
                  <DatePicker
                    defaultValue={moment()}
                    className="w-100"
                    disabledDate={disabledDate}
                  />
                </Form.Item>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="form-group form-inline-pt m-0">
                <Form.Item name="set_device_states" className="m-0" valuePropName="checked">
                  <Switch className="form-control" />
                </Form.Item>
                <label className="label">Set Device States</label>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="form-group form-inline-pt m-0">
                <Form.Item
                  name="set_device_states_inc_non_prod"
                  className="m-0"
                  valuePropName="checked"
                >
                  <Switch className="form-control" />
                </Form.Item>
                <label className="label">Set Device States Inc Non Prod</label>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="form-group form-inline-pt m-0">
                <Form.Item
                  name="set_device_states_by_keyword"
                  className="m-0"
                  valuePropName="checked"
                >
                  <Switch className="form-control" />
                </Form.Item>
                <label className="label">Set Device States By KeyWord</label>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="form-group form-inline-pt m-0">
                <Form.Item name="x_ref_ad" className="m-0" valuePropName="checked">
                  <Switch className="form-control" />
                </Form.Item>
                <label className="label">XRefAD</label>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="form-group form-inline-pt m-0">
                <Form.Item name="x_ref_azure" className="m-0" valuePropName="checked">
                  <Switch className="form-control" />
                </Form.Item>
                <label className="label">XRefAzure</label>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="form-group form-inline-pt m-0">
                <Form.Item name="set_desktop_non_prod" className="m-0" valuePropName="checked">
                  <Switch className="form-control" />
                </Form.Item>
                <label className="label">Set Desktops Non Prod</label>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="form-group form-inline-pt m-0">
                <Form.Item name="update_rv_tools_vm" className="m-0" valuePropName="checked">
                  <Switch className="form-control" />
                </Form.Item>
                <label className="label">Update RVTools_VM</label>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="form-group form-inline-pt m-0">
                <Form.Item name="update_rv_tools_host" className="m-0" valuePropName="checked">
                  <Switch className="form-control" />
                </Form.Item>
                <label className="label">Update RVTools_Host</label>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="form-group form-inline-pt m-0">
                <Form.Item name="apply_overrides" className="m-0" valuePropName="checked">
                  <Switch className="form-control" />
                </Form.Item>
                <label className="label">Apply Overrides</label>
              </div>
            </Col>
          </Row>
          <div className="btns-block modal-footer pt-lg">
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              loading={sqlServerInventory.processData.loading}
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
