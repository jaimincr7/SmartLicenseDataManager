import { Button, Checkbox, Col, Form, Input, Modal, Row, Spin, Switch } from 'antd';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { getObjectForUpdateMultiple } from '../../../../common/helperFunction';
import { ICmdbOperatingSystem } from '../../../../services/cmdb/operatingSystem/operatingSystem.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getCmdbOperatingSystemById,
  saveCmdbOperatingSystem,
} from '../../../../store/cmdb/operatingSystem/operatingSystem.action';
import {
  clearCmdbOperatingSystemGetById,
  clearCmdbOperatingSystemMessages,
  cmdbOperatingSystemSelector,
} from '../../../../store/cmdb/operatingSystem/operatingSystem.reducer';
import { getTenantLookup, updateMultiple } from '../../../../store/common/common.action';
import {
  clearBULookUp,
  clearCompanyLookUp,
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';
import { IAddCmdbOperatingSystemProps } from './addOperatingSystem.model';

const AddCmdbOperatingSystemModal: React.FC<IAddCmdbOperatingSystemProps> = (props) => {
  const cmdbOperatingSystem = useAppSelector(cmdbOperatingSystemSelector);
  const common = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();

  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.CmdbOperatingSystem} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ICmdbOperatingSystem = {
    name: '',
    manufacturer: '',
    version: '',
    build_number: '',
    serial_number: '',
    is_oem: false,
    is_server: false,
  };

  const onFinish = (values: any) => {
    const inputValues: ICmdbOperatingSystem = {
      ...values,
      id: id ? +id : null,
    };
    if (!isMultiple) {
      dispatch(saveCmdbOperatingSystem(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        cmdbOperatingSystem.search.tableName
      );
      if (result) {
        dispatch(updateMultiple(result));
      }
    }
  };

  const fillValuesOnEdit = async (data: ICmdbOperatingSystem) => {
    if (data) {
      initialValues = {
        name: data.name,
        manufacturer: data.manufacturer,
        version: data.version,
        build_number: data.build_number,
        serial_number: data.serial_number,
        is_oem: data.is_oem,
        is_server: data.is_server,
        date_added: data.date_added,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (cmdbOperatingSystem.save.messages.length > 0) {
      if (cmdbOperatingSystem.save.hasErrors) {
        toast.error(cmdbOperatingSystem.save.messages.join(' '));
      } else {
        toast.success(cmdbOperatingSystem.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearCmdbOperatingSystemMessages());
    }
  }, [cmdbOperatingSystem.save.messages]);

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
    if (+id > 0 && cmdbOperatingSystem.getById.data) {
      const data = cmdbOperatingSystem.getById.data;
      fillValuesOnEdit(data);
    }
  }, [cmdbOperatingSystem.getById.data]);

  useEffect(() => {
    dispatch(getTenantLookup());
    if (+id > 0) {
      dispatch(getCmdbOperatingSystemById(+id));
    }
    return () => {
      dispatch(clearCmdbOperatingSystemGetById());
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
        {cmdbOperatingSystem.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={cmdbOperatingSystem.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="cmdbOperatingSystem"
            initialValues={initialValues}
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Row gutter={[30, 15]} className="form-label-hide">
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'name']} valuePropName="checked" noStyle>
                      <Checkbox>Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Name'
                  )}
                  <Form.Item
                    name="name"
                    label="Name"
                    className="m-0"
                    rules={[{ max: 200, required: !isMultiple }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'manufacturer']} valuePropName="checked" noStyle>
                      <Checkbox>Manufacturer</Checkbox>
                    </Form.Item>
                  ) : (
                    'Manufacturer'
                  )}
                  <Form.Item
                    name="manufacturer"
                    className="m-0"
                    label="Manufacturer"
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'version']} valuePropName="checked" noStyle>
                      <Checkbox>Version</Checkbox>
                    </Form.Item>
                  ) : (
                    'Version'
                  )}
                  <Form.Item name="version" className="m-0" label="Version" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'build_number']} valuePropName="checked" noStyle>
                      <Checkbox>Build Number</Checkbox>
                    </Form.Item>
                  ) : (
                    'Build Number'
                  )}
                  <Form.Item
                    name="build_number"
                    className="m-0"
                    label="Build Number"
                    rules={[{ max: 510 }]}
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
                    rules={[{ max: 510 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_oem" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item name={['checked', 'is_oem']} valuePropName="checked" noStyle>
                      <Checkbox>Is OEM</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is OEM'
                  )}
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="is_server" className="m-0" valuePropName="checked">
                    <Switch className="form-control" />
                  </Form.Item>
                  &nbsp;
                  {isMultiple ? (
                    <Form.Item name={['checked', 'is_server']} valuePropName="checked" noStyle>
                      <Checkbox>Is Server</Checkbox>
                    </Form.Item>
                  ) : (
                    'Is Server'
                  )}
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={cmdbOperatingSystem.save.loading || common.save.loading}
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
export default AddCmdbOperatingSystemModal;
