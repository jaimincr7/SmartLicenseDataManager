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
  setGlobalSearch,
} from '../../../store/common/common.reducer';

const GlobalSearch: React.FC = () => {
  const commonLookups = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();

  const [form] = Form.useForm();

  let searchValues = {
    tenant_id: null,
    company_id: null,
    bu_id: null,
  };

  const handleTenantChange = (tenantId: number) => {
    searchValues = {
      ...searchValues,
      tenant_id: tenantId ? tenantId : null,
    };

    form.setFieldsValue({ tenant_id: tenantId, company_id: null, bu_id: null });
    dispatch(setGlobalSearch(searchValues));
    if (tenantId) {
      dispatch(getCompanyLookup(tenantId));
      dispatch(clearBULookUp());
    } else {
      dispatch(clearCompanyLookUp());
      dispatch(clearBULookUp());
    }
  };

  const handleCompanyChange = (companyId: number) => {
    const tenantId = form.getFieldValue('tenant_id');
    searchValues = {
      ...searchValues,
      tenant_id: tenantId ? tenantId : null,
      company_id: companyId ? companyId : null,
    };

    form.setFieldsValue({ company_id: companyId, bu: null });
    dispatch(setGlobalSearch(searchValues));
    if (companyId) {
      dispatch(getBULookup(companyId));
    } else {
      dispatch(clearBULookUp());
    }
  };

  const handleBUChange = (buId: number) => {
    const tenantId = form.getFieldValue('tenant_id');
    const companyId = form.getFieldValue('company_id');
    searchValues = {
      tenant_id: tenantId ? tenantId : null,
      company_id: companyId ? companyId : null,
      bu_id: buId ? buId : null,
    };
    form.setFieldsValue({ bu_id: buId });
    dispatch(setGlobalSearch(searchValues));
  };

  useEffect(() => {
    dispatch(getTenantLookup());
    form.setFieldsValue(commonLookups.search);
  }, [dispatch]);

  return (
    <>
      <Form form={form} initialValues={commonLookups.search} name="horizontal_filter" layout="inline">
        <Form.Item name="tenant_id" className="mr-1">
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
        <Form.Item name="company_id" className="mr-1">
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
        <Form.Item name="bu_id" className="m-0">
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
