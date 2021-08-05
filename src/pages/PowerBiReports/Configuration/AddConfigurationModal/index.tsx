import { Button, Col, Form, Input, Modal, Row, Spin, Tooltip } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import {
  IConfiguration,
  IReportEmbedUrl,
} from '../../../../services/powerBiReports/configuration/configuration.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getConfigurationById,
  saveConfiguration,
} from '../../../../store/powerBiReports/configuration/configuration.action';
import {
  clearConfigurationGetById,
  clearConfigurationMessages,
  configurationSelector,
} from '../../../../store/powerBiReports/configuration/configuration.reducer';
import { IAddConfigurationProps } from './addConfiguration.model';
import { InfoCircleOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import configurationService from '../../../../services/powerBiReports/configuration/configuration.service';

const AddConfigurationModal: React.FC<IAddConfigurationProps> = (props) => {
  const configuration = useAppSelector(configurationSelector);
  const dispatch = useAppDispatch();

  const [getEmbeddedLoading, setGetEmbeddedLoading] = useState(false);

  const { id, showModal, handleModalClose, refreshDataTable } = props;

  const isNew: boolean = id ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.PowerBIConfig} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IConfiguration = {
    name: '',
    description: '',
    embedded_url: '',
    pb_report_id: '',
    work_space_id: '',
  };

  const onFinish = (values: any) => {
    const inputValues: IConfiguration = {
      ...values,
      id: id ? +id : null,
    };
    dispatch(saveConfiguration(inputValues));
  };

  const fillValuesOnEdit = async (data: IConfiguration) => {
    if (data) {
      initialValues = {
        name: data.name,
        description: data.description,
        embedded_url: data.embedded_url,
        pb_report_id: data.pb_report_id,
        work_space_id: data.work_space_id,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (configuration.save.messages.length > 0) {
      if (configuration.save.hasErrors) {
        toast.error(configuration.save.messages.join(' '));
      } else {
        toast.success(configuration.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearConfigurationMessages());
    }
  }, [configuration.save.messages]);

  useEffect(() => {
    if (+id > 0 && configuration.getById.data) {
      const data = configuration.getById.data;
      fillValuesOnEdit(data);
    }
  }, [configuration.getById.data]);

  useEffect(() => {
    if (+id > 0) {
      dispatch(getConfigurationById(+id));
    }
    return () => {
      dispatch(clearConfigurationGetById());
    };
  }, [dispatch]);

  const getEmbedUrl = () => {
    const reportId = form.getFieldValue('pb_report_id');
    const workspaceId = form.getFieldValue('work_space_id');
    if (reportId && workspaceId) {
      const reportDetail: IReportEmbedUrl = {
        pb_report_id: form.getFieldValue('pb_report_id'),
        work_space_id: form.getFieldValue('work_space_id'),
      };
      setGetEmbeddedLoading(true);
      configurationService.getReportEmbedUrl(reportDetail).then((res: any) => {
        if (res && res.body?.data) {
          form.setFieldsValue({ embedded_url: res.body?.data?.embed_url });
        }
        setGetEmbeddedLoading(false);
      });
    } else {
      toast.error('Please enter Work Space Id and Report Id.');
    }
  };

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
        {configuration.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={configuration.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="addConfiguration"
            initialValues={initialValues}
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Row gutter={[30, 15]} className="form-label-hide">
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Name</label>
                  <Form.Item
                    name="name"
                    label="Name"
                    className="m-0"
                    rules={[
                      { pattern: new RegExp('^([a-z0-9]+-)*[a-z0-9]+$'), required: true, max: 200 },
                    ]}
                  >
                    <Input
                      disabled={!isNew}
                      className="form-control"
                      suffix={
                        <Tooltip title="You can't change it once it saved.">
                          <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                        </Tooltip>
                      }
                    />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Description</label>
                  <Form.Item
                    name="description"
                    label="Description"
                    className="m-0"
                    rules={[{ required: true, max: 500 }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Work Space Id</label>
                  <Form.Item
                    name="work_space_id"
                    label="WorkSpaceId"
                    className="m-0"
                    rules={[{ required: true }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Report Id</label>
                  <Form.Item
                    name="pb_report_id"
                    label="PBReportId"
                    className="m-0"
                    rules={[{ required: true }]}
                  >
                    <Input className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={24} md={16}>
                <div className="form-group m-0">
                  <label className="label">Embedded Url</label>
                  <Form.Item
                    name="embedded_url"
                    label="EmbeddedUrl"
                    className="m-0"
                    rules={[{ required: true }]}
                  >
                    <Input
                      className="form-control"
                      addonAfter={
                        getEmbeddedLoading ? (
                          <Spin size="small" />
                        ) : (
                          <CloudDownloadOutlined
                            onClick={() => {
                              getEmbedUrl();
                            }}
                          />
                        )
                      }
                    />
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={configuration.save.loading}
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
export default AddConfigurationModal;
