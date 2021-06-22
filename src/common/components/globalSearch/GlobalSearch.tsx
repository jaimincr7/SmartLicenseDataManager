import { Form, Select } from 'antd';
import { useEffect } from 'react';
import { ILookup } from '../../../services/common/common.model';
import { useAppDispatch, useAppSelector } from '../../../store/app.hooks';
import {
  getBULookup,
  getCompanyLookup,
  getTenantLookup,
} from '../../../store/common/common.action';
import {
  clearBULookUp,
  clearCompanyLookUp,
  commonSelector,
} from '../../../store/common/common.reducer';

const GlobalSearch: React.FC = () => {
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();

  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log(values);
  };

  const handleTenantChange = (tenantId: number) => {
    form.setFieldsValue({ tenant: tenantId, company: null, bu: null });
    if (tenantId) {
      dispatch(getCompanyLookup(tenantId));
      dispatch(clearBULookUp());
    } else {
      dispatch(clearCompanyLookUp());
      dispatch(clearBULookUp());
    }
  };

  const handleCompanyChange = (companyId: number) => {
    form.setFieldsValue({ company: companyId, bu: null });
    if (companyId) {
      dispatch(getBULookup(companyId));
    } else {
      dispatch(clearBULookUp());
    }
  };

  const handleBUChange = (buId: number) => {
    form.setFieldsValue({ bu: buId });
  };

  useEffect(() => {
    dispatch(getTenantLookup());
    return () => {
      dispatch(clearCompanyLookUp());
      dispatch(clearBULookUp());
    };
  }, [dispatch]);

  return (
    <>
      <Form form={form} name="horizontal_filter" layout="inline" onFinish={onFinish}>
        <Form.Item name="tenant" className="mr-1">
          <Select
            placeholder="Filter by Tenant"
            onChange={handleTenantChange}
            suffixIcon={<img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />}
            allowClear
          >
            {commonLookups.tenantLookup.data.map((option: ILookup) => (
              <Select.Option key={option.id} value={option.id}>
                {option.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="company" className="mr-1">
          <Select
            placeholder="Filter by Company"
            onChange={handleCompanyChange}
            suffixIcon={<img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />}
            allowClear
          >
            {commonLookups.companyLookup.data.map((option: ILookup) => (
              <Select.Option key={option.id} value={option.id}>
                {option.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="bu" className="m-0">
          <Select
            placeholder="Filter by BU"
            onChange={handleBUChange}
            suffixIcon={<img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />}
            allowClear
          >
            {commonLookups.buLookup.data.map((option: ILookup) => (
              <Select.Option key={option.id} value={option.id}>
                {option.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </>
  );
};

export default GlobalSearch;
