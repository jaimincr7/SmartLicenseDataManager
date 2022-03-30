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
import {
  forEditModal,
  getObjectForUpdateMultiple,
  passDateToApi,
} from '../../../../common/helperFunction';
import { IInlineSearch } from '../../../../common/models/common';
import { ICmdbDevice } from '../../../../services/cmdb/device/device.model';
import { ILookup } from '../../../../services/common/common.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import { getCmdbDeviceById, saveCmdbDevice } from '../../../../store/cmdb/device/device.action';
import {
  clearCmdbDeviceGetById,
  clearCmdbDeviceMessages,
  cmdbDeviceSelector,
} from '../../../../store/cmdb/device/device.reducer';
import {
  getCmdbOperatingSystemLookup,
  getCmdbProcessorLookup,
  getCmdbVirtualizationLookup,
  getTenantLookup,
  updateMultiple,
} from '../../../../store/common/common.action';
import {
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';
import { globalSearchSelector } from '../../../../store/globalSearch/globalSearch.reducer';
import { IAddCmdbDeviceProps } from './addDevice.model';

const { Option } = Select;

const AddCmdbDeviceModal: React.FC<IAddCmdbDeviceProps> = (props) => {
  const cmdbDevice = useAppSelector(cmdbDeviceSelector);
  const dispatch = useAppDispatch();
  const globalFilters = useAppSelector(globalSearchSelector);

  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;
  const commonLookups = useAppSelector(commonSelector);
  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.CmdbDevice} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ICmdbDevice = {
    source: '',
    last_updated: null,
    computer_name: '',
    type: '',
    manufacturer: '',
    model: '',
    architecture: '',
    bios_manufacturer: '',
    bios_serial: '',
    bios_version: '',
    host_name: '',
    hypervisor_name: '',
    is_virtual: false,
    is_vdi: false,
    is_server: false,
    is_host: false,
    is_tablet: false,
    is_portable: false,
    tenant_id: null,
    operating_system_id: null,
    processor_id: null,
    virtualization_id: null,
  };

  const onFinish = (values: any) => {
    const inputValues: ICmdbDevice = {
      ...values,
      id: id ? +id : null,
    };
    inputValues.last_updated = passDateToApi(inputValues.last_updated, true);
    if (!isMultiple) {
      dispatch(saveCmdbDevice(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        cmdbDevice.search.tableName
      );
      if (result) {
        dispatch(updateMultiple(result));
      }
    }
  };

  const fillValuesOnEdit = async (data: ICmdbDevice) => {
    if (data) {
      initialValues = {
        source: data.source,
        last_updated: _.isNull(data.last_updated) ? null : forEditModal(data.last_updated),
        computer_name: data.computer_name,
        type: data.type,
        manufacturer: data.manufacturer,
        model: data.model,
        architecture: data.architecture,
        bios_manufacturer: data.bios_manufacturer,
        bios_serial: data.bios_serial,
        bios_version: data.bios_version,
        host_name: data.host_name,
        hypervisor_name: data.hypervisor_name,
        is_virtual: data.is_virtual,
        is_vdi: data.is_vdi,
        is_server: data.is_server,
        is_host: data.is_host,
        is_tablet: data.is_tablet,
        is_portable: data.is_portable,
        tenant_id: data.tenant_id,
        operating_system_id: _.isNull(data.operating_system_id) ? null : data.operating_system_id,
        processor_id: _.isNull(data.processor_id) ? null : data.processor_id,
        virtualization_id: _.isNull(data.virtualization_id) ? null : data.virtualization_id,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (cmdbDevice.save.messages.length > 0) {
      if (cmdbDevice.save.hasErrors) {
        toast.error(cmdbDevice.save.messages.join(' '));
      } else {
        toast.success(cmdbDevice.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearCmdbDeviceMessages());
    }
  }, [cmdbDevice.save.messages]);

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
    if (+id > 0 && cmdbDevice.getById.data) {
      const data = cmdbDevice.getById.data;
      fillValuesOnEdit(data);
    }
  }, [cmdbDevice.getById.data]);

  useEffect(() => {
    dispatch(getTenantLookup());
    dispatch(getCmdbOperatingSystemLookup());
    dispatch(getCmdbProcessorLookup());
    dispatch(getCmdbVirtualizationLookup());
    if (+id > 0) {
      dispatch(getCmdbDeviceById(+id));
    }
    return () => {
      dispatch(clearCmdbDeviceGetById());
    };
  }, [dispatch]);

  useEffect(() => {
    if (+id === 0 && !isMultiple) {
      const globalSearch: IInlineSearch = {};
      for (const key in globalFilters.search) {
        const element = globalFilters.search[key];
        globalSearch[key] = element ? [element] : null;
      }
      if (globalSearch.tenant_id) {
        form.setFieldsValue(globalSearch);
      }
    }
  }, []);

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
        {cmdbDevice.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={cmdbDevice.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="cmdbDevice"
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
                  <Form.Item
                    name="tenant_id"
                    className="m-0"
                    label="Tenant"
                    rules={[{ required: !isMultiple }]}
                  >
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
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'operating_system_id']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Operating System</Checkbox>
                    </Form.Item>
                  ) : (
                    'Operating System'
                  )}
                  <Form.Item
                    name="operating_system_id"
                    className="m-0"
                    label="Operating System"
                    rules={[{ required: !isMultiple }]}
                  >
                    <Select allowClear loading={commonLookups.cmdbOperatingSystemLookup.loading}>
                      {commonLookups.cmdbOperatingSystemLookup.data.map((option: ILookup) => (
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
                    <Form.Item name={['checked', 'processor_id']} valuePropName="checked" noStyle>
                      <Checkbox>Processor</Checkbox>
                    </Form.Item>
                  ) : (
                    'Processor'
                  )}
                  <Form.Item
                    name="processor_id"
                    className="m-0"
                    label="Processor"
                    rules={[{ required: !isMultiple }]}
                  >
                    <Select allowClear loading={commonLookups.cmdbProcessorLookup.loading}>
                      {commonLookups.cmdbProcessorLookup.data.map((option: ILookup) => (
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
                    <Form.Item
                      name={['checked', 'virtualization_id']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Virtualization</Checkbox>
                    </Form.Item>
                  ) : (
                    'Virtualization'
                  )}
                  <Form.Item
                    name="virtualization_id"
                    className="m-0"
                    label="Virtualization"
                    rules={[{ required: !isMultiple }]}
                  >
                    <Select allowClear loading={commonLookups.cmdbVirtualizationLookup.loading}>
                      {commonLookups.cmdbVirtualizationLookup.data.map((option: ILookup) => (
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
                    <Form.Item name={['checked', 'source']} valuePropName="checked" noStyle>
                      <Checkbox>Source</Checkbox>
                    </Form.Item>
                  ) : (
                    'Source'
                  )}
                  <Form.Item name="source" label="Source" className="m-0" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'last_updated']} valuePropName="checked" noStyle>
                      <Checkbox>Last Updated</Checkbox>
                    </Form.Item>
                  ) : (
                    'Last Updated'
                  )}
                  <Form.Item name="last_updated" className="m-0" label="Last Updated">
                    <DatePicker className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'computer_name']} valuePropName="checked" noStyle>
                      <Checkbox>Computer Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Computer Name'
                  )}
                  <Form.Item
                    name="computer_name"
                    className="m-0"
                    label="Computer Name"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'type']} valuePropName="checked" noStyle>
                      <Checkbox>Type</Checkbox>
                    </Form.Item>
                  ) : (
                    'Type'
                  )}
                  <Form.Item name="type" className="m-0" label="Type" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'manufacturer']} valuePropName="checked" noStyle>
                      <Checkbox>Manufacturer</Checkbox>
                    </Form.Item>
                  ) : (
                    'Manufacturer'
                  )}
                  <Form.Item
                    name="manufacturer"
                    className="m-0"
                    label="Manufacturer"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'model']} valuePropName="checked" noStyle>
                      <Checkbox>Model</Checkbox>
                    </Form.Item>
                  ) : (
                    'Model'
                  )}
                  <Form.Item name="model" className="m-0" label="Model" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'architecture']} valuePropName="checked" noStyle>
                      <Checkbox>Architecture</Checkbox>
                    </Form.Item>
                  ) : (
                    'Architecture'
                  )}
                  <Form.Item
                    name="architecture"
                    className="m-0"
                    label="Architecture"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'bios_manufacturer']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Bios Manufacturer</Checkbox>
                    </Form.Item>
                  ) : (
                    'Bios Manufacturer'
                  )}
                  <Form.Item
                    name="bios_manufacturer"
                    className="m-0"
                    label="Bios Manufacturer"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'bios_serial']} valuePropName="checked" noStyle>
                      <Checkbox>Bios Serial</Checkbox>
                    </Form.Item>
                  ) : (
                    'Bios Serial'
                  )}
                  <Form.Item
                    name="bios_serial"
                    className="m-0"
                    label="Bios Serial"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'bios_version']} valuePropName="checked" noStyle>
                      <Checkbox>Bios Version</Checkbox>
                    </Form.Item>
                  ) : (
                    'Bios Version'
                  )}
                  <Form.Item
                    name="bios_version"
                    className="m-0"
                    label="Bios Version"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'host_name']} valuePropName="checked" noStyle>
                      <Checkbox>Host Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Host Name'
                  )}
                  <Form.Item
                    name="host_name"
                    className="m-0"
                    label="Host Name"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'hypervisor_name']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Hypervisor Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Hypervisor Name'
                  )}
                  <Form.Item
                    name="hypervisor_name"
                    className="m-0"
                    label="Hypervisor Name"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_virtual" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item name={['checked', 'is_virtual']} valuePropName="checked" noStyle>
                      <Checkbox>Is Virtual</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Virtual'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_vdi" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item name={['checked', 'is_vdi']} valuePropName="checked" noStyle>
                      <Checkbox>Is Vdi</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Vdi'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_server" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item name={['checked', 'is_server']} valuePropName="checked" noStyle>
                      <Checkbox>Is Server</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Server'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_host" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item name={['checked', 'is_host']} valuePropName="checked" noStyle>
                      <Checkbox>Is Host</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Host'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_tablet" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item name={['checked', 'is_tablet']} valuePropName="checked" noStyle>
                      <Checkbox>Is Tablet</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Tablet'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_portable" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item name={['checked', 'is_portable']} valuePropName="checked" noStyle>
                      <Checkbox>Is Portable</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Portable'
                  )}
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={cmdbDevice.save.loading || commonLookups.save.loading}
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
export default AddCmdbDeviceModal;
