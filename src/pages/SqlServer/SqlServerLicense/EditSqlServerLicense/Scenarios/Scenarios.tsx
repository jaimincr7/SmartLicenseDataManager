import { Form, Col, Input, Row, Select, Spin, Switch } from 'antd';
import React, { useEffect } from 'react';
import { ISqlServerLicense } from '../../../../../services/sqlServer/sqlServerLicense/sqlServerLicense.model';
import { useAppDispatch, useAppSelector } from '../../../../../store/app.hooks';
import {
  getAgreementTypesLookup,
  getBULookup,
  getCompanyLookup,
  getTenantLookup,
} from '../../../../../store/common/common.action';
import { commonSelector } from '../../../../../store/common/common.reducer';
import { getSqlServerLicenseById } from '../../../../../store/sqlServer/sqlServerLicense/sqlServerLicense.action';
import {
  clearSqlServerLicenseGetById,
  sqlServerLicenseSelector,
} from '../../../../../store/sqlServer/sqlServerLicense/sqlServerLicense.reducer';
import _ from 'lodash';
import { ILookup } from '../../../../../services/common/common.model';
import { IScenariosProps } from './scenarios.model';

const { Option } = Select;

const Scenarios: React.FC<IScenariosProps> = (props) => {
  const sqlServerLicense = useAppSelector(sqlServerLicenseSelector);
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const { licenseId } = props;

  let values: ISqlServerLicense = {};

  const fillValuesOnEdit = async (data: ISqlServerLicense) => {
    if (data.tenant_id) {
      await dispatch(getCompanyLookup(data.tenant_id));
    }
    if (data.company_id) {
      await dispatch(getBULookup(data.company_id));
    }

    if (data) {
      values = {
        tenant_id: _.isNull(data.tenant_id) ? null : data.tenant_id,
        company_id: _.isNull(data.company_id) ? null : data.company_id,
        bu_id: _.isNull(data.bu_id) ? null : data.bu_id,
        opt_agreement_type: _.isNull(data.opt_agreement_type) ? null : data.opt_agreement_type,
        notes: data.notes,
        opt_default_to_enterprise_on_hosts: data.opt_default_to_enterprise_on_hosts,
        opt_cluster_logic: data.opt_cluster_logic,
        opt_exclude_non_prod: data.opt_exclude_non_prod,
        opt_entitlements: data.opt_entitlements,
      };
      form.setFieldsValue(values);
    }
  };

  useEffect(() => {
    if (+licenseId > 0 && sqlServerLicense.getById.data) {
      const data = sqlServerLicense.getById.data;
      fillValuesOnEdit(data);
    }
  }, [sqlServerLicense.getById.data]);

  useEffect(() => {
    dispatch(getTenantLookup());
    dispatch(getAgreementTypesLookup());

    if (+licenseId > 0) {
      dispatch(getSqlServerLicenseById(+licenseId));
    }
    return () => {
      dispatch(clearSqlServerLicenseGetById());
    };
  }, [dispatch]);

  return (
    <>
      <div className="sqlServer">
        <div className="title-block">
          <h4 className="p-0">Scenarios</h4>
        </div>
        {/* <div className="main-card"> */}
        {sqlServerLicense.getById.loading ? (
          <div className="spin-loader">
            <Spin spinning={sqlServerLicense.getById.loading} />
          </div>
        ) : (
          <Form form={form} name="addSqlServerLicense" initialValues={values}>
            <Row gutter={[30, 15]} className="form-label-hide">
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Company</label>
                  <Form.Item name="company_id" className="m-0" label="Company">
                    <Select
                      disabled
                      suffixIcon={false}
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
                    <Select
                      disabled
                      suffixIcon={false}
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
                  <label className="label">Selected Date</label>
                  <Form.Item name="date_added" className="m-0">
                    <Input disabled className="form-control" />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group m-0">
                  <label className="label">Agreement Type</label>
                  <Form.Item name="opt_agreement_type" className="m-0" label="Agreement Type">
                    <Select
                      disabled
                      suffixIcon={false}
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
                  <Form.Item name="opt_cluster_logic" className="m-0" valuePropName="checked">
                    <Switch disabled className="form-control" />
                  </Form.Item>
                  <label className="label">Cluster Logic</label>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="form-group form-inline-pt m-0">
                  <Form.Item
                    name="opt_default_to_enterprise_on_hosts"
                    className="m-0"
                    valuePropName="checked"
                  >
                    <Switch disabled className="form-control" />
                  </Form.Item>
                  <label className="label">Default to Enterprise on Hosts</label>
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
