import { Button, Col, DatePicker, Form, Input, Modal, Row, Select, Spin, Switch } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { Messages } from '../../../../common/constants/messages';
import { ILookup } from '../../../../services/common/common.model';
import { IWindowsServerLicense } from '../../../../services/windowsServer/windowsServerLicense/windowsServerLicense.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getAgreementTypesLookup,
  getAllCompanyLookup,
  getBULookup,
} from '../../../../store/common/common.action';
import {
  clearBULookUp,
  clearCompanyLookUp,
  commonSelector,
} from '../../../../store/common/common.reducer';
import {
  getWindowsServerLicenseById,
  saveWindowsServerLicense,
} from '../../../../store/windowsServer/windowsServerLicense/windowsServerLicense.action';
import {
  clearWindowsServerLicenseGetById,
  clearWindowsServerLicenseMessages,
  windowsServerLicenseSelector,
} from '../../../../store/windowsServer/windowsServerLicense/windowsServerLicense.reducer';
import { IAddWindowsServerLicenseProps } from './addWindowsServerLicense.model';

const { Option } = Select;

const validateMessages = {
  required: Messages.FIELD_REQUIRED,
  string: {
    max: Messages.MAXLENGTH,
  },
};

const AddWindowsServerLicenseModal: React.FC<IAddWindowsServerLicenseProps> = (props) => {
  const windowsServerLicense = useAppSelector(windowsServerLicenseSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();

  const { id, showModal, handleModalClose, refreshDataTable } = props;

  const isNew: boolean = id ? false : true;
  const title = useMemo(() => {
    return isNew ? 'Add License Scenario' : 'Edit License Scenario';
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IWindowsServerLicense = {
    bu_id: null,
    company_id: null,
    opt_agreement_type: null,
    opt_exclude_non_prod: false,
    opt_default_to_data_center_on_hosts: false,
    notes: '',
    opt_entitlements: false,
    selected_date: moment(),
  };

  const onFinish = (values: IWindowsServerLicense) => {
    dispatch(saveWindowsServerLicense(values));
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

  const fillValuesOnEdit = async (data: IWindowsServerLicense) => {
    if (data.company_id) {
      await dispatch(getBULookup(data.company_id));
    }
    if (data) {
      initialValues = {
        company_id: _.isNull(data.company_id) ? null : data.company_id,
        bu_id: _.isNull(data.bu_id) ? null : data.bu_id,
        opt_agreement_type: _.isNull(data.opt_agreement_type) ? null : data.opt_agreement_type,
        notes: data.notes,
        opt_default_to_data_center_on_hosts: data.opt_default_to_data_center_on_hosts,
        opt_exclude_non_prod: data.opt_exclude_non_prod,
        opt_entitlements: data.opt_entitlements,
        selected_date: _.isNull(data.selected_date) ? null : moment(data.selected_date),
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (windowsServerLicense.save.messages.length > 0) {
      if (windowsServerLicense.save.hasErrors) {
        toast.error(windowsServerLicense.save.messages.join(' '));
      } else {
        toast.success(windowsServerLicense.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearWindowsServerLicenseMessages());
    }
  }, [windowsServerLicense.save.messages]);

  useEffect(() => {
    if (+id > 0 && windowsServerLicense.getById.data) {
      const data = windowsServerLicense.getById.data;
      fillValuesOnEdit(data);
    }
  }, [windowsServerLicense.getById.data]);

  useEffect(() => {
    dispatch(getAllCompanyLookup());
    dispatch(getAgreementTypesLookup());
    if (+id > 0) {
      dispatch(getWindowsServerLicenseById(+id));
    }
    return () => {
      dispatch(clearWindowsServerLicenseGetById());
      dispatch(clearCompanyLookUp());
      dispatch(clearBULookUp());
    };
  }, [dispatch]);

  return (
    <>
      <Modal
        wrapClassName="custom-modal"
        title={title}
        centered
        visible={showModal}
        onCancel={handleModalClose}
        footer={false}
      >
        {windowsServerLicense.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={windowsServerLicense.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="addWindowsServerLicense"
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
                  <label className="label">BU</label>
                  <Form.Item name="bu_id" className="m-0" label="BU" rules={[{ required: true }]}>
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
                  <label className="label">Agreement Type</label>
                  <Form.Item name="opt_agreement_type" className="m-0" label="Agreement Type">
                    <Select
                      suffixIcon={
                        <img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />
                      }
                      allowClear
                      notFoundContent={
                        commonLookups.agreementTypesLookup.data.length === 0 ? (
                          <Spin size="small" />
                        ) : null
                      }
                    >
                      {commonLookups.agreementTypesLookup.data.map((option: ILookup) => (
                        <Option key={option.id} value={option.id}>
                          {option.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="opt_exclude_non_prod" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Exclude Non-Prod</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item
                    name="opt_default_to_data_center_on_hosts"
                    className="m-0"
                    valuePropName="checked"
                  >
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Default to Data Center on Hosts</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="opt_entitlements" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Assign Entitlements</label>
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
              <Col xs={24}>
                <div className="form-group m-0">
                  <label className="label">Notes</label>
                  <Form.Item
                    name="notes"
                    label="Notes"
                    className="m-0"
                    rules={[{ required: true, max: 510 }]}
                  >
                    <Input.TextArea className="form-control" />
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={windowsServerLicense.save.loading}
              >
                {submitButtonText}
              </Button>
              <Button key="back" onClick={handleModalClose}>
                Cancel
              </Button>
            </div>
          </Form>
        )}
      </Modal>
    </>
  );
};
export default AddWindowsServerLicenseModal;
