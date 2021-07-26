import { Button, Col, Form, Input, Modal, Row, Spin } from 'antd';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { validateMessages } from '../../../../common/constants/common';
import { ITenant } from '../../../../services/master/tenant/tenant.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import { getTenantById, saveTenant } from '../../../../store/master/tenant/tenant.action';
import {
  clearTenantGetById,
  clearTenantMessages,
  tenantSelector,
} from '../../../../store/master/tenant/tenant.reducer';
import { IAddTenantProps } from './addTenant.model';

const AddTenantModal: React.FC<IAddTenantProps> = (props) => {
  const tenant = useAppSelector(tenantSelector);
  const dispatch = useAppDispatch();

  const { id, showModal, handleModalClose, refreshDataTable } = props;

  const isNew: boolean = id ? false : true;
  const title = useMemo(() => {
    return isNew ? 'Add Tenant' : 'Edit Tenant';
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ITenant = {
    name: '',
  };

  const onFinish = (values: any) => {
    const inputValues: ITenant = {
      ...values,
      id: id ? +id : null,
    };
    dispatch(saveTenant(inputValues));
  };

  const fillValuesOnEdit = async (data: ITenant) => {
    if (data) {
      initialValues = {
        name: data.name,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (tenant.save.messages.length > 0) {
      if (tenant.save.hasErrors) {
        toast.error(tenant.save.messages.join(' '));
      } else {
        toast.success(tenant.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearTenantMessages());
    }
  }, [tenant.save.messages]);

  useEffect(() => {
    if (+id > 0 && tenant.getById.data) {
      const data = tenant.getById.data;
      fillValuesOnEdit(data);
    }
  }, [tenant.getById.data]);

  useEffect(() => {
    if (+id > 0) {
      dispatch(getTenantById(+id));
    }
    return () => {
      dispatch(clearTenantGetById());
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
        {tenant.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={tenant.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="addTenant"
            initialValues={initialValues}
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Row gutter={[30, 15]} className="form-label-hide">
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Tenant Name</label>
                  <Form.Item
                    name="name"
                    label="Tenant Name"
                    className="m-0"
                    rules={[{ required: true, max: 200 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button key="submit" type="primary" htmlType="submit" loading={tenant.save.loading}>
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
export default AddTenantModal;
