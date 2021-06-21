import { Form, Input, Select, Spin, Button } from 'antd';
import { useState } from 'react';
import { IDropDownOption } from '../../models/common';
import { SwapOutlined } from '@ant-design/icons';
import { DatePicker } from 'antd';
import React from 'react';

const { RangePicker } = DatePicker;

export const FilterByDate = (dataIndex: string) => (
  <>
    <Form.Item name={dataIndex} className="m-0 filter-input lg">
      <RangePicker />
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
  getColumnLookup: (index: string) => Promise<any>,
  form: any
) => {
  const [swap, setSwap] = useState(true);

  const [options, setOptions] = useState([]);

  React.useEffect(() => {
    if (!swap && options.length === 0) {
      getColumnLookup(dataIndex).then((res) => {
        setOptions(res);
      });
    }
    if (form.getFieldValue(dataIndex)) {
      form.setFieldsValue({ [dataIndex]: undefined });
    }
  }, [swap]);
  return (
    <>
      <div className="input-group">
        {swap ? FilterByInput(dataIndex) : FilterByDropdown(dataIndex, options || [])}
        <Button onClick={() => setSwap(!swap)} className="filter-btn">
          <SwapOutlined />
        </Button>
      </div>
    </>
  );
};
