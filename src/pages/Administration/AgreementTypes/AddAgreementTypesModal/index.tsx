import { Button, Checkbox, Col, Form, Input, Modal, Row, Spin } from 'antd';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { IAgreementTypes } from '../../../../services/master/agreementTypes/agreementTypes.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getAgreementTypesById,
  saveAgreementTypes,
} from '../../../../store/master/agreementTypes/agreementTypes.action';
import {
  clearAgreementTypesGetById,
  clearAgreementTypesMessages,
  agreementTypesSelector,
} from '../../../../store/master/agreementTypes/agreementTypes.reducer';
import { IAddAgreementTypesProps } from './addAgreementTypes.model';
import { updateMultiple } from '../../../../store/common/common.action';
import {
  commonSelector,
  clearMultipleUpdateMessages,
} from '../../../../store/common/common.reducer';
import { getObjectForUpdateMultiple } from '../../../../common/helperFunction';

const AddAgreementTypesModal: React.FC<IAddAgreementTypesProps> = (props) => {
  const agreementTypes = useAppSelector(agreementTypesSelector);
  const dispatch = useAppDispatch();
  const common = useAppSelector(commonSelector);
  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;

  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.AgreementTypes} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IAgreementTypes = {
    agreement_type: '',
  };

  const onFinish = (values: any) => {
    const inputValues: IAgreementTypes = {
      ...values,
      id: id ? +id : null,
    };
    if (!isMultiple) {
      dispatch(saveAgreementTypes(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        agreementTypes.search.tableName
      );
      if (result) {
        dispatch(updateMultiple(result));
      }
    }
  };

  const fillValuesOnEdit = async (data: IAgreementTypes) => {
    if (data) {
      initialValues = {
        agreement_type: data.agreement_type,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (agreementTypes.save.messages.length > 0) {
      if (agreementTypes.save.hasErrors) {
        toast.error(agreementTypes.save.messages.join(' '));
      } else {
        toast.success(agreementTypes.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearAgreementTypesMessages());
    }
  }, [agreementTypes.save.messages]);

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
    if (+id > 0 && agreementTypes.getById.data) {
      const data = agreementTypes.getById.data;
      fillValuesOnEdit(data);
    }
  }, [agreementTypes.getById.data]);

  useEffect(() => {
    if (+id > 0) {
      dispatch(getAgreementTypesById(+id));
    }
    return () => {
      dispatch(clearAgreementTypesGetById());
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
        {agreementTypes.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={agreementTypes.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="agreementTypes"
            initialValues={initialValues}
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Row gutter={[30, 15]} className="form-label-hide">
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'agreement_type']} valuePropName="checked" noStyle>
                      <Checkbox>Agreement Type</Checkbox>
                    </Form.Item>
                  ) : (
                    'Agreement Type'
                  )}
                  <Form.Item
                    name="agreement_type"
                    label="Agreement Type"
                    className="m-0"
                    rules={[{ required: !isMultiple, max: 255 }]}
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
                loading={agreementTypes.save.loading || common.save.loading}
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
export default AddAgreementTypesModal;
