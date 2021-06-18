import { Button, Col, Form, InputNumber, Modal, Row, Select } from 'antd';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { Messages } from '../../../../common/constants/messages';
import { ILookup } from '../../../../services/common/common.model';
import { ISqlServerEntitlements } from '../../../../services/sqlServerEntitlements/sqlServerEntitlements.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getBULookup,
  getCompanyLookup,
  getTenantLookup,
} from '../../../../store/common/common.action';
import { commonSelector } from '../../../../store/common/common.reducer';
import { getSqlServerEntitlementsById, saveSqlServerEntitlements } from '../../../../store/sqlServerEntitlements/sqlServerEntitlements.action';
import { clearSqlServerEntitlementsGetById, clearSqlServerEntitlementsMessages, sqlServerEntitlementsSelector } from '../../../../store/sqlServerEntitlements/sqlServerEntitlements.reducer';
import { IAddSqlServerEntitlementsProps } from './addSqlServerEntitlements.model';
import './addSqlServerEntitlements.style.scss';

const { Option } = Select;

const validateMessages = {
  required: Messages.FIELD_REQUIRED,
  types: {
    number: Messages.NUMBER
  },
  number: {    
    min: Messages.MIN
  }
};

const AddSqlServerEntitlementsModal: React.FC<IAddSqlServerEntitlementsProps> = (props) => {
  const sqlServersEntitlements = useAppSelector(sqlServerEntitlementsSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();

  const { id, showModal, handleModalClose } = props;

  const isNew: boolean = id ? false : true;
  const title = useMemo(() => {
    return isNew ? 'Add Sql Server Entitlements' : 'Edit Sql Server Entitlements';
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ISqlServerEntitlements = {
    company_id: null,
    bu_id: null,
    license_id: 0,
    qty_01: 0,
    qty_02: 0,
    qty_03: 0,
    tenant_id: null
  };

  const onFinish = (values: any) => {
    const inputValues: ISqlServerEntitlements = {
      ...values,
      id: id ? +id : null,
    };
    dispatch(saveSqlServerEntitlements(inputValues));
  };

  useEffect(() => {
    if (sqlServersEntitlements.save.messages.length > 0) {
      if (sqlServersEntitlements.save.hasErrors) {
        toast.error(sqlServersEntitlements.save.messages.join('\n'));
      } else {
        toast.success(sqlServersEntitlements.save.messages.join(' '));
      }
      dispatch(clearSqlServerEntitlementsMessages());
      props.handleModalClose();
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
          tenant_id: _.isNull(data.tenant_id) ? null : commonLookups.tenantLookup?.data.filter((x) => x.id === data.tenant_id)[0]?.id,
          company_id: _.isNull(data.company_id) ? null : commonLookups.companyLookup?.data.filter((x) => x.id === data.company_id)[0]?.id,
          bu_id: _.isNull(data.bu_id) ? null : commonLookups.buLookup?.data.filter((x) => x.id === data.bu_id)[0]?.id,
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
    if (+id > 0) {
      dispatch(getSqlServerEntitlementsById(+id));
    }
    return () => {
      dispatch(clearSqlServerEntitlementsGetById());
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
                <Form.Item name="tenant_id" className="m-0" label="Tenant" rules={[{ required: true }]}>
                  <Select
                    suffixIcon={
                      <img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />
                    }
                    onChange={(value) => dispatch(getCompanyLookup(+value))}
                    allowClear
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
                <Form.Item name="company_id" className="m-0" label="Company" rules={[{ required: true }]}>
                  <Select
                    suffixIcon={
                      <img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />
                    }
                    onChange={(value) => dispatch(getBULookup(+value))}
                    allowClear
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
                <Form.Item name="bu_id" className="m-0" label="BU" rules={[{ required: true }]}>
                  <Select
                    suffixIcon={
                      <img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />
                    }
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
                <label className="label">License Id</label>
                <Form.Item name="license_id" label="License Id" className="m-0" rules={[{ required: true, type: 'number', min : 1}]}>
                  <InputNumber className="form-control w-100" />
                </Form.Item>
              </div>
            </Col>     
            <Col xs={24} sm={12} md={8}>
              <div className="form-group m-0">
                <label className="label">Qty1</label>
                <Form.Item name="qty_01" label="Qty1" className="m-0" rules={[{ type: 'number' }]}>
                  <InputNumber className="form-control w-100" />
                </Form.Item>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="form-group m-0">
                <label className="label">Qty2</label>
                <Form.Item name="qty_02" label="Qty2" className="m-0" rules={[{ type: 'number' }]}>
                  <InputNumber className="form-control w-100" />
                </Form.Item>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="form-group m-0">
                <label className="label">Qty3</label>
                <Form.Item name="qty_03" label="Qty3" className="m-0" rules={[{ type: 'number' }]}>
                  <InputNumber className="form-control w-100" />
                </Form.Item>
              </div>
            </Col>            
          </Row>
          <div className="btns-block modal-footer">
            <Button key="submit" type="primary" htmlType="submit">
                {submitButtonText}
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
export default AddSqlServerEntitlementsModal;