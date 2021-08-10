import { Button, Col, Form, Input, Modal, Row, Spin, Switch, TreeSelect } from 'antd';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { IMenu } from '../../../../services/administration/menu/menu.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import { saveMenu } from '../../../../store/administration/menu/menu.action';
import {
  clearMenuMessages,
  menuSelector,
} from '../../../../store/administration/menu/menu.reducer';
import { IEditMenuModal } from './editMenu.model';

const EditMenuModal: React.FC<IEditMenuModal> = (props) => {
  const menuReduxStore = useAppSelector(menuSelector);
  const dispatch = useAppDispatch();

  const { selectedMenu, showModal, handleModalClose, refreshDataTable, parentMenu } = props;

  const isNew: boolean = selectedMenu?.id ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.Menu} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IMenu = {
    description: '',
    status: true,
  };

  const onFinish = (values: any) => {
    const inputValues: IMenu = {
      ...values,
      id: selectedMenu?.id ? +selectedMenu.id : null,
    };
    dispatch(saveMenu(inputValues));
  };

  const fillValuesOnEdit = async (data: IMenu) => {
    if (data) {
      initialValues = {
        description: data.description,
        status: data.status,
        parent_menu_id: data.parent_menu_id,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (menuReduxStore.save.messages.length > 0) {
      if (menuReduxStore.save.hasErrors) {
        toast.error(menuReduxStore.save.messages.join(' '));
      } else {
        toast.success(menuReduxStore.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearMenuMessages());
    }
  }, [menuReduxStore.save.messages]);

  useEffect(() => {
    if (selectedMenu && +selectedMenu.id > 0) {
      const data = selectedMenu;
      fillValuesOnEdit(data);
    }
  }, [selectedMenu]);

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
        {menuReduxStore.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={menuReduxStore.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="editMenu"
            initialValues={initialValues}
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Row gutter={[30, 15]} className="form-label-hide">
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Menu Title</label>
                  <Form.Item
                    name="description"
                    className="m-0"
                    label="Menu Title"
                    rules={[{ required: true }]}
                  >
                    <Input className="form-control w-100" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Parent Menu</label>
                  <Form.Item name="parent_menu_id" className="m-0" label="Parent Menu">
                    <TreeSelect
                      style={{ width: '100%' }}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      treeData={parentMenu}
                      placeholder="Default: No parent"
                      treeDefaultExpandAll
                      allowClear
                    />
                    {/* <Select
                      allowClear
                      suffixIcon={
                        <img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />
                      }
                    >
                      {parentMenu.map((option: ILookup) => (
                        <Option key={option.id} value={option.id}>
                          {option.name}
                        </Option>
                      ))}
                    </Select> */}
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Status</label>
                  <Form.Item
                    name="status"
                    className="m-0"
                    label="Status"
                    valuePropName="checked"
                    rules={[{ required: true }]}
                  >
                    <Switch />
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={menuReduxStore.save.loading}
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
export default EditMenuModal;
