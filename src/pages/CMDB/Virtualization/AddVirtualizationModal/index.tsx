import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Spin,
  Switch,
} from 'antd';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import _ from 'lodash';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { getObjectForUpdateMultiple } from '../../../../common/helperFunction';
import { IInlineSearch } from '../../../../common/models/common';
import { ICmdbVirtualization } from '../../../../services/cmdb/virtualization/virtualization.model';
import { ILookup } from '../../../../services/common/common.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getCmdbVirtualizationById,
  saveCmdbVirtualization,
} from '../../../../store/cmdb/virtualization/virtualization.action';
import {
  clearCmdbVirtualizationGetById,
  clearCmdbVirtualizationMessages,
  cmdbVirtualizationSelector,
} from '../../../../store/cmdb/virtualization/virtualization.reducer';
import { getTenantLookup, updateMultiple } from '../../../../store/common/common.action';
import {
  clearBULookUp,
  clearCompanyLookUp,
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';
import { globalSearchSelector } from '../../../../store/globalSearch/globalSearch.reducer';
import { IAddCmdbVirtualizationProps } from './addVirtualization.model';

const { Option } = Select;

const AddCmdbVirtualizationModal: React.FC<IAddCmdbVirtualizationProps> = (props) => {
  const cmdbVirtualization = useAppSelector(cmdbVirtualizationSelector);
  const dispatch = useAppDispatch();
  const commonLookups = useAppSelector(commonSelector);
  const globalFilters = useAppSelector(globalSearchSelector);
  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.CmdbVirtualization} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ICmdbVirtualization = {
    cluster_name: '',
    cluster_id: '',
    data_center_name: '',
    data_center_id: null,
    is_drs_enabled: false,
    is_ha_enabled: false,
    hypervisor_type: '',
    host_name: '',
    tenant_id: null,
  };

  const onFinish = (values: any) => {
    const inputValues: ICmdbVirtualization = {
      ...values,
      id: id ? +id : null,
    };
    if (!isMultiple) {
      dispatch(saveCmdbVirtualization(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        cmdbVirtualization.search.tableName
      );
      if (result) {
        dispatch(updateMultiple(result));
      }
    }
  };

  const fillValuesOnEdit = async (data: ICmdbVirtualization) => {
    if (data) {
      initialValues = {
        cluster_name: data.cluster_name,
        cluster_id: data.cluster_id,
        data_center_name: data.data_center_name,
        data_center_id: data.data_center_id,
        is_drs_enabled: data.is_drs_enabled,
        is_ha_enabled: data.is_ha_enabled,
        hypervisor_type: data.hypervisor_type,
        host_name: data.host_name,
        tenant_id: data.tenant_id,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (cmdbVirtualization.save.messages.length > 0) {
      if (cmdbVirtualization.save.hasErrors) {
        toast.error(cmdbVirtualization.save.messages.join(' '));
      } else {
        toast.success(cmdbVirtualization.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearCmdbVirtualizationMessages());
    }
  }, [cmdbVirtualization.save.messages]);

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
    if (+id > 0 && cmdbVirtualization.getById.data) {
      const data = cmdbVirtualization.getById.data;
      fillValuesOnEdit(data);
    }
  }, [cmdbVirtualization.getById.data]);

  useEffect(() => {
    dispatch(getTenantLookup());
    if (+id > 0) {
      dispatch(getCmdbVirtualizationById(+id));
    }
    return () => {
      dispatch(clearCmdbVirtualizationGetById());
      dispatch(clearCompanyLookUp());
      dispatch(clearBULookUp());
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
        {cmdbVirtualization.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={cmdbVirtualization.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="cmdbVirtualization"
            initialValues={initialValues}
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Row gutter={[30, 15]} className="form-label-hide">
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'tenant_id']} valuePropName="checked" noStyle>
                      <Checkbox>Tenant</Checkbox>
                    </Form.Item>
                  ) : (
                    'Tenant'
                  )}
                  <Form.Item
                    name="tenant_id"
                    className="m-0"
                    label="Tenant"
                    rules={[{ required: !isMultiple }]}
                  >
                    <Select
                      allowClear
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
                      loading={commonLookups.tenantLookup.loading}
                    >
                      {commonLookups.tenantLookup.data.map((option: ILookup) => (
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
                    <Form.Item name={['checked', 'cluster_name']} valuePropName="checked" noStyle>
                      <Checkbox>Cluster Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Cluster Name'
                  )}
                  <Form.Item
                    name="cluster_name"
                    label="Cluster Name"
                    className="m-0"
                    rules={[{ max: 500, required: !isMultiple }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'cluster_id']} valuePropName="checked" noStyle>
                      <Checkbox>Cluster ID</Checkbox>
                    </Form.Item>
                  ) : (
                    'Cluster ID'
                  )}
                  <Form.Item
                    name="cluster_id"
                    className="m-0"
                    label="Cluster ID"
                    rules={[{ max: 500, required: !isMultiple }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'data_center_name']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Datacenter Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Data Center Name'
                  )}
                  <Form.Item
                    name="data_center_name"
                    className="m-0"
                    label="Data Center Name"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'data_center_id']} valuePropName="checked" noStyle>
                      <Checkbox>Datacenter Id</Checkbox>
                    </Form.Item>
                  ) : (
                    'Data Center Id'
                  )}
                  <Form.Item
                    name="data_center_id"
                    className="m-0"
                    label="Data Center Id"
                    rules={[{ type: 'integer' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'hypervisor_type']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Hypervisor Type</Checkbox>
                    </Form.Item>
                  ) : (
                    'Hypervisor Type'
                  )}
                  <Form.Item
                    name="hypervisor_type"
                    className="m-0"
                    label="Hypervisor Type"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'host_name']} valuePropName="checked" noStyle>
                      <Checkbox>Host Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Host Name'
                  )}
                  <Form.Item
                    name="host_name"
                    className="m-0"
                    label="Host Name"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_drs_enabled" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item name={['checked', 'is_drs_enabled']} valuePropName="checked" noStyle>
                      <Checkbox>Is DRS Enabled</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is DRS Enabled'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_ha_enabled" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item name={['checked', 'is_ha_enabled']} valuePropName="checked" noStyle>
                      <Checkbox>Is HA Enabled</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is HA Enabled'
                  )}
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={cmdbVirtualization.save.loading || commonLookups.save.loading}
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
export default AddCmdbVirtualizationModal;
