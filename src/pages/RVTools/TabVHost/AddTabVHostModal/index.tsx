import { Button, Col, Form, Input, InputNumber, Modal, Row, Select, Spin } from 'antd';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { validateMessages } from '../../../../common/constants/common';
import { ILookup } from '../../../../services/common/common.model';
import { ITabVHost } from '../../../../services/rvTools/tabVHost/tabVHost.model';
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
import { getTabVHostById, saveTabVHost } from '../../../../store/rvTools/tabVHost/tabVHost.action';
import {
  clearTabVHostGetById,
  clearTabVHostMessages,
  tabVHostSelector,
} from '../../../../store/rvTools/tabVHost/tabVHost.reducer';
import { IAddTabVHostProps } from './addTabVHost.model';

const { Option } = Select;

const AddTabVHostModal: React.FC<IAddTabVHostProps> = (props) => {
  const tabVHost = useAppSelector(tabVHostSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();

  const { id, showModal, handleModalClose, refreshDataTable } = props;

  const isNew: boolean = id ? false : true;
  const title = useMemo(() => {
    return isNew ? 'Add Tab-V-Host' : 'Edit Tab-V-Host';
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ITabVHost = {
    company_id: null,
    bu_id: null,
    source: '',
    host: '',
    data_center: '',
    cluster: '',
    cpu: null,
    cores_per_cpu: null,
    cores: null,
    domain: '',
    cpu_model: '',
    esx_version: '',
    tenant_id: null,
  };

  const onFinish = (values: any) => {
    const inputValues: ITabVHost = {
      ...values,
      id: id ? +id : null,
    };
    dispatch(saveTabVHost(inputValues));
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
        data_center: data.data_center,
        host: data.host,
        cluster: data.cluster,
        cpu: data.cpu,
        cores_per_cpu: data.cores_per_cpu,
        cores: data.cores,
        domain: data.domain,
        cpu_model: data.cpu_model,
        esx_version: data.esx_version,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (tabVHost.save.messages.length > 0) {
      if (tabVHost.save.hasErrors) {
        toast.error(tabVHost.save.messages.join(' '));
      } else {
        toast.success(tabVHost.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearTabVHostMessages());
    }
  }, [tabVHost.save.messages]);

  useEffect(() => {
    if (+id > 0 && tabVHost.getById.data) {
      const data = tabVHost.getById.data;
      fillValuesOnEdit(data);
    }
  }, [tabVHost.getById.data]);

  useEffect(() => {
    dispatch(getTenantLookup());
    if (+id > 0) {
      dispatch(getTabVHostById(+id));
    }
    return () => {
      dispatch(clearTabVHostGetById());
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
        {tabVHost.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={tabVHost.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="addTabVHost"
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
                  <label className="label">Host</label>
                  <Form.Item name="host" label="Host" className="m-0" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Cluster</label>
                  <Form.Item name="cluster" label="Cluster" className="m-0" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">CPU</label>
                  <Form.Item name="cpu" label="CPU" className="m-0" rules={[{ type: 'integer' }]}>
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Cores per CPU</label>
                  <Form.Item
                    name="cores_per_cpu"
                    label="Cores per CPU"
                    className="m-0"
                    rules={[{ type: 'integer' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Cores</label>
                  <Form.Item
                    name="cores"
                    label="Cores"
                    className="m-0"
                    rules={[{ type: 'integer' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Domain</label>
                  <Form.Item name="domain" className="m-0" label="Domain" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">CPU Model</label>
                  <Form.Item
                    name="cpu_model"
                    className="m-0"
                    label="CPU Model"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">ESX Version</label>
                  <Form.Item
                    name="esx_version"
                    className="m-0"
                    label="ESX Version"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
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
            </Row>
            <div className="btns-block modal-footer">
              <Button key="submit" type="primary" htmlType="submit" loading={tabVHost.save.loading}>
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
export default AddTabVHostModal;
