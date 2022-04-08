import { Form, Input, Select, Button } from 'antd';
import { useState } from 'react';
import { IDropDownOption } from '../../../models/common';
import { DatePicker } from 'antd';
import React from 'react';
import commonService from '../../../../services/common/common.service';
import moment from 'moment';
import { Common } from '../../../constants/common';
import { forDropDown, getOnlyTime, getSimpleDate } from '../../../helperFunction';

const { RangePicker } = DatePicker;

export const FilterByDate = (dataIndex: string) => (
  <>
    <Form.Item name={dataIndex} className="m-0 filter-input lg">
      <RangePicker defaultPickerValue={[getSimpleDate(true), getSimpleDate(true)]} />
    </Form.Item>
  </>
);

export const FilterByDateSwap = (
  dataIndex: string,
  tableName: string,
  form: any,
  getColumnLookup?: (index: string) => Promise<any>,
  ObjectForColumnFilter?: {},
  disableSwitch?: boolean,
  timeToUtc?: boolean
) => {
  const [dropSearch, setDropSearch] = React.useState(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [swap, setSwap] = useState<boolean>(true);

  const [options, setOptions] = useState<IDropDownOption[]>([]);

  const time = moment().utcOffset(0);
  const time2 = moment().utcOffset(0);
  time.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
  time2.set({ hour: 23, minute: 59, second: 59, millisecond: 999 });

  // const inlineSearchFilter = _.pickBy(filter_keys, function (value) {
  //   return !(
  //     value === undefined ||
  //     value === '' ||
  //     _.isNull(value) ||
  //     (Array.isArray(value) && value.length === 0)
  //   );
  // });

  React.useEffect(() => {
    if (form.getFieldValue(dataIndex)) {
      form.setFieldsValue({ [dataIndex]: undefined });
    }
  }, [swap]);

  React.useEffect(() => {
    if (dataIndex === 'date_added') setSwap(false);
    if (!swap) {
      if (getColumnLookup) {
        setLoading(true);
        const obj: any = {
          ...ObjectForColumnFilter,
        };
        const filterOBJ: any = {
          table_name: tableName,
          column_name: dataIndex,
          filter_keys: obj.filter_keys,
          limit: obj.limit,
          offset: obj.offset,
          order_by: obj.order_by,
          order_direction: obj.order_direction,
          keyword: obj.keyword,
          is_column_selection: false,
          current_user: {},
        };
        getColumnLookup(filterOBJ).then((res) => {
          setLoading(false);
          setOptions(res);
        });
      } else {
        const obj: any = {
          ...ObjectForColumnFilter,
          table_name: tableName,
          column_name: dataIndex,
        };
        if (!obj?.column_called?.includes(dataIndex)) {
          setLoading(true);
          obj.column_called?.push(dataIndex);
          const filterOBJ: any = {
            table_name: tableName,
            column_name: dataIndex,
            filter_keys: obj.filter_keys,
            limit: obj.limit,
            offset: obj.offset,
            order_by: obj.order_by,
            order_direction: obj.order_direction,
            keyword: obj.keyword,
            is_column_selection: false,
            current_user: {},
          };
          commonService
            .getColumnLookup(filterOBJ)
            .then((res) => {
              return res.body.data;
            })
            .then((res) => {
              setLoading(false);
              setOptions(res);
            });
        }
      }
    }
  }, [dropSearch]);

  const handleDropSearch = (e) => {
    if (e) {
      setDropSearch(!dropSearch);
    }
  };
  return (
    <>
      <div className="input-filter-group">
        {swap ? (
          timeToUtc ? (
            <Form.Item name={dataIndex} className="m-0 filter-input lg">
              <RangePicker
                defaultPickerValue={[
                  moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }),
                  moment().set({ hour: 23, minute: 59, second: 59, millisecond: 999 }),
                ]}
              />
            </Form.Item>
          ) : (
            <Form.Item name={dataIndex} className="m-0 filter-input lg">
              <RangePicker defaultPickerValue={[time, time2]} />
            </Form.Item>
          )
        ) : (
          FilterByDropdown(
            dataIndex,
            options || [],
            loading,
            handleDropSearch,
            true,
            false,
            false,
            timeToUtc
          )
        )}
        {disableSwitch === true ? (
          <></>
        ) : (
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
        )}
      </div>
    </>
  );
};

export const FilterByInput = (dataIndex: string, wantColumnLengthOpt?: boolean) => (
  <>
    <Form.Item name={dataIndex} className={`m-0 filter-input ${wantColumnLengthOpt ? 'sm' : ''}`}>
      <Input
        placeholder={wantColumnLengthOpt ? 'Search' : 'Search by keyword'}
        className="form-control"
        autoComplete="off"
      />
    </Form.Item>
  </>
);

export const FilterByDropdown = (
  dataIndex: string,
  dropdownOptions: IDropDownOption[] = [],
  loading?: boolean,
  setDropSearch?: (e: any) => void,
  isDateDropDown?: boolean,
  isTime?: boolean,
  wantColumnLengthOpt?: boolean,
  timeToUtc?: boolean
) => (
  <>
    <Form.Item name={dataIndex} className={`m-0 filter-input ${wantColumnLengthOpt ? 'sm' : ''}`}>
      <Select
        onDropdownVisibleChange={setDropSearch}
        showArrow={true}
        mode="multiple"
        dropdownClassName="filter-dropdown-pop"
        placeholder={wantColumnLengthOpt ? 'Select' : 'Select and search'}
        maxTagCount="responsive"
        allowClear
        loading={loading}
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
        {(loading ? [] : dropdownOptions).map((option: IDropDownOption) => (
          <Select.Option key={`${option.name}-${option.id}`} value={option.id}>
            {timeToUtc === true
              ? isDateDropDown
                ? moment(option.name).format(Common.DATEFORMAT)?.toString() == 'Invalid date'
                  ? 'NULL'
                  : moment(option.name).format(Common.DATEFORMAT)
                : isTime
                ? moment(option.name).utc().format('HH:MM:SS').toString()
                : option.name?.toString()
              : isDateDropDown
              ? forDropDown(option.name) == 'Invalid date'
                ? 'NULL'
                : forDropDown(option.name)
              : isTime
              ? getOnlyTime(option.name)
              : option.name?.toString()}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  </>
);

export const FilterByBooleanDropDown = (
  dataIndex: string,
  tableName: string,
  ObjectForColumnFilter?: {}
) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [dropSearch, setDropSearch] = React.useState(false);
  const [option, setOption] = useState<IDropDownOption[]>([]);

  React.useEffect(() => {
    const obj: any = {
      ...ObjectForColumnFilter,
    };
    if (obj.column_called && !obj.column_called?.includes(dataIndex)) {
      setLoading(true);
      obj.column_called?.push(dataIndex);
      const filterOBJ: any = {
        table_name: tableName,
        column_name: dataIndex,
        filter_keys: obj.filter_keys,
        limit: obj.limit,
        offset: obj.offset,
        order_by: obj.order_by,
        order_direction: obj.order_direction,
        keyword: obj.keyword,
        is_column_selection: false,
        current_user: {},
      };
      commonService
        .getColumnLookup(filterOBJ)
        .then((res) => {
          return res.body.data;
        })
        .then((res) => {
          setLoading(false);
          setOption(res);
        });
    }
  }, [dropSearch]);

  const handleDropSearch = (e) => {
    if (e) {
      setDropSearch(!dropSearch);
    }
  };

  return (
    <>
      <Form.Item name={dataIndex} className="m-0 filter-input sm">
        <Select
          onDropdownVisibleChange={handleDropSearch}
          showArrow={true}
          mode="multiple"
          dropdownClassName="filter-dropdown-pop"
          placeholder="Select"
          maxTagCount="responsive"
          allowClear
          loading={loading}
          showSearch
          optionFilterProp="children"
          filterOption={(input, option: any) =>
            option.children?.toString()?.toLowerCase().indexOf(input?.toString()?.toLowerCase()) >=
            0
          }
          filterSort={(optionA: any, optionB: any) =>
            optionA.children
              ?.toString()
              ?.toLowerCase()
              ?.localeCompare(optionB.children?.toString()?.toLowerCase())
          }
        >
          {(loading ? [] : option).map((option: IDropDownOption) => (
            <Select.Option key={`${option.name}-${option.id}`} value={option.id}>
              {option.name?.toString() === 'true'
                ? 'Yes'
                : option.name?.toString() === 'false'
                ? 'No'
                : 'NULL'}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </>
  );
};

export const FilterWithSwapOption = (
  dataIndex: string,
  tableName: string,
  form: any,
  getColumnLookup?: (index: string) => Promise<any>,
  ObjectForColumnFilter?: {},
  isTime?: boolean,
  wantColumnLengthOpt?: boolean
) => {
  const [swap, setSwap] = useState<boolean>(true);
  const [dropSearch, setDropSearch] = React.useState(false);

  const [loading, setLoading] = useState<boolean>(false);

  const [options, setOptions] = useState<IDropDownOption[]>([]);

  React.useEffect(() => {
    if (form.getFieldValue(dataIndex)) {
      form.setFieldsValue({ [dataIndex]: undefined });
    }
  }, [swap]);

  React.useEffect(() => {
    if (!swap) {
      if (getColumnLookup) {
        setLoading(true);
        const obj: any = {
          ...ObjectForColumnFilter,
        };
        const filterOBJ: any = {
          table_name: tableName,
          column_name: dataIndex,
          filter_keys: obj.filter_keys,
          limit: obj.limit,
          offset: obj.offset,
          order_by: obj.order_by,
          order_direction: obj.order_direction,
          keyword: obj.keyword,
          is_column_selection: false,
          current_user: {},
        };
        getColumnLookup(filterOBJ).then((res) => {
          setOptions(res);
          setLoading(false);
        });
      } else {
        const obj: any = {
          ...ObjectForColumnFilter,
        };
        if (!obj.column_called?.includes(dataIndex)) {
          setLoading(true);
          obj.column_called?.push(dataIndex);
          const filterOBJ: any = {
            table_name: tableName,
            column_name: dataIndex,
            filter_keys: obj.filter_keys,
            limit: obj.limit,
            offset: obj.offset,
            order_by: obj.order_by,
            order_direction: obj.order_direction,
            keyword: obj.keyword,
            is_column_selection: false,
            current_user: {},
          };
          commonService
            .getColumnLookup(filterOBJ)
            .then((res) => {
              return res.body.data;
            })
            .then((res) => {
              setLoading(false);
              setOptions(res);
            });
        }
      }
    }
  }, [dropSearch]);

  const handleDropSearch = (e) => {
    if (e) {
      setDropSearch(!dropSearch);
    }
  };
  return (
    <>
      <div className="input-filter-group">
        {swap
          ? FilterByInput(dataIndex, wantColumnLengthOpt)
          : FilterByDropdown(
              dataIndex,
              options || [],
              loading,
              handleDropSearch,
              false,
              isTime,
              wantColumnLengthOpt
            )}
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
