import { Button, Checkbox, Col, Form, Input, Modal, Row, Select, Spin } from 'antd';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { ICmsCategoryExtended } from '../../../../services/cms/categoryExtended/categoryExtended.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getCmsCategoryExtendedById,
  saveCmsCategoryExtended,
} from '../../../../store/cms/categoryExtended/categoryExtended.action';
import {
  clearCmsCategoryExtendedGetById,
  clearCmsCategoryExtendedMessages,
  cmsCategoryExtendedSelector,
} from '../../../../store/cms/categoryExtended/categoryExtended.reducer';
import { getCmsCategoryLookup, updateMultiple } from '../../../../store/common/common.action';
import {
  clearBULookUp,
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';
import { IAddCmsCategoryExtendedProps } from './addCategoryExtended.model';
import { ILookup } from '../../../../services/common/common.model';
import { getObjectForUpdateMultiple } from '../../../../common/helperFunction';

const { Option } = Select;

const AddCmsCategoryExtendedModal: React.FC<IAddCmsCategoryExtendedProps> = (props) => {
  const cmsCategoryExtended = useAppSelector(cmsCategoryExtendedSelector);
  const dispatch = useAppDispatch();
  const commonLookups = useAppSelector(commonSelector);

  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.CmsCategoryExtended} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ICmsCategoryExtended = {
    category_id: null,
    name: '',
  };

  const onFinish = (values: any) => {
    const inputValues: ICmsCategoryExtended = {
      ...values,
      id: id ? +id : null,
    };
    if (!isMultiple) {
      dispatch(saveCmsCategoryExtended(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        cmsCategoryExtended.search.tableName
      );
      if (result) {
        dispatch(updateMultiple(result));
      }
    }
  };

  const fillValuesOnEdit = async (data: ICmsCategoryExtended) => {
    if (data) {
      initialValues = {
        category_id: data.category_id,
        name: data.name,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (cmsCategoryExtended.save.messages.length > 0) {
      if (cmsCategoryExtended.save.hasErrors) {
        toast.error(cmsCategoryExtended.save.messages.join(' '));
      } else {
        toast.success(cmsCategoryExtended.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearCmsCategoryExtendedMessages());
    }
  }, [cmsCategoryExtended.save.messages]);

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
    if (+id > 0 && cmsCategoryExtended.getById.data) {
      const data = cmsCategoryExtended.getById.data;
      fillValuesOnEdit(data);
    }
  }, [cmsCategoryExtended.getById.data]);

  useEffect(() => {
    dispatch(getCmsCategoryLookup());
    if (+id > 0) {
      dispatch(getCmsCategoryExtendedById(+id));
    }
    return () => {
      dispatch(clearCmsCategoryExtendedGetById());
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
        {cmsCategoryExtended.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={cmsCategoryExtended.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="cmsCategoryExtended"
            initialValues={initialValues}
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Row gutter={[30, 15]} className="form-label-hide">
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'category_id']} valuePropName="checked" noStyle>
                      <Checkbox>Category ID</Checkbox>
                    </Form.Item>
                  ) : (
                    'Category ID'
                  )}
                  <Form.Item
                    name="category_id"
                    className="m-0"
                    label="Category ID"
                    rules={[{ required: !isMultiple }]}
                  >
                    <Select
                      allowClear
                      loading={commonLookups.cmsCategoryLookup.loading}
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
                    >
                      {commonLookups.cmsCategoryLookup.data.map((option: ILookup) => (
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
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={cmsCategoryExtended.save.loading || commonLookups.save.loading}
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
export default AddCmsCategoryExtendedModal;
