import { Button, Col, Form, InputNumber, Modal, Row, Select, Spin } from 'antd';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { Messages } from '../../../../common/constants/messages';
import { ILookup } from '../../../../services/common/common.model';
import { ISqlServerPricing } from '../../../../services/sqlServer/sqlServerPricing/sqlServerPricing.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getAgreementTypesLookup,
  getBULookup,
  getCompanyLookup,
  getCurrencyLookup,
  getSqlServerLicenseLookup,
  getTenantLookup,
} from '../../../../store/common/common.action';
import {
  clearBULookUp,
  clearCompanyLookUp,
  commonSelector,
} from '../../../../store/common/common.reducer';
import {
  getSqlServerPricingById,
  saveSqlServerPricing,
} from '../../../../store/sqlServer/sqlServerPricing/sqlServerPricing.action';
import {
  clearSqlServerPricingGetById,
  clearSqlServerPricingMessages,
  sqlServerPricingSelector,
} from '../../../../store/sqlServer/sqlServerPricing/sqlServerPricing.reducer';
import { IAddSqlServerPricingProps } from './addSqlServerPricing.model';

const { Option } = Select;

const validateMessages = {
  required: Messages.FIELD_REQUIRED,
};

const AddSqlServerPricingModal: React.FC<IAddSqlServerPricingProps> = (props) => {
  const sqlServerPricing = useAppSelector(sqlServerPricingSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();

  const { id, showModal, handleModalClose, refreshDataTable } = props;

  const isNew: boolean = id ? false : true;
  const title = useMemo(() => {
    return isNew ? 'Add Sql Server Pricing' : 'Edit Sql Server Pricing';
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ISqlServerPricing = {
    bu_id: null,
    company_id: null,
    tenant_id: null,
    license_id: null,
    price: null,
    currency_id: null,
    agreement_type_id: null,
  };

  const onFinish = (values: any) => {
    const inputValues: ISqlServerPricing = {
      ...values,
      id: id ? +id : null,
    };
    dispatch(saveSqlServerPricing(inputValues));
  };

  const handleTenantChange = (tenantId: number) => {
    form.setFieldsValue({ tenant_id: tenantId, company_id: null, bu_id: null });
    if (tenantId) {
      dispatch(getCompanyLookup(tenantId));
      dispatch(clearBULookUp());
    } else {
      dispatch(clearCompanyLookUp());
      dispatch(clearBULookUp());
    }
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

  const fillValuesOnEdit = async (data) => {
    if (data.tenant_id) {
      await dispatch(getCompanyLookup(data.tenant_id));
    }
    if (data.company_id) {
      await dispatch(getBULookup(data.company_id));
    }
    if (data) {
      initialValues = {
        tenant_id: _.isNull(data.tenant_id) ? null : data.tenant_id,
        company_id: _.isNull(data.company_id) ? null : data.company_id,
        bu_id: _.isNull(data.bu_id) ? null : data.bu_id,
        agreement_type_id: _.isNull(data.agreement_type_id) ? null : data.agreement_type_id,
        currency_id: _.isNull(data.currency_id) ? null : data.currency_id,
        license_id: _.isNull(data.license_id) ? null : data.license_id,
        price: data.price,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (sqlServerPricing.save.messages.length > 0) {
      if (sqlServerPricing.save.hasErrors) {
        toast.error(sqlServerPricing.save.messages.join(' '));
      } else {
        toast.success(sqlServerPricing.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearSqlServerPricingMessages());
    }
  }, [sqlServerPricing.save.messages]);

  useEffect(() => {
    if (+id > 0 && sqlServerPricing.getById.data) {
      const data = sqlServerPricing.getById.data;
      fillValuesOnEdit(data);
    }
  }, [sqlServerPricing.getById.data]);

  useEffect(() => {
    dispatch(getTenantLookup());
    dispatch(getAgreementTypesLookup());
    dispatch(getSqlServerLicenseLookup());
    dispatch(getCurrencyLookup());
    if (+id > 0) {
      dispatch(getSqlServerPricingById(+id));
    }
    return () => {
      dispatch(clearSqlServerPricingGetById());
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
        {sqlServerPricing.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={sqlServerPricing.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="addSqlServerPricing"
            initialValues={initialValues}
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Row gutter={[30, 15]} className="form-label-hide">
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Tenant</label>
                  <Form.Item
                    name="tenant_id"
                    className="m-0"
                    label="Tenant"
                    rules={[{ required: true }]}
                  >
                    <Select
                      suffixIcon={
                        <img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />
                      }
                      onChange={handleTenantChange}
                      allowClear
                      notFoundContent={
                        commonLookups.tenantLookup.data.length === 0 ? <Spin size="small" /> : null
                      }
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
                  <label className="label">Company</label>
                  <Form.Item name="company_id" className="m-0" label="Company">
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
                  <label className="label">BU</label>
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
                  <label className="label">Product Name</label>
                  <Form.Item name="license_id" className="m-0" label="Product Name">
                    <Select
                      suffixIcon={
                        <img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />
                      }
                      allowClear
                      notFoundContent={
                        commonLookups.sqlServerLicenseLookup.data.length === 0 ? (
                          <Spin size="small" />
                        ) : null
                      }
                    >
                      {commonLookups.sqlServerLicenseLookup.data.map((option: ILookup) => (
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
                  <Form.Item name="agreement_type_id" className="m-0" label="Agreement Type">
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
                <div className="form-group m-0">
                  <label className="label">Currency</label>
                  <Form.Item name="currency_id" className="m-0" label="Currency">
                    <Select
                      suffixIcon={
                        <img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />
                      }
                      allowClear
                      notFoundContent={
                        commonLookups.currencyLookup.data.length === 0 ? (
                          <Spin size="small" />
                        ) : null
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
                  <label className="label">Price</label>
                  <Form.Item
                    name="price"
                    label="Price"
                    className="m-0"
                    rules={[{ type: 'number', min: 0 }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={sqlServerPricing.save.loading}
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
export default AddSqlServerPricingModal;
