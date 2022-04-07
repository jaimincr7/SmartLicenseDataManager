import { Button, Checkbox, Col, Form, Input, Modal, Row, Spin } from 'antd';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import _ from 'lodash';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { ICmdbSoftwareNormalization } from '../../../../services/cmdb/softwareNormalization/softwareNormalization.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getCmdbSoftwareNormalizationById,
  saveCmdbSoftwareNormalization,
} from '../../../../store/cmdb/softwareNormalization/softwareNormalization.action';
import {
  clearCmdbSoftwareNormalizationGetById,
  clearCmdbSoftwareNormalizationMessages,
  cmdbSoftwareNormalizationSelector,
} from '../../../../store/cmdb/softwareNormalization/softwareNormalization.reducer';
import { getTenantLookup, updateMultiple } from '../../../../store/common/common.action';
import {
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';
import { IAddCmdbSoftwareNormalizationProps } from './addSoftwareNormalization.model';
import { getObjectForUpdateMultiple } from '../../../../common/helperFunction';
import { IInlineSearch } from '../../../../common/models/common';
import { globalSearchSelector } from '../../../../store/globalSearch/globalSearch.reducer';

const AddCmdbSoftwareNormalizationModal: React.FC<IAddCmdbSoftwareNormalizationProps> = (props) => {
  const cmdbSoftwareNormalization = useAppSelector(cmdbSoftwareNormalizationSelector);
  const dispatch = useAppDispatch();
  const commonLookups = useAppSelector(commonSelector);
  const globalFilters = useAppSelector(globalSearchSelector);
  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '}{' '}
        <BreadCrumbs pageName={Page.CmdbSoftwareNormalization} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ICmdbSoftwareNormalization = {
    software_title: '',
    licensable: '',
    metric: '',
    product: '',
    edition: '',
    version: '',
    publisher: '',
  };

  const onFinish = (values: any) => {
    const inputValues: ICmdbSoftwareNormalization = {
      ...values,
      id: id ? +id : null,
    };
    if (!isMultiple) {
      dispatch(saveCmdbSoftwareNormalization(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        cmdbSoftwareNormalization.search.tableName
      );
      if (result) {
        dispatch(updateMultiple(result));
      }
    }
  };

  const fillValuesOnEdit = async (data: ICmdbSoftwareNormalization) => {
    if (data) {
      initialValues = {
        software_title: data.software_title,
        licensable: data.licensable,
        metric: data.metric,
        product: data.product,
        edition: data.edition,
        version: data.version,
        publisher: data.publisher,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (cmdbSoftwareNormalization.save.messages.length > 0) {
      if (cmdbSoftwareNormalization.save.hasErrors) {
        toast.error(cmdbSoftwareNormalization.save.messages.join(' '));
      } else {
        toast.success(cmdbSoftwareNormalization.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearCmdbSoftwareNormalizationMessages());
    }
  }, [cmdbSoftwareNormalization.save.messages]);

  useEffect(() => {
    if (commonLookups.save.messages.length > 0) {
      if (commonLookups.save.hasErrors) {
        toast.error(commonLookups.save.messages.join(' '));
      } else {
        toast.success(commonLookups.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearMultipleUpdateMessages());
    }
  }, [commonLookups.save.messages]);

  useEffect(() => {
    if (+id > 0 && cmdbSoftwareNormalization.getById.data) {
      const data = cmdbSoftwareNormalization.getById.data;
      fillValuesOnEdit(data);
    }
  }, [cmdbSoftwareNormalization.getById.data]);

  useEffect(() => {
    dispatch(getTenantLookup());
    if (+id > 0) {
      dispatch(getCmdbSoftwareNormalizationById(+id));
    }
    return () => {
      dispatch(clearCmdbSoftwareNormalizationGetById());
    };
  }, [dispatch]);

  useEffect(() => {
    if (+id === 0 && !isMultiple) {
      const globalSearch: IInlineSearch = {};
      for (const key in globalFilters.search) {
        const element = globalFilters.search[key];
        globalSearch[key] = element ? [element] : null;
      }
      if (globalSearch.tenant_id) {
        const initlValues = {
          tenant_id: _.isNull(globalSearch.tenant_id) ? null : globalSearch.tenant_id[0],
        };
        form.setFieldsValue(initlValues);
      }
    }
  }, []);

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
        {cmdbSoftwareNormalization.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={cmdbSoftwareNormalization.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="cmdbSoftwareNormalization"
            initialValues={initialValues}
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Row gutter={[30, 15]} className="form-label-hide">
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'software_title']} valuePropName="checked" noStyle>
                      <Checkbox>Software Title</Checkbox>
                    </Form.Item>
                  ) : (
                    'Software Title'
                  )}
                  <Form.Item
                    name="software_title"
                    label="Software Title"
                    className="m-0"
                    rules={[{ max: 255 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'licensable']} valuePropName="checked" noStyle>
                      <Checkbox>Licensable</Checkbox>
                    </Form.Item>
                  ) : (
                    'Licensable'
                  )}
                  <Form.Item
                    name="licensable"
                    className="m-0"
                    label="Licensable"
                    rules={[{ max: 255 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'metric']} valuePropName="checked" noStyle>
                      <Checkbox>Metric</Checkbox>
                    </Form.Item>
                  ) : (
                    'Metric'
                  )}
                  <Form.Item name="metric" className="m-0" label="Metric" rules={[{ max: 255 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'product']} valuePropName="checked" noStyle>
                      <Checkbox>Product</Checkbox>
                    </Form.Item>
                  ) : (
                    'Product'
                  )}
                  <Form.Item name="product" className="m-0" label="Product">
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'edition']} valuePropName="checked" noStyle>
                      <Checkbox>Edition</Checkbox>
                    </Form.Item>
                  ) : (
                    'Edition'
                  )}
                  <Form.Item name="edition" className="m-0" label="Edition" rules={[{ max: 255 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'publisher']} valuePropName="checked" noStyle>
                      <Checkbox>Publisher</Checkbox>
                    </Form.Item>
                  ) : (
                    'Publisher'
                  )}
                  <Form.Item
                    name="publisher"
                    className="m-0"
                    label="Publisher"
                    rules={[{ max: 255 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'version']} valuePropName="checked" noStyle>
                      <Checkbox>Version</Checkbox>
                    </Form.Item>
                  ) : (
                    'Version'
                  )}
                  <Form.Item name="version" className="m-0" label="Version" rules={[{ max: 255 }]}>
                    <Input className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={cmdbSoftwareNormalization.save.loading || commonLookups.save.loading}
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
export default AddCmdbSoftwareNormalizationModal;
