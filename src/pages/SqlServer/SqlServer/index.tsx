import { Button, Input, Menu, Dropdown, Checkbox, Form } from 'antd';
import { useEffect, useState } from 'react';
import { ISearchSqlServer } from '../../../services/sqlServer/sqlServer.model';
import { useAppDispatch } from '../../../store/app.hooks';
import { clearSqlServer } from '../../../store/sqlServer/sqlServer.reducer';
import { ISqlServerProps } from './sqlServer.model';
import './sqlServer.style.scss';
import React from 'react';
import DataTable from './components/DataTable';
import GlobalSearch from '../../../common/components/globalSearch/GlobalSearch';
import AddSqlServerModal from './AddSqlServer';

const dropdownMenu = (
  <Menu>
    <Menu.Item key="0">
      <Checkbox>Tenant</Checkbox>
    </Menu.Item>
    <Menu.Item key="1">
      <Checkbox>Company</Checkbox>
    </Menu.Item>
  </Menu>
);

const SqlServer: React.FC<ISqlServerProps> = () => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const [addModalVisible, setAddModalVisible] = React.useState(false);
  const [id, setId] = React.useState(0);

  const [search, setSearch] = useState({
    keyword: '',
    offset: 0,
  });

  const onFinish = (values: ISearchSqlServer) => {
    setSearch({ ...search, keyword: values.keyword });
  };

  useEffect(() => {
    return () => {
      dispatch(clearSqlServer());
    };
  }, []);

  const Filter = () => (
    <>
      <Form form={form} name="horizontal_login" layout="inline" onFinish={onFinish}>
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

  return (
    <div className="homePage">
      <div className="title-block">
        <h4 className="p-0">Sql Server</h4>
        <div className="right-title">
          <GlobalSearch />
        </div>
      </div>
      <div className="main-card">
        <div className="title-block search-block">
          <Filter />
          <div className="btns-block">
            <Dropdown overlay={dropdownMenu} trigger={['click']} overlayClassName="custom-dropdown">
              <Button
                icon={
                  <em className="anticon">
                    <img src={`${process.env.PUBLIC_URL}/assets/images/ic-lines.svg`} alt="" />
                  </em>
                }
              >
                Show/Hide Columns
              </Button>
            </Dropdown>
            <Button
              type="primary"
              onClick={() => {
                setAddModalVisible(true);
                setId(0);
              }}
            >
              Add Sql Server
            </Button>
          </div>
        </div>
        <DataTable
          search={search}
          setSelectedId={(id) => {
            setId(id);
            setAddModalVisible(true);
          }}
        />
      </div>
      {addModalVisible && (
        <AddSqlServerModal
          showModal={addModalVisible}
          handleModalClose={() => setAddModalVisible(false)}
          id={id}
          refreshDataTable={()=> setSearch({...search})}
        />
      )}
    </div>
  );
};

export default SqlServer;
