import { Button, Col, Form, InputNumber, Modal, Row, Select, Spin } from 'antd';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { validateMessages } from '../../../../common/constants/common';
import { ILookup } from '../../../../services/common/common.model';
import { IWindowsServerPricing } from '../../../../services/windowsServer/windowsServerPricing/windowsServerPricing.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getAgreementTypesLookup,
  getBULookup,
  getCompanyLookup,
  getCurrencyLookup,
  getWindowsServerLicenseLookup,
  getTenantLookup,
} from '../../../../store/common/common.action';
import {
  clearBULookUp,
  clearCompanyLookUp,
  commonSelector,
} from '../../../../store/common/common.reducer';
import {
  saveWindowsServerPricing,
  getWindowsServerPricingById,
} from '../../../../store/windowsServer/windowsServerPricing/windowsServerPricing.action';
import {
  windowsServerPricingSelector,
  clearWindowsServerPricingMessages,
  clearWindowsServerPricingGetById,
} from '../../../../store/windowsServer/windowsServerPricing/windowsServerPricing.reducer';
import { IAddWindowsServerPricingProps } from './addWindowsServerPricing.model';

const { Option } = Select;

const AddWindowsServerPricingModal: React.FC<IAddWindowsServerPricingProps> = (props) => {
  const windowsServerPricing = useAppSelector(windowsServerPricingSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();

  const { id, showModal, handleModalClose, refreshDataTable } = props;

  const isNew: boolean = id ? false : true;
  const title = useMemo(() => {
    return isNew ? 'Add Windows Server Pricing' : 'Edit Windows Server Pricing';
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IWindowsServerPricing = {
    bu_id: null,
    company_id: null,
    tenant_id: null,
    license_id: null,
    price: null,
    currency_id: null,
    agreement_type_id: null,
  };

  const onFinish = (values: any) => {
    const inputValues: IWindowsServerPricing = {
      ...values,
      id: id ? +id : null,
    };
    dispatch(saveWindowsServerPricing(inputValues));
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
    if (windowsServerPricing.save.messages.length > 0) {
      if (windowsServerPricing.save.hasErrors) {
        toast.error(windowsServerPricing.save.messages.join(' '));
      } else {
        toast.success(windowsServerPricing.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearWindowsServerPricingMessages());
    }
  }, [windowsServerPricing.save.messages]);

  useEffect(() => {
    if (+id > 0 && windowsServerPricing.getById.data) {
      const data = windowsServerPricing.getById.data;
      fillValuesOnEdit(data);
    }
  }, [windowsServerPricing.getById.data]);

  useEffect(() => {
    dispatch(getTenantLookup());
    dispatch(getAgreementTypesLookup());
    dispatch(getWindowsServerLicenseLookup());
    dispatch(getCurrencyLookup());
    if (+id > 0) {
      dispatch(getWindowsServerPricingById(+id));
    }
    return () => {
      dispatch(clearWindowsServerPricingGetById());
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
        {windowsServerPricing.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={windowsServerPricing.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="addWindowsServerPricing"
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
                      onChange={handleTenantChange}
                      allowClear
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
                  <label className="label">Company</label>
                  <Form.Item name="company_id" className="m-0" label="Company">
                    <Select
                      onChange={handleCompanyChange}
                      allowClear
                      loading={commonLookups.companyLookup.loading}
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
                      onChange={handleBUChange}
                      allowClear
                      loading={commonLookups.buLookup.loading}
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
                    <Select loading={commonLookups.windowsServerLicenseLookup.loading} allowClear>
                      {commonLookups.windowsServerLicenseLookup.data.map((option: ILookup) => (
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
                    <Select loading={commonLookups.agreementTypesLookup.loading} allowClear>
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
                  <label className="label">Price</label>
                  <Form.Item
                    name="price"
                    label="Price"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber min={0} className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={windowsServerPricing.save.loading}
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
export default AddWindowsServerPricingModal;
