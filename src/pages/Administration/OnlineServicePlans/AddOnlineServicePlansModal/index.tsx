import { Button, Checkbox, Col, Form, Input, Modal, Row, Spin } from 'antd';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { getObjectForUpdateMultiple } from '../../../../common/helperFunction';
import { IConfigOnlineServicePlans } from '../../../../services/master/onlineServicePlans/onlineServicePlans.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import { updateMultiple } from '../../../../store/common/common.action';
import {
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';
import {
  getConfigOnlineServicePlansById,
  saveConfigOnlineServicePlans,
} from '../../../../store/master/onlineServicePlans/onlineServicePlans.action';
import {
  clearConfigOnlineServicePlansGetById,
  clearConfigOnlineServicePlansMessages,
  configOnlineServicePlansSelector,
} from '../../../../store/master/onlineServicePlans/onlineServicePlans.reducer';
import { IAddConfigOnlineServicePlansProps } from './addOnlineservicePlans.model';

const AddConfigOnlineServicePlansModal: React.FC<IAddConfigOnlineServicePlansProps> = (props) => {
  const configOnlineServicePlans = useAppSelector(configOnlineServicePlansSelector);
  const common = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '}{' '}
        <BreadCrumbs pageName={Page.ConfigOnlineServicePlans} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IConfigOnlineServicePlans = {
    name: '',
    string_id: '',
    guid: '',
  };

  const onFinish = (values: any) => {
    const inputValues: IConfigOnlineServicePlans = {
      ...values,
      id: id ? +id : null,
    };
    if (!isMultiple) {
      dispatch(saveConfigOnlineServicePlans(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        configOnlineServicePlans.search.tableName
      );
      if (result) {
        dispatch(updateMultiple(result));
      }
    }
  };

  const fillValuesOnEdit = async (data: IConfigOnlineServicePlans) => {
    if (data) {
      initialValues = {
        name: data.name,
        string_id: data.string_id,
        guid: data.guid,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (configOnlineServicePlans.save.messages.length > 0) {
      if (configOnlineServicePlans.save.hasErrors) {
        toast.error(configOnlineServicePlans.save.messages.join(' '));
      } else {
        toast.success(configOnlineServicePlans.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearConfigOnlineServicePlansMessages());
    }
  }, [configOnlineServicePlans.save.messages]);

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
    if (+id > 0 && configOnlineServicePlans.getById.data) {
      const data = configOnlineServicePlans.getById.data;
      fillValuesOnEdit(data);
    }
  }, [configOnlineServicePlans.getById.data]);

  useEffect(() => {
    if (+id > 0) {
      dispatch(getConfigOnlineServicePlansById(+id));
    }
    return () => {
      dispatch(clearConfigOnlineServicePlansGetById());
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
        {configOnlineServicePlans.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={configOnlineServicePlans.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="configOnlineServicePlans"
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
                    rules={[{ required: !isMultiple, max: 255 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'string_id']} valuePropName="checked" noStyle>
                      <Checkbox>String ID</Checkbox>
                    </Form.Item>
                  ) : (
                    'String ID'
                  )}
                  <Form.Item
                    name="string_id"
                    label="String ID"
                    className="m-0"
                    rules={[{ max: 100 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'guid']} valuePropName="checked" noStyle>
                      <Checkbox>GUID</Checkbox>
                    </Form.Item>
                  ) : (
                    'GUID'
                  )}
                  <Form.Item name="guid" label="GUID" className="m-0" rules={[{ max: 36 }]}>
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
                loading={configOnlineServicePlans.save.loading || common.save.loading}
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
export default AddConfigOnlineServicePlansModal;
