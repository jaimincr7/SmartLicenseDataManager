import { Table, Popconfirm, Input, Form, Button, Select } from 'antd';
import React, { useState } from 'react';
import {
  clearSqlServerMessages,
  sqlServerSelector,
} from '../../../../store/sqlServer/sqlServer.reducer';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import { ISearchSqlServer, ISqlServer } from '../../../../services/sqlServer/sqlServer.model';
import { deleteSqlServer, searchSqlServer } from '../../../../store/sqlServer/sqlServer.action';
import { toast } from 'react-toastify';
import { fixedColumn, IDataTable } from './dataTable.model';
import moment from 'moment';
import { Common } from '../../../../common/constants/common';
import _ from 'lodash';
import { SearchOutlined, ClearOutlined, SwapOutlined } from '@ant-design/icons';
import { IDropDownOption } from '../../../../common/models/commont';
import { DatePicker } from 'antd';
import sqlServerService from '../../../../services/sqlServer/sqlServer.service';
const { RangePicker } = DatePicker;

let pageLoaded = false;

const DataTable: React.FC<IDataTable> = (props) => {
  const { search, setSelectedId } = props;

  const sqlServers = useAppSelector(sqlServerSelector);
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const [inlineSearch, setInlineSearch] = useState<any>({});
  const [columnLookup, setColumnLookup] = useState<any>({});

  const fetchSqlServer = () => {
    const searchData: ISearchSqlServer = {
      order_by: 'id',
      order_direction: 'DESC',
      is_lookup: !pageLoaded,
      limit: pagination.pageSize,
      offset: (pagination.current - 1) * pagination.pageSize,
      ...(search || {}),
      filter_keys: inlineSearch,
    };
    pageLoaded = true;
    dispatch(searchSqlServer(searchData));
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const removeSqlServer = (id: number) => {
    dispatch(deleteSqlServer(id));
  };

  React.useEffect(() => {
    if (sqlServers.delete.messages.length > 0) {
      if (sqlServers.delete.hasErrors) {
        toast.error(sqlServers.delete.messages.join(' '));
      } else {
        toast.success(sqlServers.delete.messages.join(' '));
        fetchSqlServer();
      }
      dispatch(clearSqlServerMessages());
    }
  }, [sqlServers.delete.messages]);

  React.useEffect(() => {
    fetchSqlServer();
  }, [search, pagination, inlineSearch]);

  const onFinish = (values: any) => {
    setInlineSearch(values);
  };

  const onReset = () => {
    form.resetFields();
    setInlineSearch({});
  };

  const getColumnLookup = (column: string)=>{
    sqlServerService.getLookupSqlServerByFieldName(column).then((res)=>{
      setColumnLookup({...columnLookup, [column]:res.body.data})
    })

  }

  const FilterByDate = (dataIndex: string) => (
    <>
      <Form.Item name={dataIndex} className="m-0 filter-input lg">
        <RangePicker />
      </Form.Item>
    </>
  );

  const FilterByInput = (dataIndex: string) => (
    <>
      <Form.Item name={dataIndex} className="m-0 filter-input">
        <Input placeholder="Search by keyword" className="form-control" autoComplete="off" />
      </Form.Item>
    </>
  );

  const FilterByDropdown = (dataIndex: string, dropdownOptions: IDropDownOption[] = []) => (
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

  const FilterBySwap = (dataIndex: string, dropdownOptions: IDropDownOption[]) => {
    const [swap, setSwap] = useState(true);

    React.useEffect(() => {
      if (!swap && !dropdownOptions) {
        getColumnLookup(dataIndex);
      }
    }, [swap])
    return (
      <>
      <div className="input-group">
        {swap ? FilterByInput(dataIndex) : FilterByDropdown(dataIndex, (dropdownOptions || []))}
        <Button onClick={() => setSwap(!swap)} className="filter-btn"><SwapOutlined /></Button>
        </div>
      </>
    )
  };

  const columns = [
    {
      title: 'Product Name',
      children: [
        {
          title: FilterBySwap('product_name', columnLookup?.product_name),
          dataIndex: 'product_name',
          key: 'product_name',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'Operating System',
      children: [
        {
          title: FilterBySwap('operating_system', columnLookup?.operating_system),
          dataIndex: 'operating_system',
          key: 'operating_system',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'Tenant Name',
      children: [
        {
          title: FilterByDropdown('tenant_id', sqlServers.search.lookups?.tenants),
          dataIndex: 'tenant_name',
          key: 'tenant_name',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'Company Name',
      children: [
        {
          title: FilterByDropdown('company_id', sqlServers.search.lookups?.companies),
          dataIndex: 'company_name',
          key: 'company_name',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'Bu Name',
      children: [
        {
          title: FilterByDropdown('bu_id', sqlServers.search.lookups?.bus),
          dataIndex: 'bu_name',
          key: 'bu_name',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'Date Added',
      children: [
        {
          title: FilterByDate('date_added'),
          dataIndex: 'date_added',
          key: 'date_added',
          ellipsis: true,
          render: (date: Date) => (!_.isNull(date) ? moment(date).format(Common.DATEFORMAT) : ''),
        },
      ],
    },
    {
      title: 'SQL Cluster',
      children: [
        {
          title: FilterBySwap('sql_cluster', columnLookup?.sql_cluster),
          dataIndex: 'sql_cluster',
          key: 'sql_cluster',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'Host',
      children: [
        {
          title: FilterBySwap('host', columnLookup?.host),
          dataIndex: 'host',
          key: 'host',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'Device Name',
      children: [
        {
          title: FilterBySwap('device_name', columnLookup?.device_name),
          dataIndex: 'device_name',
          key: 'device_name',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'Device Type',
      children: [
        {
          title: FilterBySwap('device_type', columnLookup?.device_type),
          dataIndex: 'device_type',
          key: 'device_type',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'Product Family',
      children: [
        {
          title: FilterBySwap('product_family', columnLookup?.product_family),
          dataIndex: 'product_family',
          key: 'product_family',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'Version',
      children: [
        {
          title: FilterBySwap('version', columnLookup?.version),
          dataIndex: 'version',
          key: 'version',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'Edition',
      children: [
        {
          title: FilterBySwap('edition', columnLookup?.edition),
          dataIndex: 'edition',
          key: 'edition',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'Device State',
      children: [
        {
          title: FilterBySwap('device_state', columnLookup?.device_state),
          dataIndex: 'device_state',
          key: 'device_state',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'Software State',
      children: [
        {
          title: FilterBySwap('software_state', columnLookup?.software_state),
          dataIndex: 'software_state',
          key: 'software_state',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'Cluster',
      children: [
        {
          title: FilterBySwap('cluster', columnLookup?.cluster),
          dataIndex: 'cluster',
          key: 'cluster',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'Source',
      children: [
        {
          title: FilterBySwap('source', columnLookup?.source),
          dataIndex: 'source',
          key: 'source',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'OS Type',
      children: [
        {
          title: FilterBySwap('os_type', columnLookup?.os_type),
          dataIndex: 'os_type',
          key: 'os_type',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'Raw Software Title',
      children: [
        {
          title: FilterBySwap('raw_software_title', columnLookup?.raw_software_title),
          dataIndex: 'raw_software_title',
          key: 'raw_software_title',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'FQDN',
      children: [
        {
          title: FilterBySwap('fqdn', columnLookup?.fqdn),
          dataIndex: 'fqdn',
          key: 'fqdn',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'Service',
      children: [
        {
          title: FilterBySwap('service', columnLookup?.service),
          dataIndex: 'service',
          key: 'service',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'Cost Code',
      children: [
        {
          title: FilterBySwap('cost_code', columnLookup?.cost_code),
          dataIndex: 'cost_code',
          key: 'cost_code',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'Line of Business',
      children: [
        {
          title: FilterBySwap('line_of_business', columnLookup?.line_of_business),
          dataIndex: 'line_of_business',
          key: 'line_of_business',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'Market',
      children: [
        {
          title: FilterBySwap('market', columnLookup?.market),
          dataIndex: 'market',
          key: 'market',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'Application',
      children: [
        {
          title: FilterBySwap('application', columnLookup?.application),
          dataIndex: 'application',
          key: 'application',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'Data Center',
      children: [
        {
          title: FilterBySwap('data_center', columnLookup?.data_center),
          dataIndex: 'data_center',
          key: 'data_center',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'Serial Number',
      children: [
        {
          title: FilterBySwap('serial_number', columnLookup?.serial_number),
          dataIndex: 'serial_number',
          key: 'serial_number',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'SQL Cluster Node Type',
      children: [
        {
          title: FilterBySwap('sql_cluster_node_type', columnLookup?.sql_cluster_node_type),
          dataIndex: 'sql_cluster_node_type',
          key: 'sql_cluster_node_type',
          ellipsis: true,
        },
      ],
    },
    {
      title: 'Action',
      children: [
        {
          title: (
            <div className="btns-block">
              <Button htmlType="submit" className="action-btn filter-btn p-0">
                <img src={`${process.env.PUBLIC_URL}/assets/images/ic-search.svg`} alt="" />
              </Button>
              <Button htmlType="button" onClick={onReset} className="action-btn filter-btn p-0">
                <img src={`${process.env.PUBLIC_URL}/assets/images/ic-clear.svg`} alt="" />
              </Button>
            </div>
          ),
          key: 'Action',
          width: '80px',
          fixed: 'right' as fixedColumn,
          render: (_, data: ISqlServer) => (
            <div className="btns-block">
              <a
                href="#"
                className="action-btn"
                onClick={() => {
                  setSelectedId(data.id);
                }}
              >
                <img src={`${process.env.PUBLIC_URL}/assets/images/ic-edit.svg`} alt="" />
              </a>
              <Popconfirm title="Sure to delete?" onConfirm={() => removeSqlServer(data.id)}>
                <a href="#" title="" className="action-btn">
                  <img src={`${process.env.PUBLIC_URL}/assets/images/ic-delete.svg`} alt="" />
                </a>
              </Popconfirm>
            </div>
          ),
        },
      ],
    },
  ];

  return (
    <>
      <Form form={form} name="searchTable" onFinish={onFinish}>
        <Table
          scroll={{ x: true }}
          rowKey={(record) => record.id}
          dataSource={sqlServers.search.data}
          columns={columns}
          loading={sqlServers.search.loading}
          pagination={{ ...pagination, total: sqlServers.search.count }}
          onChange={handleTableChange}
          className="custom-table"
        />
      </Form>
    </>
  );
};

export default DataTable;
