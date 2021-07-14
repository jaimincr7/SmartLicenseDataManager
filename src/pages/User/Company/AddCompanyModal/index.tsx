import { Button, Col, DatePicker, Form, Input, Modal, Row, Select, Spin, Switch } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { Messages } from '../../../../common/constants/messages';
import { ILookup } from '../../../../services/common/common.model';
import { ICompany } from '../../../../services/master/company/company.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import { getCurrencyLookup, getTenantLookup } from '../../../../store/common/common.action';
import {
  clearBULookUp,
  clearCompanyLookUp,
  commonSelector,
} from '../../../../store/common/common.reducer';
import { getCompanyById, saveCompany } from '../../../../store/master/company/company.action';
import {
  clearCompanyGetById,
  clearCompanyMessages,
  companySelector,
} from '../../../../store/master/company/company.reducer';
import { IAddCompanyProps } from './addCompany.model';

const { Option } = Select;

const validateMessages = {
  required: Messages.FIELD_REQUIRED,
  types: {
    email: Messages.INVALID,
  },
  string: {
    max: Messages.MAXLENGTH,
  },
  pattern: {
    mismatch: Messages.INVALID,
  },
};

const AddCompanyModal: React.FC<IAddCompanyProps> = (props) => {
  const company = useAppSelector(companySelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();

  const { id, showModal, handleModalClose, refreshDataTable } = props;

  const isNew: boolean = id ? false : true;
  const title = useMemo(() => {
    return isNew ? 'Add Company' : 'Edit Company';
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ICompany = {
    tenant_id: null,
    currency_id: null,
    name: '',
    address: '',
    city: '',
    province: '',
    postal_code: '',
    phone: '',
    fax: '',
    email: null,
    joined_date: moment(),
    active: false,
  };

  const onFinish = (values: any) => {
    const inputValues: ICompany = {
      ...values,
      id: id ? +id : null,
    };
    dispatch(saveCompany(inputValues));
  };

  const fillValuesOnEdit = async (data: ICompany) => {
    if (data) {
      initialValues = {
        tenant_id: _.isNull(data.tenant_id) ? null : data.tenant_id,
        currency_id: _.isNull(data.currency_id) ? null : data.currency_id,
        name: data.name,
        address: data.address,
        city: data.city,
        province: data.province,
        postal_code: data.postal_code,
        phone: data.phone,
        fax: data.fax,
        email: data.email,
        active: data.active,
        joined_date: _.isNull(data.joined_date) ? null : moment(data.joined_date),
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (company.save.messages.length > 0) {
      if (company.save.hasErrors) {
        toast.error(company.save.messages.join(' '));
      } else {
        toast.success(company.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearCompanyMessages());
    }
  }, [company.save.messages]);

  useEffect(() => {
    if (+id > 0 && company.getById.data) {
      const data = company.getById.data;
      fillValuesOnEdit(data);
    }
  }, [company.getById.data]);

  useEffect(() => {
    dispatch(getTenantLookup());
    dispatch(getCurrencyLookup());
    if (+id > 0) {
      dispatch(getCompanyById(+id));
    }
    return () => {
      dispatch(clearCompanyGetById());
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
        {company.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={company.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="addCompany"
            initialValues={initialValues}
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Row gutter={[30, 15]} className="form-label-hide">
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Tenant</label>
                  <Form.Item name="tenant_id" className="m-0" label="Tenant">
                    <Select allowClear loading={commonLookups.tenantLookup.loading}>
                      {commonLookups.tenantLookup.data.map((option: ILookup) => (
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
                  <label className="label">Currency</label>
                  <Form.Item name="currency_id" className="m-0" label="Currency">
                    <Select loading={commonLookups.currencyLookup.loading} allowClear>
                      {commonLookups.currencyLookup.data.map((option: ILookup) => (
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
                  <label className="label">Company Name</label>
                  <Form.Item
                    name="name"
                    label="Company Name"
                    className="m-0"
                    rules={[{ required: true, max: 200 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Address</label>
                  <Form.Item name="address" label="Address" className="m-0" rules={[{ max: 200 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">City</label>
                  <Form.Item name="city" label="City" className="m-0" rules={[{ max: 200 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Province</label>
                  <Form.Item
                    name="province"
                    label="Province"
                    className="m-0"
                    rules={[{ max: 200 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Postal Code</label>
                  <Form.Item
                    name="postal_code"
                    label="Postal Code "
                    className="m-0"
                    rules={[{ pattern: /^[0-9\b]+$/, max: 20 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Phone</label>
                  <Form.Item
                    name="phone"
                    label="Phone"
                    className="m-0"
                    rules={[{ pattern: /^[0-9\b]+$/, max: 30 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Fax</label>
                  <Form.Item
                    name="fax"
                    label="Fax"
                    className="m-0"
                    rules={[{ pattern: /^[0-9\b]+$/, max: 30 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Email</label>
                  <Form.Item
                    name="email"
                    label="Email"
                    className="m-0"
                    rules={[{ type: 'email', max: 100 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Joined Date</label>
                  <Form.Item
                    name="joined_date"
                    label="Joined Date"
                    className="m-0"
                    rules={[{ required: true }]}
                  >
                    <DatePicker className="w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="active" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Active</label>
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button key="submit" type="primary" htmlType="submit" loading={company.save.loading}>
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
export default AddCompanyModal;
