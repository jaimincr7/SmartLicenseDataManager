import { Button, Col, Form, Input, InputNumber, Modal, Row, Select, Spin, Switch } from 'antd';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { validateMessages } from '../../../../common/constants/common';
import { ILookup } from '../../../../services/common/common.model';
import { ITabVCluster } from '../../../../services/rvTools/tabVCluster/tabVCluster.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getBULookup,
  getCompanyLookup,
  getTenantLookup,
} from '../../../../store/common/common.action';
import {
  clearBULookUp,
  clearCompanyLookUp,
  commonSelector,
} from '../../../../store/common/common.reducer';
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

  const { id, showModal, handleModalClose, refreshDataTable } = props;

  const isNew: boolean = id ? false : true;
  const title = useMemo(() => {
    return isNew ? 'Add Tab-V-Cluster' : 'Edit Tab-V-Cluster';
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
    dispatch(saveTabVCluster(inputValues));
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
    if (+id > 0 && tabVCluster.getById.data) {
      const data = tabVCluster.getById.data;
      fillValuesOnEdit(data);
    }
  }, [tabVCluster.getById.data]);

  useEffect(() => {
    dispatch(getTenantLookup());
    if (+id > 0) {
      dispatch(getTabVClusterById(+id));
    }
    return () => {
      dispatch(clearTabVClusterGetById());
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
                  <label className="label">Tenant</label>
                  <Form.Item
                    name="tenant_id"
                    className="m-0"
                    label="Tenant"
                    rules={[{ required: true }]}
                  >
                    <Select
                      onChange={handleTenantChange}
                      allowClear
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
                  <label className="label">Company</label>
                  <Form.Item name="company_id" className="m-0" label="Company">
                    <Select
                      onChange={handleCompanyChange}
                      allowClear
                      loading={commonLookups.companyLookup.loading}
                    >
                      {commonLookups.companyLookup.data.map((option: ILookup) => (
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
                  <label className="label">BU</label>
                  <Form.Item name="bu_id" className="m-0" label="BU">
                    <Select
                      onChange={handleBUChange}
                      allowClear
                      loading={commonLookups.buLookup.loading}
                    >
                      {commonLookups.buLookup.data.map((option: ILookup) => (
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
                  <label className="label">Name</label>
                  <Form.Item name="name" label="Name" className="m-0" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Over All Status</label>
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
                  <label className="label">Hosts</label>
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
                  <label className="label">Effective Hosts</label>
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
                  <label className="label">Total CPU</label>
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
                  <label className="label">CPU Cores</label>
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
                  <label className="label">V Motions</label>
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
                  <label className="label">DRS Default VM Behavior</label>
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
                  <label className="label">Fail Over Level</label>
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
                  <label className="label">DRS Default VM Behavior Value</label>
                  <Form.Item
                    name="drs_default_vm_behavior_value"
                    label="drs_default_vm_behavior_value"
                    className="m-0"
                    rules={[{ type: 'integer' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">DRS v Motion Rate</label>
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
                  <label className="label">Source</label>
                  <Form.Item name="source" label="Source" className="m-0" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Data Center</label>
                  <Form.Item
                    name="data_center"
                    label="Data Center"
                    className="m-0"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">VMs Per Host</label>
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
                  <label className="label">VMs</label>
                  <Form.Item name="vms" label="VMs" className="m-0" rules={[{ type: 'integer' }]}>
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Health</label>
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
                  <Form.Item name="ha_enabled" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">HA Enabled</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="drs_enabled" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  <label className="label">DRS Enabled</label>
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={tabVCluster.save.loading}
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
