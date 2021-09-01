import { Button, Col, Form, Modal, Row, Select, Spin } from 'antd';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import _ from 'lodash';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { ICmdbUserMap } from '../../../../services/cmdb/userMap/userMap.model';
import { ILookup } from '../../../../services/common/common.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import { getCmdbUserMapById, saveCmdbUserMap } from '../../../../store/cmdb/userMap/userMap.action';
import {
  clearCmdbUserMapGetById,
  clearCmdbUserMapMessages,
  cmdbUserMapSelector,
} from '../../../../store/cmdb/userMap/userMap.reducer';
import {
  getCmdbDeviceLookup,
  getCmdbUserLookup,
  getTenantLookup,
} from '../../../../store/common/common.action';
import {
  clearBULookUp,
  clearCompanyLookUp,
  commonSelector,
} from '../../../../store/common/common.reducer';
import { IAddCmdbUserMapProps } from './addUserMap.model';

const { Option } = Select;

const AddCmdbUserMapModal: React.FC<IAddCmdbUserMapProps> = (props) => {
  const cmdbUserMap = useAppSelector(cmdbUserMapSelector);
  const dispatch = useAppDispatch();
  const commonLookups = useAppSelector(commonSelector);
  const { id, showModal, handleModalClose, refreshDataTable } = props;

  const isNew: boolean = id ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.CmdbUserMap} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: ICmdbUserMap = {
    user_id: null,
    device_id: null,
    tenant_id: null,
  };

  const onFinish = (values: any) => {
    const inputValues: ICmdbUserMap = {
      ...values,
      id: id ? +id : null,
    };
    dispatch(saveCmdbUserMap(inputValues));
  };

  const fillValuesOnEdit = async (data: ICmdbUserMap) => {
    if (data) {
      initialValues = {
        user_id: _.isNull(data.user_id) ? null : data.user_id,
        device_id: _.isNull(data.device_id) ? null : data.device_id,
        tenant_id: _.isNull(data.tenant_id) ? null : data.tenant_id,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (cmdbUserMap.save.messages.length > 0) {
      if (cmdbUserMap.save.hasErrors) {
        toast.error(cmdbUserMap.save.messages.join(' '));
      } else {
        toast.success(cmdbUserMap.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearCmdbUserMapMessages());
    }
  }, [cmdbUserMap.save.messages]);

  useEffect(() => {
    if (+id > 0 && cmdbUserMap.getById.data) {
      const data = cmdbUserMap.getById.data;
      fillValuesOnEdit(data);
    }
  }, [cmdbUserMap.getById.data]);

  useEffect(() => {
    dispatch(getTenantLookup());
    dispatch(getCmdbDeviceLookup());
    dispatch(getCmdbUserLookup());
    if (+id > 0) {
      dispatch(getCmdbUserMapById(+id));
    }
    return () => {
      dispatch(clearCmdbUserMapGetById());
      dispatch(clearCompanyLookUp());
      dispatch(clearBULookUp());
    };
  }, [dispatch]);

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
        {cmdbUserMap.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={cmdbUserMap.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="cmdbUserMap"
            initialValues={initialValues}
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Row gutter={[30, 15]} className="form-label-hide">
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Tenant</label>
                  <Form.Item
                    name="tenant_id"
                    className="m-0"
                    label="Tenant"
                    rules={[{ required: true }]}
                  >
                    <Select
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
                      loading={commonLookups.tenantLookup.loading}
                    >
                      {commonLookups.tenantLookup.data.map((option: ILookup) => (
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
                  <label className="label">Device</label>
                  <Form.Item
                    name="device_id"
                    className="m-0"
                    label="Device"
                    rules={[{ required: true }]}
                  >
                    <Select
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
                      loading={commonLookups.cmdbDeviceLookup.loading}
                    >
                      {commonLookups.cmdbDeviceLookup.data.map((option: ILookup) => (
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
                  <label className="label">User</label>
                  <Form.Item
                    name="user_id"
                    className="m-0"
                    label="User"
                    rules={[{ required: true }]}
                  >
                    <Select
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
                      loading={commonLookups.cmdbUserLookup.loading}
                    >
                      {commonLookups.cmdbUserLookup.data.map((option: ILookup) => (
                        <Option key={option.id} value={option.id}>
                          {option.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <div className="btns-block modal-footer">
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={cmdbUserMap.save.loading}
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
export default AddCmdbUserMapModal;
