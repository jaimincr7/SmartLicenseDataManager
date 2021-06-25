import {
  Button,
  Col,
  Form,
  Modal,
  Row,
  Select,
  Spin,
  Switch,
  DatePicker,
} from 'antd';
import { useEffect } from 'react';
import { Messages } from '../../../../common/constants/messages';
import { ILookup } from '../../../../services/common/common.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getBULookup,
  getCompanyLookup,
} from '../../../../store/common/common.action';
import {
  clearBULookUp,
  commonSelector,
} from '../../../../store/common/common.reducer';
import './processData.style.scss';
import { IProcessDataModalProps } from './processData.model';

const { Option } = Select;

const validateMessages = {
  required: Messages.FIELD_REQUIRED,
};

const ProcessDataModal: React.FC<IProcessDataModalProps> = (props) => {
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();

  const { showModal, handleModalClose } = props;

  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log(values);
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
                <label className="label">Date Added</label>
                <DatePicker className="w-100" />
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="form-group form-inline-pt m-0">
                <Form.Item name="SetDeviceStates" className="m-0">
                  <Switch className="form-control" />
                </Form.Item>
                <label className="label">Set Device States</label>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="form-group form-inline-pt m-0">
                <Form.Item name="SetDeviceStatesIncNonProd" className="m-0">
                  <Switch className="form-control" />
                </Form.Item>
                <label className="label">SetDeviceStatesIncNonProd</label>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="form-group form-inline-pt m-0">
                <Form.Item name="SetDeviceStatesByKeyWord" className="m-0">
                  <Switch className="form-control" />
                </Form.Item>
                <label className="label">SetDeviceStatesByKeyWord</label>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="form-group form-inline-pt m-0">
                <Form.Item name="XRefAd" className="m-0">
                  <Switch className="form-control" />
                </Form.Item>
                <label className="label">XRefAd</label>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="form-group form-inline-pt m-0">
                <Form.Item name="XRefAzure" className="m-0">
                  <Switch className="form-control" />
                </Form.Item>
                <label className="label">XRefAzure</label>
              </div>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <div className="form-group form-inline-pt m-0">
                <Form.Item name="SetDesktopsNonProd" className="m-0">
                  <Switch className="form-control" />
                </Form.Item>
                <label className="label">SetDesktopsNonProd</label>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="form-group form-inline-pt m-0">
                <Form.Item name="UpdateRVTools_VM" className="m-0">
                  <Switch className="form-control" />
                </Form.Item>
                <label className="label">UpdateRVTools_VM</label>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="form-group form-inline-pt m-0">
                <Form.Item name="SetDesktopsNonProd" className="m-0">
                  <Switch className="form-control" />
                </Form.Item>
                <label className="label">SetDesktopsNonProd</label>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="form-group form-inline-pt m-0">
                <Form.Item name="UpdateRVTools_Host" className="m-0">
                  <Switch className="form-control" />
                </Form.Item>
                <label className="label">UpdateRVTools_Host</label>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="form-group form-inline-pt m-0">
                <Form.Item name="ApplyOverrides" className="m-0">
                  <Switch className="form-control" />
                </Form.Item>
                <label className="label">ApplyOverrides</label>
              </div>
            </Col>
          </Row>
          <div className="btns-block modal-footer pt-lg">
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
