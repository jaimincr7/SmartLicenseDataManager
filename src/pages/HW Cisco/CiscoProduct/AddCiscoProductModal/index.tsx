import {
  Button,
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
import moment from 'moment';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { ILookup } from '../../../../services/common/common.model';
import { ICiscoProduct } from '../../../../services/hwCisco/ciscoProduct/ciscoProduct.model';
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

  const { id, showModal, handleModalClose, refreshDataTable } = props;

  const isNew: boolean = id ? false : true;
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
    date_added: null,
  };

  const onFinish = (values: any) => {
    const inputValues: ICiscoProduct = {
      ...values,
      id: id ? +id : null,
    };
    dispatch(saveCiscoProduct(inputValues));
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
        ship_date: _.isNull(data.ship_date) ? null : moment(data.ship_date),
        product_quantity: data.product_quantity,
        date_data_added: _.isNull(data.date_data_added) ? null : moment(data.date_data_added),
        original_data_source: data.original_data_source,
        last_update_data_source: data.last_update_data_source,
        last_update_date: _.isNull(data.last_update_date) ? null : moment(data.last_update_date),
        smart_account: data.smart_account,
        warranty_type: data.warranty_type,
        warranty_end_date: _.isNull(data.warranty_end_date) ? null : moment(data.warranty_end_date),
        hardware_bill_to: data.hardware_bill_to,
        po: data.po,
        so: data.so,
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
                  <label className="label">Tenant</label>
                  <Form.Item
                    name="tenant_id"
                    className="m-0"
                    label="Tenant"
                    rules={[{ required: true }]}
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
                  <label className="label">Company</label>
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
                  <label className="label">BU</label>
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
                  <label className="label">Source</label>
                  <Form.Item name="source" label="Source" className="m-0" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">UID</label>
                  <Form.Item
                    name="uid"
                    className="m-0"
                    label="UID"
                    rules={[{ max: 200, required: true }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Current Organization</label>
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
                  <label className="label">Previous Organization</label>
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
                  <label className="label">Responsible Party</label>
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
                  <label className="label">Cisco Install Site ID</label>
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
                  <label className="label">Cisco Ship To ID</label>
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
                  <label className="label">Product ID</label>
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
                  <label className="label">Serial Number</label>
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
                  <label className="label">Instance ID</label>
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
                  <label className="label">Parent SN</label>
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
                  <label className="label">Parent Instance ID</label>
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
                  <label className="label">Parent / Child Relationship</label>
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
                  <label className="label">Collected SN</label>
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
                  <label className="label">HostID</label>
                  <Form.Item name="host_id" className="m-0" label="HostID" rules={[{ max: 100 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Install Base Status</label>
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
                  <label className="label">Replacement SN</label>
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
                  <label className="label">Zone Assignment</label>
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
                  <label className="label">Zone Description</label>
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
                  <label className="label">Software License PAK</label>
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
                  <label className="label">Product Relationship</label>
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
                  <label className="label">Parent Child Indicator</label>
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
                  <label className="label">Discovery System Status</label>
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
                  <label className="label">Notes</label>
                  <Form.Item name="notes" className="m-0" label="Notes" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Corrective Action</label>
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
                  <label className="label">Ship Date</label>
                  <Form.Item name="ship_date" label="Ship Date" className="m-0">
                    <DatePicker className="w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Product Quantity</label>
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
                  <label className="label">Date Data Added</label>
                  <Form.Item name="date_data_added" label="Date Data Added" className="m-0">
                    <DatePicker className="w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Original Data Source</label>
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
                  <label className="label">Last Update Data Source</label>
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
                  <label className="label">Last Update Date</label>
                  <Form.Item name="last_update_date" label="Last Update Date" className="m-0">
                    <DatePicker className="w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Smart Account</label>
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
                  <label className="label">Warranty Type</label>
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
                  <label className="label">Warranty End Date</label>
                  <Form.Item name="warranty_end_date" label="Warranty End Date" className="m-0">
                    <DatePicker className="w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Hardware Bill To</label>
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
                  <label className="label">PO</label>
                  <Form.Item name="po" label="PO" className="m-0" rules={[{ max: 100 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">SO</label>
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
                  <label className="label">Minor Follow Parent</label>
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={ciscoProduct.save.loading}
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
