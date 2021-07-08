import { Button, Col, Form, InputNumber, Modal, Row, Select, Spin } from 'antd';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { Messages } from '../../../../common/constants/messages';
import { ILookup } from '../../../../services/common/common.model';
import { ISqlServerEntitlements } from '../../../../services/sqlServer/sqlServerEntitlements/sqlServerEntitlements.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getBULookup,
  getCompanyLookup,
  getSqlServerLicenseLookup,
  getTenantLookup,
} from '../../../../store/common/common.action';
import {
  clearBULookUp,
  clearCompanyLookUp,
  commonSelector,
} from '../../../../store/common/common.reducer';
import {
  getSqlServerEntitlementsById,
  saveSqlServerEntitlements,
} from '../../../../store/sqlServer/sqlServerEntitlements/sqlServerEntitlements.action';
import {
  clearSqlServerEntitlementsGetById,
  clearSqlServerEntitlementsMessages,
  sqlServerEntitlementsSelector,
} from '../../../../store/sqlServer/sqlServerEntitlements/sqlServerEntitlements.reducer';
import { IAddSqlServerEntitlementsProps } from './addSqlServerEntitlements.model';

const { Option } = Select;

const validateMessages = {
  required: Messages.FIELD_REQUIRED,
  types: {
    number: Messages.NUMBER,
  },
  number: {
    min: Messages.MIN,
  },
};

const AddSqlServerEntitlementsModal: React.FC<IAddSqlServerEntitlementsProps> = (props) => {
  const sqlServersEntitlements = useAppSelector(sqlServerEntitlementsSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();

  const { id, showModal, handleModalClose, refreshDataTable } = props;

  const isNew: boolean = id ? false : true;
  const title = useMemo(() => {
    return isNew ? 'Add Sql Server Entitlement' : 'Edit Sql Server Entitlement';
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ISqlServerEntitlements = {
    company_id: null,
    bu_id: null,
    license_id: null,
    qty_01: 0,
    qty_02: 0,
    qty_03: 0,
    tenant_id: null,
  };

  const onFinish = (values: any) => {
    const inputValues: ISqlServerEntitlements = {
      ...values,
      id: id ? +id : null,
    };
    dispatch(saveSqlServerEntitlements(inputValues));
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

  useEffect(() => {
    if (sqlServersEntitlements.save.messages.length > 0) {
      if (sqlServersEntitlements.save.hasErrors) {
        toast.error(sqlServersEntitlements.save.messages.join(' '));
      } else {
        toast.success(sqlServersEntitlements.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearSqlServerEntitlementsMessages());
    }
  }, [sqlServersEntitlements.save.messages]);

  useEffect(() => {
    if (+id > 0 && sqlServersEntitlements.getById.data) {
      const data = sqlServersEntitlements.getById.data;

      if (data.tenant_id) {
        dispatch(getCompanyLookup(data.tenant_id));
      }
      if (data.company_id) {
        dispatch(getBULookup(data.company_id));
      }
      if (data) {
        initialValues = {
          tenant_id: _.isNull(data.tenant_id) ? null : data.tenant_id,
          company_id: _.isNull(data.company_id) ? null : data.company_id,
          bu_id: _.isNull(data.bu_id) ? null : data.bu_id,
          license_id: data.license_id,
          qty_01: data.qty_01,
          qty_02: data.qty_02,
          qty_03: data.qty_03,
        };
        form.setFieldsValue(initialValues);
      }
    }
  }, [sqlServersEntitlements.getById.data]);

  useEffect(() => {
    dispatch(getTenantLookup());
    dispatch(getSqlServerLicenseLookup());
    if (+id > 0) {
      dispatch(getSqlServerEntitlementsById(+id));
    }
    return () => {
      dispatch(clearSqlServerEntitlementsGetById());
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
        {sqlServersEntitlements.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={sqlServersEntitlements.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="addSqlServerEntitlements"
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
                  <label className="label">Qty1</label>
                  <Form.Item
                    name="qty_01"
                    label="Qty1"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Qty2</label>
                  <Form.Item
                    name="qty_02"
                    label="Qty2"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Qty3</label>
                  <Form.Item
                    name="qty_03"
                    label="Qty3"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Product Name</label>
                  <Form.Item name="license_id" className="m-0" label="Product name">
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
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={sqlServersEntitlements.save.loading}
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
export default AddSqlServerEntitlementsModal;
