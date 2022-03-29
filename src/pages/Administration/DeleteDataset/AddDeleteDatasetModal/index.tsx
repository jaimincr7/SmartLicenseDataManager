import { Button, Checkbox, Col, Form, Input, Modal, Row, Spin, Switch } from 'antd';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { IDeleteDataset } from '../../../../services/master/deleteDataset/deleteDataset.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  clearCompanyLookUp,
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';
import {
  getDeleteDatasetById,
  saveDeleteDataset,
} from '../../../../store/master/deleteDataset/deleteDataset.action';
import { updateMultiple } from '../../../../store/common/common.action';
import {
  clearDeleteDatasetGetById,
  clearDeleteDatasetMessages,
  deleteDatasetSelector,
} from '../../../../store/master/deleteDataset/deleteDataset.reducer';
import { IAddDeleteDatasetProps } from './addDeleteDataset.model';
import React from 'react';
import { getObjectForUpdateMultiple } from '../../../../common/helperFunction';

const AddDeleteDatasetModal: React.FC<IAddDeleteDatasetProps> = (props) => {
  const deleteDataset = useAppSelector(deleteDatasetSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.DeleteDataset} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IDeleteDataset = {
    table_name: '',
    store_procedure_name: '',
    is_date_available: false,
  };

  const onFinish = (values: any) => {
    const inputValues: IDeleteDataset = {
      ...values,
      id: id ? +id : null,
    };
    if (!isMultiple) {
      dispatch(saveDeleteDataset(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        deleteDataset.search.tableName
      );
      if (result) {
        dispatch(updateMultiple(result));
      }
    }
  };

  const fillValuesOnEdit = async (data: IDeleteDataset) => {
    if (data) {
      initialValues = {
        table_name: data.table_name,
        store_procedure_name: data.store_procedure_name,
        is_date_available: data.is_date_available,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (deleteDataset.save.messages.length > 0) {
      if (deleteDataset.save.hasErrors) {
        toast.error(deleteDataset.save.messages.join(' '));
      } else {
        toast.success(deleteDataset.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearDeleteDatasetMessages());
    }
  }, [deleteDataset.save.messages]);

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
    if (+id > 0 && deleteDataset.getById.data) {
      const data = deleteDataset.getById.data;
      fillValuesOnEdit(data);
    }
  }, [deleteDataset.getById.data]);

  useEffect(() => {
    if (+id > 0) {
      dispatch(getDeleteDatasetById(+id));
    }
    return () => {
      dispatch(clearDeleteDatasetGetById());
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
        {deleteDataset.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={deleteDataset.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="addDeleteDataset"
            initialValues={initialValues}
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Row gutter={[30, 15]} className="form-label-hide">
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'table_name']} valuePropName="checked" noStyle>
                      <Checkbox>Table Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Table Name'
                  )}
                  <Form.Item
                    name="table_name"
                    label="Table Name"
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
                    <Form.Item
                      name={['checked', 'store_procedure_name']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Stored Procedure Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Stored Procedure Name'
                  )}
                  <Form.Item
                    name="store_procedure_name"
                    label="Stored Procedure Name"
                    className="m-0"
                    rules={[{ required: !isMultiple, max: 500 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_date_available" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp; &nbsp;
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'is_date_available']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Is Date Available</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Date Available'
                  )}
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={deleteDataset.save.loading || commonLookups.save.loading}
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
export default AddDeleteDatasetModal;
