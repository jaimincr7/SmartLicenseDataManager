import { Table, Input, Button, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import React from 'react';
import { Link } from 'react-router-dom';

const data = [
  {
    key: '1',
    Tenant: 'Wade Warren',
    Company: 'Apple',
    BU: 'In fermentum posuere urna nec',
    DateAdded: '2020-06-21',
    EventDate: '2020-06-21',
    ContractType: 'Lorem',
    Actions: '',
  },
  {
    key: '2',
    Tenant: 'Wade Warren',
    Company: 'Apple',
    BU: 'In fermentum posuere urna nec',
    DateAdded: '2020-06-21',
    EventDate: '2020-06-21',
    ContractType: 'Lorem',
    Actions: '',
  },
  {
    key: '3',
    Tenant: 'Wade Warren',
    Company: 'Apple',
    BU: 'In fermentum posuere urna nec',
    DateAdded: '2020-06-21',
    EventDate: '2020-06-21',
    ContractType: 'Lorem',
    Actions: '',
  },
  {
    key: '4',
    Tenant: 'Wade Warren',
    Company: 'Apple',
    BU: 'In fermentum posuere urna nec',
    DateAdded: '2020-06-21',
    EventDate: '2020-06-21',
    ContractType: 'Lorem',
    Actions: '',
  },
];

export default class Ctable extends React.Component {
  state = {
    searchText: '',
    searchedColumn: '',
    pagination: {
      current: 1,
      pageSize: 10,
    },
  };

  searchInput;
  fixedColumn: 'left' = 'left';

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          className="form-control"
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined style={{ color: '#fff' }} />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              this.setState({
                searchText: selectedKeys[0],
                searchedColumn: dataIndex,
              });
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: (text) => text,
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  // pagination--------------
  componentDidMount() {
    // const { pagination } = this.state;
    this.fetch();
  }

  // handleTableChange = (pagination, filters, sorter) => {
  //   this.fetch({
  //     sortField: sorter.field,
  //     sortOrder: sorter.order,
  //     pagination,
  //     ...filters,
  //   });
  // };

  fetch = () => {
    this.setState({ loading: true });
    this.setState({
      pagination: {
        total: 200,
      },
    });
  };

  render() {
    const { pagination } = this.state;
    const columns = [
      {
        title: 'Tenant',
        dataIndex: 'Tenant',
        key: 'Tenant',
        ...this.getColumnSearchProps('Tenant'),
      },
      {
        title: 'Company',
        dataIndex: 'Company',
        key: 'Company',
        ...this.getColumnSearchProps('Company'),
      },
      {
        title: 'BU',
        dataIndex: 'BU',
        key: 'BU',
        ...this.getColumnSearchProps('BU'),
      },
      {
        title: 'DateAdded',
        dataIndex: 'DateAdded',
        key: 'DateAdded',
        ...this.getColumnSearchProps('DateAdded'),
      },
      {
        title: 'EventDate',
        dataIndex: 'EventDate',
        key: 'EventDate',
        ...this.getColumnSearchProps('EventDate'),
      },
      {
        title: 'ContractType',
        dataIndex: 'ContractType',
        key: 'ContractType',
        ...this.getColumnSearchProps('ContractType'),
      },
      {
        title: 'Action',
        key: 'Action',
        // fixed: this.fixedColumn,
        width: '80px',
        render: () => (
          <div className="btns-block">
            <Link to="/add-event" title="" className="action-btn">
              <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
            </Link>
            <a href="#" title="" className="action-btn">
              <img src={`${process.env.PUBLIC_URL}/assets/images/ic-delete.svg`} alt="" />
            </a>
          </div>
        ),
      },
    ];
    return (
      <Table
        scroll={{ x: true }}
        pagination={{
          ...pagination,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        }}
        columns={columns}
        dataSource={data}
        className="custom-table"
      />
    );
  }
}
