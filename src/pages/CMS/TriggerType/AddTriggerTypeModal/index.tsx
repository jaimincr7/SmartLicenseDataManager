import { Button, Checkbox, Col, Form, Input, Modal, Row, Spin } from 'antd';
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
import { getTenantLookup, updateMultiple } from '../../../../store/common/common.action';
import {
  clearBULookUp,
  clearCompanyLookUp,
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';
import { IAddCmsTriggerTypeProps } from './addTriggerType.model';
import { getObjectForUpdateMultiple } from '../../../../common/helperFunction';

const AddCmsTriggerTypeModal: React.FC<IAddCmsTriggerTypeProps> = (props) => {
  const cmsTriggerType = useAppSelector(cmsTriggerTypeSelector);
  const common = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();

  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
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
    if (!isMultiple) {
      dispatch(saveCmsTriggerType(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        cmsTriggerType.search.tableName
      );
      if (result) {
        dispatch(updateMultiple(result));
      }
    }
  };

  const fillValuesOnEdit = async (data: ICmsTriggerType) => {
    if (data) {
      initialValues = {
        name: data.name,
        description: data.description,
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
    if (common.save.messages.length > 0) {
      if (common.save.hasErrors) {
        toast.error(common.save.messages.join(' '));
      } else {
        toast.warn(common.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearMultipleUpdateMessages());
    }
  }, [common.save.messages]);

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
                    rules={[{ required: !isMultiple, max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'description']} valuePropName="checked" noStyle>
                      <Checkbox>Description</Checkbox>
                    </Form.Item>
                  ) : (
                    'Description'
                  )}
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
                loading={cmsTriggerType.save.loading || common.save.loading}
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
