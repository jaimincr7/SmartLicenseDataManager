import { Button, Col, Form, Input, Modal, Row, Switch } from 'antd';
import React, { useEffect } from 'react';
import { Can } from '../../../common/ability';
import { Action, Page } from '../../../common/constants/pageAction';
import { IMappingColumnProps } from './MappingColumn.model';

const MappingColumn: React.FC<IMappingColumnProps> = (props) => {
  const { saveMapping, fileName, showModal, handleModalClose } = props;

  const [form] = Form.useForm();
  const initialValues = {
    file_name: fileName,
    isPublic: false,
  };

  useEffect(() => {
    form.setFieldsValue({ "file_name": fileName })
  }, [fileName])

  const onFinish = (values: any) => {
    const { file_name, isPublic } = values;
    saveMapping(file_name, isPublic);
  };

  return (
    <Modal
      wrapClassName="custom-modal"
      title={'Mapping Columns'}
      centered
      visible={showModal}
      onCancel={handleModalClose}
      footer={false}
    >
      <Form form={form} name="saveMapping" initialValues={initialValues}>
        <Row gutter={[30, 15]} className="form-label-hide">
          <Col xs={24} sm={12} md={8}>
            <div className="form-group m-0">
              <label className="label">File Name</label>
              <Form.Item
                name="file_name"
                label="File Name"
                className="m-0"
                rules={[{ required: true }]}
              >
                <Input className="form-control" />
              </Form.Item>
            </div>
          </Col>
          <Can I={Action.Select} a={Page.ConfigExcelFileMapping}>
            {}
            <Col xs={24} sm={12} md={8}>
              <div className="form-group form-inline-pt m-0">
                <Form.Item name="isPublic" className="m-0" valuePropName="checked">
                  <Switch className="form-control" />
                </Form.Item>
                <label className="label">Is Public?</label>
              </div>
            </Col>
          </Can>
        </Row>
      </Form>

      <div className="btns-block modal-footer">
        <Button
          key="submit"
          type="primary"
          onClick={() => {
            onFinish(form.getFieldsValue());
          }}
        >
          Save
        </Button>
        <Button type="primary" onClick={handleModalClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default MappingColumn;
