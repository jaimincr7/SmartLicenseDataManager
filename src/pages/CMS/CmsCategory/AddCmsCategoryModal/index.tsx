import { Button, Checkbox, Col, Form, Input, Modal, Row, Spin } from 'antd';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { ICmsCategory } from '../../../../services/cms/cmsCategory/cmsCategory.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getCmsCategoryById,
  saveCmsCategory,
} from '../../../../store/cms/cmsCategory/cmsCategory.action';
import {
  clearCmsCategoryGetById,
  clearCmsCategoryMessages,
  cmsCategorySelector,
} from '../../../../store/cms/cmsCategory/cmsCategory.reducer';
import { getTenantLookup, updateMultiple } from '../../../../store/common/common.action';
import {
  clearBULookUp,
  clearCompanyLookUp,
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';
import { IAddCmsCategoryProps } from './addCmsCategory.model';
import { getObjectForUpdateMultiple } from '../../../../common/helperFunction';

const AddCmsCategoryModal: React.FC<IAddCmsCategoryProps> = (props) => {
  const cmsCategory = useAppSelector(cmsCategorySelector);
  const common = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();

  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.CmsCategory} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ICmsCategory = {
    name: '',
  };

  const onFinish = (values: any) => {
    const inputValues: ICmsCategory = {
      ...values,
      id: id ? +id : null,
    };
    if (!isMultiple) {
      dispatch(saveCmsCategory(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        cmsCategory.search.tableName
      );
      if (result) {
        dispatch(updateMultiple(result));
      }
    }
  };

  const fillValuesOnEdit = async (data: ICmsCategory) => {
    if (data) {
      initialValues = {
        name: data.name,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (cmsCategory.save.messages.length > 0) {
      if (cmsCategory.save.hasErrors) {
        toast.error(cmsCategory.save.messages.join(' '));
      } else {
        toast.success(cmsCategory.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearCmsCategoryMessages());
    }
  }, [cmsCategory.save.messages]);

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
    if (+id > 0 && cmsCategory.getById.data) {
      const data = cmsCategory.getById.data;
      fillValuesOnEdit(data);
    }
  }, [cmsCategory.getById.data]);

  useEffect(() => {
    dispatch(getTenantLookup());
    if (+id > 0) {
      dispatch(getCmsCategoryById(+id));
    }
    return () => {
      dispatch(clearCmsCategoryGetById());
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
        {cmsCategory.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={cmsCategory.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="cmsCategory"
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
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={cmsCategory.save.loading || common.save.loading}
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
export default AddCmsCategoryModal;
