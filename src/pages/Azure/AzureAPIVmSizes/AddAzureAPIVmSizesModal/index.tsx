import { Button, Col, Form, Input, InputNumber, Modal, Row, Spin } from 'antd';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { Messages } from '../../../../common/constants/messages';
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
import { IAddAzureAPIVmSizesProps } from './addAzureAPIVmSizes.model';

const validateMessages = {
  required: Messages.FIELD_REQUIRED,
  string: {
    max: Messages.MAXLENGTH,
  },
};

const AddAzureAPIVmSizesModal: React.FC<IAddAzureAPIVmSizesProps> = (props) => {
  const azureAPIVmSizes = useAppSelector(azureAPIVmSizesSelector);
  const dispatch = useAppDispatch();

  const { id, showModal, handleModalClose, refreshDataTable } = props;

  const isNew: boolean = id ? false : true;
  const title = useMemo(() => {
    return isNew ? 'Add Azure API - VM Sizes' : 'Edit Azure API - VM Sizes';
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
  };

  const onFinish = (values: IAzureAPIVmSizes) => {
    const inputValues: IAzureAPIVmSizes = {
      ...values,
      id: id ? +id : null,
    };
    dispatch(saveAzureAPIVmSizes(inputValues));
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
                  <label className="label">Name</label>
                  <Form.Item name="name" label="Name" className="m-0" rules={[{ max: 510 }]}>
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Number Of Cores</label>
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
                  <label className="label">OS Disk Size in GB</label>
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
                  <label className="label">Resource Disk Size in GB</label>
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
                  <label className="label">Memory in GB</label>
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
                  <label className="label">Max Data Disk Count</label>
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
                loading={azureAPIVmSizes.save.loading}
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
