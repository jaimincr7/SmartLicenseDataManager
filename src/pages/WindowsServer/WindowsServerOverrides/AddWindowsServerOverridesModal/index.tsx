import { Button, Col, Form, Input, Modal, Row, Select, Spin, Switch } from 'antd';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { Messages } from '../../../../common/constants/messages';
import { ILookup } from '../../../../services/common/common.model';
import { IWindowsServerOverrides } from '../../../../services/windowsServer/windowsServerOverrides/windowsServerOverrides.model';
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
import {
  getWindowsServerOverridesById,
  saveWindowsServerOverrides,
} from '../../../../store/windowsServer/windowsServerOverrides/windowsServerOverrides.action';
import {
  clearWindowsServerOverridesGetById,
  clearWindowsServerOverridesMessages,
  windowsServerOverridesSelector,
} from '../../../../store/windowsServer/windowsServerOverrides/windowsServerOverrides.reducer';
import { IAddWindowsServerOverridesProps } from './addWindowsServerOverrides.model';

const { Option } = Select;

const validateMessages = {
  required: Messages.FIELD_REQUIRED,
  string: {
    max: Messages.MAXLENGTH,
  },
};

const AddWindowsServerOverridesModal: React.FC<IAddWindowsServerOverridesProps> = (props) => {
  const overrides = useAppSelector(windowsServerOverridesSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();

  const { id, showModal, handleModalClose, refreshDataTable } = props;

  const isNew: boolean = id ? false : true;
  const title = useMemo(() => {
    return isNew ? 'Add Windows Server Override' : 'Edit Windows Server Override';
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IWindowsServerOverrides = {
    bu_id: null,
    company_id: null,
    tenant_id: null,
    device_name: '',
    id_device_type: '',
    id_field: '',
    id_value: '',
    override_field: '',
    override_value: '',
    enabled: false,
    version: '',
    edition: '',
    source: '',
    notes: '',
  };

  const onFinish = (values: any) => {
    const inputValues: IWindowsServerOverrides = {
      ...values,
      id: id ? +id : null,
    };
    dispatch(saveWindowsServerOverrides(inputValues));
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

  const fillValuesOnEdit = async (data: IWindowsServerOverrides) => {
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
        override_field: data.override_field,
        override_value: data.override_value,
        device_name: data.device_name,
        id_device_type: data.id_device_type,
        id_field: data.id_field,
        id_value: data.id_value,
        version: data.version,
        edition: data.edition,
        source: data.source,
        enabled: data.enabled,
        notes: data.notes,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (overrides.save.messages.length > 0) {
      if (overrides.save.hasErrors) {
        toast.error(overrides.save.messages.join(' '));
      } else {
        toast.success(overrides.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearWindowsServerOverridesMessages());
    }
  }, [overrides.save.messages]);

  useEffect(() => {
    if (+id > 0 && overrides.getById.data) {
      const data = overrides.getById.data;
      fillValuesOnEdit(data);
    }
  }, [overrides.getById.data]);

  useEffect(() => {
    dispatch(getTenantLookup());
    if (+id > 0) {
      dispatch(getWindowsServerOverridesById(+id));
    }
    return () => {
      dispatch(clearWindowsServerOverridesGetById());
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
        {overrides.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={overrides.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="addWindowsServerOverrides"
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
                  <label className="label">Device Name</label>
                  <Form.Item
                    name="device_name"
                    label="Device name"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Device Type</label>
                  <Form.Item
                    name="id_device_type"
                    label="Device Type"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Field</label>
                  <Form.Item name="id_field" label="Field" className="m-0" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Value</label>
                  <Form.Item name="id_value" label="Value" className="m-0" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Override Field</label>
                  <Form.Item
                    name="override_field"
                    label="Override Field"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Override Value</label>
                  <Form.Item
                    name="override_value"
                    className="m-0"
                    label="Override Value"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Version</label>
                  <Form.Item name="version" label="Version" className="m-0" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Edition</label>
                  <Form.Item name="edition" label="Edition" className="m-0" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Source</label>
                  <Form.Item name="source" label="Source" className="m-0" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="enabled" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Enabled</label>
                </div>
              </Col>
              <Col xs={24}>
                <div className="form-group m-0">
                  <label className="label">Notes</label>
                  <Form.Item name="notes" label="Notes" className="m-0">
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
                loading={overrides.save.loading}
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
export default AddWindowsServerOverridesModal;
