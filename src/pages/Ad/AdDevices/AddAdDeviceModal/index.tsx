import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Spin,
  Switch,
} from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { IAdDevices } from '../../../../services/ad/adDevices/adDevices.model';
import { ILookup } from '../../../../services/common/common.model';
import { getAdDeviceById, saveAdDevice } from '../../../../store/ad/adDevices/adDevices.action';
import {
  adDevicesSelector,
  clearAdDeviceGetById,
  clearAdDeviceMessages,
} from '../../../../store/ad/adDevices/adDevices.reducer';
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
import { IAddAdDeviceProps } from './addAdDevice.model';

const { Option } = Select;

const AddAdDeviceModal: React.FC<IAddAdDeviceProps> = (props) => {
  const adDevices = useAppSelector(adDevicesSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();

  const { id, showModal, handleModalClose, refreshDataTable } = props;

  const isNew: boolean = id ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.ADDevices} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IAdDevices = {
    tenant_id: null,
    company_id: null,
    bu_id: null,
    source: '',
    distinguished_name: '',
    dns_host_name: '',
    enabled: false,
    iPv4_address: '',
    last_logon: '',
    last_logon_date: null,
    last_logon_timestamp: '',
    name: '',
    object_class: '',
    object_guid: '',
    operating_system: '',
    password_expired: false,
    password_last_set: null,
    password_never_expires: false,
    sam_account_name: '',
    sid: '',
    user_principal_name: '',
    when_created: null,
    device_type: '',
    exclusion: '',
    exclusion_id: null,
    inventoried: false,
    active: false,
    qualified: false,
    domain: '',
    description: '',
  };

  const onFinish = (values: any) => {
    const inputValues: IAdDevices = {
      ...values,
      id: id ? +id : null,
    };
    dispatch(saveAdDevice(inputValues));
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
        device_type: data.device_type,
        source: data.source,
        operating_system: data.operating_system,
        distinguished_name: data.distinguished_name,
        dns_host_name: data.dns_host_name,
        enabled: data.enabled,
        iPv4_address: data.iPv4_address,
        last_logon: data.last_logon,
        last_logon_date: _.isNull(data.last_logon_date) ? null : moment(data.last_logon_date),
        last_logon_timestamp: data.last_logon_timestamp,
        name: data.name,
        object_class: data.object_class,
        object_guid: data.object_guid,
        password_expired: data.password_expired,
        password_last_set: _.isNull(data.password_last_set) ? null : moment(data.password_last_set),
        password_never_expires: data.password_never_expires,
        sam_account_name: data.sam_account_name,
        sid: data.sid,
        user_principal_name: data.user_principal_name,
        when_created: _.isNull(data.when_created) ? null : moment(data.when_created),
        exclusion: data.exclusion,
        exclusion_id: data.exclusion_id,
        inventoried: data.inventoried,
        active: data.active,
        qualified: data.qualified,
        domain: data.domain,
        description: data.description,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (adDevices.save.messages.length > 0) {
      if (adDevices.save.hasErrors) {
        toast.error(adDevices.save.messages.join(' '));
      } else {
        toast.success(adDevices.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearAdDeviceMessages());
    }
  }, [adDevices.save.messages]);

  useEffect(() => {
    if (+id > 0 && adDevices.getById.data) {
      const data = adDevices.getById.data;
      fillValuesOnEdit(data);
    }
  }, [adDevices.getById.data]);

  useEffect(() => {
    dispatch(getTenantLookup());
    if (+id > 0) {
      dispatch(getAdDeviceById(+id));
    }
    return () => {
      dispatch(clearAdDeviceGetById());
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
        {adDevices.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={adDevices.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="addAdDevice"
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
                      loading={commonLookups.tenantLookup.loading}
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
                      loading={commonLookups.buLookup.loading}
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
                  <label className="label">Distinguished Name</label>
                  <Form.Item
                    name="distinguished_name"
                    label="Distinguished Name"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">DNS Host Name</label>
                  <Form.Item
                    name="dns_host_name"
                    className="m-0"
                    label="DNS Host Name"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">iPv4 Address</label>
                  <Form.Item
                    name="iPv4_address"
                    label="iPv4 Address"
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
                    name="device_type"
                    label="Device type"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Last Logon</label>
                  <Form.Item
                    name="last_logon"
                    label="Last Logon"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Last Logon Date</label>
                  <Form.Item name="last_logon_date" label="Last Logon Date" className="m-0">
                    <DatePicker className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Last Logon Timestamp</label>
                  <Form.Item
                    name="last_logon_timestamp"
                    label="Last Logon Timestamp"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Name</label>
                  <Form.Item name="name" label="Name" className="m-0" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Object Class</label>
                  <Form.Item
                    name="object_class"
                    label="Object Class"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Object GUId</label>
                  <Form.Item
                    name="object_guid"
                    label="Object GUId"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
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
                <div className="form-group m-0">
                  <label className="label">Operating System</label>
                  <Form.Item
                    name="operating_system"
                    label="Operating system"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Password Last Set</label>
                  <Form.Item name="password_last_set" label="Password Last Set" className="m-0">
                    <DatePicker className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Sam Account Name</label>
                  <Form.Item
                    name="sam_account_name"
                    label="Sam Account Name"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">sId</label>
                  <Form.Item name="sid" label="sId" className="m-0" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">User Principal Name</label>
                  <Form.Item
                    name="user_principal_name"
                    label="User Principal Name"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">When Created</label>
                  <Form.Item name="when_created" label="When Created" className="m-0">
                    <DatePicker className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Exclusion</label>
                  <Form.Item
                    name="exclusion"
                    label="Exclusion"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Exclusion Id</label>
                  <Form.Item
                    name="exclusion_id"
                    label="Exclusion Id"
                    className="m-0"
                    rules={[{ type: 'integer' }]}
                  >
                    <InputNumber min={1} className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Domain</label>
                  <Form.Item name="domain" label="Domain" className="m-0" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <Row gutter={[30, 15]} className="form-label-hide">
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="enabled" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Enabled</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="password_expired" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Password Expired</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="password_never_expires" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Password Never Expires</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="inventoried" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Inventoried</label>
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
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="qualified" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Qualified</label>
                </div>
              </Col>
              <Col xs={24}>
                <div className="form-group m-0">
                  <label className="label">Description</label>
                  <Form.Item name="description" label="Description" className="m-0">
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
                loading={adDevices.save.loading}
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
export default AddAdDeviceModal;
