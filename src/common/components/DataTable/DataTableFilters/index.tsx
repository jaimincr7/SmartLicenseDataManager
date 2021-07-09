import { Form, Input, Select, Spin, Button } from 'antd';
import { useState } from 'react';
import { IDropDownOption } from '../../../models/common';
import { DatePicker } from 'antd';
import React from 'react';
import commonService from '../../../../services/common/common.service';
import moment from 'moment';
import sqlServerLicenseDetailService from '../../../../services/sqlServer/sqlServerLicenseDetail/sqlServerLicenseDetail.service';
import windowsServerLicenseDetailService from '../../../../services/windowsServer/windowsServerLicenseDetail/windowsServerLicenseDetail.service';

const { RangePicker } = DatePicker;

export const FilterByDate = (dataIndex: string) => (
  <>
    <Form.Item name={dataIndex} className="m-0 filter-input lg">
      <RangePicker
        defaultPickerValue={[
          moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }),
          moment().set({ hour: 23, minute: 59, second: 59, millisecond: 999 }),
        ]}
      />
    </Form.Item>
  </>
);

export const FilterByInput = (dataIndex: string) => (
  <>
    <Form.Item name={dataIndex} className="m-0 filter-input">
      <Input placeholder="Search by keyword" className="form-control" autoComplete="off" />
    </Form.Item>
  </>
);

export const FilterByDropdown = (dataIndex: string, dropdownOptions: IDropDownOption[] = []) => (
  <>
    <Form.Item name={dataIndex} className="m-0 filter-input">
      <Select
        suffixIcon={<img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />}
        showArrow={true}
        mode="multiple"
        dropdownClassName="filter-dropdown-pop"
        placeholder="Select and search"
        maxTagCount="responsive"
        allowClear
        notFoundContent={dropdownOptions.length === 0 ? <Spin size="small" /> : null}
      >
        {dropdownOptions.map((option: IDropDownOption) => (
          <Select.Option key={option.name} value={option.id}>
            {option.name}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  </>
);

export const FilterWithSwapOption = (
  dataIndex: string,
  tableName: string,
  form: any,
  licenseId?: number
) => {
  const [swap, setSwap] = useState<boolean>(true);

  const [options, setOptions] = useState<IDropDownOption[]>([]);

  React.useEffect(() => {
    if (!swap && licenseId && options.length === 0) {
      if (tableName === 'vWindowsServerLicense') {
        windowsServerLicenseDetailService
          .getLicenseDetailColumnLookup(licenseId, dataIndex)
          .then((res) => {
            return res.body.data;
          })
          .then((res) => {
            setOptions(res);
          });
      } else if (tableName === 'vSqlServerLicense') {
        sqlServerLicenseDetailService
          .getLicenseDetailColumnLookup(licenseId, dataIndex)
          .then((res) => {
            return res.body.data;
          })
          .then((res) => {
            setOptions(res);
          });
      }
    }
    if (!swap && !licenseId && options.length === 0) {
      commonService
        .getColumnLookup(tableName, dataIndex)
        .then((res) => {
          return res.body.data;
        })
        .then((res) => {
          setOptions(res);
        });
    }
    if (form.getFieldValue(dataIndex)) {
      form.setFieldsValue({ [dataIndex]: undefined });
    }
  }, [swap]);
  return (
    <>
      <div className="input-filter-group">
        {swap ? FilterByInput(dataIndex) : FilterByDropdown(dataIndex, options || [])}
        <Button onClick={() => setSwap(!swap)} className={`filter-btn ${swap ? '' : 'active'}`}>
          <img src={`${process.env.PUBLIC_URL}/assets/images/ic-switch.svg`} alt="" />
          <img
            src={`${process.env.PUBLIC_URL}/assets/images/ic-switch-white.svg`}
            alt=""
            className="ovarlap"
          />
        </Button>
      </div>
    </>
  );
};

export const Filter = ({ onSearch }) => {
  const onFinish = (values: { keyword: string }) => {
    onSearch(values.keyword);
  };

  const [formKeyword] = Form.useForm();

  return (
    <>
      <Form form={formKeyword} name="horizontal_login" layout="inline" onFinish={onFinish}>
        <Form.Item name="keyword">
          <Input
            placeholder="Search by keyword"
            className="form-control sm-input"
            prefix={<img src={`${process.env.PUBLIC_URL}/assets/images/ic-search.svg`} alt="" />}
            // allowClear={true}
          />
        </Form.Item>
      </Form>
    </>
  );
};
