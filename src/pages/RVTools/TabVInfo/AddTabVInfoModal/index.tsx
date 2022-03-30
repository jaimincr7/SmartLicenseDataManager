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
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { getObjectForUpdateMultiple } from '../../../../common/helperFunction';
import { IInlineSearch } from '../../../../common/models/common';
import { ILookup } from '../../../../services/common/common.model';
import { ITabVInfo } from '../../../../services/rvTools/tabVInfo/tabVInfo.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getBULookup,
  getCompanyLookup,
  getTenantLookup,
  updateMultiple,
} from '../../../../store/common/common.action';
import {
  clearBULookUp,
  clearCompanyLookUp,
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';
import { globalSearchSelector } from '../../../../store/globalSearch/globalSearch.reducer';
import { getTabVInfoById, saveTabVInfo } from '../../../../store/rvTools/tabVInfo/tabVInfo.action';
import {
  clearTabVInfoGetById,
  clearTabVInfoMessages,
  tabVInfoSelector,
} from '../../../../store/rvTools/tabVInfo/tabVInfo.reducer';
import { IAddTabVInfoProps } from './addTabVInfo.model';

const { Option } = Select;

const AddTabVInfoModal: React.FC<IAddTabVInfoProps> = (props) => {
  const tabVInfo = useAppSelector(tabVInfoSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const globalFilters = useAppSelector(globalSearchSelector);

  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.TabVInfo} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ITabVInfo = {
    company_id: null,
    bu_id: null,
    source: '',
    vm: '',
    dns_name: '',
    power_state: '',
    guest_state: '',
    cpus: null,
    data_center: '',
    cluster: '',
    host: '',
    os: '',
    customer_id: '',
    s_id: '',
    os_according_to_the_configuration_file: '',
    os_according_to_the_vm_ware_tools: '',
    vm_uuid: '',
    vmc: false,
    cpu_size_recommendation: null,
    tenant_id: null,
  };

  const onFinish = (values: any) => {
    const inputValues: ITabVInfo = {
      ...values,
      id: id ? +id : null,
    };
    if (!isMultiple) {
      dispatch(saveTabVInfo(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        tabVInfo.search.tableName
      );
      if (result) {
        dispatch(updateMultiple(result));
      }
    }
  };

  const handleTenantChange = (tenantId: number) => {
    form.setFieldsValue({ tenant_id: tenantId, company_id: null, bu_id: null });
    if (tenantId) {
      dispatch(getCompanyLookup(tenantId));
      dispatch(clearBULookUp());
    } else {
      dispatch(clearCompanyLookUp());
      dispatch(clearBULookUp());
    }
  };

  const handleCompanyChange = (companyId: number) => {
    form.setFieldsValue({ company_id: companyId, bu_id: null });
    if (companyId) {
      dispatch(getBULookup(companyId));
    } else {
      dispatch(clearBULookUp());
    }
  };

  const handleBUChange = (buId: number) => {
    form.setFieldsValue({ bu_id: buId });
  };

  const fillValuesOnEdit = async (data: ITabVInfo) => {
    if (data.tenant_id) {
      await dispatch(getCompanyLookup(data.tenant_id));
    }
    if (data.company_id) {
      await dispatch(getBULookup(data.company_id));
    }
    if (data) {
      initialValues = {
        tenant_id: _.isNull(data.tenant_id) ? null : data.tenant_id,
        company_id: _.isNull(data.company_id) ? null : data.company_id,
        bu_id: _.isNull(data.bu_id) ? null : data.bu_id,
        source: data.source,
        data_center: data.data_center,
        host: data.host,
        cluster: data.cluster,
        vm: data.vm,
        dns_name: data.dns_name,
        power_state: data.power_state,
        guest_state: data.guest_state,
        cpus: data.cpus,
        os: data.os,
        customer_id: data.customer_id,
        s_id: data.s_id,
        os_according_to_the_configuration_file: data.os_according_to_the_configuration_file,
        os_according_to_the_vm_ware_tools: data.os_according_to_the_vm_ware_tools,
        vm_uuid: data.vm_uuid,
        vmc: data.vmc,
        cpu_size_recommendation: data.cpu_size_recommendation,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (tabVInfo.save.messages.length > 0) {
      if (tabVInfo.save.hasErrors) {
        toast.error(tabVInfo.save.messages.join(' '));
      } else {
        toast.success(tabVInfo.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearTabVInfoMessages());
    }
  }, [tabVInfo.save.messages]);

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
    if (+id > 0 && tabVInfo.getById.data) {
      const data = tabVInfo.getById.data;
      fillValuesOnEdit(data);
    }
  }, [tabVInfo.getById.data]);

  useEffect(() => {
    if (Object.keys(globalFilters?.globalTenantLookup?.data).length == 0) {
      dispatch(getTenantLookup());
    }
    if (+id > 0) {
      dispatch(getTabVInfoById(+id));
    }
    return () => {
      dispatch(clearTabVInfoGetById());
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
      if (globalFilters.search.tenant_id && globalFilters.search.tenant_id !== 0) {
        if (!globalFilters.search.company_id) {
          dispatch(getCompanyLookup(globalSearch.tenant_id[0]));
        }
        if (!globalFilters.search.bu_id && globalFilters.search.company_id !== 0) {
          dispatch(getBULookup(globalSearch.company_id[0]));
        }
        const initlValues = {
          company_id: _.isNull(globalSearch.company_id) ? null : globalSearch.company_id[0],
          bu_id: _.isNull(globalSearch.bu_id) ? null : globalSearch.bu_id[0],
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
        {tabVInfo.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={tabVInfo.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="addTabVInfo"
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
                      onChange={handleTenantChange}
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
                      {Object.keys(globalFilters?.globalTenantLookup?.data).length > 0
                        ? globalFilters?.globalTenantLookup?.data.map((option: ILookup) => (
                            <Option key={option.id} value={option.id}>
                              {option.name}
                            </Option>
                          ))
                        : commonLookups.tenantLookup.data.map((option: ILookup) => (
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
                    <Form.Item name={['checked', 'company_id']} valuePropName="checked" noStyle>
                      <Checkbox>Company</Checkbox>
                    </Form.Item>
                  ) : (
                    'Company'
                  )}
                  <Form.Item name="company_id" className="m-0" label="Company">
                    <Select
                      onChange={handleCompanyChange}
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
                      loading={commonLookups.companyLookup.loading}
                    >
                      {Object.keys(commonLookups.companyLookup.data).length > 0
                        ? commonLookups.companyLookup.data.map((option: ILookup) => (
                            <Option key={option.id} value={option.id}>
                              {option.name}
                            </Option>
                          ))
                        : globalFilters?.globalCompanyLookup?.data.map((option: ILookup) => (
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
                    <Form.Item name={['checked', 'bu_id']} valuePropName="checked" noStyle>
                      <Checkbox>BU</Checkbox>
                    </Form.Item>
                  ) : (
                    'BU'
                  )}
                  <Form.Item name="bu_id" className="m-0" label="BU">
                    <Select
                      onChange={handleBUChange}
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
                      loading={commonLookups.buLookup.loading}
                    >
                      {Object.keys(commonLookups.buLookup.data).length > 0
                        ? commonLookups.buLookup.data.map((option: ILookup) => (
                            <Option key={option.id} value={option.id}>
                              {option.name}
                            </Option>
                          ))
                        : globalFilters?.globalBULookup?.data.map((option: ILookup) => (
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
                    <Form.Item name={['checked', 'host']} valuePropName="checked" noStyle>
                      <Checkbox>Host</Checkbox>
                    </Form.Item>
                  ) : (
                    'Host'
                  )}
                  <Form.Item name="host" label="Host" className="m-0" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'cluster']} valuePropName="checked" noStyle>
                      <Checkbox>Cluster</Checkbox>
                    </Form.Item>
                  ) : (
                    'Cluster'
                  )}
                  <Form.Item name="cluster" label="Cluster" className="m-0" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'source']} valuePropName="checked" noStyle>
                      <Checkbox>Source</Checkbox>
                    </Form.Item>
                  ) : (
                    'Source'
                  )}
                  <Form.Item name="source" label="Source" className="m-0" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'data_center']} valuePropName="checked" noStyle>
                      <Checkbox>Datacenter</Checkbox>
                    </Form.Item>
                  ) : (
                    'Datacenter'
                  )}
                  <Form.Item
                    name="data_center"
                    label="Datacenter"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'cpus']} valuePropName="checked" noStyle>
                      <Checkbox>CPUs</Checkbox>
                    </Form.Item>
                  ) : (
                    'CPUs'
                  )}
                  <Form.Item name="cpus" label="CPUs" className="m-0" rules={[{ type: 'integer' }]}>
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'vm']} valuePropName="checked" noStyle>
                      <Checkbox>VM</Checkbox>
                    </Form.Item>
                  ) : (
                    'VM'
                  )}
                  <Form.Item name="vm" className="m-0" label="VM" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'dns_name']} valuePropName="checked" noStyle>
                      <Checkbox>DNS Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'DNS Name'
                  )}
                  <Form.Item
                    name="dns_name"
                    className="m-0"
                    label="DNS Name"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'power_state']} valuePropName="checked" noStyle>
                      <Checkbox>Power State</Checkbox>
                    </Form.Item>
                  ) : (
                    'Power State'
                  )}
                  <Form.Item
                    name="power_state"
                    className="m-0"
                    label="Power State"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'guest_state']} valuePropName="checked" noStyle>
                      <Checkbox>Guest State</Checkbox>
                    </Form.Item>
                  ) : (
                    'Guest State'
                  )}
                  <Form.Item
                    name="guest_state"
                    className="m-0"
                    label="Guest State"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'os']} valuePropName="checked" noStyle>
                      <Checkbox>OS</Checkbox>
                    </Form.Item>
                  ) : (
                    'OS'
                  )}
                  <Form.Item name="os" className="m-0" label="OS" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'customer_id']} valuePropName="checked" noStyle>
                      <Checkbox>Customer Id</Checkbox>
                    </Form.Item>
                  ) : (
                    'Customer Id'
                  )}
                  <Form.Item
                    name="customer_id"
                    className="m-0"
                    label="Customer Id"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 's_id']} valuePropName="checked" noStyle>
                      <Checkbox>sId</Checkbox>
                    </Form.Item>
                  ) : (
                    'sId'
                  )}
                  <Form.Item name="s_id" className="m-0" label="sId" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'os_according_to_the_configuration_file']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>OS According to the Configuration File</Checkbox>
                    </Form.Item>
                  ) : (
                    'OS According to the Configuration File'
                  )}
                  <Form.Item
                    name="os_according_to_the_configuration_file"
                    className="m-0"
                    label="OS According to the Configuration File"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'os_according_to_the_vm_ware_tools']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>OS According to the VMware Tools</Checkbox>
                    </Form.Item>
                  ) : (
                    'OS According to the VMware Tools'
                  )}
                  <Form.Item
                    name="os_according_to_the_vm_ware_tools"
                    className="m-0"
                    label="OS According to the VMware Tools"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'vm_uuid']} valuePropName="checked" noStyle>
                      <Checkbox>VM UUID</Checkbox>
                    </Form.Item>
                  ) : (
                    'VM UUID'
                  )}
                  <Form.Item name="vm_uuid" className="m-0" label="VM UUID" rules={[{ max: 72 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'cpu_size_recommendation']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>CPU Size Recommendation</Checkbox>
                    </Form.Item>
                  ) : (
                    'CPU Size Recommendation'
                  )}
                  <Form.Item
                    name="cpu_size_recommendation"
                    label="CPU Size Recommendation"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="vmc" className="m-0 mr-1" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item name={['checked', 'vmc']} valuePropName="checked" noStyle>
                      <Checkbox>VMC</Checkbox>
                    </Form.Item>
                  ) : (
                    'VMC'
                  )}
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={tabVInfo.save.loading || commonLookups.save.loading}
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
export default AddTabVInfoModal;
