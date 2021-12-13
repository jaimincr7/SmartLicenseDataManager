import { Button, Col, Form, Input, InputNumber, Modal, Row, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { DEFAULT_PAGE_SIZE } from '../../../common/constants/common';
import { IPreviewExcel } from './PreviewExcel.model';

const PreviewExcel: React.FC<IPreviewExcel> = (props) => {
  const { headerRowCount, dataRecords, setRecords, previewData, records, showModal, handleModalClose, maxCount, seqNumber } = props;
  const [columns, setColumns] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    showSizeChanger: true,
  });

  useEffect(() => {
    showModal && previewData(headerRowCount);
  }, [showModal]);

  const [form] = Form.useForm();
  const initialValues = {
    header_row: dataRecords.filter(data => data.index == seqNumber).header_row,
  };

  useEffect(() => {
    debugger;
    const initialValues = {
      header_row: dataRecords.filter(data => data.index == seqNumber).header_row,
    };
    form.setFieldsValue(initialValues);
  }, [dataRecords]);

  useEffect(() => {
    const mainColumns = [];
    headerRowCount > 0 && form.setFieldsValue({ header_row: headerRowCount });
    if (records?.length > 0) {
      for (let index = 0; index <= maxCount; index++) {
        mainColumns.push({
          dataIndex: 'description' + index,
          key: 'description' + index,
          ellipsis: true,
          render: (_, data: any, i) => {
            return (
              <>
                {index === 0
                  ? headerRowCount === 0
                    ? 1
                    : i + (headerRowCount ?? 1)
                  : data[index - 1]}
              </>
            );
          },
        });
      }
      setColumns(mainColumns);
    }
  }, [records]);

  const handleTableChange = (paginating) => {
    setPagination(paginating);
  };

  const submitHeaderRow = (values: any) => {
    const dummyRecords = _.cloneDeep(dataRecords);
    dummyRecords.map((data) => {
      debugger;
      if(data.index == seqNumber) 
      {
        data.header_row = values.header_row;
        data.delimeter = values.deli_meter;
      }
    });
    setRecords(dummyRecords);
    handleModalClose();
  }

  return (
    <Modal
      wrapClassName="custom-modal"
      title={'Manage Excel'}
      centered
      visible={showModal}
      onCancel={handleModalClose}
      footer={false}
    >
      <Form form={form} name="formUpload" initialValues={initialValues} onFinish={submitHeaderRow}>
        <Row gutter={[30, 15]} className="form-label-hide">
        <Col xs={24} sm={12} md={8}>
          <div className="form-group ">
            <label className="label">Header Row</label>
            <Form.Item name="header_row" className="m-0" rules={[{ required: true, type: 'integer' }]}>
              <InputNumber
                min={1}
                max={maxCount}
                className="form-control w-100"
                onChange={(value) => {
                  previewData(value);
                }}
              />
            </Form.Item>
          </div>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <div className="form-group ">
            <label className="label">Deli Meter</label>
            <Form.Item name="deli_meter" className="m-0" rules={[{ type: 'integer' }]}>
              <Input
                min={1}
                max={maxCount}
                className="form-control w-100"
              />
            </Form.Item>
          </div>
        </Col>
        </Row>
        <Table
          showHeader={false}
          scroll={{ x: true }}
          pagination={{
            ...pagination,
            pageSizeOptions: [
              '10',
              records?.length > 10 ? '50' : '-',
              records?.length > 50 ? '100' : '-',
              records?.length > 100 ? '500' : '-',
            ],
            total: records?.length,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
          onChange={handleTableChange}
          dataSource={records}
          columns={columns}
          className="custom-table first-row-header"
        />

      <div className="btns-block modal-footer">
        <Button key="submit" type="primary" htmlType="submit" >
          Ok
        </Button>
      </div>
      </Form>
    </Modal>
  );
};

export default PreviewExcel;
