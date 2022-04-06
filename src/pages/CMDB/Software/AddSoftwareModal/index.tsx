import { Button, Checkbox, Col, DatePicker, Form, Input, Modal, Row, Select, Spin } from 'antd';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import _ from 'lodash';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { ICmdbSoftware } from '../../../../services/cmdb/software/software.model';
import { ILookup } from '../../../../services/common/common.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getCmdbSoftwareById,
  saveCmdbSoftware,
} from '../../../../store/cmdb/software/software.action';
import {
  clearCmdbSoftwareGetById,
  clearCmdbSoftwareMessages,
  cmdbSoftwareSelector,
} from '../../../../store/cmdb/software/software.reducer';
import {
  getCmdbApplicationLookup,
  getCmdbDeviceLookup,
  getTenantLookup,
  updateMultiple,
} from '../../../../store/common/common.action';
import {
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';
import { IAddCmdbSoftwareProps } from './addSoftware.model';
import {
  forEditModal,
  getObjectForUpdateMultiple,
  passDateToApi,
} from '../../../../common/helperFunction';
import { IInlineSearch } from '../../../../common/models/common';
import { globalSearchSelector } from '../../../../store/globalSearch/globalSearch.reducer';

const { Option } = Select;

const AddCmdbSoftwareModal: React.FC<IAddCmdbSoftwareProps> = (props) => {
  const cmdbSoftware = useAppSelector(cmdbSoftwareSelector);
  const dispatch = useAppDispatch();
  const commonLookups = useAppSelector(commonSelector);
  const globalFilters = useAppSelector(globalSearchSelector);
  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.CmdbSoftware} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ICmdbSoftware = {
    name: '',
    version: '',
    edition: '',
    installed_date: null,
    uninstall_string: '',
    file_name: '',
    file_path: '',
    package_guid: '',
    last_scanned: '',
    device_id: null,
    application_id: null,
    tenant_id: null,
  };

  const onFinish = (values: any) => {
    const inputValues: ICmdbSoftware = {
      ...values,
      id: id ? +id : null,
    };
    inputValues.installed_date = passDateToApi(inputValues.installed_date, true);
    if (!isMultiple) {
      dispatch(saveCmdbSoftware(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        cmdbSoftware.search.tableName
      );
      if (result) {
        dispatch(updateMultiple(result));
      }
    }
  };

  const fillValuesOnEdit = async (data: ICmdbSoftware) => {
    if (data) {
      initialValues = {
        name: data.name,
        version: data.version,
        edition: data.edition,
        installed_date: _.isNull(data.installed_date) ? null : forEditModal(data.installed_date),
        uninstall_string: data.uninstall_string,
        file_name: data.file_name,
        file_path: data.file_path,
        package_guid: data.package_guid,
        last_scanned: data.last_scanned,
        device_id: _.isNull(data.device_id) ? null : data.device_id,
        application_id: _.isNull(data.application_id) ? null : data.application_id,
        tenant_id: _.isNull(data.tenant_id) ? null : data.tenant_id,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (cmdbSoftware.save.messages.length > 0) {
      if (cmdbSoftware.save.hasErrors) {
        toast.error(cmdbSoftware.save.messages.join(' '));
      } else {
        toast.success(cmdbSoftware.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearCmdbSoftwareMessages());
    }
  }, [cmdbSoftware.save.messages]);

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
    if (+id > 0 && cmdbSoftware.getById.data) {
      const data = cmdbSoftware.getById.data;
      fillValuesOnEdit(data);
    }
  }, [cmdbSoftware.getById.data]);

  useEffect(() => {
    dispatch(getTenantLookup());
    dispatch(getCmdbApplicationLookup());
    dispatch(getCmdbDeviceLookup());
    if (+id > 0) {
      dispatch(getCmdbSoftwareById(+id));
    }
    return () => {
      dispatch(clearCmdbSoftwareGetById());
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
        const initlValues = {
          tenant_id: _.isNull(globalSearch.tenant_id) ? null : globalSearch.tenant_id[0],
        };
        form.setFieldsValue(initlValues);
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
        {cmdbSoftware.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={cmdbSoftware.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="cmdbSoftware"
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
                    <Select
                      allowClear
                      loading={commonLookups.tenantLookup.loading}
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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'application_id']} valuePropName="checked" noStyle>
                      <Checkbox>Application</Checkbox>
                    </Form.Item>
                  ) : (
                    'Application'
                  )}
                  <Form.Item
                    name="application_id"
                    className="m-0"
                    label="Application"
                    rules={[{ required: !isMultiple }]}
                  >
                    <Select
                      allowClear
                      loading={commonLookups.cmdbApplicationLookup.loading}
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
                      {commonLookups.cmdbApplicationLookup.data.map((option: ILookup) => (
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
                    <Form.Item name={['checked', 'device_id']} valuePropName="checked" noStyle>
                      <Checkbox>Device</Checkbox>
                    </Form.Item>
                  ) : (
                    'Device'
                  )}
                  <Form.Item
                    name="device_id"
                    className="m-0"
                    label="Device"
                    rules={[{ required: !isMultiple }]}
                  >
                    <Select
                      allowClear
                      loading={commonLookups.cmdbDeviceLookup.loading}
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
                      {commonLookups.cmdbDeviceLookup.data.map((option: ILookup) => (
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
                    <Form.Item name={['checked', 'name']} valuePropName="checked" noStyle>
                      <Checkbox>Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Name'
                  )}
                  <Form.Item
                    name="name"
                    label="Name"
                    className="m-0"
                    rules={[{ max: 510, required: !isMultiple }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'version']} valuePropName="checked" noStyle>
                      <Checkbox>Version</Checkbox>
                    </Form.Item>
                  ) : (
                    'Version'
                  )}
                  <Form.Item name="version" className="m-0" label="Version" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'edition']} valuePropName="checked" noStyle>
                      <Checkbox>Edition</Checkbox>
                    </Form.Item>
                  ) : (
                    'Edition'
                  )}
                  <Form.Item name="edition" className="m-0" label="Edition" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'installed_date']} valuePropName="checked" noStyle>
                      <Checkbox>Installed Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'Installed Date'
                  )}
                  <Form.Item name="installed_date" className="m-0" label="Installed Date">
                    <DatePicker className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'uninstall_string']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Uninstall String</Checkbox>
                    </Form.Item>
                  ) : (
                    'Uninstall String'
                  )}
                  <Form.Item name="uninstall_string" className="m-0" label="Uninstall String">
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'file_name']} valuePropName="checked" noStyle>
                      <Checkbox>File Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'File Name'
                  )}
                  <Form.Item
                    name="file_name"
                    className="m-0"
                    label="File Name"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'file_path']} valuePropName="checked" noStyle>
                      <Checkbox>File Path</Checkbox>
                    </Form.Item>
                  ) : (
                    'File Path'
                  )}
                  <Form.Item
                    name="file_path"
                    className="m-0"
                    label="File Path"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'package_guid']} valuePropName="checked" noStyle>
                      <Checkbox>Package GUID</Checkbox>
                    </Form.Item>
                  ) : (
                    'Package GUID'
                  )}
                  <Form.Item
                    name="package_guid"
                    className="m-0"
                    label="Package GUID"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'last_scanned']} valuePropName="checked" noStyle>
                      <Checkbox>Last Scanned</Checkbox>
                    </Form.Item>
                  ) : (
                    'Last Scanned'
                  )}
                  <Form.Item
                    name="last_scanned"
                    className="m-0"
                    label="Last Scanned"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={cmdbSoftware.save.loading || commonLookups.save.loading}
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
export default AddCmdbSoftwareModal;
