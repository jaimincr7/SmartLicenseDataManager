import { Button, Col, Form, Input, Modal, Row, Select, Spin } from 'antd';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { Messages } from '../../../../common/constants/messages';
import { ILookup } from '../../../../services/common/common.model';
import { ISqlServer } from '../../../../services/sqlServer/sqlServer.model';
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
import { saveSqlServer, getSqlServerById } from '../../../../store/sqlServer/sqlServer.action';
import {
  sqlServerSelector,
  clearSqlServerMessages,
  clearSqlServerGetById,
} from '../../../../store/sqlServer/sqlServer.reducer';
import { IAddSqlServerProps } from './addSqlServer.model';
import './addSqlServer.style.scss';

const { Option } = Select;

const validateMessages = {
  required: Messages.FIELD_REQUIRED,
};

const AddSqlServerModal: React.FC<IAddSqlServerProps> = (props) => {
  const sqlServers = useAppSelector(sqlServerSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();

  const { id, showModal, handleModalClose, refreshDataTable } = props;

  const isNew: boolean = id ? false : true;
  const title = useMemo(() => {
    return isNew ? 'Add Sql Server' : 'Edit Sql Server';
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ISqlServer = {
    bu_id: null,
    company_id: null,
    cluster: '',
    cost_code: '',
    data_center: '',
    device_name: '',
    tenant_id: null,
    date_added: null,
    sql_cluster: '',
    host: '',
    device_type: '',
    product_family: '',
    version: '',
    edition: '',
    device_state: '',
    software_state: '',
    source: '',
    operating_system: '',
    os_type: '',
    tenant_name: '',
    raw_software_title: '',
    product_name: '',
    fqdn: '',
    service: '',
    line_of_business: '',
    market: '',
    application: '',
    serial_number: '',
    sql_cluster_node_type: '',
  };

  const onFinish = (values: any) => {
    const inputValues: ISqlServer = {
      ...values,
      id: id ? +id : null,
    };
    dispatch(saveSqlServer(inputValues));
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
        cluster: data.cluster,
        cost_code: data.cost_code,
        data_center: data.data_center,
        device_name: data.device_name,
        sql_cluster: data.sql_cluster,
        host: data.host,
        device_type: data.device_type,
        product_family: data.product_family,
        version: data.version,
        edition: data.edition,
        device_state: data.device_state,
        software_state: data.software_state,
        source: data.source,
        operating_system: data.operating_system,
        os_type: data.os_type,
        raw_software_title: data.raw_software_title,
        product_name: data.product_name,
        fqdn: data.fqdn,
        service: data.service,
        line_of_business: data.line_of_business,
        market: data.market,
        application: data.application,
        serial_number: data.serial_number,
        sql_cluster_node_type: data.sql_cluster_node_type,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (sqlServers.save.messages.length > 0) {
      if (sqlServers.save.hasErrors) {
        toast.error(sqlServers.save.messages.join('\n'));
      } else {
        toast.success(sqlServers.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearSqlServerMessages());
    }
  }, [sqlServers.save.messages]);

  useEffect(() => {
    if (+id > 0 && sqlServers.getById.data) {
      const data = sqlServers.getById.data;
      fillValuesOnEdit(data);
    }
  }, [sqlServers.getById.data]);

  useEffect(() => {
    dispatch(getTenantLookup());
    if (+id > 0) {
      dispatch(getSqlServerById(+id));
    }
    return () => {
      dispatch(clearSqlServerGetById());
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
        {sqlServers.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={sqlServers.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="addSqlServer"
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
                      suffixIcon={
                        <img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />
                      }
                      onChange={handleTenantChange}
                      allowClear
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
                  <Form.Item
                    name="company_id"
                    className="m-0"
                    label="Company"
                    rules={[{ required: true }]}
                  >
                    <Select
                      suffixIcon={
                        <img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />
                      }
                      onChange={handleCompanyChange}
                      allowClear
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
                  <Form.Item name="bu_id" className="m-0" label="BU" rules={[{ required: true }]}>
                    <Select
                      suffixIcon={
                        <img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />
                      }
                      onChange={handleBUChange}
                      allowClear
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
                  <label className="label">Sql Cluster</label>
                  <Form.Item name="sql_cluster" label="Sql Cluster" className="m-0">
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Host</label>
                  <Form.Item name="host" className="m-0" label="Host" rules={[{ required: true }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              {/* <Col xs={24} sm={12} md={8}>
                            <div className="form-group m-0">
                                <label className="label">Procs</label>
                                <Form.Item
                                    name="procs"
                                    label="Procs"
                                    className="m-0"
                                    rules={[{ type: 'number'}]}
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
                                    rules={[{ type: 'number'}]}
                                    >
                                    <InputNumber className="form-control w-100" />
                                </Form.Item>                         
                            </div>
                        </Col> */}
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Device Name</label>
                  <Form.Item
                    name="device_name"
                    label="Device name"
                    className="m-0"
                    rules={[{ required: true }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Device Type</label>
                  <Form.Item
                    name="device_type"
                    label="Device type"
                    className="m-0"
                    rules={[{ required: true }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Product Family</label>
                  <Form.Item
                    name="product_family"
                    label="Product family"
                    className="m-0"
                    rules={[{ required: true }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Version</label>
                  <Form.Item
                    name="version"
                    label="Version"
                    className="m-0"
                    rules={[{ required: true }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Edition</label>
                  <Form.Item
                    name="edition"
                    label="Edition"
                    className="m-0"
                    rules={[{ required: true }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              {/* <Col xs={24} sm={12} md={8}>
                            <div className="form-group m-0">
                                <label className="label">vCPU</label>
                                <Form.Item
                                    name="vCPU"
                                    label="vCPU"
                                    className="m-0"
                                    rules={[{ type: 'number'}]}
                                    >
                                    <InputNumber className="form-control w-100" />
                                </Form.Item>                      
                            </div>
                        </Col> */}
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Device State</label>
                  <Form.Item
                    name="device_state"
                    label="Device state"
                    className="m-0"
                    rules={[{ required: true }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Software State</label>
                  <Form.Item
                    name="software_state"
                    label="Software state"
                    className="m-0"
                    rules={[{ required: true }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Cluster</label>
                  <Form.Item
                    name="cluster"
                    label="Cluster"
                    className="m-0"
                    rules={[{ required: true }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Source</label>
                  <Form.Item
                    name="source"
                    label="Source"
                    className="m-0"
                    rules={[{ required: true }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Operating System</label>
                  <Form.Item
                    name="operating_system"
                    label="Operating system"
                    className="m-0"
                    rules={[{ required: true }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">OS Type</label>
                  <Form.Item
                    name="os_type"
                    label="OS type"
                    className="m-0"
                    rules={[{ required: true }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Raw Software Title</label>
                  <Form.Item
                    name="raw_software_title"
                    label="Raw software title"
                    className="m-0"
                    rules={[{ required: true }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Product Name</label>
                  <Form.Item
                    name="product_name"
                    label="Product name"
                    className="m-0"
                    rules={[{ required: true }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">FQDN</label>
                  <Form.Item name="fqdn" label="FQDN" className="m-0" rules={[{ required: true }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Service</label>
                  <Form.Item
                    name="service"
                    label="Service"
                    className="m-0"
                    rules={[{ required: true }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Cost Code</label>
                  <Form.Item
                    name="cost_code"
                    label="Cost code"
                    className="m-0"
                    rules={[{ required: true }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Line of Bussiness</label>
                  <Form.Item
                    name="line_of_business"
                    label="Line of bussiness"
                    className="m-0"
                    rules={[{ required: true }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Market</label>
                  <Form.Item
                    name="market"
                    label="Market"
                    className="m-0"
                    rules={[{ required: true }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Application</label>
                  <Form.Item
                    name="application"
                    label="Application"
                    className="m-0"
                    rules={[{ required: true }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Data Center</label>
                  <Form.Item
                    name="data_center"
                    label="Data center"
                    className="m-0"
                    rules={[{ required: true }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Serial Number</label>
                  <Form.Item
                    name="serial_number"
                    label="Serial number"
                    className="m-0"
                    rules={[{ required: true }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">SQL Cluster Node Type</label>
                  <Form.Item
                    name="sql_cluster_node_type"
                    label="SQL cluster node type"
                    className="m-0"
                    rules={[{ required: true }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              {/* <Col xs={24} sm={12} md={8}>
                            <div className="form-group m-0">
                                <Form.Item name="ha_enabled" className="m-0" valuePropName="checked">
                                    <Checkbox>Enabled</Checkbox>
                                </Form.Item>                        
                            </div>
                        </Col> */}
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={sqlServers.save.loading}
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
export default AddSqlServerModal;
