import { Button, Checkbox, Col, Form, Input, Modal, Row, Spin } from 'antd';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { getObjectForUpdateMultiple } from '../../../../common/helperFunction';
import { IConfigLicenseUnits } from '../../../../services/master/licenseUnits/licenseUnits.model';
import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import { updateMultiple } from '../../../../store/common/common.action';
import {
  clearMultipleUpdateMessages,
  commonSelector,
} from '../../../../store/common/common.reducer';
import {
  getConfigLicenseUnitsById,
  saveConfigLicenseUnits,
} from '../../../../store/master/licenseUnits/licenseUnits.action';
import {
  clearConfigLicenseUnitsGetById,
  clearConfigLicenseUnitsMessages,
  configLicenseUnitsSelector,
} from '../../../../store/master/licenseUnits/licenseUnits.reducer';
import { IAddConfigLicenseUnitsProps } from './addLicenseUnits.model';

const AddConfigLicenseUnitsModal: React.FC<IAddConfigLicenseUnitsProps> = (props) => {
  const configLicenseUnits = useAppSelector(configLicenseUnitsSelector);
  const common = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const { id, showModal, handleModalClose, refreshDataTable, isMultiple, valuesForSelection } =
    props;

  const isNew: boolean = id || isMultiple ? false : true;
  const title = useMemo(() => {
    return (
      <>
        {isNew ? 'Add ' : 'Edit '} <BreadCrumbs pageName={Page.ConfigLicenseUnits} level={1} />
      </>
    );
  }, [isNew]);
  const submitButtonText = useMemo(() => {
    return isNew ? 'Save' : 'Update';
  }, [isNew]);

  const [form] = Form.useForm();

  let initialValues: IConfigLicenseUnits = {
    license_unit: '',
  };

  const onFinish = (values: any) => {
    const inputValues: IConfigLicenseUnits = {
      ...values,
      id: id ? +id : null,
    };
    if (!isMultiple) {
      dispatch(saveConfigLicenseUnits(inputValues));
    } else {
      const result = getObjectForUpdateMultiple(
        valuesForSelection,
        inputValues,
        configLicenseUnits.search.tableName
      );
      if (result) {
        dispatch(updateMultiple(result));
      }
    }
  };

  const fillValuesOnEdit = async (data: IConfigLicenseUnits) => {
    if (data) {
      initialValues = {
        license_unit: data.license_unit,
      };
      form.setFieldsValue(initialValues);
    }
  };

  useEffect(() => {
    if (configLicenseUnits.save.messages.length > 0) {
      if (configLicenseUnits.save.hasErrors) {
        toast.error(configLicenseUnits.save.messages.join(' '));
      } else {
        toast.success(configLicenseUnits.save.messages.join(' '));
        handleModalClose();
        refreshDataTable();
      }
      dispatch(clearConfigLicenseUnitsMessages());
    }
  }, [configLicenseUnits.save.messages]);

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
    if (+id > 0 && configLicenseUnits.getById.data) {
      const data = configLicenseUnits.getById.data;
      fillValuesOnEdit(data);
    }
  }, [configLicenseUnits.getById.data]);

  useEffect(() => {
    if (+id > 0) {
      dispatch(getConfigLicenseUnitsById(+id));
    }
    return () => {
      dispatch(clearConfigLicenseUnitsGetById());
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
        {configLicenseUnits.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={configLicenseUnits.getById.loading} />
          </div>
        ) : (
          <Form
            form={form}
            name="configLicenseUnits"
            initialValues={initialValues}
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Row gutter={[30, 15]} className="form-label-hide">
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  {isMultiple ? (
                    <Form.Item name={['checked', 'license_unit']} valuePropName="checked" noStyle>
                      <Checkbox>License Unit</Checkbox>
                    </Form.Item>
                  ) : (
                    'License Unit'
                  )}
                  <Form.Item
                    name="license_unit"
                    label="License Unit"
                    className="m-0"
                    rules={[{ required: !isMultiple, max: 255 }]}
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
                loading={configLicenseUnits.save.loading || common.save.loading}
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
export default AddConfigLicenseUnitsModal;
