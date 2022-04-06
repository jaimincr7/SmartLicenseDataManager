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
import { ITabVCluster } from '../../../../services/rvTools/tabVCluster/tabVCluster.model';
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
import {
  getTabVClusterById,
  saveTabVCluster,
} from '../../../../store/rvTools/tabVCluster/tabVCluster.action';
import {
  clearTabVClusterGetById,
  clearTabVClusterMessages,
  tabVClusterSelector,
} from '../../../../store/rvTools/tabVCluster/tabVCluster.reducer';
import { IAddTabVClusterProps } from './addTabVCluster.model';

const { Option } = Select;

const AddTabVClusterModal: React.FC<IAddTabVClusterProps> = (props) => {
  const tabVCluster = useAppSelector(tabVClusterSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const globalFilters = useAppSelector(globalSearchSelector);

  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.TabVCluster} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ITabVCluster = {
    company_id: null,
    bu_id: null,
    source: '',
    name: '',
    over_all_status: '',
    num_hosts: null,
    num_effective_hosts: null,
    total_cpu: null,
    num_cpu_cores: null,
    num_v_motions: null,
    ha_enabled: false,
    failover_level: null,
    drs_enabled: false,
    drs_default_vm_behavior_value: null,
    drs_v_motion_rate: null,
    drs_default_vm_behavior: '',
    data_center: '',
    vm_sper_host: null,
    vms: null,
    health: null,
    tenant_id: null,
  };

  const onFinish = (values: any) => {
    const inputValues: ITabVCluster = {
      ...values,
      ha_enabled: values.ha_enabled ? 'True' : 'False',
      drs_enabled: values.drs_enabled ? 'True' : 'False',
      id: id ? +id : null,
    };
    if (!isMultiple) {
      dispatch(saveTabVCluster(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        tabVCluster.search.tableName
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

  const fillValuesOnEdit = async (data) => {
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
        name: data.name,
        over_all_status: data.over_all_status,
        num_hosts: data.num_hosts,
        num_effective_hosts: data.num_effective_hosts,
        total_cpu: Number(data.total_cpu),
        num_cpu_cores: data.num_cpu_cores,
        num_v_motions: data.num_v_motions,
        ha_enabled: data.ha_enabled === 'True' ? true : false,
        failover_level: data.failover_level,
        drs_enabled: data.drs_enabled === 'True' ? true : false,
        drs_default_vm_behavior_value: data.drs_default_vm_behavior_value,
        drs_v_motion_rate: data.drs_v_motion_rate,
        drs_default_vm_behavior: data.drs_default_vm_behavior,
        data_center: data.data_center,
        vm_sper_host: data.vm_sper_host,
        vms: data.vms,
        health: data.health,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (tabVCluster.save.messages.length > 0) {
      if (tabVCluster.save.hasErrors) {
        toast.error(tabVCluster.save.messages.join(' '));
      } else {
        toast.success(tabVCluster.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearTabVClusterMessages());
    }
  }, [tabVCluster.save.messages]);

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
    if (+id > 0 && tabVCluster.getById.data) {
      const data = tabVCluster.getById.data;
      fillValuesOnEdit(data);
    }
  }, [tabVCluster.getById.data]);

  useEffect(() => {
    if (Object.keys(globalFilters?.globalTenantLookup?.data).length == 0) {
      dispatch(getTenantLookup());
    }
    if (+id > 0) {
      dispatch(getTabVClusterById(+id));
    }
    return () => {
      dispatch(clearTabVClusterGetById());
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
        {tabVCluster.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={tabVCluster.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="addTabVCluster"
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
                    <Form.Item name={['checked', 'name']} valuePropName="checked" noStyle>
                      <Checkbox>Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Name'
                  )}
                  <Form.Item name="name" label="Name" className="m-0" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'over_all_status']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Over All Status</Checkbox>
                    </Form.Item>
                  ) : (
                    'Over All Status'
                  )}
                  <Form.Item
                    name="over_all_status"
                    label="Over All Status"
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
                    <Form.Item name={['checked', 'num_hosts']} valuePropName="checked" noStyle>
                      <Checkbox>Hosts</Checkbox>
                    </Form.Item>
                  ) : (
                    'Hosts'
                  )}
                  <Form.Item
                    name="num_hosts"
                    label="Hosts"
                    className="m-0"
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
                      name={['checked', 'num_effective_hosts']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Effective Hosts</Checkbox>
                    </Form.Item>
                  ) : (
                    'Effective Hosts'
                  )}
                  <Form.Item
                    name="num_effective_hosts"
                    label="Effective Hosts"
                    className="m-0"
                    rules={[{ type: 'integer' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'total_cpu']} valuePropName="checked" noStyle>
                      <Checkbox>Total CPU</Checkbox>
                    </Form.Item>
                  ) : (
                    'Total CPU'
                  )}
                  <Form.Item
                    name="total_cpu"
                    label="Total CPU"
                    className="m-0"
                    rules={[{ type: 'integer' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'num_cpu_cores']} valuePropName="checked" noStyle>
                      <Checkbox>CPU Cores</Checkbox>
                    </Form.Item>
                  ) : (
                    'CPU Cores'
                  )}
                  <Form.Item
                    name="num_cpu_cores"
                    label="CPU Cores"
                    className="m-0"
                    rules={[{ type: 'integer' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'num_v_motions']} valuePropName="checked" noStyle>
                      <Checkbox>V Motions</Checkbox>
                    </Form.Item>
                  ) : (
                    'V Motions'
                  )}
                  <Form.Item
                    name="num_v_motions"
                    label="V Motions"
                    className="m-0"
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
                      name={['checked', 'drs_default_vm_behavior']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>DRS Default VM Behavior</Checkbox>
                    </Form.Item>
                  ) : (
                    'DRS Default VM Behavior'
                  )}
                  <Form.Item
                    name="drs_default_vm_behavior"
                    className="m-0"
                    label="DRS Default VM Behavior"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'failover_level']} valuePropName="checked" noStyle>
                      <Checkbox>Fail Over Level</Checkbox>
                    </Form.Item>
                  ) : (
                    'Fail Over Level'
                  )}
                  <Form.Item
                    name="failover_level"
                    label="Fail Over Level"
                    className="m-0"
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
                      name={['checked', 'drs_default_vm_behavior_value']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Drs Default VM Behavior Value</Checkbox>
                    </Form.Item>
                  ) : (
                    'Drs Default VM Behavior Value'
                  )}
                  <Form.Item
                    name="drs_default_vm_behavior_value"
                    label="Drs Default VM Behavior Value"
                    className="m-0"
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
                      name={['checked', 'drs_v_motion_rate']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>DRS v Motion Rate</Checkbox>
                    </Form.Item>
                  ) : (
                    'DRS v Motion Rate'
                  )}
                  <Form.Item
                    name="drs_v_motion_rate"
                    label="DRS v Motion Rate"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
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
                    <Form.Item name={['checked', 'vm_sper_host']} valuePropName="checked" noStyle>
                      <Checkbox>VMs Per Host</Checkbox>
                    </Form.Item>
                  ) : (
                    'VMs Per Host'
                  )}
                  <Form.Item
                    name="vm_sper_host"
                    label="VMs Per Host"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'vms']} valuePropName="checked" noStyle>
                      <Checkbox>VMs</Checkbox>
                    </Form.Item>
                  ) : (
                    'VMs'
                  )}
                  <Form.Item name="vms" label="VMs" className="m-0" rules={[{ type: 'integer' }]}>
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'health']} valuePropName="checked" noStyle>
                      <Checkbox>Health</Checkbox>
                    </Form.Item>
                  ) : (
                    'Health'
                  )}
                  <Form.Item
                    name="health"
                    label="Health"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="ha_enabled" className="m-0 mr-1" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item name={['checked', 'ha_enabled']} valuePropName="checked" noStyle>
                      <Checkbox>HA Enabled</Checkbox>
                    </Form.Item>
                  ) : (
                    'HA Enabled'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="drs_enabled" className="m-0 mr-1" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item name={['checked', 'drs_enabled']} valuePropName="checked" noStyle>
                      <Checkbox>DRS Enabled</Checkbox>
                    </Form.Item>
                  ) : (
                    'DRS Enabled'
                  )}
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={tabVCluster.save.loading || commonLookups.save.loading}
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
export default AddTabVClusterModal;
