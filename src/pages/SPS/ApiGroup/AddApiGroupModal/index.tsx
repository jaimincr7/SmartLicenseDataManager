import { Button, Checkbox, Col, Form, Input, Modal, Row, Spin } from 'antd';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { ISpsApiGroup } from '../../../../services/sps/apiGroup/apiGroup.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getSpsApiGroupById,
  saveSpsApiGroup,
} from '../../../../store/sps/apiGroup/apiGroup.action';
import {
  clearSpsApiGroupGetById,
  clearSpsApiGroupMessages,
  spsApiGroupSelector,
} from '../../../../store/sps/apiGroup/apiGroup.reducer';
import { IAddSpsApiGroupProps } from './addApiGroup.model';
import { getObjectForUpdateMultiple } from '../../../../common/helperFunction';
import { updateMultiple } from '../../../../store/common/common.action';
import {
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';

const AddSpsApiGroupModal: React.FC<IAddSpsApiGroupProps> = (props) => {
  const spsApiGroup = useAppSelector(spsApiGroupSelector);
  const common = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.SpsApiGroup} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ISpsApiGroup = {
    name: '',
    stored_procedure_post_process: '',
  };

  const onFinish = (values: any) => {
    const inputValues: ISpsApiGroup = {
      ...values,
      id: id ? +id : null,
    };
    if (!isMultiple) {
      dispatch(saveSpsApiGroup(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        spsApiGroup.search.tableName
      );
      if (result) {
        dispatch(updateMultiple(result));
      }
    }
  };

  const fillValuesOnEdit = async (data: ISpsApiGroup) => {
    if (data) {
      initialValues = {
        name: data.name,
        stored_procedure_post_process: data.stored_procedure_post_process,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (spsApiGroup.save.messages.length > 0) {
      if (spsApiGroup.save.hasErrors) {
        toast.error(spsApiGroup.save.messages.join(' '));
      } else {
        toast.success(spsApiGroup.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearSpsApiGroupMessages());
    }
  }, [spsApiGroup.save.messages]);

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
    if (+id > 0 && spsApiGroup.getById.data) {
      const data = spsApiGroup.getById.data;
      fillValuesOnEdit(data);
    }
  }, [spsApiGroup.getById.data]);

  useEffect(() => {
    if (+id > 0) {
      dispatch(getSpsApiGroupById(+id));
    }
    return () => {
      dispatch(clearSpsApiGroupGetById());
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
        {spsApiGroup.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={spsApiGroup.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="spsApiGroup"
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
                    rules={[{ required: !isMultiple, max: 500 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'stored_procedure_post_process']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Stored Procedure Post Process</Checkbox>
                    </Form.Item>
                  ) : (
                    'Stored Procedure Post Process'
                  )}
                  <Form.Item
                    name="stored_procedure_post_process"
                    label="Stored Procedure Post Process"
                    className="m-0"
                    rules={[{ max: 255 }]}
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
                loading={spsApiGroup.save.loading || common.save.loading}
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
export default AddSpsApiGroupModal;
