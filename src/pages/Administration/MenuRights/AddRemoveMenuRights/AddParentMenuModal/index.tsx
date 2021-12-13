import { Button, Col, Form, Input, Modal, Row, Select, Switch } from 'antd';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../../../../store/app.hooks';
import { IAddParentMenuModalProps } from './addData.model';
import {
  clearAddParentMenuMessages,
  menuSelector,
} from '../../../../../store/administration/menu/menu.reducer';
import { addParentMenu } from '../../../../../store/administration/menu/menu.action';
import { validateMessages } from '../../../../../common/constants/common';
import { ILookup } from '../../../../../services/common/common.model';
import { IAddParentMenu } from '../../../../../services/administration/menu/menu.model';
import commonService from '../../../../../services/common/common.service';

const { Option } = Select;

const filterObj = {
  table_name: 'Menu',
  column_name: 'icon',
  filter_keys: {},
  limit: 0,
  offset: 0,
  order_by: 'icon',
  order_direction: 'ASC',
  keyword: '',
  is_column_selection: false,
};

const AddParentMenuModal: React.FC<IAddParentMenuModalProps> = (props) => {
  const menuAccessRights = useAppSelector(menuSelector);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);

  const { showModal, handleModalClose, refreshDataTable } = props;

  const [form] = Form.useForm();

  const initialValues = {
    description: '',
    icon: '',
    status: true,
  };

  const onFinish = (values: IAddParentMenu) => {
    dispatch(addParentMenu(values));
  };

  useEffect(() => {
    if (menuAccessRights.addParentMenu.messages.length > 0) {
      if (menuAccessRights.addParentMenu.hasErrors) {
        toast.error(menuAccessRights.addParentMenu.messages.join(' '));
      } else {
        toast.success(menuAccessRights.addParentMenu.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearAddParentMenuMessages());
    }
  }, [menuAccessRights.addParentMenu.messages]);

  useEffect(() => {
    commonService
      .getColumnLookup(filterObj)
      .then((res) => {
        return res.body.data;
      })
      .then((res) => {
        setLoading(false);
        setOptions(res);
      });
  }, [dispatch]);

  return (
    <>
      <Modal
        wrapClassName="custom-modal"
        title="Add Parent Menu"
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
                <label className="label">Description</label>
                <Form.Item
                  name="description"
                  label="Description"
                  className="m-0"
                  rules={[{ required: true }]}
                >
                  <Input className="form-control" />
                </Form.Item>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="form-group m-0">
                <label className="label">Icon</label>
                <Form.Item name="icon" className="m-0" label="Icon" rules={[{ required: true }]}>
                  <Select
                    placeholder="Select Icon"
                    loading={loading}
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
                    {options.map((option: ILookup) => (
                      <Option key={option.id} value={option.id}>
                        {option.name === 'NULL' ? (
                          <>None</>
                        ) : (
                          <>
                            <img
                              className="icon-box-select"
                              src={`${process.env.PUBLIC_URL}/assets/images/${option?.name}`}
                              alt=""
                            />
                          </>
                        )}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="form-group m-0">
                <label className="label">Status</label>
                <Form.Item name="status" className="m-0 mr-1" valuePropName="checked">
                  <Switch className="form-control" />
                </Form.Item>
              </div>
            </Col>
          </Row>
          <div className="btns-block modal-footer pt-lg">
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              loading={menuAccessRights.addParentMenu.loading}
            >
              Add Parent Menu
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
export default AddParentMenuModal;
