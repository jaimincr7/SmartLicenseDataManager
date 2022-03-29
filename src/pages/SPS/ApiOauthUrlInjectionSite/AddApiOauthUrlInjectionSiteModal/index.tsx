import { Button, Checkbox, Col, Form, Input, Modal, Row, Select, Spin } from 'antd';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { ISpsApiOauthUrlInjectionSite } from '../../../../services/sps/apiOauthUrlInjectionSite/apiOauthUrlInjectionSite.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getSpsApiOauthUrlInjectionSiteById,
  saveSpsApiOauthUrlInjectionSite,
} from '../../../../store/sps/apiOauthUrlInjectionSite/apiOauthUrlInjectionSite.action';
import {
  clearSpsApiOauthUrlInjectionSiteGetById,
  clearSpsApiOauthUrlInjectionSiteMessages,
  spsApiOauthUrlInjectionSiteSelector,
} from '../../../../store/sps/apiOauthUrlInjectionSite/apiOauthUrlInjectionSite.reducer';
import { IAddSpsApiOauthUrlInjectionSiteProps } from './addApiOauthUrlInjectionSite.model';
import { ILookup } from '../../../../services/common/common.model';
import {
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';
import { getSpsApiTypes, updateMultiple } from '../../../../store/common/common.action';
import { getObjectForUpdateMultiple } from '../../../../common/helperFunction';

const { Option } = Select;

const AddSpsApiOauthUrlInjectionSiteModal: React.FC<IAddSpsApiOauthUrlInjectionSiteProps> = (
  props
) => {
  const spsApiOauthUrlInjectionSite = useAppSelector(spsApiOauthUrlInjectionSiteSelector);
  const dispatch = useAppDispatch();
  const commonLookups = useAppSelector(commonSelector);
  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '}{' '}
        <BreadCrumbs pageName={Page.SpsApiOauthUrlInjectionSite} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ISpsApiOauthUrlInjectionSite = {
    inj_site: '',
    inj_param_id: '',
    param: '',
    api_type_id: null,
  };

  const onFinish = (values: any) => {
    const inputValues: ISpsApiOauthUrlInjectionSite = {
      ...values,
      id: id ? +id : null,
    };
    if (!isMultiple) {
      dispatch(saveSpsApiOauthUrlInjectionSite(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        spsApiOauthUrlInjectionSite.search.tableName
      );
      if (result) {
        dispatch(updateMultiple(result));
      }
    }
  };

  const fillValuesOnEdit = async (data: ISpsApiOauthUrlInjectionSite) => {
    if (data) {
      initialValues = {
        inj_site: data.inj_site,
        inj_param_id: data.inj_param_id,
        param: data.param,
        api_type_id: _.isNull(data.api_type_id) ? null : data.api_type_id,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (spsApiOauthUrlInjectionSite.save.messages.length > 0) {
      if (spsApiOauthUrlInjectionSite.save.hasErrors) {
        toast.error(spsApiOauthUrlInjectionSite.save.messages.join(' '));
      } else {
        toast.success(spsApiOauthUrlInjectionSite.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearSpsApiOauthUrlInjectionSiteMessages());
    }
  }, [spsApiOauthUrlInjectionSite.save.messages]);

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
    if (+id > 0 && spsApiOauthUrlInjectionSite.getById.data) {
      const data = spsApiOauthUrlInjectionSite.getById.data;
      fillValuesOnEdit(data);
    }
  }, [spsApiOauthUrlInjectionSite.getById.data]);

  useEffect(() => {
    dispatch(getSpsApiTypes());
    if (+id > 0) {
      dispatch(getSpsApiOauthUrlInjectionSiteById(+id));
    }
    return () => {
      dispatch(clearSpsApiOauthUrlInjectionSiteGetById());
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
        {spsApiOauthUrlInjectionSite.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={spsApiOauthUrlInjectionSite.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="spsApiOauthUrlInjectionSite"
            initialValues={initialValues}
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Row gutter={[30, 15]} className="form-label-hide">
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'param']} valuePropName="checked" noStyle>
                      <Checkbox>Param</Checkbox>
                    </Form.Item>
                  ) : (
                    'Param'
                  )}
                  <Form.Item name="param" label="Param" className="m-0" rules={[{ max: 255 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'inj_param_id']} valuePropName="checked" noStyle>
                      <Checkbox>Injection Param ID</Checkbox>
                    </Form.Item>
                  ) : (
                    'Injection Param ID'
                  )}
                  <Form.Item
                    name="inj_param_id"
                    label="Injection Param ID"
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
                    <Form.Item name={['checked', 'inj_site']} valuePropName="checked" noStyle>
                      <Checkbox>Injection Site</Checkbox>
                    </Form.Item>
                  ) : (
                    'Injection Site'
                  )}
                  <Form.Item
                    name="inj_site"
                    label="Injection Site"
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
                    <Form.Item name={['checked', 'api_type_id']} valuePropName="checked" noStyle>
                      <Checkbox>API Type</Checkbox>
                    </Form.Item>
                  ) : (
                    'API Type'
                  )}
                  <Form.Item name="api_type_id" className="m-0" label="API Type">
                    <Select
                      allowClear
                      loading={commonLookups.spsApiTypes.loading}
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
                      {commonLookups.spsApiTypes.data.map((option: ILookup) => (
                        <Option key={option.id} value={option.id}>
                          {option.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={spsApiOauthUrlInjectionSite.save.loading || commonLookups.save.loading}
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
export default AddSpsApiOauthUrlInjectionSiteModal;
