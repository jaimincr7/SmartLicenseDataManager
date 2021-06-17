import { Button, Checkbox, Col, Form, Input, InputNumber, Modal, Row, Select } from "antd";
import _ from "lodash";
import { useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { Messages } from "../../../../common/constants/messages";
import { ISqlServer } from "../../../../services/sqlServer/sqlServer.model";
import { useAppSelector, useAppDispatch } from "../../../../store/app.hooks";
import { getBULookup, getCompanyLookup, getTenantLookup } from "../../../../store/common/common.action";
import { commonSelector } from "../../../../store/common/common.reducer";
import { saveSqlServer, getSqlServerById } from "../../../../store/sqlServer/sqlServer.action";
import { sqlServerSelector, clearSqlServerMessages, clearSqlServerGetById } from "../../../../store/sqlServer/sqlServer.reducer";
import { IAddSqlServerProps, IDropDownOption } from "./addSqlServer.model";

const { Option } = Select;
 
const validateMessages = {
    required: Messages.FIELD_REQUIRED,
};
  
const AddSqlServerModal: React.FC<IAddSqlServerProps> = (props) => {
    const sqlServers = useAppSelector(sqlServerSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();

  const { id, showModal, handleModalClose } = props;

  const isNew: boolean = id ? false : true;
  const title = useMemo(() => {
    return isNew ? 'Add Sql Server' : 'Edit Sql Server';
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  const initialValues : ISqlServer = {
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
    sql_cluster_node_type: ''
  };

  const onFinish = (values: any) => {    
      const inputValues: ISqlServer = { 
        ...values, 
        id: id ? +id : null
      };
    dispatch(saveSqlServer(inputValues));
  };

  useEffect(() => {
    if (sqlServers.save.messages.length > 0) {
      if (sqlServers.save.hasErrors) {
        toast.error(sqlServers.save.messages.join('\n'));
      } else {
        toast.success(sqlServers.save.messages.join(' '));
      }
      dispatch(clearSqlServerMessages());
      props.handleModalClose();
    }
  }, [sqlServers.save.messages]);

  useEffect(() => {
    if (+id > 0) {
      let data = sqlServers.getById.data;

      if (data) {
          data ={
            ...data,
            bu_id: _.isNull(data.bu_id) ? null : commonLookups.buLookup.data.filter((x) => x.id === data.bu_id)[0].id,
            company_id: _.isNull(data.company_id) ? null : commonLookups.companyLookup.data.filter((x) => x.id === data.company_id)[0].id,
            tenant_id: _.isNull(data.tenant_id) ? null : commonLookups.tenantLookup.data.filter((x) => x.id === data.tenant_id)[0].id, 
          }
        form.setFieldsValue(data);
      }
    }
  }, [sqlServers.getById.data]);

  useEffect(() => {
    dispatch(getTenantLookup());
    if (+id > 0) {
      dispatch(getSqlServerById(+id));
    }
    return () => {
      dispatch(clearSqlServerGetById());
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
                <Form
                    form={form}
                    name="addSqlServer"
                    initialValues={initialValues}
                    onFinish={onFinish}
                    validateMessages={validateMessages}
                >
                <Row gutter={[30, 15]}>
                    <Col xs={24} sm={12} md={8}>
                        <div className="form-group m-0">
                            <label className="label">Tenant</label>
                            <Form.Item name="tenant_id">
                                <Select
                                    suffixIcon={
                                        <img src={`${process.env.PUBLIC_URL}images/ic-down.svg`} alt="" />
                                    }
                                    onChange={(value)=>dispatch(getCompanyLookup(+value))}
                                    allowClear
                                >
                                    {commonLookups.tenantLookup.data.map((option: IDropDownOption) => (
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
                            <Form.Item name="company_id">
                                <Select
                                    suffixIcon={
                                        <img src={`${process.env.PUBLIC_URL}images/ic-down.svg`} alt="" />
                                    }
                                    onChange={(value)=>dispatch(getBULookup(+value))}
                                    allowClear
                                >
                                    {commonLookups.companyLookup.data.map((option: IDropDownOption) => (
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
                            <Form.Item name="bu_id">
                                <Select
                                    suffixIcon={
                                        <img src={`${process.env.PUBLIC_URL}images/ic-down.svg`} alt="" />
                                    }
                                    allowClear
                                >
                                    {commonLookups.buLookup.data.map((option: IDropDownOption) => (
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
                            <Form.Item name="sql_cluster">
                                <Input className="form-control" />
                            </Form.Item>                        
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <div className="form-group m-0">
                            <label className="label">Host</label>
                            <Form.Item name="host" rules={[{ required: true }]}>
                                <Input className="form-control"/>
                            </Form.Item>                       
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <div className="form-group m-0">
                            <label className="label">Procs</label>
                            <Form.Item
                                name="procs"
                                rules={[{ type: 'number'}]}
                                >
                                <InputNumber className="form-control" />
                            </Form.Item>                      
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <div className="form-group m-0">
                            <label className="label">Cores</label>
                            <Form.Item
                                name="cores"
                                rules={[{ type: 'number'}]}
                                >
                                <InputNumber className="form-control" />
                            </Form.Item>                         
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <div className="form-group m-0">
                            <label className="label">Device Name</label>
                            <Form.Item name="device_name" rules={[{ required: true }]}>
                                <Input className="form-control" />
                            </Form.Item>                        
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <div className="form-group m-0">
                            <label className="label">Device Type</label>
                            <Form.Item name="device_type" rules={[{ required: true }]}>
                                <Input className="form-control" />
                            </Form.Item>                        
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <div className="form-group m-0">
                            <label className="label">Product Family</label>
                            <Form.Item name="product_family" rules={[{ required: true }]}>
                                <Input className="form-control" />
                            </Form.Item>                        
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <div className="form-group m-0">
                            <label className="label">Version</label>
                            <Form.Item name="version" rules={[{ required: true }]}>
                                <Input className="form-control" />
                            </Form.Item>                        
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <div className="form-group m-0">
                            <label className="label">Edition</label>
                            <Form.Item name="edition" rules={[{ required: true }]}>
                                <Input className="form-control" />
                            </Form.Item>                        
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <div className="form-group m-0">
                            <label className="label">vCPU</label>
                            <Form.Item
                                name="vCPU"
                                rules={[{ type: 'number'}]}
                                >
                                <InputNumber className="form-control" />
                            </Form.Item>                      
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <div className="form-group m-0">
                            <label className="label">Device State</label>
                            <Form.Item name="device_state" rules={[{ required: true }]}>
                                <Input className="form-control" />
                            </Form.Item>                        
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <div className="form-group m-0">
                            <label className="label">Software State</label>
                            <Form.Item name="software_state" rules={[{ required: true }]}>
                                <Input className="form-control" />
                            </Form.Item>                        
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <div className="form-group m-0">
                            <label className="label">Cluster</label>
                            <Form.Item name="cluster" rules={[{ required: true }]}>
                                <Input className="form-control" />
                            </Form.Item>                        
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <div className="form-group m-0">
                            <label className="label">Source</label>
                            <Form.Item name="source" rules={[{ required: true }]}>
                                <Input className="form-control" />
                            </Form.Item>                        
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <div className="form-group m-0">
                            <label className="label">Operating System</label>
                            <Form.Item name="operating_system" rules={[{ required: true }]}>
                                <Input className="form-control" />
                            </Form.Item>                        
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <div className="form-group m-0">
                            <label className="label">OS Type</label>
                            <Form.Item name="os_type" rules={[{ required: true }]}>
                                <Input className="form-control" />
                            </Form.Item>                        
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <div className="form-group m-0">
                            <label className="label">Raw Software Title</label>
                            <Form.Item name="raw_software_title" rules={[{ required: true }]}>
                                <Input className="form-control" />
                            </Form.Item>                        
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <div className="form-group m-0">
                            <label className="label">Product Name</label>
                            <Form.Item name="product_name" rules={[{ required: true }]}>
                                <Input className="form-control" />
                            </Form.Item>                        
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <div className="form-group m-0">
                            <label className="label">FQDN</label>
                            <Form.Item name="fqdn" rules={[{ required: true }]}>
                                <Input className="form-control" />
                            </Form.Item>                        
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <div className="form-group m-0">
                            <label className="label">Service</label>
                            <Form.Item name="service" rules={[{ required: true }]}>
                                <Input className="form-control" />
                            </Form.Item>                        
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <div className="form-group m-0">
                            <label className="label">Cost Code</label>
                            <Form.Item name="cost_code" rules={[{ required: true }]}>
                                <Input className="form-control" />
                            </Form.Item>                        
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <div className="form-group m-0">
                            <label className="label">Line of Bussiness</label>
                            <Form.Item name="line_of_business" rules={[{ required: true }]}>
                                <Input className="form-control" />
                            </Form.Item>                        
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <div className="form-group m-0">
                            <label className="label">Market</label>
                            <Form.Item name="market" rules={[{ required: true }]}>
                                <Input className="form-control" />
                            </Form.Item>                        
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <div className="form-group m-0">
                            <label className="label">Application</label>
                            <Form.Item name="application" rules={[{ required: true }]}>
                                <Input className="form-control" />
                            </Form.Item>                        
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <div className="form-group m-0">
                            <label className="label">Data Center</label>
                            <Form.Item name="data_center" rules={[{ required: true }]}>
                                <Input className="form-control" />
                            </Form.Item>                        
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <div className="form-group m-0">
                            <label className="label">Serial Number</label>
                            <Form.Item name="serial_number" rules={[{ required: true }]}>
                                <Input className="form-control" />
                            </Form.Item>                        
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <div className="form-group m-0">
                            <label className="label">SQL Cluster Node Type</label>
                            <Form.Item name="sql_cluster_node_type" rules={[{ required: true }]}>
                                <Input className="form-control" />
                            </Form.Item>                        
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <div className="form-group m-0">
                            <Form.Item name="ha_enabled" valuePropName="checked">
                                <Checkbox>Enabled</Checkbox>
                            </Form.Item>                        
                        </div>
                    </Col>
                </Row>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        {submitButtonText}
                    </Button>
                    <Button onClick={handleModalClose}>
                        Cancel
                    </Button>
                </Form.Item>
              </Form>              
            </Modal>
        </>
    );
};
export default AddSqlServerModal;

