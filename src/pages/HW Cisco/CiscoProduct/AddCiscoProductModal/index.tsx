import {
  Button,
  Checkbox,
  Col,
  DatePicker,
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
import {
  forEditModal,
  getObjectForUpdateMultiple,
  getSimpleDate,
  passDateToApi,
} from '../../../../common/helperFunction';
import { IInlineSearch } from '../../../../common/models/common';
import { ILookup } from '../../../../services/common/common.model';
import { ICiscoProduct } from '../../../../services/hwCisco/ciscoProduct/ciscoProduct.model';
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
  getCiscoProductById,
  saveCiscoProduct,
} from '../../../../store/hwCisco/ciscoProduct/ciscoProduct.action';
import {
  ciscoProductSelector,
  clearCiscoProductGetById,
  clearCiscoProductMessages,
} from '../../../../store/hwCisco/ciscoProduct/ciscoProduct.reducer';
import { IAddCiscoProductProps } from './addCiscoProduct.model';

const { Option } = Select;

const AddCiscoProductModal: React.FC<IAddCiscoProductProps> = (props) => {
  const ciscoProduct = useAppSelector(ciscoProductSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const globalFilters = useAppSelector(globalSearchSelector);

  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.HwCiscoProduct} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ICiscoProduct = {
    bu_id: null,
    company_id: null,
    tenant_id: null,
    source: '',
    uid: '',
    current_organization: '',
    previous_organization: '',
    responsible_party: '',
    cisco_install_site_id: '',
    cisco_ship_to_id: '',
    product_id: '',
    serial_number: '',
    instance_id: '',
    parent_sn: '',
    parent_instance_id: '',
    parent_child_relationship: '',
    collected_sn: '',
    host_id: '',
    install_base_status: '',
    replacement_sn: '',
    zone_assignment: '',
    zone_description: '',
    software_license_pak: '',
    product_relationship: '',
    parent_child_indicator: '',
    minor_follow_parent: false,
    discovery_system_status: '',
    notes: '',
    corrective_action: '',
    ship_date: null,
    product_quantity: null,
    date_data_added: null,
    original_data_source: '',
    last_update_data_source: '',
    last_update_date: null,
    smart_account: '',
    warranty_type: '',
    warranty_end_date: null,
    hardware_bill_to: '',
    po: '',
    so: '',
    date_added: getSimpleDate(),
  };

  const onFinish = (values: any) => {
    const inputValues: ICiscoProduct = {
      ...values,
      id: id ? +id : null,
    };
    inputValues.ship_date = passDateToApi(inputValues.ship_date, true);
    inputValues.date_data_added = passDateToApi(inputValues.date_data_added, true);
    inputValues.last_update_date = passDateToApi(inputValues.last_update_date, true);
    inputValues.warranty_end_date = passDateToApi(inputValues.last_update_date, true);
    inputValues.date_added = passDateToApi(inputValues.date_added, true);
    if (!isMultiple) {
      dispatch(saveCiscoProduct(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        ciscoProduct.search.tableName
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

  const fillValuesOnEdit = async (data: ICiscoProduct) => {
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
        uid: data.uid,
        current_organization: data.current_organization,
        previous_organization: data.previous_organization,
        responsible_party: data.responsible_party,
        cisco_install_site_id: data.cisco_install_site_id,
        cisco_ship_to_id: data.cisco_ship_to_id,
        product_id: data.product_id,
        serial_number: data.serial_number,
        instance_id: data.instance_id,
        parent_sn: data.parent_sn,
        parent_instance_id: data.parent_instance_id,
        parent_child_relationship: data.parent_child_relationship,
        collected_sn: data.collected_sn,
        host_id: data.host_id,
        install_base_status: data.install_base_status,
        replacement_sn: data.replacement_sn,
        zone_assignment: data.zone_assignment,
        zone_description: data.zone_description,
        software_license_pak: data.software_license_pak,
        product_relationship: data.product_relationship,
        parent_child_indicator: data.parent_child_indicator,
        minor_follow_parent: data.minor_follow_parent,
        discovery_system_status: data.discovery_system_status,
        notes: data.notes,
        corrective_action: data.corrective_action,
        ship_date: _.isNull(data.ship_date) ? null : forEditModal(data.ship_date),
        product_quantity: data.product_quantity,
        date_data_added: _.isNull(data.date_data_added) ? null : forEditModal(data.date_data_added),
        original_data_source: data.original_data_source,
        last_update_data_source: data.last_update_data_source,
        last_update_date: _.isNull(data.last_update_date)
          ? null
          : forEditModal(data.last_update_date),
        smart_account: data.smart_account,
        warranty_type: data.warranty_type,
        warranty_end_date: _.isNull(data.warranty_end_date)
          ? null
          : forEditModal(data.warranty_end_date),
        hardware_bill_to: data.hardware_bill_to,
        po: data.po,
        so: data.so,
        date_added: _.isNull(data.date_added) ? null : forEditModal(data.date_added),
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (ciscoProduct.save.messages.length > 0) {
      if (ciscoProduct.save.hasErrors) {
        toast.error(ciscoProduct.save.messages.join(' '));
      } else {
        toast.success(ciscoProduct.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearCiscoProductMessages());
    }
  }, [ciscoProduct.save.messages]);

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
    if (+id > 0 && ciscoProduct.getById.data) {
      const data = ciscoProduct.getById.data;
      fillValuesOnEdit(data);
    }
  }, [ciscoProduct.getById.data]);

  useEffect(() => {
    dispatch(getTenantLookup());
    if (+id > 0) {
      dispatch(getCiscoProductById(+id));
    }
    return () => {
      dispatch(clearCiscoProductGetById());
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
      if (globalSearch.company_id) {
        dispatch(getCompanyLookup(globalSearch.tenant_id[0]));
        dispatch(getBULookup(globalSearch.company_id[0]));
        const initialValues = {
          company_id: _.isNull(globalSearch.company_id) ? null : globalSearch.company_id[0],
          bu_id: _.isNull(globalSearch.bu_id) ? null : globalSearch.bu_id[0],
          tenant_id: _.isNull(globalSearch.tenant_id) ? null : globalSearch.tenant_id[0],
        };
        form.setFieldsValue(initialValues);
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
        {ciscoProduct.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={ciscoProduct.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="ciscoProduct"
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
                    <Form.Item name={['checked', 'company_id']} valuePropName="checked" noStyle>
                      <Checkbox>Company</Checkbox>
                    </Form.Item>
                  ) : (
                    'Company'
                  )}
                  <Form.Item name="company_id" className="m-0" label="Company">
                    <Select
                      onChange={handleCompanyChange}
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
                    <Form.Item name={['checked', 'uid']} valuePropName="checked" noStyle>
                      <Checkbox>UID</Checkbox>
                    </Form.Item>
                  ) : (
                    'UID'
                  )}
                  <Form.Item
                    name="uid"
                    className="m-0"
                    label="UID"
                    rules={[{ max: 200, required: !isMultiple }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'current_organization']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Current Organization</Checkbox>
                    </Form.Item>
                  ) : (
                    'Current Organization'
                  )}
                  <Form.Item
                    name="current_organization"
                    className="m-0"
                    label="Current Organization"
                    rules={[{ max: 200 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'previous_organization']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Previous Organization</Checkbox>
                    </Form.Item>
                  ) : (
                    'Previous Organization'
                  )}
                  <Form.Item
                    name="previous_organization"
                    className="m-0"
                    label="Previous Organization"
                    rules={[{ max: 200 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'responsible_party']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Responsible Party</Checkbox>
                    </Form.Item>
                  ) : (
                    'Responsible Party'
                  )}
                  <Form.Item
                    name="responsible_party"
                    className="m-0"
                    label="Responsible Party"
                    rules={[{ max: 200 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'cisco_install_site_id']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Cisco Install Site ID</Checkbox>
                    </Form.Item>
                  ) : (
                    'Cisco Install Site ID'
                  )}
                  <Form.Item
                    name="cisco_install_site_id"
                    className="m-0"
                    label="Cisco Install Site ID"
                    rules={[{ max: 100 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'cisco_ship_to_id']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Cisco Ship To ID</Checkbox>
                    </Form.Item>
                  ) : (
                    'Cisco Ship To ID'
                  )}
                  <Form.Item
                    name="cisco_ship_to_id"
                    className="m-0"
                    label="Cisco Ship To ID"
                    rules={[{ max: 100 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'product_id']} valuePropName="checked" noStyle>
                      <Checkbox>Product ID</Checkbox>
                    </Form.Item>
                  ) : (
                    'Product ID'
                  )}
                  <Form.Item
                    name="product_id"
                    className="m-0"
                    label="Product ID"
                    rules={[{ max: 100 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'serial_number']} valuePropName="checked" noStyle>
                      <Checkbox>Serial Number</Checkbox>
                    </Form.Item>
                  ) : (
                    'Serial Number'
                  )}
                  <Form.Item
                    name="serial_number"
                    className="m-0"
                    label="Serial Number"
                    rules={[{ max: 100 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'instance_id']} valuePropName="checked" noStyle>
                      <Checkbox>Instance ID</Checkbox>
                    </Form.Item>
                  ) : (
                    'Instance ID'
                  )}
                  <Form.Item
                    name="instance_id"
                    className="m-0"
                    label="Instance ID"
                    rules={[{ max: 100 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'parent_sn']} valuePropName="checked" noStyle>
                      <Checkbox>Parent SN</Checkbox>
                    </Form.Item>
                  ) : (
                    'Parent SN'
                  )}
                  <Form.Item
                    name="parent_sn"
                    className="m-0"
                    label="Parent SN"
                    rules={[{ max: 100 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'parent_instance_id']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Parent Instance ID</Checkbox>
                    </Form.Item>
                  ) : (
                    'Parent Instance ID'
                  )}
                  <Form.Item
                    name="parent_instance_id"
                    className="m-0"
                    label="Parent Instance ID"
                    rules={[{ max: 100 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'parent_child_relationship']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Parent / Child Relationship</Checkbox>
                    </Form.Item>
                  ) : (
                    'Parent / Child Relationship'
                  )}
                  <Form.Item
                    name="parent_child_relationship"
                    className="m-0"
                    label="Parent / Child Relationship"
                    rules={[{ max: 100 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'collected_sn']} valuePropName="checked" noStyle>
                      <Checkbox>Collected SN</Checkbox>
                    </Form.Item>
                  ) : (
                    'Collected SN'
                  )}
                  <Form.Item
                    name="collected_sn"
                    className="m-0"
                    label="Collected SN"
                    rules={[{ max: 100 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'host_id']} valuePropName="checked" noStyle>
                      <Checkbox>Host ID</Checkbox>
                    </Form.Item>
                  ) : (
                    'Host ID'
                  )}
                  <Form.Item name="host_id" className="m-0" label="Host ID" rules={[{ max: 100 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'date_added']} valuePropName="checked" noStyle>
                      <Checkbox>Date Added</Checkbox>
                    </Form.Item>
                  ) : (
                    'Date Added'
                  )}
                  <Form.Item name="date_added" label="Date Added" className="m-0">
                    <DatePicker className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'install_base_status']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Install Base Status</Checkbox>
                    </Form.Item>
                  ) : (
                    'Install Base Status'
                  )}
                  <Form.Item
                    name="install_base_status"
                    className="m-0"
                    label="Install Base Status"
                    rules={[{ max: 100 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'replacement_sn']} valuePropName="checked" noStyle>
                      <Checkbox>Replacement SN</Checkbox>
                    </Form.Item>
                  ) : (
                    'Replacement SN'
                  )}
                  <Form.Item
                    name="replacement_sn"
                    className="m-0"
                    label="Replacement SN"
                    rules={[{ max: 100 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'zone_assignment']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Zone Assignment</Checkbox>
                    </Form.Item>
                  ) : (
                    'Zone Assignment'
                  )}
                  <Form.Item
                    name="zone_assignment"
                    className="m-0"
                    label="Zone Assignment"
                    rules={[{ max: 100 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'zone_description']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Zone Description</Checkbox>
                    </Form.Item>
                  ) : (
                    'Zone Description'
                  )}
                  <Form.Item
                    name="zone_description"
                    className="m-0"
                    label="Zone Description"
                    rules={[{ max: 100 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'software_license_pak']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Software License PAK</Checkbox>
                    </Form.Item>
                  ) : (
                    'Software License PAK'
                  )}
                  <Form.Item
                    name="software_license_pak"
                    className="m-0"
                    label="Software License PAK"
                    rules={[{ max: 100 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'product_relationship']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Product Relationship</Checkbox>
                    </Form.Item>
                  ) : (
                    'Product Relationship'
                  )}
                  <Form.Item
                    name="product_relationship"
                    className="m-0"
                    label="Product Relationship"
                    rules={[{ max: 100 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'parent_child_indicator']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Parent Child Indicator</Checkbox>
                    </Form.Item>
                  ) : (
                    'Parent Child Indicator'
                  )}
                  <Form.Item
                    name="parent_child_indicator"
                    className="m-0"
                    label="Parent Child Indicator"
                    rules={[{ max: 100 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'discovery_system_status']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Discovery System Status</Checkbox>
                    </Form.Item>
                  ) : (
                    'Discovery System Status'
                  )}
                  <Form.Item
                    name="discovery_system_status"
                    className="m-0"
                    label="Discovery System Status"
                    rules={[{ max: 100 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'notes']} valuePropName="checked" noStyle>
                      <Checkbox>Notes</Checkbox>
                    </Form.Item>
                  ) : (
                    'Notes'
                  )}
                  <Form.Item name="notes" className="m-0" label="Notes" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'corrective_action']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Corrective Action</Checkbox>
                    </Form.Item>
                  ) : (
                    'Corrective Action'
                  )}
                  <Form.Item
                    name="corrective_action"
                    className="m-0"
                    label="Corrective Action"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'ship_date']} valuePropName="checked" noStyle>
                      <Checkbox>Ship Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'Ship Date'
                  )}
                  <Form.Item name="ship_date" label="Ship Date" className="m-0">
                    <DatePicker className="w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'product_quantity']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Product Quantity</Checkbox>
                    </Form.Item>
                  ) : (
                    'Product Quantity'
                  )}
                  <Form.Item
                    name="product_quantity"
                    className="m-0"
                    label="Product Quantity"
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
                      name={['checked', 'date_data_added']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Date Data Added</Checkbox>
                    </Form.Item>
                  ) : (
                    'Date Data Added'
                  )}
                  <Form.Item name="date_data_added" label="Date Data Added" className="m-0">
                    <DatePicker className="w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'original_data_source']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Original Data Source</Checkbox>
                    </Form.Item>
                  ) : (
                    'Original Data Source'
                  )}
                  <Form.Item
                    name="original_data_source"
                    className="m-0"
                    label="Original Data Source"
                    rules={[{ max: 100 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'last_update_data_source']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Last Update Data Source</Checkbox>
                    </Form.Item>
                  ) : (
                    'Last Update Data Source'
                  )}
                  <Form.Item
                    name="last_update_data_source"
                    label="Last Update Data Source"
                    className="m-0"
                    rules={[{ max: 100 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'last_update_date']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Last Update Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'Last Update Date'
                  )}
                  <Form.Item name="last_update_date" label="Last Update Date" className="m-0">
                    <DatePicker className="w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'smart_account']} valuePropName="checked" noStyle>
                      <Checkbox>Smart Account</Checkbox>
                    </Form.Item>
                  ) : (
                    'Smart Account'
                  )}
                  <Form.Item
                    name="smart_account"
                    label="Smart Account"
                    className="m-0"
                    rules={[{ max: 100 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'warranty_type']} valuePropName="checked" noStyle>
                      <Checkbox>Warranty Type</Checkbox>
                    </Form.Item>
                  ) : (
                    'Warranty Type'
                  )}
                  <Form.Item
                    name="warranty_type"
                    label="Warranty Type"
                    className="m-0"
                    rules={[{ max: 100 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'warranty_end_date']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Warranty End Date</Checkbox>
                    </Form.Item>
                  ) : (
                    'Warranty End Date'
                  )}
                  <Form.Item name="warranty_end_date" label="Warranty End Date" className="m-0">
                    <DatePicker className="w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'hardware_bill_to']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Hardware Bill To</Checkbox>
                    </Form.Item>
                  ) : (
                    'Hardware Bill To'
                  )}
                  <Form.Item
                    name="hardware_bill_to"
                    label="Hardware Bill To"
                    className="m-0"
                    rules={[{ max: 200 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'po']} valuePropName="checked" noStyle>
                      <Checkbox>PO</Checkbox>
                    </Form.Item>
                  ) : (
                    'PO'
                  )}
                  <Form.Item name="po" label="PO" className="m-0" rules={[{ max: 100 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'so']} valuePropName="checked" noStyle>
                      <Checkbox>SO</Checkbox>
                    </Form.Item>
                  ) : (
                    'SO'
                  )}
                  <Form.Item name="so" label="SO" className="m-0" rules={[{ max: 100 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="minor_follow_parent" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'minor_follow_parent']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Minor Follow Parent</Checkbox>
                    </Form.Item>
                  ) : (
                    'Minor Follow Parent'
                  )}
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={ciscoProduct.save.loading || commonLookups.save.loading}
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
export default AddCiscoProductModal;
