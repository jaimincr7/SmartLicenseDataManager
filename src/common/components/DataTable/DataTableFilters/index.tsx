import { Form, Input, Select, Button } from 'antd';
import { useState } from 'react';
import { IDropDownOption } from '../../../models/common';
import { DatePicker } from 'antd';
import React from 'react';
import commonService from '../../../../services/common/common.service';
import moment from 'moment';
import { Common } from '../../../constants/common';

const { RangePicker } = DatePicker;

export const FilterByDate = (dataIndex: string) => (
  <>
    <Form.Item name={dataIndex} className="m-0 filter-input lg">
      <RangePicker defaultPickerValue={[moment().utc(), moment().utc()]} />
    </Form.Item>
  </>
);

export const FilterByDateSwap = (
  dataIndex: string,
  tableName: string,
  form: any,
  getColumnLookup?: (index: string) => Promise<any>,
  filter_keys?: any[],
  keyword?: string
) => {
  const [swap, setSwap] = useState<boolean>(true);

  const [options, setOptions] = useState<IDropDownOption[]>([]);

  React.useEffect(() => {
    if (!swap && options.length === 0) {
      if (getColumnLookup) {
        getColumnLookup(dataIndex).then((res) => {
          setOptions(res);
        });
      } else {
        commonService
          .getColumnLookup(tableName, dataIndex, filter_keys, keyword)
          .then((res) => {
            return res.body.data;
          })
          .then((res) => {
            const updatedRes = res?.map((element) => ({
              name: moment(element.name).format(Common.DATEFORMAT),
              id: element.id,
            }));
            setOptions(updatedRes);
          });
      }
    }
    if (form.getFieldValue(dataIndex)) {
      form.setFieldsValue({ [dataIndex]: undefined });
    }
  }, [swap]);
  return (
    <>
      <div className="input-filter-group">
        {swap ? (
          <Form.Item name={dataIndex} className="m-0 filter-input lg">
            <RangePicker defaultPickerValue={[moment().utc(), moment().utc()]} />
          </Form.Item>
        ) : (
          FilterByDropdown(dataIndex, options || [])
        )}
        <Button
          onClick={() => {
            if (form.getFieldValue(dataIndex)) {
              form.setFieldsValue({ [dataIndex]: undefined });
            }
            setSwap(!swap);
          }}
          className={`filter-btn ${swap ? '' : 'active'}`}
        >
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
        showArrow={true}
        mode="multiple"
        dropdownClassName="filter-dropdown-pop"
        placeholder="Select and search"
        maxTagCount="responsive"
        allowClear
        loading={dropdownOptions.length === 0}
        showSearch
        optionFilterProp="children"
        filterOption={(input, option: any) =>
          option.children?.toString()?.toLowerCase().indexOf(input?.toString()?.toLowerCase()) >= 0
        }
        filterSort={(optionA: any, optionB: any) =>
          optionA.children
            ?.toString()
            ?.toLowerCase()
            ?.localeCompare(optionB.children?.toString()?.toLowerCase())
        }
      >
        {dropdownOptions.map((option: IDropDownOption) => (
          <Select.Option key={`${option.name}-${option.id}`} value={option.id}>
            {option.name?.toString()}
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
  getColumnLookup?: (index: string) => Promise<any>,
  filter_keys?: any[],
  keyword?: string
) => {
  const [swap, setSwap] = useState<boolean>(true);

  const [options, setOptions] = useState<IDropDownOption[]>([]);

  React.useEffect(() => {
    if (!swap && options.length === 0) {
      if (getColumnLookup) {
        getColumnLookup(dataIndex).then((res) => {
          setOptions(res);
        });
      } else {
        commonService
          .getColumnLookup(tableName, dataIndex, filter_keys, keyword)
          .then((res) => {
            return res.body.data;
          })
          .then((res) => {
            setOptions(res);
          });
      }
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

let keywordSearchTimer = null;
export const Filter = ({ onSearch }) => {
  const onFinish = (values: { keyword: string }) => {
    onSearch(values.keyword);
  };

  const handleChange = (e) => {
    if (keywordSearchTimer) {
      clearTimeout(keywordSearchTimer);
    }
    keywordSearchTimer = setTimeout(() => {
      onFinish({ keyword: e.target.value });
    }, 1000);
  };

  const [formKeyword] = Form.useForm();

  return (
    <>
      <Form form={formKeyword} name="horizontal_login" layout="inline" onFinish={onFinish}>
        <Form.Item name="keyword">
          <Input
            onChange={handleChange}
            placeholder="Search by keyword"
            className="form-control sm-input"
            prefix={<img src={`${process.env.PUBLIC_URL}/assets/images/ic-search.svg`} alt="" />}
            allowClear={true}
          />
        </Form.Item>
      </Form>
    </>
  );
};
