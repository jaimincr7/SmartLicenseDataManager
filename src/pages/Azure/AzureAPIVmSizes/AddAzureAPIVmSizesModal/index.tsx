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
  Spin,
} from 'antd';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import _ from 'lodash';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import {
  forEditModal,
  getObjectForUpdateMultiple,
  getSimpleDate,
  passDateToApi,
} from '../../../../common/helperFunction';
import { IAzureAPIVmSizes } from '../../../../services/azure/azureAPIVmSizes/azureAPIVmSizes.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getAzureAPIVmSizesById,
  saveAzureAPIVmSizes,
} from '../../../../store/azure/azureAPIVmSizes/azureAPIVmSizes.action';
import {
  clearAzureAPIVmSizesGetById,
  clearAzureAPIVmSizesMessages,
  azureAPIVmSizesSelector,
} from '../../../../store/azure/azureAPIVmSizes/azureAPIVmSizes.reducer';
import { updateMultiple } from '../../../../store/common/common.action';
import {
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';
import { IAddAzureAPIVmSizesProps } from './addAzureAPIVmSizes.model';

const AddAzureAPIVmSizesModal: React.FC<IAddAzureAPIVmSizesProps> = (props) => {
  const azureAPIVmSizes = useAppSelector(azureAPIVmSizesSelector);
  const common = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();

  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.AzureAPIVmSizes} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IAzureAPIVmSizes = {
    name: '',
    number_of_cores: null,
    os_disk_size_in_gb: null,
    resource_disk_size_in_gb: null,
    memory_in_gb: null,
    max_data_disk_count: null,
    date_added: getSimpleDate(),
  };

  const onFinish = (values: IAzureAPIVmSizes) => {
    const inputValues: IAzureAPIVmSizes = {
      ...values,
      id: id ? +id : null,
    };
    inputValues.date_added = passDateToApi(inputValues.date_added, true);
    if (!isMultiple) {
      dispatch(saveAzureAPIVmSizes(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        azureAPIVmSizes.search.tableName
      );
      if (result) {
        dispatch(updateMultiple(result));
      }
    }
  };

  const fillValuesOnEdit = async (data: IAzureAPIVmSizes) => {
    if (data) {
      initialValues = {
        name: data.name,
        number_of_cores: data.number_of_cores,
        os_disk_size_in_gb: data.os_disk_size_in_gb,
        resource_disk_size_in_gb: data.resource_disk_size_in_gb,
        memory_in_gb: data.memory_in_gb,
        max_data_disk_count: data.max_data_disk_count,
        date_added: _.isNull(data.date_added) ? null : forEditModal(data.date_added),
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (azureAPIVmSizes.save.messages.length > 0) {
      if (azureAPIVmSizes.save.hasErrors) {
        toast.error(azureAPIVmSizes.save.messages.join(' '));
      } else {
        toast.success(azureAPIVmSizes.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearAzureAPIVmSizesMessages());
    }
  }, [azureAPIVmSizes.save.messages]);

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
    if (+id > 0 && azureAPIVmSizes.getById.data) {
      const data = azureAPIVmSizes.getById.data;
      fillValuesOnEdit(data);
    }
  }, [azureAPIVmSizes.getById.data]);

  useEffect(() => {
    if (+id > 0) {
      dispatch(getAzureAPIVmSizesById(+id));
    }
    return () => {
      dispatch(clearAzureAPIVmSizesGetById());
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
        {azureAPIVmSizes.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={azureAPIVmSizes.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="addAzureAPIVmSizes"
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
                  <Form.Item name="name" label="Name" className="m-0" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'number_of_cores']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Number Of Cores</Checkbox>
                    </Form.Item>
                  ) : (
                    'Number Of Cores'
                  )}
                  <Form.Item
                    name="number_of_cores"
                    label="Number Of Cores"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'os_disk_size_in_gb']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>OS Disk Size in GB</Checkbox>
                    </Form.Item>
                  ) : (
                    'OS Disk Size in GB'
                  )}
                  <Form.Item
                    name="os_disk_size_in_gb"
                    label="OS Disk Size in GB"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item
                      name={['checked', 'resource_disk_size_in_gb']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Resource Disk Size in GB</Checkbox>
                    </Form.Item>
                  ) : (
                    'Resource Disk Size in GB'
                  )}
                  <Form.Item
                    name="resource_disk_size_in_gb"
                    label="Resource Disk Size in GB"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'memory_in_gb']} valuePropName="checked" noStyle>
                      <Checkbox>Memory in GB</Checkbox>
                    </Form.Item>
                  ) : (
                    'Memory in GB'
                  )}
                  <Form.Item
                    name="memory_in_gb"
                    label="Memory in GB"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
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
                      name={['checked', 'max_data_disk_count']}
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>Max Data Disk Count</Checkbox>
                    </Form.Item>
                  ) : (
                    'Max Data Disk Count'
                  )}
                  <Form.Item
                    name="max_data_disk_count"
                    label="Max Data Disk Count"
                    className="m-0"
                    rules={[{ type: 'number' }]}
                  >
                    <InputNumber className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={azureAPIVmSizes.save.loading || common.save.loading}
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
export default AddAzureAPIVmSizesModal;
