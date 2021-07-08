import { Button, Col, Form, Input, Modal, Row, Select, Spin, Switch } from 'antd';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { Messages } from '../../../../common/constants/messages';
import { ILookup } from '../../../../services/common/common.model';
import { ISqlServerLicense } from '../../../../services/sqlServerLicense/sqlServerLicense.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getAgreementTypesLookup,
  getBULookup,
  getCompanyLookup,
  getTenantLookup,
} from '../../../../store/common/common.action';
import {
  clearBULookUp,
  clearCompanyLookUp,
  commonSelector,
} from '../../../../store/common/common.reducer';
import {
  getSqlServerLicenseById,
  saveSqlServerLicense,
} from '../../../../store/sqlServerLicense/sqlServerLicense.action';
import {
  clearSqlServerLicenseGetById,
  clearSqlServerLicenseMessages,
  sqlServerLicenseSelector,
} from '../../../../store/sqlServerLicense/sqlServerLicense.reducer';
import { IAddSqlServerLicenseProps } from './addSqlServerLicense.model';
import './addSqlServerLicense.style.scss';

const { Option } = Select;

const validateMessages = {
  required: Messages.FIELD_REQUIRED,
  string: {
    max: Messages.MAXLENGTH,
  },
};

const AddSqlServerLicenseModal: React.FC<IAddSqlServerLicenseProps> = (props) => {
  const sqlServerLicense = useAppSelector(sqlServerLicenseSelector);
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

  let initialValues: ISqlServerLicense = {
    bu_id: null,
    company_id: null,
    tenant_id: null,
    opt_agreement_type: null,
    opt_exclude_non_prod: false,
    opt_cluster_logic: false,
    apt_default_to_enterprise_on_hosts: false,
    notes: '',
    opt_entitlements: false,
  };

  const onFinish = (values: any) => {
    const inputValues: ISqlServerLicense = {
      ...values,
      id: id ? +id : null,
    };
    dispatch(saveSqlServerLicense(inputValues));
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

  const fillValuesOnEdit = async (data: ISqlServerLicense) => {
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
        opt_agreement_type: _.isNull(data.opt_agreement_type) ? null : data.opt_agreement_type,
        notes: data.notes,
        apt_default_to_enterprise_on_hosts: data.apt_default_to_enterprise_on_hosts,
        opt_cluster_logic: data.opt_cluster_logic,
        opt_exclude_non_prod: data.opt_exclude_non_prod,
        opt_entitlements: data.opt_entitlements,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (sqlServerLicense.save.messages.length > 0) {
      if (sqlServerLicense.save.hasErrors) {
        toast.error(sqlServerLicense.save.messages.join(' '));
      } else {
        toast.success(sqlServerLicense.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearSqlServerLicenseMessages());
    }
  }, [sqlServerLicense.save.messages]);

  useEffect(() => {
    if (+id > 0 && sqlServerLicense.getById.data) {
      const data = sqlServerLicense.getById.data;
      fillValuesOnEdit(data);
    }
  }, [sqlServerLicense.getById.data]);

  useEffect(() => {
    dispatch(getTenantLookup());
    dispatch(getAgreementTypesLookup());
    if (+id > 0) {
      dispatch(getSqlServerLicenseById(+id));
    }
    return () => {
      dispatch(clearSqlServerLicenseGetById());
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
        {sqlServerLicense.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={sqlServerLicense.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="addSqlServerLicense"
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
                  <label className="label">Opt Exclude Non-Prod</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="opt_cluster_logic" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Opt Cluster Logic</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item
                    name="apt_default_to_enterprise_on_hosts"
                    className="m-0"
                    valuePropName="checked"
                  >
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Opt Default to Enterprise on Hosts</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="opt_entitlements" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Opt Entitlements</label>
                </div>
              </Col>
              <Col xs={24}>
                <div className="form-group m-0">
                  <label className="label">Notes</label>
                  <Form.Item name="notes" label="Notes" className="m-0" rules={[{ max: 510 }]}>
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
                loading={sqlServerLicense.save.loading}
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
export default AddSqlServerLicenseModal;
