import { Button, Col, Form, Modal, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/app.hooks';
import { getCSVExcelColumns } from '../../../store/bulkImport/bulkImport.action';
import { bulkImportSelector } from '../../../store/bulkImport/bulkImport.reducer';
import { ICheckDelimeterProps } from './checkDelimiter.model';

const { Option } = Select;

const CkeckDelimiterModal: React.FC<ICheckDelimeterProps> = (props) => {
  const bulkImport = useAppSelector(bulkImportSelector);
  const dispatch = useAppDispatch();
  const [files, setFiles] = useState([]);
  const { showModal, handleModalClose } =
    props;

  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    const arr: Array<{ original_filename: any, filename: any, delimiter: string }> = [];
    Object.keys(values).map((data) => {
      const fltrObj = files.filter(dataDM => dataDM.original_filename == data)[0];
      const Obj = {
        original_filename: fltrObj.original_filename,
        filename: fltrObj.filename,
        delimiter: values[data],
      };
      arr.push(Obj);
    }
    );
    const valueFinal = { csv_file_info: arr };
    dispatch(getCSVExcelColumns(valueFinal));
    handleModalClose();
  };

  useEffect(() => {
    if (bulkImport?.getExcelColumns?.csvFiles?.length > 0 && bulkImport.getExcelColumns.csvFiles !== null) {
      setFiles(bulkImport.getExcelColumns.csvFiles);
    } if(bulkImport.getCSVExcelColumns.csvFiles !== null && bulkImport.getCSVExcelColumns.csvFiles?.length > 0) {
      setFiles(bulkImport.getCSVExcelColumns.csvFiles);
    }
  }, [bulkImport.getExcelColumns.data,bulkImport.getCSVExcelColumns.csvFiles]);

  return (
    <>
      <Modal
        wrapClassName="custom-modal"
        title={'Re-Filling Proper Delimiters'}
        centered
        visible={showModal}
        onCancel={handleModalClose}
        footer={false}
      >

        <Form
          form={form}
          name="CkeckDelimiter"
          onFinish={onFinish}
        >
          <Row gutter={[30, 15]} className="form-label-hide">
            {files && files.map((data, index) => (<Col xs={24} sm={12} md={8} key={index}>
              <div className="form-group m-0">
                <label className="label">{data.original_filename}</label>
                <Form.Item
                  name={data.original_filename}
                  label={data.original_filename}
                  className="m-0"
                  rules={[{ required: true }]}
                >
                  <Select
                    showSearch
                    placeholder="Select a Delimit"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value=";">;</Option>
                    <Option value=",">,</Option>
                    <Option value="    ">TAB</Option>
                    <Option value=" ">SPACE</Option>
                  </Select>
                </Form.Item>
              </div>
            </Col>))}
          </Row>
          <div className="btns-block modal-footer">
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
            >
              Check Delimit
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};
export default CkeckDelimiterModal;

