import { Form, Select, Spin } from 'antd';
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

  const handleTenantChange = (tenantId: number) => {
    form.setFieldsValue({ tenant_id: tenantId, company_id: null, bu_id: null });
    setGlobalSearchValues();
    if (tenantId) {
      dispatch(getCompanyLookup(tenantId));
      dispatch(clearBULookUp());
    } else {
      dispatch(clearCompanyLookUp());
      dispatch(clearBULookUp());
    }
  };

  const handleCompanyChange = (companyId: number) => {
    form.setFieldsValue({ company_id: companyId, bu_id: null });
    setGlobalSearchValues();
    if (companyId) {
      dispatch(getBULookup(companyId));
    } else {
      dispatch(clearBULookUp());
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
    dispatch(getTenantLookup());
    form.setFieldsValue(commonLookups.search);
  }, [dispatch]);

  return (
    <>
      <Form
        form={form}
        initialValues={commonLookups.search}
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
              commonLookups.tenantLookup.data.length === 0 ? <Spin size="small" /> : null
            }
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
            notFoundContent={
              commonLookups.companyLookup.data.length === 0 ? <Spin size="small" /> : null
            }
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
            notFoundContent={
              commonLookups.buLookup.data.length === 0 ? <Spin size="small" /> : null
            }
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
