import { Button, Checkbox, Col, Form, Input, Modal, Row, Select, Spin } from 'antd';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import {
  IConfiguration,
  IPowerBIReport,
  IWorkspace,
} from '../../../../services/powerBiReports/configuration/configuration.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getConfigurationById,
  getReportsByGroupId,
  saveConfiguration,
} from '../../../../store/powerBiReports/configuration/configuration.action';
import {
  clearConfigurationGetById,
  clearConfigurationMessages,
  configurationSelector,
} from '../../../../store/powerBiReports/configuration/configuration.reducer';
import { IAddConfigurationProps } from './addConfiguration.model';
import { getGroups } from './../../../../store/powerBiReports/configuration/configuration.action';
import { getObjectForUpdateMultiple } from '../../../../common/helperFunction';
import { updateMultiple } from '../../../../store/common/common.action';
import {
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';

const { Option } = Select;

const AddConfigurationModal: React.FC<IAddConfigurationProps> = (props) => {
  const configuration = useAppSelector(configurationSelector);
  const common = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();

  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

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
    report_type: '',
  };

  const onFinish = (values: any) => {
    const inputValues: IConfiguration = {
      ...values,
      embedded_url: form.getFieldValue('embedded_url'),
      id: id ? +id : null,
    };
    if (!isMultiple) {
      dispatch(saveConfiguration(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        configuration.search.tableName
      );
      if (result) {
        dispatch(updateMultiple(result));
      }
    }
  };

  const fillValuesOnEdit = async (data: IConfiguration) => {
    if (data) {
      initialValues = {
        name: data.name,
        description: data.description,
        embedded_url: data.embedded_url,
        pb_report_id: data.pb_report_id,
        work_space_id: data.work_space_id,
        report_type: data.report_type,
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
    if (+id > 0 && configuration.getById.data) {
      const data = configuration.getById.data;
      fillValuesOnEdit(data);
    }
  }, [configuration.getById.data]);

  useEffect(() => {
    dispatch(getGroups());
    if (+id > 0) {
      dispatch(getConfigurationById(+id));
    }
    return () => {
      dispatch(clearConfigurationGetById());
    };
  }, [dispatch]);

  const handleWorkspaceChange = (workspaceId: string) => {
    form.setFieldsValue({ work_space_id: workspaceId, pb_report_id: null });
    if (workspaceId) {
      dispatch(getReportsByGroupId(workspaceId));
    }
  };

  const handleReportChange = (reportId: string) => {
    const selectedReport = configuration.getReportsByGroupId.data?.find((x) => x.id === reportId);
    form.setFieldsValue({
      pb_report_id: reportId,
      description: selectedReport?.name,
      report_type: selectedReport?.report_type,
      embedded_url: selectedReport?.embed_url,
    });
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
                  {isMultiple ? (
                    <Form.Item name={['checked', 'work_space_id']} valuePropName="checked" noStyle>
                      <Checkbox>Workspace</Checkbox>
                    </Form.Item>
                  ) : (
                    'Workspace'
                  )}
                  <Form.Item name="work_space_id" className="m-0" label="Workspace">
                    <Select
                      onChange={handleWorkspaceChange}
                      allowClear
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
                      loading={configuration.getGroups.loading}
                    >
                      {configuration.getGroups.data?.map((option: IWorkspace) => (
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
                    <Form.Item name={['checked', 'pb_report_id']} valuePropName="checked" noStyle>
                      <Checkbox>Report</Checkbox>
                    </Form.Item>
                  ) : (
                    'Report'
                  )}
                  <Form.Item name="pb_report_id" className="m-0" label="Report">
                    <Select
                      onChange={handleReportChange}
                      allowClear
                      showSearch
                      dropdownClassName="value-box-select"
                      optionFilterProp="children"
                      filterOption={(input, option: any) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      filterSort={(optionA: any, optionB: any) =>
                        optionA.children
                          ?.toLowerCase()
                          ?.localeCompare(optionB.children?.toLowerCase())
                      }
                      loading={configuration.getReportsByGroupId.loading}
                    >
                      {configuration.getReportsByGroupId.data?.map((option: IPowerBIReport) => (
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
                    <Form.Item name={['checked', 'pb_report_id']} valuePropName="checked" noStyle>
                      <Checkbox>Report Type</Checkbox>
                    </Form.Item>
                  ) : (
                    'Report Type'
                  )}
                  <Form.Item
                    name="report_type"
                    label="Report Type"
                    className="m-0"
                    rules={[{ required: !isMultiple, max: 500 }]}
                  >
                    <Input disabled={true} className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'description']} valuePropName="checked" noStyle>
                      <Checkbox>Name</Checkbox>
                    </Form.Item>
                  ) : (
                    'Name'
                  )}
                  <Form.Item
                    name="description"
                    label="Name"
                    className="m-0"
                    rules={[{ required: !isMultiple, max: 500 }]}
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
                loading={configuration.save.loading || common.save.loading}
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
