import { Button, Col, Form, Modal, Row, Select } from 'antd';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { IPurgeDataModalProps } from './purgeDataModal.model';
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import {
  clearCompanyMessages,
  companySelector,
} from '../../../../store/master/company/company.reducer';
import { getAllCompanyLookup } from '../../../../store/common/common.action';
import { purgeCompanyById } from '../../../../store/master/company/company.action';
import { ILookup } from '../../../../services/common/common.model';
import { commonSelector } from '../../../../store/common/common.reducer';

const { Option } = Select;

const DeleteDatasetModal: React.FC<IPurgeDataModalProps> = (props) => {
  const company = useAppSelector(companySelector);
  const common = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();

  const { showModal, handleModalClose } = props;

  const [form] = Form.useForm();

  const initialValues = {
    company_id: null,
  };

  const onFinish = (values: any) => {
    dispatch(purgeCompanyById(values.company_id));
  };

  useEffect(() => {
    if (company.purge.messages.length > 0) {
      if (company.purge.hasErrors) {
        toast.error(company.purge.messages.join(' '));
      } else {
        toast.warning(company.purge.messages.join(' '));
        handleModalClose();
      }
      dispatch(clearCompanyMessages());
    }
  }, [company.purge.messages]);

  const handleCompanyChange = (companyId: number) => {
    form.setFieldsValue({ company_id: companyId, bu_id: null });
  };

  useEffect(() => {
    dispatch(getAllCompanyLookup());
  }, [dispatch]);

  return (
    <>
      <Modal
        wrapClassName="custom-modal"
        title="Purge Data"
        centered
        visible={showModal}
        onCancel={handleModalClose}
        footer={false}
      >
        <Form form={form} name="deleteDataset" initialValues={initialValues} onFinish={onFinish}>
          <Row gutter={[30, 15]} className="form-label-hide">
            <Col xs={24} sm={12} md={8}>
              <div className="form-group m-0">
                <label className="label">Company Name</label>
                <Form.Item
                  name="company_id"
                  className="m-0"
                  label="Company Name"
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder="Select Company Name"
                    onChange={handleCompanyChange}
                    allowClear
                    loading={common.allCompanyLookup.loading}
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
                    {common.allCompanyLookup.data.map((option: ILookup) => (
                      <Option key={option.id} value={option.id}>
                        {option.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Col>
          </Row>
          <div className="btns-block modal-footer">
            <Button key="submit" type="primary" htmlType="submit" loading={company.purge.loading}>
              Purge
            </Button>
            <Button key="back" onClick={handleModalClose}>
              Cancel
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};
export default DeleteDatasetModal;
