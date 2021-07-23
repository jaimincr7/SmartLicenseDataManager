import { Button, Col, Form, Input, Modal, Row, Select, Spin, Switch } from 'antd';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { validateMessages } from '../../../../common/constants/common';
import { ILookup } from '../../../../services/common/common.model';
import { IBU } from '../../../../services/master/bu/bu.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import { getCompanyLookup, getTenantLookup } from '../../../../store/common/common.action';
import { clearCompanyLookUp, commonSelector } from '../../../../store/common/common.reducer';
import { getBUById, saveBU } from '../../../../store/master/bu/bu.action';
import {
  clearBUGetById,
  clearBUMessages,
  buSelector,
} from '../../../../store/master/bu/bu.reducer';
import { IAddBUProps } from './addBU.model';

const { Option } = Select;

const AddBUModal: React.FC<IAddBUProps> = (props) => {
  const bu = useAppSelector(buSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();

  const { id, showModal, handleModalClose, refreshDataTable } = props;

  const isNew: boolean = id ? false : true;
  const title = useMemo(() => {
    return isNew ? 'Add BU' : 'Edit BU';
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IBU = {
    tenant_id: null,
    company_id: null,
    name: '',
    active: false,
  };

  const onFinish = (values: any) => {
    const inputValues: IBU = {
      ...values,
      id: id ? +id : null,
    };
    dispatch(saveBU(inputValues));
  };

  const handleTenantChange = (tenantId: number) => {
    form.setFieldsValue({ tenant_id: tenantId, company_id: null, bu_id: null });
    if (tenantId) {
      dispatch(getCompanyLookup(tenantId));
    } else {
      dispatch(clearCompanyLookUp());
    }
  };

  const fillValuesOnEdit = async (data: IBU) => {
    if (data.tenant_id) {
      await dispatch(getCompanyLookup(data.tenant_id));
    }
    if (data) {
      initialValues = {
        tenant_id: _.isNull(data.tenant_id) ? null : data.tenant_id,
        company_id: _.isNull(data.company_id) ? null : data.company_id,
        name: data.name,
        active: data.active,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (bu.save.messages.length > 0) {
      if (bu.save.hasErrors) {
        toast.error(bu.save.messages.join(' '));
      } else {
        toast.success(bu.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearBUMessages());
    }
  }, [bu.save.messages]);

  useEffect(() => {
    if (+id > 0 && bu.getById.data) {
      const data = bu.getById.data;
      fillValuesOnEdit(data);
    }
  }, [bu.getById.data]);

  useEffect(() => {
    dispatch(getTenantLookup());
    if (+id > 0) {
      dispatch(getBUById(+id));
    }
    return () => {
      dispatch(clearBUGetById());
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
        {bu.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={bu.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="addBU"
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
                  <Form.Item
                    name="company_id"
                    className="m-0"
                    label="Company"
                    rules={[{ required: true }]}
                  >
                    <Select allowClear loading={commonLookups.companyLookup.loading}>
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
                  <label className="label">BU Name</label>
                  <Form.Item
                    name="name"
                    label="BU Name"
                    className="m-0"
                    rules={[{ required: true, max: 200 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
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
            </Row>
            <div className="btns-block modal-footer">
              <Button key="submit" type="primary" htmlType="submit" loading={bu.save.loading}>
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
export default AddBUModal;
