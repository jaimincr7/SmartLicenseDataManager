import { Layout, PageHeader, Button, Select, Row, Col, Form, Input } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import { useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import { getSqlServerById, saveSqlServer } from '../../../../store/sqlServer/sqlServer.action';
import {
  clearSqlServerGetById,
  clearSqlServerMessages,
  sqlServerSelector,
} from '../../../../store/sqlServer/sqlServer.reducer';
import { IAddSqlServerProps, IDropDownOption } from './addSqlServer.model';
import { LeftOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { ISqlServer } from '../../../../services/sqlServer/sqlServer.model';
import 'antd/dist/antd.css';
import './addSqlServer.style.scss';
import _ from 'lodash';
import { Messages } from '../../../../common/constants/messages';

const { Option } = Select;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const validateMessages = {
  required: Messages.FIELD_REQUIRED,
};

const AddSqlServer: React.FC<IAddSqlServerProps> = (props) => {
    const sqlServers = useAppSelector(sqlServerSelector);
    const dispatch = useAppDispatch();
    const history = useHistory();

    const { id } = props.match?.params;

    const isNew: boolean = id ? false : true;
    const title = useMemo(() => {
      return isNew ? 'Add Sql Server' : 'Edit Sql Server';
    }, [isNew]);
    const submitButtonText = useMemo(() => {
      return isNew ? 'Save' : 'Update';
    }, [isNew]);

    const [form] = Form.useForm();

    let initialValues = {
      buName: null,
      companyName: null,
      cluster: '',
      costCode: '',
      dataCenter: '',
      deviceName: '',
      tenantName: null,
    };

    const buOptions: Array<IDropDownOption> = [
      { id: 60, name: 'Demo BU' },
      { id: 1, name: 'Demo 2' },
    ];
    const companyOptions: Array<IDropDownOption> = [{ id: 53, name: 'Demo Company' }];
    const tenantsOptions: Array<IDropDownOption> = [
      { id: 40, name: 'Demo Company' },
      { id: 1, name: 'MatrixData 360' },
    ];

    const onFinish = (values: any) => {
      const inputValues: ISqlServer = {
        id: id ? +id : null,
        bu_id: values.buName,
        company_id: values.companyName,
        device_name: values.deviceName,
        cost_code: values.costCode,
        cluster: values.cluster,
        data_center: values.dataCenter,
        tenant_id: values.tenantName,
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
        history.push('/sql-server');
      }
    }, [sqlServers.save.messages]);

    useEffect(() => {
      if (+id > 0) {
        const data = sqlServers.getById.data;

        if (data) {
          initialValues = {
            buName: _.isNull(data.bu_id) ? null : buOptions.filter((x) => x.id === data.bu_id)[0].id,
            companyName: _.isNull(data.company_id) ? null : companyOptions.filter((x) => x.id === data.company_id)[0].id,
            tenantName: _.isNull(data.tenant_id) ? null : tenantsOptions.filter((x) => x.id === data.tenant_id)[0].id,
            cluster: data.cluster,
            costCode: data.cost_code,
            deviceName: data.device_name,
            dataCenter: data.data_center,
          };
          form.setFieldsValue(initialValues);
        }
      }
    }, [sqlServers.getById.data]);
    
    useEffect(() => {
      if (+id > 0) {
        dispatch(getSqlServerById(+id));
      }
      return () => {
        dispatch(clearSqlServerGetById());
      };
    }, [dispatch]);

  return (
    <>
      <div className="addSlqServerPage">
        <Layout className="layout">
          <PageHeader
            className="site-page-header"
            title={title}
            extra={[
              <Button key="1" onClick={() => history.push('/sql-server')}>
                <LeftOutlined /> Back
              </Button>,
            ]}
          />
          <Content style={{ padding: '0 25px' }}>
            <div className="site-layout-content">
              <Form
                {...layout}
                form={form}
                name="addSqlServer"
                initialValues={initialValues}
                onFinish={onFinish}
                validateMessages={validateMessages}
              >
                <Row gutter={[8, 8]}>
                  <Col span={12}>
                    <Form.Item name="buName" label="BU Name:" rules={[{ required: true }]}>
                      <Select placeholder="Select a option and change input text above" allowClear>
                        {buOptions.map((option: IDropDownOption) => (
                          <Option key={option.id} value={option.id}>
                            {option.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="companyName"
                      label="Company Name:"
                      rules={[{ required: true }]}
                    >
                      <Select placeholder="Select a option and change input text above" allowClear>
                        {companyOptions.map((option: IDropDownOption) => (
                          <Option key={option.id} value={option.id}>
                            {option.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[8, 8]}>
                  <Col span={12}>
                    <Form.Item name="cluster" label="Cluster:" rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="costCode" label="Cost Code:">
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[8, 8]}>
                  <Col span={12}>
                    <Form.Item name="dataCenter" label="Data Center:" rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="deviceName" label="Device Name:" rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[8, 8]}>
                  <Col span={12}>
                    <Form.Item name="tenantName" label="Tenant Name:" rules={[{ required: true }]}>
                      <Select placeholder="Select a option and change input text above" allowClear>
                        {tenantsOptions.map((option: IDropDownOption) => (
                          <Option key={option.id} value={option.id}>
                            {option.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>                  
                </Row>
                <Row>
                  <Col span={24} style={{ marginLeft: '150px' }}>
                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        {submitButtonText}
                      </Button>
                      <Button htmlType="button" onClick={() => form.resetFields()}>
                        Reset
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
          </Content>
        </Layout>
      </div>
    </>
  );
};
export default AddSqlServer;
