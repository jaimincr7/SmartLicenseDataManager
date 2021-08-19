import { Button, Col, Form, Input, Modal, Row, Select, Spin } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getCmsContractLookup,
  getTenantLookup,
  getUserLookup,
} from '../../../../store/common/common.action';
import {
  clearBULookUp,
  clearCompanyLookUp,
  commonSelector,
} from '../../../../store/common/common.reducer';
import {
  clearCmsContractAgreementAttachmentGetById,
  clearCmsContractAgreementAttachmentMessages,
  cmsContractAgreementAttachmentSelector,
} from '../../../../store/cms/contractAgreementAttachment/contractAgreementAttachment.reducer';
import { IAddCmsContractAgreementAttachmentProps } from './addContractAgreementAttachment.model';
import { ICmsContractAgreementAttachment } from '../../../../services/cms/contractAgreementAttachment/contractAgreementAttachment.model';
import {
  getCmsContractAgreementAttachmentById,
  saveCmsContractAgreementAttachment,
} from '../../../../store/cms/contractAgreementAttachment/contractAgreementAttachment.action';
import { ILookup } from '../../../../services/common/common.model';

const { Option } = Select;

const AddCmsContractAgreementAttachmentModal: React.FC<IAddCmsContractAgreementAttachmentProps> = (
  props
) => {
  const cmsContractAgreementAttachment = useAppSelector(cmsContractAgreementAttachmentSelector);
  const dispatch = useAppDispatch();
  const commonLookups = useAppSelector(commonSelector);
  const { id, showModal, handleModalClose, refreshDataTable } = props;

  const isNew: boolean = id ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '}{' '}
        <BreadCrumbs pageName={Page.CmsContractAgreementAttachment} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ICmsContractAgreementAttachment = {
    contract_agreement_id: null,
    original_name: '',
    file_path: '',
    file_name: '',
    user_id: null,
  };

  const onFinish = (values: any) => {
    const inputValues: ICmsContractAgreementAttachment = {
      ...values,
      id: id ? +id : null,
    };
    dispatch(saveCmsContractAgreementAttachment(inputValues));
  };

  const fillValuesOnEdit = async (data: ICmsContractAgreementAttachment) => {
    if (data) {
      initialValues = {
        contract_agreement_id: _.isNull(data.contract_agreement_id)
          ? null
          : data.contract_agreement_id,
        original_name: data.original_name,
        file_path: data.file_path,
        file_name: data.file_name,
        user_id: _.isNull(data.user_id) ? null : data.user_id,
        date_added: _.isNull(data.date_added) ? null : moment(data.date_added),
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (cmsContractAgreementAttachment.save.messages.length > 0) {
      if (cmsContractAgreementAttachment.save.hasErrors) {
        toast.error(cmsContractAgreementAttachment.save.messages.join(' '));
      } else {
        toast.success(cmsContractAgreementAttachment.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearCmsContractAgreementAttachmentMessages());
    }
  }, [cmsContractAgreementAttachment.save.messages]);

  useEffect(() => {
    if (+id > 0 && cmsContractAgreementAttachment.getById.data) {
      const data = cmsContractAgreementAttachment.getById.data;
      fillValuesOnEdit(data);
    }
  }, [cmsContractAgreementAttachment.getById.data]);

  useEffect(() => {
    dispatch(getTenantLookup());
    dispatch(getCmsContractLookup());
    dispatch(getUserLookup());
    if (+id > 0) {
      dispatch(getCmsContractAgreementAttachmentById(+id));
    }
    return () => {
      dispatch(clearCmsContractAgreementAttachmentGetById());
      dispatch(clearCompanyLookUp());
      dispatch(clearBULookUp());
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(getTenantLookup());
    if (+id > 0) {
      dispatch(getCmsContractAgreementAttachmentById(+id));
    }
    return () => {
      dispatch(clearCmsContractAgreementAttachmentGetById());
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
        {cmsContractAgreementAttachment.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={cmsContractAgreementAttachment.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="cmsContractAgreementAttachment"
            initialValues={initialValues}
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Row gutter={[30, 15]} className="form-label-hide">
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Contract Agreement</label>
                  <Form.Item
                    rules={[{ required: true }]}
                    name="contract_agreement_id"
                    className="m-0"
                    label="Contract Agreement"
                  >
                    <Select
                      allowClear
                      showSearch
                      loading={commonLookups.cmsContractLookup.loading}
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
                      {commonLookups.cmsContractLookup.data.map((option: ILookup) => (
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
                  <label className="label">User</label>
                  <Form.Item
                    rules={[{ required: true }]}
                    name="user_id"
                    className="m-0"
                    label="User ID"
                  >
                    <Select
                      allowClear
                      showSearch
                      loading={commonLookups.UserLookup.loading}
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
                      {commonLookups.UserLookup.data.map((option: ILookup) => (
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
                  <label className="label">Original Name</label>
                  <Form.Item
                    name="original_name"
                    label="OriginalName"
                    className="m-0"
                    rules={[{ max: 510, required: true }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">File Path</label>
                  <Form.Item
                    name="file_path"
                    label="File Path"
                    className="m-0"
                    rules={[{ max: 510, required: true }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">File Name</label>
                  <Form.Item
                    name="file_name"
                    label="File Name"
                    className="m-0"
                    rules={[{ max: 510, required: true }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={cmsContractAgreementAttachment.save.loading}
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
export default AddCmsContractAgreementAttachmentModal;
