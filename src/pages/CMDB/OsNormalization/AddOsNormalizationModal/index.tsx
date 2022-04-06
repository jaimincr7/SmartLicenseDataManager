import { Button, Checkbox, Col, Form, Input, InputNumber, Modal, Row, Spin } from 'antd';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import _ from 'lodash';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { ICmdbOsNormalization } from '../../../../services/cmdb/osNormalization/osNormalization.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getCmdbOsNormalizationById,
  saveCmdbOsNormalization,
} from '../../../../store/cmdb/osNormalization/osNormalization.action';
import {
  clearCmdbOsNormalizationGetById,
  clearCmdbOsNormalizationMessages,
  cmdbOsNormalizationSelector,
} from '../../../../store/cmdb/osNormalization/osNormalization.reducer';
import {
  getCmdbApplicationLookup,
  getCmdbDeviceLookup,
  getTenantLookup,
  updateMultiple,
} from '../../../../store/common/common.action';
import {
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';
import { IAddCmdbOsNormalizationProps } from './addOsNormalization.model';
import { getObjectForUpdateMultiple } from '../../../../common/helperFunction';
import { IInlineSearch } from '../../../../common/models/common';
import { globalSearchSelector } from '../../../../store/globalSearch/globalSearch.reducer';

const AddCmdbOsNormalizationModal: React.FC<IAddCmdbOsNormalizationProps> = (props) => {
  const cmdbOsNormalization = useAppSelector(cmdbOsNormalizationSelector);
  const dispatch = useAppDispatch();
  const commonLookups = useAppSelector(commonSelector);
  const globalFilters = useAppSelector(globalSearchSelector);
  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.CmdbOsNormalization} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ICmdbOsNormalization = {
    operating_system_raw: '',
    device_type: '',
    family: '',
    publisher: '',
    edition: '',
    edition_index: null,
    version: '',
    version_index: null,
  };

  const onFinish = (values: any) => {
    const inputValues: ICmdbOsNormalization = {
      ...values,
      id: id ? +id : null,
    };
    if (!isMultiple) {
      dispatch(saveCmdbOsNormalization(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        cmdbOsNormalization.search.tableName
      );
      if (result) {
        dispatch(updateMultiple(result));
      }
    }
  };

  const fillValuesOnEdit = async (data: ICmdbOsNormalization) => {
    if (data) {
      initialValues = {
        operating_system_raw: data.operating_system_raw,
        device_type: data.device_type,
        family: data.family,
        publisher: data.publisher,
        edition: data.edition,
        edition_index: _.isNull(data.edition_index) ? null : data.edition_index,
        version: data.version,
        version_index: _.isNull(data.version_index) ? null : data.version_index,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (cmdbOsNormalization.save.messages.length > 0) {
      if (cmdbOsNormalization.save.hasErrors) {
        toast.error(cmdbOsNormalization.save.messages.join(' '));
      } else {
        toast.success(cmdbOsNormalization.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearCmdbOsNormalizationMessages());
    }
  }, [cmdbOsNormalization.save.messages]);

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
    if (+id > 0 && cmdbOsNormalization.getById.data) {
      const data = cmdbOsNormalization.getById.data;
      fillValuesOnEdit(data);
    }
  }, [cmdbOsNormalization.getById.data]);

  useEffect(() => {
    dispatch(getTenantLookup());
    dispatch(getCmdbApplicationLookup());
    dispatch(getCmdbDeviceLookup());
    if (+id > 0) {
      dispatch(getCmdbOsNormalizationById(+id));
    }
    return () => {
      dispatch(clearCmdbOsNormalizationGetById());
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
        {cmdbOsNormalization.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={cmdbOsNormalization.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="cmdbOsNormalization"
            initialValues={initialValues}
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Row gutter={[30, 15]} className="form-label-hide">
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'operating_system_raw']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Operating System</Checkbox>
                    </Form.Item>
                  ) : (
                    'Operating System'
                  )}
                  <Form.Item
                    name="operating_system_raw"
                    label="Operating System"
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
                    <Form.Item name={['checked', 'device_type']} valuePropName="checked" noStyle>
                      <Checkbox>Device Type</Checkbox>
                    </Form.Item>
                  ) : (
                    'Device Type'
                  )}
                  <Form.Item
                    name="device_type"
                    className="m-0"
                    label="Device Type"
                    rules={[{ max: 255 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'family']} valuePropName="checked" noStyle>
                      <Checkbox>Family</Checkbox>
                    </Form.Item>
                  ) : (
                    'Family'
                  )}
                  <Form.Item name="family" className="m-0" label="Family" rules={[{ max: 255 }]}>
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
                  <Form.Item name="publisher" className="m-0" label="Publisher">
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
                    <Form.Item name={['checked', 'edition_index']} valuePropName="checked" noStyle>
                      <Checkbox>Edition Index</Checkbox>
                    </Form.Item>
                  ) : (
                    'Edition Index'
                  )}
                  <Form.Item
                    name="edition_index"
                    className="m-0"
                    label="Edition Index"
                    rules={[{ type: 'integer' }]}
                  >
                    <InputNumber className="form-control w-100" />
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
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'version_index']} valuePropName="checked" noStyle>
                      <Checkbox>Version Index</Checkbox>
                    </Form.Item>
                  ) : (
                    'Version Index'
                  )}
                  <Form.Item
                    name="version_index"
                    className="m-0"
                    label="Version Index"
                    rules={[{ type: 'integer' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={cmdbOsNormalization.save.loading || commonLookups.save.loading}
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
export default AddCmdbOsNormalizationModal;
