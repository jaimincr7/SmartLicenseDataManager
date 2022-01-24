import { Form, Col, Input, Row, Select, Spin, Switch } from 'antd';
import React, { useEffect } from 'react';
import { IWindowsServerLicense } from '../../../../../services/windowsServer/windowsServerLicense/windowsServerLicense.model';
import { useAppDispatch, useAppSelector } from '../../../../../store/app.hooks';
import {
  getAgreementTypesLookup,
  getBULookup,
  getCompanyLookup,
} from '../../../../../store/common/common.action';
import { commonSelector } from '../../../../../store/common/common.reducer';
import { getWindowsServerLicenseById } from '../../../../../store/windowsServer/windowsServerLicense/windowsServerLicense.action';
import {
  clearWindowsServerLicenseGetById,
  windowsServerLicenseSelector,
} from '../../../../../store/windowsServer/windowsServerLicense/windowsServerLicense.reducer';
import _ from 'lodash';
import { ILookup } from '../../../../../services/common/common.model';
import { IScenariosProps } from './scenarios.model';

const { Option } = Select;

const Scenarios: React.FC<IScenariosProps> = (props) => {
  const windowsServerLicense = useAppSelector(windowsServerLicenseSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const { licenseId } = props;

  let values: IWindowsServerLicense = {};

  const fillValuesOnEdit = async (data: IWindowsServerLicense) => {
    if (data.tenant_id) {
      await dispatch(getCompanyLookup(data.tenant_id));
    }
    if (data.company_id) {
      await dispatch(getBULookup(data.company_id));
    }

    if (data) {
      values = {
        company_id: _.isNull(data.company_id) ? null : data.company_id,
        bu_id: _.isNull(data.bu_id) ? null : data.bu_id,
        opt_agreement_type: _.isNull(data.opt_agreement_type) ? null : data.opt_agreement_type,
        notes: data.notes,
        opt_default_to_data_center_on_hosts: data.opt_default_to_data_center_on_hosts,
        opt_exclude_non_prod: data.opt_exclude_non_prod,
        opt_entitlements: data.opt_entitlements,
      };
      form.setFieldsValue(values);
    }
  };

  useEffect(() => {
    if (+licenseId > 0 && windowsServerLicense.getById.data) {
      const data = windowsServerLicense.getById.data;
      fillValuesOnEdit(data);
    }
  }, [windowsServerLicense.getById.data]);

  useEffect(() => {
    dispatch(getAgreementTypesLookup());

    if (+licenseId > 0) {
      dispatch(getWindowsServerLicenseById(+licenseId));
    }
    return () => {
      dispatch(clearWindowsServerLicenseGetById());
    };
  }, [dispatch]);

  return (
    <>
      <div className="windowsServer">
        <div className="title-block">
          <h4 className="p-0">Scenarios</h4>
        </div>
        {/* <div className="main-card"> */}
        {windowsServerLicense.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={windowsServerLicense.getById.loading} />
          </div>
        ) : (
          <Form form={form} name="addWindowsServerLicense" initialValues={values}>
            <Row gutter={[30, 15]} className="form-label-hide">
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Company</label>
                  <Form.Item name="company_id" className="m-0" label="Company">
                    <Select disabled suffixIcon={false}>
                      {commonLookups.companyLookup.data.map((option: ILookup) => (
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
                  <Form.Item name="bu_id" className="m-0" label="BU">
                    <Select disabled suffixIcon={false}>
                      {commonLookups.buLookup.data.map((option: ILookup) => (
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
                  <label className="label">Agreement Type</label>
                  <Form.Item name="opt_agreement_type" className="m-0" label="Agreement Type">
                    <Select disabled suffixIcon={false}>
                      {commonLookups.agreementTypesLookup.data.map((option: ILookup) => (
                        <Option key={option.id} value={option.id}>
                          {option.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="opt_exclude_non_prod" className="m-0" valuePropName="checked">
                    <Switch disabled className="form-control" />
                  </Form.Item>
                  <label className="label">Exclude Non-Prod</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item
                    name="opt_default_to_data_center_on_hosts"
                    className="m-0"
                    valuePropName="checked"
                  >
                    <Switch disabled className="form-control" />
                  </Form.Item>
                  <label className="label">Default to Datacenter on Hosts</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item name="opt_entitlements" className="m-0" valuePropName="checked">
                    <Switch disabled className="form-control" />
                  </Form.Item>
                  <label className="label">Assign Entitlements</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Selected Date</label>
                  <Form.Item name="selected_date" className="m-0">
                    <Input disabled className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24}>
                <div className="form-group m-0">
                  <label className="label">Notes</label>
                  <Form.Item name="notes" label="Notes" className="m-0">
                    <Input.TextArea disabled className="form-control" />
                  </Form.Item>
                </div>
              </Col>
            </Row>
          </Form>
        )}
        {/* </div> */}
      </div>
    </>
  );
};

export default Scenarios;
