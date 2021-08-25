import { Button, Col, Form, Input, Modal, Row, Spin } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { ICmsTriggerType } from '../../../../services/cms/triggerType/triggerType.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getCmsTriggerTypeById,
  saveCmsTriggerType,
} from '../../../../store/cms/triggerType/triggerType.action';
import {
  clearCmsTriggerTypeGetById,
  clearCmsTriggerTypeMessages,
  cmsTriggerTypeSelector,
} from '../../../../store/cms/triggerType/triggerType.reducer';
import { getTenantLookup } from '../../../../store/common/common.action';
import { clearBULookUp, clearCompanyLookUp } from '../../../../store/common/common.reducer';
import { IAddCmsTriggerTypeProps } from './addTriggerType.model';

const AddCmsTriggerTypeModal: React.FC<IAddCmsTriggerTypeProps> = (props) => {
  const cmsTriggerType = useAppSelector(cmsTriggerTypeSelector);
  const dispatch = useAppDispatch();

  const { id, showModal, handleModalClose, refreshDataTable } = props;

  const isNew: boolean = id ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.CmsTriggerType} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ICmsTriggerType = {
    name: '',
    description: '',
  };

  const onFinish = (values: any) => {
    const inputValues: ICmsTriggerType = {
      ...values,
      id: id ? +id : null,
    };
    dispatch(saveCmsTriggerType(inputValues));
  };

  const fillValuesOnEdit = async (data: ICmsTriggerType) => {
    if (data) {
      initialValues = {
        name: data.name,
        description: data.description,
        date_added: _.isNull(data.date_added) ? null : moment(data.date_added),
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (cmsTriggerType.save.messages.length > 0) {
      if (cmsTriggerType.save.hasErrors) {
        toast.error(cmsTriggerType.save.messages.join(' '));
      } else {
        toast.success(cmsTriggerType.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearCmsTriggerTypeMessages());
    }
  }, [cmsTriggerType.save.messages]);

  useEffect(() => {
    if (+id > 0 && cmsTriggerType.getById.data) {
      const data = cmsTriggerType.getById.data;
      fillValuesOnEdit(data);
    }
  }, [cmsTriggerType.getById.data]);

  useEffect(() => {
    dispatch(getTenantLookup());
    if (+id > 0) {
      dispatch(getCmsTriggerTypeById(+id));
    }
    return () => {
      dispatch(clearCmsTriggerTypeGetById());
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
        {cmsTriggerType.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={cmsTriggerType.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="cmsTriggerType"
            initialValues={initialValues}
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Row gutter={[30, 15]} className="form-label-hide">
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Name</label>
                  <Form.Item
                    name="name"
                    label="Name"
                    className="m-0"
                    rules={[{ required: true, max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Description</label>
                  <Form.Item
                    name="description"
                    label="Description"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={cmsTriggerType.save.loading}
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
export default AddCmsTriggerTypeModal;
