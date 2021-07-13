import { Form, Select, Spin } from 'antd';
import { useEffect } from 'react';
import { ILookup } from '../../../services/common/common.model';
import { useAppDispatch, useAppSelector } from '../../../store/app.hooks';
import {
  getGlobalTenantLookup,
  getGlobalCompanyLookup,
  getGlobalBULookup,
} from '../../../store/globalSearch/globalSearch.action';
import {
  clearGlobalBULookUp,
  clearGlobalCompanyLookUp,
  globalSearchSelector,
  setGlobalSearch,
} from '../../../store/globalSearch/globalSearch.reducer';

const GlobalSearch: React.FC = () => {
  const globalLookups = useAppSelector(globalSearchSelector);
  const dispatch = useAppDispatch();

  const [form] = Form.useForm();

  const handleTenantChange = (tenantId: number) => {
    form.setFieldsValue({ tenant_id: tenantId, company_id: null, bu_id: null });
    setGlobalSearchValues();
    if (tenantId) {
      dispatch(getGlobalCompanyLookup(tenantId));
      dispatch(clearGlobalBULookUp());
    } else {
      dispatch(clearGlobalCompanyLookUp());
      dispatch(clearGlobalBULookUp());
    }
  };

  const handleCompanyChange = (companyId: number) => {
    form.setFieldsValue({ company_id: companyId, bu_id: null });
    setGlobalSearchValues();
    if (companyId) {
      dispatch(getGlobalBULookup(companyId));
    } else {
      dispatch(clearGlobalBULookUp());
    }
  };

  const handleBUChange = (buId: number) => {
    form.setFieldsValue({ bu_id: buId });
    setGlobalSearchValues();
  };

  const setGlobalSearchValues = () => {
    const tenantId = form.getFieldValue('tenant_id');
    const companyId = form.getFieldValue('company_id');
    const buId = form.getFieldValue('bu_id');

    const searchValues = {
      tenant_id: tenantId ? tenantId : null,
      company_id: companyId ? companyId : null,
      bu_id: buId ? buId : null,
    };
    dispatch(setGlobalSearch(searchValues));
  };

  useEffect(() => {
    dispatch(getGlobalTenantLookup());
    form.setFieldsValue(globalLookups.search);
  }, [dispatch]);

  return (
    <>
      <Form
        form={form}
        initialValues={globalLookups.search}
        name="horizontal_filter"
        layout="inline"
      >
        <Form.Item name="tenant_id" className="mr-1">
          <Select
            placeholder="Filter by Tenant"
            onChange={handleTenantChange}
            suffixIcon={<img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />}
            allowClear
            notFoundContent={
              globalLookups.globalTenantLookup.data.length === 0 ? <Spin size="small" /> : null
            }
          >
            {globalLookups.globalTenantLookup.data.map((option: ILookup) => (
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
            notFoundContent={
              globalLookups.globalCompanyLookup.data.length === 0 ? <Spin size="small" /> : null
            }
          >
            {globalLookups.globalCompanyLookup.data.map((option: ILookup) => (
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
            notFoundContent={
              globalLookups.globalBULookup.data.length === 0 ? <Spin size="small" /> : null
            }
          >
            {globalLookups.globalBULookup.data.map((option: ILookup) => (
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
