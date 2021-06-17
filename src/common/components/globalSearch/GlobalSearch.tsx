import { Select } from 'antd';

const GlobalSearch: React.FC = () => {
  return (
    <>
      <Select
        placeholder="Filter by Tenant"
        suffixIcon={<img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />}
      >
        <Select.Option value="1">John Smith</Select.Option>
        <Select.Option value="2">John Smith</Select.Option>
        <Select.Option value="3">John Smith</Select.Option>
      </Select>
      <Select
        placeholder="Filter by Company"
        suffixIcon={<img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />}
      >
        <Select.Option value="1">John Smith</Select.Option>
        <Select.Option value="2">John Smith</Select.Option>
        <Select.Option value="3">John Smith</Select.Option>
      </Select>
      <Select
        placeholder="Filter by BU"
        suffixIcon={<img src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`} alt="" />}
      >
        <Select.Option value="1">John Smith</Select.Option>
        <Select.Option value="2">John Smith</Select.Option>
        <Select.Option value="3">John Smith</Select.Option>
      </Select>
    </>
  );
};

export default GlobalSearch;
