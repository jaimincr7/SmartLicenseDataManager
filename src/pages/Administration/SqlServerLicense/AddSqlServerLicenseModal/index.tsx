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
import { IConfigSqlServerLicense } from '../../../../services/master/sqlServerLicense/sqlServerLicense.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getConfigSqlServerLicenseById,
  saveConfigSqlServerLicense,
} from '../../../../store/master/sqlServerLicense/sqlServerLicense.action';
import {
  clearConfigSqlServerLicenseGetById,
  clearConfigSqlServerLicenseMessages,
  configSqlServerLicenseSelector,
} from '../../../../store/master/sqlServerLicense/sqlServerLicense.reducer';
import { IAddConfigSqlServerLicenseProps } from './addSqlServerLicense.model';
import { ILookup } from '../../../../services/common/common.model';
import {
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';
import {
  getConfigLicenseUnitsLookup,
  getConfigSqlServerEditionsLookup,
  getConfigSqlServerServicesLookup,
  getConfigSqlServerVersionsLookup,
} from '../../../../store/common/common.action';
import { updateMultiple } from '../../../../store/common/common.action';
import { getObjectForUpdateMultiple } from '../../../../common/helperFunction';

const { Option } = Select;

const AddConfigSqlServerLicenseModal: React.FC<IAddConfigSqlServerLicenseProps> = (props) => {
  const configSqlServerLicense = useAppSelector(configSqlServerLicenseSelector);
  const common = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;
  const commonLookups = useAppSelector(commonSelector);
  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.ConfigSqlServerLicense} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IConfigSqlServerLicense = {
    product_name: '',
    service_id: null,
    edition_id: null,
    version_id: null,
    license_unit_id: null,
    units_per_license: null,
    license_quantity_minimum: null,
    server_cal_eligible: false,
    alternate_license_type: false,
    includes_sa: false,
    server_mobility_rights: false,
  };

  const onFinish = (values: any) => {
    const inputValues: IConfigSqlServerLicense = {
      ...values,
      id: id ? +id : null,
    };
    if (!isMultiple) {
      dispatch(saveConfigSqlServerLicense(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        configSqlServerLicense.search.tableName
      );
      if (result) {
        dispatch(updateMultiple(result));
      }
    }
  };

  const fillValuesOnEdit = async (data: IConfigSqlServerLicense) => {
    if (data) {
      initialValues = {
        product_name: data.product_name,
        service_id: _.isNull(data.service_id) ? null : data.service_id,
        edition_id: _.isNull(data.edition_id) ? null : data.edition_id,
        version_id: _.isNull(data.version_id) ? null : data.version_id,
        license_unit_id: _.isNull(data.license_unit_id) ? null : data.license_unit_id,
        units_per_license: data.units_per_license,
        license_quantity_minimum: data.license_quantity_minimum,
        server_cal_eligible: data.server_cal_eligible,
        alternate_license_type: data.alternate_license_type,
        includes_sa: data.includes_sa,
        server_mobility_rights: data.server_mobility_rights,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (configSqlServerLicense.save.messages.length > 0) {
      if (configSqlServerLicense.save.hasErrors) {
        toast.error(configSqlServerLicense.save.messages.join(' '));
      } else {
        toast.success(configSqlServerLicense.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearConfigSqlServerLicenseMessages());
    }
  }, [configSqlServerLicense.save.messages]);

  useEffect(() => {
    if (common.save.messages.length > 0) {
      if (common.save.hasErrors) {
        toast.error(common.save.messages.join(' '));
      } else {
        toast.warn(common.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearMultipleUpdateMessages());
    }
  }, [common.save.messages]);

  useEffect(() => {
    if (+id > 0 && configSqlServerLicense.getById.data) {
      const data = configSqlServerLicense.getById.data;
      fillValuesOnEdit(data);
    }
  }, [configSqlServerLicense.getById.data]);

  useEffect(() => {
    dispatch(getConfigSqlServerEditionsLookup());
    dispatch(getConfigSqlServerVersionsLookup());
    dispatch(getConfigSqlServerServicesLookup());
    dispatch(getConfigLicenseUnitsLookup());
    if (+id > 0) {
      dispatch(getConfigSqlServerLicenseById(+id));
    }
    return () => {
      dispatch(clearConfigSqlServerLicenseGetById());
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
        {configSqlServerLicense.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={configSqlServerLicense.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="configSqlServerLicense"
            initialValues={initialValues}
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Row gutter={[30, 15]} className="form-label-hide">
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'service_id']} valuePropName="checked" noStyle>
                      <Checkbox>Service</Checkbox>
                    </Form.Item>
                  ) : (
                    'Service'
                  )}
                  <Form.Item
                    name="service_id"
                    className="m-0"
                    label="Service"
                    rules={[{ required: !isMultiple }]}
                  >
                    <Select
                      allowClear
                      loading={commonLookups.configSqlServerServicesLookup.loading}
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
                      {commonLookups.configSqlServerServicesLookup.data.map((option: ILookup) => (
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
                    <Form.Item name={['checked', 'edition_id']} valuePropName="checked" noStyle>
                      <Checkbox>Edition</Checkbox>
                    </Form.Item>
                  ) : (
                    'Edition'
                  )}
                  <Form.Item
                    name="edition_id"
                    className="m-0"
                    label="Edition"
                    rules={[{ required: !isMultiple }]}
                  >
                    <Select
                      allowClear
                      loading={commonLookups.configSqlServerEditionsLookup.loading}
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
                      {commonLookups.configSqlServerEditionsLookup.data.map((option: ILookup) => (
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
                    <Form.Item name={['checked', 'version_id']} valuePropName="checked" noStyle>
                      <Checkbox>Version</Checkbox>
                    </Form.Item>
                  ) : (
                    'Version'
                  )}
                  <Form.Item
                    name="version_id"
                    className="m-0"
                    label="Version"
                    rules={[{ required: !isMultiple }]}
                  >
                    <Select
                      allowClear
                      loading={commonLookups.configSqlServerVersionsLookup.loading}
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
                      {commonLookups.configSqlServerVersionsLookup.data.map((option: ILookup) => (
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
                    <Form.Item
                      name={['checked', 'license_unit_id']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>License Unit</Checkbox>
                    </Form.Item>
                  ) : (
                    'License Unit'
                  )}
                  <Form.Item
                    name="license_unit_id"
                    className="m-0"
                    label="License Unit"
                    rules={[{ required: !isMultiple }]}
                  >
                    <Select
                      allowClear
                      loading={commonLookups.configLicenseUnitsLookup.loading}
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
                      {commonLookups.configLicenseUnitsLookup.data.map((option: ILookup) => (
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
                    <Form.Item name={['checked', 'product_name']} valuePropName="checked" noStyle>
                      <Checkbox>Product Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Product Name'
                  )}
                  <Form.Item
                    name="product_name"
                    label="Product Name"
                    className="m-0"
                    rules={[{ required: !isMultiple, max: 255 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'units_per_license']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Units Per License</Checkbox>
                    </Form.Item>
                  ) : (
                    'Units Per License'
                  )}
                  <Form.Item
                    name="units_per_license"
                    label="Units Per License"
                    className="m-0"
                    rules={[{ type: 'number', required: !isMultiple }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'license_quantity_minimum']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>License Quantity Minimum</Checkbox>
                    </Form.Item>
                  ) : (
                    'License Quantity Minimum'
                  )}
                  <Form.Item
                    name="license_quantity_minimum"
                    label="License Quantity Minimum"
                    className="m-0"
                    rules={[{ type: 'number', required: !isMultiple }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item
                    name="server_cal_eligible"
                    className="m-0 mr-1"
                    valuePropName="checked"
                  >
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'server_cal_eligible']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Server CAl Eligible</Checkbox>
                    </Form.Item>
                  ) : (
                    'Server CAl Eligible'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item
                    name="alternate_license_type"
                    className="m-0 mr-1"
                    valuePropName="checked"
                  >
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'alternate_license_type']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Alternate License Type</Checkbox>
                    </Form.Item>
                  ) : (
                    'Alternate License Type'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="includes_sa" className="m-0 mr-1" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item name={['checked', 'includes_sa']} valuePropName="checked" noStyle>
                      <Checkbox>Includes SA</Checkbox>
                    </Form.Item>
                  ) : (
                    'Includes SA'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item
                    name="server_mobility_rights"
                    className="m-0 mr-1"
                    valuePropName="checked"
                  >
                    <Switch className="form-control" />
                  </Form.Item>
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'server_mobility_rights']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Server Mobility Rights</Checkbox>
                    </Form.Item>
                  ) : (
                    'Server Mobility Rights'
                  )}
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={configSqlServerLicense.save.loading || common.save.loading}
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
export default AddConfigSqlServerLicenseModal;
