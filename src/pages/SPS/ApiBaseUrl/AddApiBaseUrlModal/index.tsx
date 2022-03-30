import { Button, Checkbox, Col, Form, Input, Modal, Row, Select, Spin, Switch } from 'antd';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { ISpsApiBaseUrl } from '../../../../services/sps/apiBaseUrl/apiBaseUrl.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getSpsApiBaseUrlById,
  saveSpsApiBaseUrl,
} from '../../../../store/sps/apiBaseUrl/apiBaseUrl.action';
import {
  clearSpsApiBaseUrlGetById,
  clearSpsApiBaseUrlMessages,
  spsApiBaseUrlSelector,
} from '../../../../store/sps/apiBaseUrl/apiBaseUrl.reducer';
import { IAddSpsApiBaseUrlProps } from './addApiBaseUrl.model';
import { ILookup } from '../../../../services/common/common.model';
import {
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';
import { getSpsApiGroupLookup, updateMultiple } from '../../../../store/common/common.action';
import { getObjectForUpdateMultiple } from '../../../../common/helperFunction';

const { Option } = Select;

const AddSpsApiBaseUrlModal: React.FC<IAddSpsApiBaseUrlProps> = (props) => {
  const spsApiBaseUrl = useAppSelector(spsApiBaseUrlSelector);
  const dispatch = useAppDispatch();
  const commonLookups = useAppSelector(commonSelector);
  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.SpsApiBaseUrl} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ISpsApiBaseUrl = {
    base_url_name: '',
    group_id: null,
    enabled: false,
  };

  const onFinish = (values: any) => {
    const inputValues: ISpsApiBaseUrl = {
      ...values,
      id: id ? +id : null,
    };
    if (!isMultiple) {
      dispatch(saveSpsApiBaseUrl(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        spsApiBaseUrl.search.tableName
      );
      if (result) {
        dispatch(updateMultiple(result));
      }
    }
  };

  const fillValuesOnEdit = async (data: ISpsApiBaseUrl) => {
    if (data) {
      initialValues = {
        base_url_name: data.base_url_name,
        group_id: _.isNull(data.group_id) ? null : data.group_id,
        enabled: data.enabled,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (spsApiBaseUrl.save.messages.length > 0) {
      if (spsApiBaseUrl.save.hasErrors) {
        toast.error(spsApiBaseUrl.save.messages.join(' '));
      } else {
        toast.success(spsApiBaseUrl.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearSpsApiBaseUrlMessages());
    }
  }, [spsApiBaseUrl.save.messages]);

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
    if (+id > 0 && spsApiBaseUrl.getById.data) {
      const data = spsApiBaseUrl.getById.data;
      fillValuesOnEdit(data);
    }
  }, [spsApiBaseUrl.getById.data]);

  useEffect(() => {
    dispatch(getSpsApiGroupLookup());
    if (+id > 0) {
      dispatch(getSpsApiBaseUrlById(+id));
    }
    return () => {
      dispatch(clearSpsApiBaseUrlGetById());
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
        {spsApiBaseUrl.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={spsApiBaseUrl.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="spsApiBaseUrl"
            initialValues={initialValues}
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Row gutter={[30, 15]} className="form-label-hide">
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'base_url_name']} valuePropName="checked" noStyle>
                      <Checkbox>Base Url Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Base Url Name'
                  )}
                  <Form.Item name="base_url_name" label="Base Url Name" className="m-0">
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'group_id']} valuePropName="checked" noStyle>
                      <Checkbox>API Group</Checkbox>
                    </Form.Item>
                  ) : (
                    'API Group'
                  )}
                  <Form.Item name="group_id" className="m-0" label="API Group">
                    <Select
                      allowClear
                      loading={commonLookups.spsApiGroups.loading}
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
                      {commonLookups.spsApiGroups.data.map((option: ILookup) => (
                        <Option key={option.id} value={option.id}>
                          {option.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="enabled" className="m-0 mr-1" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item name={['checked', 'enabled']} valuePropName="checked" noStyle>
                      <Checkbox>Enabled</Checkbox>
                    </Form.Item>
                  ) : (
                    'Enabled'
                  )}
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={spsApiBaseUrl.save.loading || commonLookups.save.loading}
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
export default AddSpsApiBaseUrlModal;
