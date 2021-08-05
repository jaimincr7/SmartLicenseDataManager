import { Button, Col, Form, Input, Modal, Row, Select, Spin } from 'antd';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { ILookup } from '../../../../services/common/common.model';
import { IRole } from '../../../../services/master/role/role.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import { getCompanyLookup, getTenantLookup } from '../../../../store/common/common.action';
import { clearCompanyLookUp, commonSelector } from '../../../../store/common/common.reducer';
import { getRoleById, saveRole } from '../../../../store/master/role/role.action';
import {
  clearRoleGetById,
  clearRoleMessages,
  roleSelector,
} from '../../../../store/master/role/role.reducer';
import { IAddRoleProps } from './addRole.model';

const { Option } = Select;

const AddRoleModal: React.FC<IAddRoleProps> = (props) => {
  const role = useAppSelector(roleSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();

  const { id, showModal, handleModalClose, refreshDataTable } = props;

  const isNew: boolean = id ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.Role} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IRole = {
    role_name: '',
    tenant_id: null,
    role_key: '',
  };

  const onFinish = (values: IRole) => {
    const inputValues: IRole = {
      ...values,
      id: id ? +id : null,
    };
    dispatch(saveRole(inputValues));
  };

  const fillValuesOnEdit = async (data: IRole) => {
    if (data.tenant_id) {
      await dispatch(getCompanyLookup(data.tenant_id));
    }
    if (data) {
      initialValues = {
        tenant_id: _.isNull(data.tenant_id) ? null : data.tenant_id,
        role_name: data.role_name,
        role_key: data.role_key,
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
    if (role.save.messages.length > 0) {
      if (role.save.hasErrors) {
        toast.error(role.save.messages.join(' '));
      } else {
        toast.success(role.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearRoleMessages());
    }
  }, [role.save.messages]);

  useEffect(() => {
    if (+id > 0 && role.getById.data) {
      const data = role.getById.data;
      fillValuesOnEdit(data);
    }
  }, [role.getById.data]);

  useEffect(() => {
    dispatch(getTenantLookup());
    if (+id > 0) {
      dispatch(getRoleById(+id));
    }
    return () => {
      dispatch(clearRoleGetById());
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
        {role.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={role.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="addRole"
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
                  <label className="label">Role Name</label>
                  <Form.Item
                    name="role_name"
                    label="RoleName"
                    className="m-0"
                    rules={[{ required: true, max: 200 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Role Key</label>
                  <Form.Item name="role_key" label="RoleKey" className="m-0" rules={[{ max: 200 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button key="submit" type="primary" htmlType="submit" loading={role.save.loading}>
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
export default AddRoleModal;
