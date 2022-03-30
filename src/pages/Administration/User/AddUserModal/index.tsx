import { Button, Checkbox, Col, Form, Input, Modal, Row, Select, Spin, Switch } from 'antd';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { ILookup } from '../../../../services/common/common.model';
import { IUser } from '../../../../services/master/user/users.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import { getCompanyLookup, getTenantLookup } from '../../../../store/common/common.action';
import {
  clearCompanyLookUp,
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';
import { updateMultiple } from '../../../../store/common/common.action';
import { getUserById, saveUser } from '../../../../store/master/users/users.action';
import {
  clearUserGetById,
  clearUserMessages,
  usersSelector,
} from '../../../../store/master/users/users.reducer';
import { IAddUserProps } from './addUser.model';
import { forEditModal, getObjectForUpdateMultiple } from '../../../../common/helperFunction';

const { Option } = Select;

const AddUserModal: React.FC<IAddUserProps> = (props) => {
  const users = useAppSelector(usersSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();

  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.User} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IUser = {
    tenant_id: null,
    company_id: null,
    id: null,
    username: '',
    display_name: '',
    email: '',
    source: isMultiple ? '' : 'web',
    password_hash: '',
    password_salt: '',
    user_image: '',
    insert_date: null,
    insert_user_id: null,
    update_date: null,
    update_user_id: null,
    is_active: 1,
    mobile_phone_number: '',
    two_factor_auth: null,
    role_ids: [],
  };

  const onFinish = (values: IUser) => {
    const inputValues: IUser = {
      ...values,
      id: id ? +id : null,
    };
    if (values.is_active) {
      inputValues.is_active = 1;
    } else {
      inputValues.is_active = 0;
    }
    if (!isMultiple) {
      dispatch(saveUser(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        users.search.tableName
      );
      if (result) {
        dispatch(updateMultiple(result));
      }
    }
  };

  const fillValuesOnEdit = async (data: IUser) => {
    if (data.tenant_id) {
      await dispatch(getCompanyLookup(data.tenant_id));
    }
    if (data) {
      initialValues = {
        tenant_id: _.isNull(data.tenant_id) ? null : data.tenant_id,
        company_id: _.isNull(data.company_id) ? null : data.company_id,
        id: data.id,
        username: data.username,
        display_name: data.display_name,
        email: data.email,
        source: data.source,
        password_hash: data.password_hash,
        password_salt: data.password_salt,
        insert_date: _.isNull(data.insert_date) ? null : forEditModal(data.insert_date),
        insert_user_id: data.insert_user_id,
        update_date: _.isNull(data.update_date) ? null : forEditModal(data.update_date),
        update_user_id: data.update_user_id,
        is_active: data.is_active,
        mobile_phone_number: data.mobile_phone_number,
        two_factor_auth: data.two_factor_auth,
        role_ids: data.role_ids,
      };
      form.setFieldsValue(initialValues);
    }
  };

  const handleTenantChange = (tenantId: number) => {
    form.setFieldsValue({ tenant_id: tenantId, company_id: null });
    if (tenantId) {
      dispatch(getCompanyLookup(tenantId));
    } else {
      dispatch(clearCompanyLookUp());
    }
  };

  useEffect(() => {
    if (users.save.messages.length > 0) {
      if (users.save.hasErrors) {
        toast.error(users.save.messages.join(' '));
      } else {
        toast.success(users.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearUserMessages());
    }
  }, [users.save.messages]);

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
    if (+id > 0 && users.getById.data) {
      const data = users.getById.data;
      fillValuesOnEdit(data);
    }
  }, [users.getById.data]);

  useEffect(() => {
    dispatch(getTenantLookup());
    if (+id > 0) {
      dispatch(getUserById(+id));
    }
    return () => {
      dispatch(clearUserGetById());
      dispatch(clearCompanyLookUp());
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
        {users.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={users.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="addUser"
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
                      onChange={handleTenantChange}
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
                    <Form.Item name={['checked', 'company_id']} valuePropName="checked" noStyle>
                      <Checkbox>Company</Checkbox>
                    </Form.Item>
                  ) : (
                    'Company'
                  )}
                  <Form.Item
                    name="company_id"
                    className="m-0"
                    label="Company"
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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'username']} valuePropName="checked" noStyle>
                      <Checkbox>User Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'User Name'
                  )}
                  <Form.Item
                    name="username"
                    label="User Name"
                    className="m-0"
                    rules={[{ required: !isMultiple, max: 200 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'display_name']} valuePropName="checked" noStyle>
                      <Checkbox>Display Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Display Name'
                  )}
                  <Form.Item
                    name="display_name"
                    label="Display Name"
                    className="m-0"
                    rules={[{ required: !isMultiple, max: 200 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'role_ids']} valuePropName="checked" noStyle>
                      <Checkbox>Role</Checkbox>
                    </Form.Item>
                  ) : (
                    'Role'
                  )}
                  <Form.Item
                    name="role_ids"
                    className="m-0"
                    label="Role"
                    rules={[{ required: !isMultiple }]}
                  >
                    <Select
                      showArrow={true}
                      mode="multiple"
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
                      loading={users.search.lookups?.roles?.length === 0}
                    >
                      {users.search.lookups?.roles?.map((option: ILookup) => (
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
                    <Form.Item name={['checked', 'email']} valuePropName="checked" noStyle>
                      <Checkbox>Email</Checkbox>
                    </Form.Item>
                  ) : (
                    'Email'
                  )}
                  <Form.Item
                    name="email"
                    label="Email"
                    className="m-0"
                    rules={[{ required: !isMultiple, type: 'email', max: 200 }]}
                  >
                    <Input className="form-control" />
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
                  <Form.Item
                    name="source"
                    label="Source"
                    className="m-0"
                    rules={[{ required: !isMultiple, max: 8 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'mobile_phone_number']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Mobile Phone Number</Checkbox>
                    </Form.Item>
                  ) : (
                    'Mobile Phone Number'
                  )}
                  <Form.Item
                    name="mobile_phone_number"
                    label="Mobile Phone Number"
                    className="m-0"
                    rules={[{ max: 40 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_active" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item name={['checked', 'is_active']} valuePropName="checked" noStyle>
                      <Checkbox>Is Active</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Active'
                  )}
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={users.save.loading || commonLookups.save.loading}
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
export default AddUserModal;
