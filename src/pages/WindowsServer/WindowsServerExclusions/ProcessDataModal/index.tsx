import { Button, Col, Form, Modal, Row, Select } from 'antd';
import { useEffect } from 'react';
import { ILookup, IScheduleDate } from '../../../../services/common/common.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import {
  getAllCompanyLookup,
  getBULookup,
  getScheduleDate,
} from '../../../../store/common/common.action';
import { clearBULookUp, commonSelector } from '../../../../store/common/common.reducer';
import { IProcessDataModalProps } from './processData.model';
import { toast } from 'react-toastify';
import moment from 'moment';
import {
  windowsServerExclusionsSelector,
  clearWindowsServerExclusionsMessages,
} from '../../../../store/windowsServer/windowsServerExclusions/windowsServerExclusions.reducer';
import { processData } from '../../../../store/windowsServer/windowsServerExclusions/windowsServerExclusions.action';
import { validateMessages } from '../../../../common/constants/common';

const { Option } = Select;

const ProcessDataModal: React.FC<IProcessDataModalProps> = (props) => {
  const windowsServerExclusions = useAppSelector(windowsServerExclusionsSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();

  const { showModal, handleModalClose } = props;

  const [form] = Form.useForm();

  const initialValues = {
    company_id: null,
    bu_id: null,
    selected_date: moment(),
  };

  const onFinish = (values: any) => {
    dispatch(processData(values));
  };

  // const disabledDate = (current) => {
  //   // Can not select days before today and today
  //   return current && current > moment().endOf('day');
  // };

  useEffect(() => {
    if (windowsServerExclusions.processData.messages.length > 0) {
      if (windowsServerExclusions.processData.hasErrors) {
        toast.error(windowsServerExclusions.processData.messages.join(' '));
      } else {
        toast.success(windowsServerExclusions.processData.messages.join(' '));
        handleModalClose();
      }
      dispatch(clearWindowsServerExclusionsMessages());
    }
  }, [windowsServerExclusions.processData.messages]);

  const handleCompanyChange = (companyId: number) => {
    form.setFieldsValue({ company_id: companyId, bu_id: null });
    if (companyId) {
      dispatch(getBULookup(companyId));
    } else {
      dispatch(clearBULookUp());
    }
  };

  const handleBUChange = (buId: number) => {
    let process = {
      company_id: null,
      bu_id: null,
      tenant_id: null,
      table_name: '',
    };
    process = form.getFieldsValue();
    const getDataScheduleDate: IScheduleDate = {
      company_id: process.company_id,
      bu_id: process.bu_id,
      table_name: 'Windows Server Exclusions',
    };
    dispatch(getScheduleDate(getDataScheduleDate));
    form.setFieldsValue({ bu_id: buId });
  };

  useEffect(() => {
    dispatch(getAllCompanyLookup());
    return () => {
      dispatch(clearBULookUp());
    };
  }, [dispatch]);

  return (
    <>
      <Modal
        wrapClassName="custom-modal"
        title="Process Data"
        centered
        visible={showModal}
        onCancel={handleModalClose}
        footer={false}
      >
        <Form
          form={form}
          name="processData"
          initialValues={initialValues}
          onFinish={onFinish}
          validateMessages={validateMessages}
        >
          <Row gutter={[30, 15]} className="form-label-hide">
            <Col xs={24} sm={12} md={8}>
              <div className="form-group m-0">
                <label className="label">Company</label>
                <Form.Item
                  name="company_id"
                  className="m-0"
                  label="Company"
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder="Select Company"
                    loading={commonLookups.allCompanyLookup.loading}
                    onChange={handleCompanyChange}
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
                  >
                    {commonLookups.allCompanyLookup.data.map((option: ILookup) => (
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
                <Form.Item name="bu_id" className="m-0" label="BU" rules={[{ required: true }]}>
                  <Select
                    placeholder="Select BU"
                    loading={commonLookups.buLookup.loading}
                    onChange={handleBUChange}
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
            {/* <Col xs={24} sm={12} md={8}>
              <div className="form-group m-0">
                <label className="label">Selected Date</label>
                <Form.Item
                  name="selected_date"
                  className="m-0"
                  label="Selected Date"
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder="Select Date"
                    loading={commonLookups.getScheduledDate.loading}
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
                  >
                    {commonLookups.getScheduledDate.data.map((option: ILookup) => (
                      <Option key={option.id} value={option.id}>
                        {option.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Col> */}
          </Row>
          <div className="btns-block modal-footer pt-lg">
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              loading={windowsServerExclusions.processData.loading}
            >
              Process
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
export default ProcessDataModal;
