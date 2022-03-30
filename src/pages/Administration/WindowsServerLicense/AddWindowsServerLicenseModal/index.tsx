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
import { IConfigWindowsServerLicense } from '../../../../services/master/windowsServerLicense/windowsServerLicense.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getConfigWindowsServerLicenseById,
  saveConfigWindowsServerLicense,
} from '../../../../store/master/windowsServerLicense/windowsServerLicense.action';
import {
  clearConfigWindowsServerLicenseGetById,
  clearConfigWindowsServerLicenseMessages,
  configWindowsServerLicenseSelector,
} from '../../../../store/master/windowsServerLicense/windowsServerLicense.reducer';
import { IAddConfigWindowsServerLicenseProps } from './addWindowsServerLicense.model';
import { ILookup } from '../../../../services/common/common.model';
import {
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';
import {
  getConfigLicenseUnitsLookup,
  getConfigWindowsServerEditionsLookup,
  getConfigWindowsServerVersionsLookup,
} from '../../../../store/common/common.action';
import { updateMultiple } from '../../../../store/common/common.action';
import { getObjectForUpdateMultiple } from '../../../../common/helperFunction';

const { Option } = Select;

const AddConfigWindowsServerLicenseModal: React.FC<IAddConfigWindowsServerLicenseProps> = (
  props
) => {
  const configWindowsServerLicense = useAppSelector(configWindowsServerLicenseSelector);
  const dispatch = useAppDispatch();
  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;
  const commonLookups = useAppSelector(commonSelector);
  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '}{' '}
        <BreadCrumbs pageName={Page.ConfigWindowsServerLicense} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IConfigWindowsServerLicense = {
    product_name: '',
    edition_id: null,
    version_id: null,
    license_unit_id: null,
    units_per_license: null,
    additional_virtual_oes_s: null,
    license_quantity_minimum: null,
    alternate_license_type: false,
    includes_sa: false,
    includes_system_center: false,
    includes_windows_server: false,
  };

  const onFinish = (values: any) => {
    const inputValues: IConfigWindowsServerLicense = {
      ...values,
      id: id ? +id : null,
    };
    if (!isMultiple) {
      dispatch(saveConfigWindowsServerLicense(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        configWindowsServerLicense.search.tableName
      );
      if (result) {
        dispatch(updateMultiple(result));
      }
    }
  };

  const fillValuesOnEdit = async (data: IConfigWindowsServerLicense) => {
    if (data) {
      initialValues = {
        product_name: data.product_name,
        edition_id: _.isNull(data.edition_id) ? null : data.edition_id,
        version_id: _.isNull(data.version_id) ? null : data.version_id,
        license_unit_id: _.isNull(data.license_unit_id) ? null : data.license_unit_id,
        units_per_license: data.units_per_license,
        additional_virtual_oes_s: data.additional_virtual_oes_s,
        license_quantity_minimum: data.license_quantity_minimum,
        alternate_license_type: data.alternate_license_type,
        includes_sa: data.includes_sa,
        includes_system_center: data.includes_system_center,
        includes_windows_server: data.includes_windows_server,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (configWindowsServerLicense.save.messages.length > 0) {
      if (configWindowsServerLicense.save.hasErrors) {
        toast.error(configWindowsServerLicense.save.messages.join(' '));
      } else {
        toast.success(configWindowsServerLicense.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearConfigWindowsServerLicenseMessages());
    }
  }, [configWindowsServerLicense.save.messages]);

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
    if (+id > 0 && configWindowsServerLicense.getById.data) {
      const data = configWindowsServerLicense.getById.data;
      fillValuesOnEdit(data);
    }
  }, [configWindowsServerLicense.getById.data]);

  useEffect(() => {
    dispatch(getConfigWindowsServerEditionsLookup());
    dispatch(getConfigWindowsServerVersionsLookup());
    dispatch(getConfigLicenseUnitsLookup());
    if (+id > 0) {
      dispatch(getConfigWindowsServerLicenseById(+id));
    }
    return () => {
      dispatch(clearConfigWindowsServerLicenseGetById());
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
        {configWindowsServerLicense.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={configWindowsServerLicense.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="configWindowsServerLicense"
            initialValues={initialValues}
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Row gutter={[30, 15]} className="form-label-hide">
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
                      loading={commonLookups.configWindowsServerEditionsLookup.loading}
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option: any) =>
                        option.children?.toLowerCase().indexOf(input?.toLowerCase()) >= 0
                      }
                      filterSort={(optionA: any, optionB: any) =>
                        optionA.children
                          ?.toLowerCase()
                          ?.localeCompare(optionB.children?.toLowerCase())
                      }
                    >
                      {commonLookups.configWindowsServerEditionsLookup.data.map(
                        (option: ILookup) => (
                          <Option key={option.id} value={option.id}>
                            {option.name}
                          </Option>
                        )
                      )}
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
                      loading={commonLookups.configWindowsServerVersionsLookup.loading}
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option: any) =>
                        option.children?.toLowerCase().indexOf(input?.toLowerCase()) >= 0
                      }
                      filterSort={(optionA: any, optionB: any) =>
                        optionA.children
                          ?.toLowerCase()
                          ?.localeCompare(optionB.children?.toLowerCase())
                      }
                    >
                      {commonLookups.configWindowsServerVersionsLookup.data.map(
                        (option: ILookup) => (
                          <Option key={option.id} value={option.id}>
                            {option.name}
                          </Option>
                        )
                      )}
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
                    rules={[{ type: 'integer', required: !isMultiple }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'additional_virtual_oes_s']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Additional Virtual OSEs</Checkbox>
                    </Form.Item>
                  ) : (
                    'Additional Virtual OSEs'
                  )}
                  <Form.Item
                    name="additional_virtual_oes_s"
                    label="Additional Virtual OSEs"
                    className="m-0"
                    rules={[{ type: 'integer', required: !isMultiple }]}
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
                    rules={[{ type: 'integer', required: !isMultiple }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="includes_windows_server" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'includes_windows_server']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Includes Windows server</Checkbox>
                    </Form.Item>
                  ) : (
                    'Includes Windows server'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="alternate_license_type" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
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
                  <Form.Item name="includes_sa" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
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
                  <Form.Item name="includes_system_center" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'includes_system_center']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Includes system Center</Checkbox>
                    </Form.Item>
                  ) : (
                    'Includes system Center'
                  )}
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={configWindowsServerLicense.save.loading || commonLookups.save.loading}
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
export default AddConfigWindowsServerLicenseModal;
