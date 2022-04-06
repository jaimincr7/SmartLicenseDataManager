import { Button, Checkbox, Col, Form, Input, Modal, Row, Select, Spin, Switch } from 'antd';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { ICmdbUser } from '../../../../services/cmdb/user/user.model';
import { ILookup } from '../../../../services/common/common.model';
import _ from 'lodash';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import { getCmdbUserById, saveCmdbUser } from '../../../../store/cmdb/user/user.action';
import {
  clearCmdbUserGetById,
  clearCmdbUserMessages,
  cmdbUserSelector,
} from '../../../../store/cmdb/user/user.reducer';
import { getTenantLookup, updateMultiple } from '../../../../store/common/common.action';
import {
  clearBULookUp,
  clearCompanyLookUp,
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';
import { IAddCmdbUserProps } from './addUser.model';
import { getObjectForUpdateMultiple } from '../../../../common/helperFunction';
import { globalSearchSelector } from '../../../../store/globalSearch/globalSearch.reducer';
import { IInlineSearch } from '../../../../common/models/common';

const { Option } = Select;

const AddCmdbUserModal: React.FC<IAddCmdbUserProps> = (props) => {
  const cmdbUser = useAppSelector(cmdbUserSelector);
  const dispatch = useAppDispatch();
  const commonLookups = useAppSelector(commonSelector);
  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;
  const globalFilters = useAppSelector(globalSearchSelector);

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.CmdbUser} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ICmdbUser = {
    name: '',
    email: '',
    first_name: '',
    last_name: '',
    is_service_account: false,
    is_resource: false,
    in_active_directory: false,
    active_directory_guid: '',
    tenant_id: null,
  };

  const onFinish = (values: any) => {
    const inputValues: ICmdbUser = {
      ...values,
      id: id ? +id : null,
    };
    if (!isMultiple) {
      dispatch(saveCmdbUser(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        cmdbUser.search.tableName
      );
      if (result) {
        dispatch(updateMultiple(result));
      }
    }
  };

  const fillValuesOnEdit = async (data: ICmdbUser) => {
    if (data) {
      initialValues = {
        name: data.name,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        is_service_account: data.is_service_account,
        is_resource: data.is_resource,
        in_active_directory: data.in_active_directory,
        active_directory_guid: data.active_directory_guid,
        tenant_id: _.isNull(data.tenant_id) ? null : data.tenant_id,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (cmdbUser.save.messages.length > 0) {
      if (cmdbUser.save.hasErrors) {
        toast.error(cmdbUser.save.messages.join(' '));
      } else {
        toast.success(cmdbUser.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearCmdbUserMessages());
    }
  }, [cmdbUser.save.messages]);

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
    if (+id > 0 && cmdbUser.getById.data) {
      const data = cmdbUser.getById.data;
      fillValuesOnEdit(data);
    }
  }, [cmdbUser.getById.data]);

  useEffect(() => {
    dispatch(getTenantLookup());
    if (+id > 0) {
      dispatch(getCmdbUserById(+id));
    }
    return () => {
      dispatch(clearCmdbUserGetById());
      dispatch(clearCompanyLookUp());
      dispatch(clearBULookUp());
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
        {cmdbUser.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={cmdbUser.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="cmdbUser"
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
                    rules={[{ max: 200, required: !isMultiple }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'email']} valuePropName="checked" noStyle>
                      <Checkbox>Email</Checkbox>
                    </Form.Item>
                  ) : (
                    'Email'
                  )}
                  <Form.Item
                    name="email"
                    className="m-0"
                    label="Email"
                    rules={[{ max: 200, type: 'email', required: !isMultiple }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'first_name']} valuePropName="checked" noStyle>
                      <Checkbox>First Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'First Name'
                  )}
                  <Form.Item
                    name="first_name"
                    className="m-0"
                    label="First Name"
                    rules={[{ max: 200, required: !isMultiple }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'last_name']} valuePropName="checked" noStyle>
                      <Checkbox>Last Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Last Name'
                  )}
                  <Form.Item
                    name="last_name"
                    className="m-0"
                    label="Last Name"
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
                      name={['checked', 'active_directory_guid']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Active Directory GUID</Checkbox>
                    </Form.Item>
                  ) : (
                    'Active Directory GUID'
                  )}
                  <Form.Item
                    name="active_directory_guid"
                    className="m-0"
                    label="Active Directory GUID"
                    rules={[{ max: 200 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_service_account" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'is_service_account']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Is Service Account</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Service Account'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_resource" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item name={['checked', 'is_resource']} valuePropName="checked" noStyle>
                      <Checkbox>Is Resource</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Resource'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="in_active_directory" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'in_active_directory']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>In Active Directory</Checkbox>
                    </Form.Item>
                  ) : (
                    'In Active Directory'
                  )}
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={cmdbUser.save.loading || commonLookups.save.loading}
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
export default AddCmdbUserModal;
