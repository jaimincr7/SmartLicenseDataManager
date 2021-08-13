import { Button, Col, Form, Input,  Modal, Row, Spin } from 'antd';
import moment from 'moment';
import _ from 'lodash';
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
import {
  getTenantLookup,
} from '../../../../store/common/common.action';
import {
  clearBULookUp,
  clearCompanyLookUp,
} from '../../../../store/common/common.reducer';
import { IAddCmsCategoryProps } from './addCmsCategory.model';


const AddCmsCategoryModal: React.FC<IAddCmsCategoryProps> = (props) => {
  const cmsCategory = useAppSelector(cmsCategorySelector);
  const dispatch = useAppDispatch();

  const { id, showModal, handleModalClose, refreshDataTable } = props;

  const isNew: boolean = id ? false : true;
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
    dispatch(saveCmsCategory(inputValues));
  };

  const fillValuesOnEdit = async (data: ICmsCategory) => {
    if (data) {
      initialValues = {
        name: data.name,
        date_added: _.isNull(data.date_added) ? null : moment(data.date_added),
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
                  <label className="label">Name</label>
                  <Form.Item name="name" label="Name" className="m-0" rules={[{ max: 510 }]}>
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
                loading={cmsCategory.save.loading}
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
