import { Button, Col, Form, InputNumber, Modal, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { DEFAULT_PAGE_SIZE } from '../../../common/constants/common';
import { IPreviewExcel } from './PreviewExcel.model';

const PreviewExcel: React.FC<IPreviewExcel> = (props) => {
  const { headerRowCount, previewData, records, showModal, handleModalClose, maxCount } = props;
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
    header_row: headerRowCount,
  };

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

  return (
    <Modal
      wrapClassName="custom-modal"
      title={'Manage Excel'}
      centered
      visible={showModal}
      onCancel={handleModalClose}
      footer={false}
    >
      <Form form={form} name="formUpload" initialValues={initialValues}>
        <Col xs={24} md={8}>
          <div className="form-group ">
            <label className="label">Header Row</label>
            <Form.Item name="header_row" className="m-0" rules={[{ type: 'integer' }]}>
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
        <Table
          showHeader={false}
          scroll={{ x: true }}
          pagination={{
            ...pagination,
            pageSizeOptions: ['10', '100', '500', '1000'],
            total: records?.length,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
          onChange={handleTableChange}
          dataSource={records}
          columns={columns}
          className="custom-table first-row-header"
        />
      </Form>

      <div className="btns-block modal-footer">
        <Button type="primary" onClick={handleModalClose}>
          Ok
        </Button>
      </div>
    </Modal>
  );
};

export default PreviewExcel;
