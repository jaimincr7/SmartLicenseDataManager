import { Button, Checkbox, Col, Form, Modal, Row, Select, Spin } from 'antd';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { ISpsApiOauthIdUrlInjectionSite } from '../../../../services/sps/apiOauthIdUrlInjectionSite/apiOauthIdUrlInjectionSite.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getSpsApiOauthIdUrlInjectionSiteById,
  saveSpsApiOauthIdUrlInjectionSite,
} from '../../../../store/sps/apiOauthIdUrlInjectionSite/apiOauthIdUrlInjectionSite.action';
import {
  clearSpsApiOauthIdUrlInjectionSiteGetById,
  clearSpsApiOauthIdUrlInjectionSiteMessages,
  spsApiOauthIdUrlInjectionSiteSelector,
} from '../../../../store/sps/apiOauthIdUrlInjectionSite/apiOauthIdUrlInjectionSite.reducer';
import { IAddSpsApiOauthIdUrlInjectionSiteProps } from './addApiOauthIdUrlInjectionSite.model';
import { ILookup } from '../../../../services/common/common.model';
import {
  clearMultipleUpdateMessages,
  clearSpsApiOAuthLookup,
  clearSpsApiUrlInjectionLookup,
  commonSelector,
} from '../../../../store/common/common.reducer';
import {
  getSpsApiOAuthLookup,
  getSpsApiUrlInjectionLookup,
  updateMultiple,
} from '../../../../store/common/common.action';
import { getObjectForUpdateMultiple } from '../../../../common/helperFunction';

const { Option } = Select;

const AddSpsApiOauthIdUrlInjectionSiteModal: React.FC<IAddSpsApiOauthIdUrlInjectionSiteProps> = (
  props
) => {
  const spsApiOauthIdUrlInjectionSite = useAppSelector(spsApiOauthIdUrlInjectionSiteSelector);
  const dispatch = useAppDispatch();
  const commonLookups = useAppSelector(commonSelector);
  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '}{' '}
        <BreadCrumbs pageName={Page.SpsApiOauthIdUrlInjectionSite} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ISpsApiOauthIdUrlInjectionSite = {
    oauth_id: null,
    inj_id: null,
  };

  const onFinish = (values: any) => {
    const inputValues: ISpsApiOauthIdUrlInjectionSite = {
      ...values,
      id: id ? +id : null,
    };
    if (!isMultiple) {
      dispatch(saveSpsApiOauthIdUrlInjectionSite(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        spsApiOauthIdUrlInjectionSite.search.tableName
      );
      if (result) {
        dispatch(updateMultiple(result));
      }
    }
  };

  const fillValuesOnEdit = async (data: ISpsApiOauthIdUrlInjectionSite) => {
    if (data) {
      initialValues = {
        oauth_id: _.isNull(data.oauth_id) ? null : data.oauth_id,
        inj_id: _.isNull(data.inj_id) ? null : data.inj_id,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (spsApiOauthIdUrlInjectionSite.save.messages.length > 0) {
      if (spsApiOauthIdUrlInjectionSite.save.hasErrors) {
        toast.error(spsApiOauthIdUrlInjectionSite.save.messages.join(' '));
      } else {
        toast.success(spsApiOauthIdUrlInjectionSite.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearSpsApiOauthIdUrlInjectionSiteMessages());
    }
  }, [spsApiOauthIdUrlInjectionSite.save.messages]);

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
    if (+id > 0 && spsApiOauthIdUrlInjectionSite.getById.data) {
      const data = spsApiOauthIdUrlInjectionSite.getById.data;
      fillValuesOnEdit(data);
    }
  }, [spsApiOauthIdUrlInjectionSite.getById.data]);

  useEffect(() => {
    dispatch(getSpsApiOAuthLookup());
    dispatch(getSpsApiUrlInjectionLookup());
    if (+id > 0) {
      dispatch(getSpsApiOauthIdUrlInjectionSiteById(+id));
    }
    return () => {
      dispatch(clearSpsApiOauthIdUrlInjectionSiteGetById());
      dispatch(clearSpsApiOAuthLookup());
      dispatch(clearSpsApiUrlInjectionLookup());
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
        {spsApiOauthIdUrlInjectionSite.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={spsApiOauthIdUrlInjectionSite.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="spsApiOauthIdUrlInjectionSite"
            initialValues={initialValues}
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Row gutter={[30, 15]} className="form-label-hide">
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'inj_id']} valuePropName="checked" noStyle>
                      <Checkbox>Injection URL</Checkbox>
                    </Form.Item>
                  ) : (
                    'Injection URL'
                  )}
                  <Form.Item
                    name="inj_id"
                    className="m-0"
                    label="Injection URL"
                    rules={[{ required: !isMultiple }]}
                  >
                    <Select
                      allowClear
                      dropdownClassName="value-box-select"
                      loading={commonLookups.spsApiUrlInjectionLookup.loading}
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
                      {commonLookups.spsApiUrlInjectionLookup.data.map((option: ILookup) => (
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
                    <Form.Item name={['checked', 'oauth_id']} valuePropName="checked" noStyle>
                      <Checkbox>OAuth</Checkbox>
                    </Form.Item>
                  ) : (
                    'OAuth'
                  )}
                  <Form.Item
                    name="oauth_id"
                    className="m-0"
                    label="OAuth"
                    rules={[{ required: !isMultiple }]}
                  >
                    <Select
                      allowClear
                      dropdownClassName="value-box-select"
                      loading={commonLookups.spsApiOAuthLookup.loading}
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
                      {commonLookups.spsApiOAuthLookup.data.map((option: ILookup) => (
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
                loading={spsApiOauthIdUrlInjectionSite.save.loading || commonLookups.save.loading}
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
export default AddSpsApiOauthIdUrlInjectionSiteModal;
