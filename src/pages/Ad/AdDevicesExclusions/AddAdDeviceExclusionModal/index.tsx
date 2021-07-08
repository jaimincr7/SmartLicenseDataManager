import { Button, Col, Form, Input, InputNumber, Modal, Row, Select, Spin, Switch } from 'antd';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { Messages } from '../../../../common/constants/messages';
import { ILookup } from '../../../../services/common/common.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getBULookup,
  getCompanyLookup,
  getTenantLookup,
} from '../../../../store/common/common.action';
import {
  clearBULookUp,
  clearCompanyLookUp,
  commonSelector,
} from '../../../../store/common/common.reducer';
import { IAddAdDevicesExclusionsProps } from './addAdDeviceExclusion.model';
import {
  adDevicesExclusionsSelector,
  clearAdDevicesExclusionsGetById,
  clearAdDevicesExclusionsMessages,
} from '../../../../store/ad/adDevicesExclusions/adDevicesExclusions.reducer';
import {
  getAdDevicesExclusionsById,
  saveAdDevicesExclusions,
} from '../../../../store/ad/adDevicesExclusions/adDevicesExclusions.action';
import { IAdDevicesExclusions } from '../../../../services/ad/adDevicesExclusions/adDevicesExclusions.model';

const { Option } = Select;

const validateMessages = {
  required: Messages.FIELD_REQUIRED,
  string: {
    max: Messages.MAXLENGTH,
  },
  types: {
    number: Messages.NUMBER,
  },
  number: {
    min: Messages.MIN,
  },
};

const AddAdDevicesExclusionsModal: React.FC<IAddAdDevicesExclusionsProps> = (props) => {
  const adDevicesExclusions = useAppSelector(adDevicesExclusionsSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();

  const { id, showModal, handleModalClose, refreshDataTable } = props;

  const isNew: boolean = id ? false : true;
  const title = useMemo(() => {
    return isNew ? 'Add Ad Devices Exclusions' : 'Edit Ad Devices Exclusions';
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IAdDevicesExclusions = {
    tenant_id: null,
    company_id: null,
    bu_id: null,
    field: '',
    condition: '',
    value: '',
    desktop: false,
    server: false,
    unknown: false,
    instance_count: null,
    decom: false,
  };

  const onFinish = (values: any) => {
    const inputValues: IAdDevicesExclusions = {
      ...values,
      id: id ? +id : null,
    };
    dispatch(saveAdDevicesExclusions(inputValues));
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
        field: data.field,
        condition: data.condition,
        value: data.value,
        desktop: data.desktop,
        server: data.server,
        unknown: data.unknown,
        instance_count: data.instance_count,
        decom: data.decom,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (adDevicesExclusions.save.messages.length > 0) {
      if (adDevicesExclusions.save.hasErrors) {
        toast.error(adDevicesExclusions.save.messages.join(' '));
      } else {
        toast.success(adDevicesExclusions.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearAdDevicesExclusionsMessages());
    }
  }, [adDevicesExclusions.save.messages]);

  useEffect(() => {
    if (+id > 0 && adDevicesExclusions.getById.data) {
      const data = adDevicesExclusions.getById.data;
      fillValuesOnEdit(data);
    }
  }, [adDevicesExclusions.getById.data]);

  useEffect(() => {
    dispatch(getTenantLookup());
    if (+id > 0) {
      dispatch(getAdDevicesExclusionsById(+id));
    }
    return () => {
      dispatch(clearAdDevicesExclusionsGetById());
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
        {adDevicesExclusions.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={adDevicesExclusions.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="addAdDevicesExclusions"
            initialValues={initialValues}
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Row gutter={[30, 15]} className="form-label-hide">
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Tenant</label>
                  <Form.Item name="tenant_id" className="m-0" label="Tenant">
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
                  <label className="label">Field</label>
                  <Form.Item
                    name="field"
                    label="Field"
                    className="m-0"
                    rules={[{ required: true, max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Condition</label>
                  <Form.Item
                    name="condition"
                    className="m-0"
                    label="Condition"
                    rules={[{ required: true, max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Value</label>
                  <Form.Item
                    name="value"
                    label="Value"
                    className="m-0"
                    rules={[{ required: true, max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Instance Count</label>
                  <Form.Item
                    name="instance_count"
                    label="Instance Count"
                    className="m-0"
                    rules={[{ type: 'number', min: 0 }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <Row gutter={[30, 15]} className="form-label-hide">
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="desktop" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Desktop</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="server" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Server</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="unknown" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Unknown</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="decom" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Decom</label>
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={adDevicesExclusions.save.loading}
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
export default AddAdDevicesExclusionsModal;
