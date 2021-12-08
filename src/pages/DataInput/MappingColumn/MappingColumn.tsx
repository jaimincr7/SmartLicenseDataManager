import { Button, Col, DatePicker, Form, Input, Modal, Row, Select, Spin, Switch } from 'antd';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Can } from '../../../common/ability';
import { Action, Page } from '../../../common/constants/pageAction';
import commonService from '../../../services/common/common.service';
import { IMappingColumnProps } from './MappingColumn.model';

const { Option } = Select;

const MappingColumn: React.FC<IMappingColumnProps> = (props) => {
  const { saveMapping, fileName, fileType, showModal, tableName, excelColumns, onExcelMapping } = props;

  const [form] = Form.useForm();
  const initialValues = {
    file_name: fileName,
    file_type: fileType,
    isPublic: false,
  };

  const [tableColumnState, setTableColumnState] = useState<any>([]);
  const [loadingTableColumns, setLoadingTableColumns] = useState<boolean>(false);

  useEffect(() => {
    if (tableName) {
      setLoadingTableColumns(true);
      commonService.getTableColumns(tableName).then((res) => {
        if (res) {
          setTableColumnState(res);
        }
        setLoadingTableColumns(false);
      });
    }
    else {
      setTableColumnState([]);
      setTableColumnState([]);
    }
  }, [tableName]);

  useEffect(() => {
    console.log(tableColumnState);
  }, [tableColumnState]);

  useEffect(() => {
    form.setFieldsValue({ file_name: fileName });
    form.setFieldsValue({ file_type: fileType });
  }, [fileName]);

  const onFinish = (values: any) => {
    const { file_name, isPublic, ...rest } = values;
    saveMapping(file_name, isPublic);
    onExcelMapping(rest);
  };

  return (
    // <Modal
    //   wrapClassName="custom-modal"
    //   title={'Mapping Columns'}
    //   centered
    //   visible={showModal}
    //   onCancel={handleModalClose}
    //   footer={false}
    // >
    <>
      <Form form={form} name="saveMapping" initialValues={initialValues}>
        <Row gutter={[30, 15]} className="form-label-hide">
          <Col xs={24} sm={12} md={8}>
            <div className="form-group m-0">
              <label className="label">Mapping Pattern</label>
              <Form.Item
                name="file_name"
                label="File Name"
                className="m-0"
                rules={[{ required: true, message: 'Please input File Name' }]}
              >
                <Input className="form-control" />
              </Form.Item>
            </div>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <div className="form-group m-0">
              <label className="label">File Type</label>
              <Form.Item
                name="file_type"
                label="File Type"
                className="m-0"
              >
                <Input className="form-control" disabled={true} />
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
        {loadingTableColumns ? (
          <div className="spin-loader">
            <Spin spinning={true} />
          </div>
        ) :   (<Row gutter={[30, 15]} className="form-label-hide">
                {(tableColumnState || []).map((col, index: number) => (
                  <Col xs={24} md={12} lg={12} xl={8} key={index}>
                    <div className="form-group form-inline">
                      <label className="label">{col.name}</label>
                      <Form.Item
                        name={col.name}
                        className="m-0 w-100"
                        label={col.name}
                        rules={[{ required: col.is_nullable === 'NO' ? true : false }]}
                      >
                        <Select
                          showSearch
                          allowClear
                          suffixIcon={
                            <img
                              src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`}
                              alt=""
                            />
                          }
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
                          {/* {excelColumns.map((option: string, index: number) => (
                            <Option key={index} value={option}>
                              {option}
                            </Option>
                          ))} */}
                        </Select> 
                      </Form.Item>
                    </div>
                  </Col>
                ))}
              </Row>)}
      </Form>
      <br />
      <div className="btns-block modal-footer">
        <Button
          key="submit"
          type="primary"
          onClick={() => {
            onFinish(form.getFieldsValue());
          }}
        >
          Save Mapping
        </Button>
      </div>
    </>
    //</Modal>
  );
};

export default MappingColumn;
