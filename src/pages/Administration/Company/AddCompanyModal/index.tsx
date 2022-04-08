import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Spin,
  Switch,
} from 'antd';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { ILookup } from '../../../../services/common/common.model';
import { ICompany } from '../../../../services/master/company/company.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import { getCurrencyLookup, getTenantLookup } from '../../../../store/common/common.action';
import {
  clearBULookUp,
  clearCompanyLookUp,
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';
import { updateMultiple } from '../../../../store/common/common.action';
import { getCompanyById, saveCompany } from '../../../../store/master/company/company.action';
import {
  clearCompanyGetById,
  clearCompanyMessages,
  companySelector,
} from '../../../../store/master/company/company.reducer';
import { IAddCompanyProps } from './addCompany.model';
import {
  forEditModal,
  getObjectForUpdateMultiple,
  getSimpleDate,
  passDateToApi,
} from '../../../../common/helperFunction';
import { clearGlobalCompanyLookUp } from '../../../../store/globalSearch/globalSearch.reducer';

const { Option } = Select;

const AddCompanyModal: React.FC<IAddCompanyProps> = (props) => {
  const company = useAppSelector(companySelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();

  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.Company} level={1} />
      </>
    );
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
    joined_date: getSimpleDate(),
    active: true,
  };

  const onFinish = (values: any) => {
    const inputValues: ICompany = {
      ...values,
      id: id ? +id : null,
    };
    inputValues.joined_date = passDateToApi(inputValues.joined_date, true);
    dispatch(clearGlobalCompanyLookUp());
    if (!isMultiple) {
      dispatch(saveCompany(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        company.search.tableName
      );
      if (result) {
        dispatch(updateMultiple(result));
      }
    }
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
        joined_date: _.isNull(data.joined_date) ? null : forEditModal(data.joined_date),
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
    if (commonLookups.save.messages.length > 0) {
      if (commonLookups.save.hasErrors) {
        toast.error(commonLookups.save.messages.join(' '));
      } else {
        toast.warn(commonLookups.save.messages.join(' '));
        handleModalClose();
      }
      dispatch(clearMultipleUpdateMessages());
    }
  }, [commonLookups.save.messages]);

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

  useEffect(() => {
    if (commonLookups.currencyLookup.data && commonLookups.currencyLookup.data.length) {
      const usdRecord = commonLookups.currencyLookup.data.filter(
        (data) => data.name.toLowerCase() == 'usd'
      );
      if (usdRecord && usdRecord.length) form.setFieldsValue({ currency_id: usdRecord[0].id });
    }
  }, [commonLookups.currencyLookup.data]);

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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'tenant_id']} valuePropName="checked" noStyle>
                      <Checkbox>Tenant</Checkbox>
                    </Form.Item>
                  ) : (
                    'Tenant'
                  )}
                  <Form.Item name="tenant_id" className="m-0" label="Tenant">
                    <Select
                      allowClear
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option: any) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      filterSort={(optionA: any, optionB: any) =>
                        optionA.children
                          ?.toLowerCase()
                          ?.localeCompare(optionB.children?.toLowerCase())
                      }
                      loading={commonLookups.tenantLookup.loading}
                    >
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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'name']} valuePropName="checked" noStyle>
                      <Checkbox>Company Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Company Name'
                  )}
                  <Form.Item
                    name="name"
                    label="Company Name"
                    className="m-0"
                    rules={[{ required: !isMultiple, max: 200 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'currency_id']} valuePropName="checked" noStyle>
                      <Checkbox>Currency</Checkbox>
                    </Form.Item>
                  ) : (
                    'Currency'
                  )}
                  <Form.Item name="currency_id" className="m-0" label="Currency">
                    <Select
                      loading={commonLookups.currencyLookup.loading}
                      allowClear
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option: any) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      filterSort={(optionA: any, optionB: any) =>
                        optionA.children
                          ?.toLowerCase()
                          ?.localeCompare(optionB.children?.toLowerCase())
                      }
                    >
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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'address']} valuePropName="checked" noStyle>
                      <Checkbox>Address</Checkbox>
                    </Form.Item>
                  ) : (
                    'Address'
                  )}
                  <Form.Item name="address" label="Address" className="m-0" rules={[{ max: 200 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'city']} valuePropName="checked" noStyle>
                      <Checkbox>City</Checkbox>
                    </Form.Item>
                  ) : (
                    'City'
                  )}
                  <Form.Item name="city" label="City" className="m-0" rules={[{ max: 200 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'province']} valuePropName="checked" noStyle>
                      <Checkbox>Province</Checkbox>
                    </Form.Item>
                  ) : (
                    'Province'
                  )}
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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'postal_code']} valuePropName="checked" noStyle>
                      <Checkbox>Postal Code</Checkbox>
                    </Form.Item>
                  ) : (
                    'Postal Code'
                  )}
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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'phone']} valuePropName="checked" noStyle>
                      <Checkbox>Phone</Checkbox>
                    </Form.Item>
                  ) : (
                    'Phone'
                  )}
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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'fax']} valuePropName="checked" noStyle>
                      <Checkbox>Fax</Checkbox>
                    </Form.Item>
                  ) : (
                    'Fax'
                  )}
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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'email']} valuePropName="checked" noStyle>
                      <Checkbox>Email</Checkbox>
                    </Form.Item>
                  ) : (
                    'Email'
                  )}
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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'joined_date']} valuePropName="checked" noStyle>
                      <Checkbox>Joined Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'Joined Date'
                  )}
                  <Form.Item
                    name="joined_date"
                    label="Joined Date"
                    className="m-0"
                    rules={[{ required: !isMultiple }]}
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
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item name={['checked', 'active']} valuePropName="checked" noStyle>
                      <Checkbox>Active</Checkbox>
                    </Form.Item>
                  ) : (
                    'Active'
                  )}
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={company.save.loading || commonLookups.save.loading}
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
export default AddCompanyModal;
