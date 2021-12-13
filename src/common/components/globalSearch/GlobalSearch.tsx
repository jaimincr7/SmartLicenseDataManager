import { DatePicker, Form, Select } from 'antd';
import moment from 'moment';
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
import { IGlobalSearchProps } from './globalSearch.model';

const GlobalSearch: React.FC<IGlobalSearchProps> = (props) => {
  const { isDateAdded } = props;
  const globalLookups = useAppSelector(globalSearchSelector);
  const dispatch = useAppDispatch();

  const [form] = Form.useForm();

  const initialValues = {
    tenant_id: 0,
    company_id: 0,
    bu_id: 0,
  };

  const handleTenantChange = (tenantId: number) => {
    form.setFieldsValue({ tenant_id: tenantId, company_id: 0, bu_id: 0 });
    setGlobalSearchValues();
    if (tenantId) {
      dispatch(getGlobalCompanyLookup(tenantId));
      dispatch(clearGlobalBULookUp());
    } else {
      dispatch(clearGlobalCompanyLookUp());
      dispatch(clearGlobalBULookUp());
    }
  };

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current > moment().endOf('day');
  };

  const handleCompanyChange = (companyId: number) => {
    form.setFieldsValue({ company_id: companyId, bu_id: 0 });
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
    const date_added = form.getFieldValue('date_added');

    const searchValues = {
      tenant_id: tenantId ? tenantId : 0,
      company_id: companyId ? companyId : 0,
      bu_id: buId ? buId : 0,
      date_added: isDateAdded ? (date_added ? date_added : null) : null,
    };
    dispatch(setGlobalSearch(searchValues));
  };

  useEffect(() => {
    dispatch(getGlobalTenantLookup());
    form.setFieldsValue(globalLookups.search);
  }, [dispatch]);

  return (
    <>
      <Form form={form} initialValues={initialValues} name="horizontal_filter" layout="inline">
        <Form.Item name="tenant_id" className="mr-1">
          <Select
            placeholder="Filter by Tenant"
            onChange={handleTenantChange}
            loading={globalLookups.globalTenantLookup.loading}
            allowClear
            showSearch
            optionFilterProp="children"
            filterOption={(input, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            filterSort={(optionA: any, optionB: any) =>
              optionA.children?.toLowerCase()?.localeCompare(optionB.children?.toLowerCase())
            }
          >
            <Select.Option key={'All'} value={0}>
              All
            </Select.Option>
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
            loading={globalLookups.globalCompanyLookup.loading}
            allowClear
            showSearch
            optionFilterProp="children"
            filterOption={(input, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            filterSort={(optionA: any, optionB: any) =>
              optionA.children?.toLowerCase()?.localeCompare(optionB.children?.toLowerCase())
            }
          >
            <Select.Option key={'All'} value={0}>
              All
            </Select.Option>
            {globalLookups.globalCompanyLookup.data.map((option: ILookup) => (
              <Select.Option key={option.id} value={option.id}>
                {option.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="bu_id" className="mr-1">
          <Select
            placeholder="Filter by BU"
            onChange={handleBUChange}
            loading={globalLookups.globalBULookup.loading}
            allowClear
            showSearch
            optionFilterProp="children"
            filterOption={(input, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            filterSort={(optionA: any, optionB: any) =>
              optionA.children?.toLowerCase()?.localeCompare(optionB.children?.toLowerCase())
            }
          >
            <Select.Option key={'All'} value={0}>
              All
            </Select.Option>
            {globalLookups.globalBULookup.data.map((option: ILookup) => (
              <Select.Option key={option.id} value={option.id}>
                {option.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        {isDateAdded ? <Form.Item
          name="date_added"
          className="m-0"
        >
          <DatePicker placeholder="Select Date Added" disabledDate={disabledDate} />
        </Form.Item>
       : <></>}
       </Form>
    </>
  );
};

export default GlobalSearch;
