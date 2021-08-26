import {
  Button,
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
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { ICmdbDevice } from '../../../../services/cmdb/device/device.model';
import { ILookup } from '../../../../services/common/common.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import { getCmdbDeviceById, saveCmdbDevice } from '../../../../store/cmdb/device/device.action';
import {
  clearCmdbDeviceGetById,
  clearCmdbDeviceMessages,
  cmdbDeviceSelector,
} from '../../../../store/cmdb/device/device.reducer';
import { getCmdbOperatingSystemLookup, getCmdbProcessorLookup, getCmdbVirtualizationLookup, getTenantLookup } from '../../../../store/common/common.action';
import { commonSelector } from '../../../../store/common/common.reducer';
import { IAddCmdbDeviceProps } from './addDevice.model';

const { Option } = Select;

const AddCmdbDeviceModal: React.FC<IAddCmdbDeviceProps> = (props) => {
  const cmdbDevice = useAppSelector(cmdbDeviceSelector);
  const dispatch = useAppDispatch();

  const { id, showModal, handleModalClose, refreshDataTable } = props;
  const commonLookups = useAppSelector(commonSelector);
  const isNew: boolean = id ? false : true;
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
    dispatch(saveCmdbDevice(inputValues));
  };

  const fillValuesOnEdit = async (data: ICmdbDevice) => {
    if (data) {
      initialValues = {
        source: data.source,
        last_updated: data.last_updated,
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
        operating_system_id: data.operating_system_id,
        processor_id: data.processor_id,
        virtualization_id: data.virtualization_id,
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
                  <label className="label">Tenant</label>
                  <Form.Item
                    name="tenant_id"
                    className="m-0"
                    label="Tenant"
                    rules={[{ required: true }]}
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
                  <label className="label">Operating System</label>
                  <Form.Item
                    name="operating_system_id"
                    className="m-0"
                    label="Operating System"
                    rules={[{ required: true }]}
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
                  <label className="label">Processor</label>
                  <Form.Item
                    name="processor_id"
                    className="m-0"
                    label="Processor"
                    rules={[{ required: true }]}
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
                  <label className="label">Virtualization</label>
                  <Form.Item
                    name="virtualization_id"
                    className="m-0"
                    label="Virtualization"
                    rules={[{ required: true }]}
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
                  <label className="label">Source</label>
                  <Form.Item name="source" label="Source" className="m-0" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">LastUpdated</label>
                  <Form.Item name="last_updated" className="m-0" label="LastUpdated">
                    <DatePicker className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Computer Name</label>
                  <Form.Item
                    name="computer_name"
                    className="m-0"
                    label="ComputerName"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Type</label>
                  <Form.Item name="type" className="m-0" label="Type" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Manufacturer</label>
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
                  <label className="label">Model</label>
                  <Form.Item name="model" className="m-0" label="Model" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Architecture</label>
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
                  <label className="label">Bios Manufacturer</label>
                  <Form.Item
                    name="bios_manufacturer"
                    className="m-0"
                    label="BiosManufacturer"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">BiosSerial</label>
                  <Form.Item
                    name="bios_serial"
                    className="m-0"
                    label="BiosSerial"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">BiosVersion</label>
                  <Form.Item
                    name="bios_version"
                    className="m-0"
                    label="BiosVersion"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">HostName</label>
                  <Form.Item
                    name="host_name"
                    className="m-0"
                    label="HostName"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Hypervisor Name</label>
                  <Form.Item
                    name="hypervisor_name"
                    className="m-0"
                    label="HypervisorName"
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
                  <label className="label">Is Virtual</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_vdi" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Is VDI</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_server" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Is Server</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_host" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Is Host</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_tablet" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Is Tablet</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_portable" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">Is Portable</label>
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={cmdbDevice.save.loading}
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
