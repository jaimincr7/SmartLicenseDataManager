import { useAppSelector, useAppDispatch } from '../../../store/app.hooks';
import React from 'react';
import { IMenuRights } from './menuRights.model';
import { clearMenuMessages, menuSelector } from '../../../store/user/menu/menu.reducer';
import { Button, Form, Select, Switch, Table } from 'antd';
import { getMenuRightsByRoleId } from '../../../store/user/menu/menu.action';
import { IMenu } from '../../../services/user/menu/menu.model';
import { ILookup } from '../../../services/common/common.model';
import _ from 'lodash';
import EditMenuModal from './EditMenuModal';
import { EditOutlined } from '@ant-design/icons';

const MenuRights: React.FC<IMenuRights> = () => {
  const reduxStoreData = useAppSelector(menuSelector);
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [columns, setColumns] = React.useState<any>([]);
  const [editModalVisible, setEditModalVisible] = React.useState(false);
  const [selectedMenu, setSelectedMenu] = React.useState<IMenu>(null);

  const onFinish = (values: any) => {
    values.menu_rights = Object.keys(_.pickBy(values.menu_rights, _.identity));
    console.log('---------values', values);
  };

  const roles = [
    {
      id: 1,
      name: 'Global Admin',
    },
    {
      id: 2,
      name: 'Tenant Admin',
    },
    {
      id: 3,
      name: 'Company Admin',
    },
    {
      id: 4,
      name: 'User',
    },
    {
      id: 5,
      name: 'Trusted Customer Evaluation',
    },
  ];

  const editMenu = (menu: IMenu) => {
    setSelectedMenu(menu);
    setEditModalVisible(true);
  };


  const getMenuDropdown = (selectedMenuId: number, menuId = 0) => {
    const dropdown = [];
    reduxStoreData.getMenuRightsByRoleId.data?.menus.map((m: IMenu) => {
      if (m.id !== selectedMenuId) {
        if (+m.parent_menu_id === menuId) {
          dropdown.push({
            title: m.description,
            value: m.id,
            children: getMenuDropdown(selectedMenuId, m.id),
          });
        }
      }
    });
    return dropdown;
  };

  React.useEffect(() => {
    dispatch(getMenuRightsByRoleId(1));
    return () => {
      dispatch(clearMenuMessages());
    };
  }, []);

  const handleRoleIdChange = (roleId: number) => {
    dispatch(getMenuRightsByRoleId(roleId));
  };

  React.useEffect(() => {
    const mainColumns = [];
    const maxLevel = reduxStoreData.getMenuRightsByRoleId.data?.maxLevel;
    for (let index = 1; index <= maxLevel; index++) {
      mainColumns.push({
        title: index == 1 ? 'Menu' : `Sub Menu ${index-1}`,
        dataIndex: 'description',
        key: 'description',
        render: (_, data: IMenu) => (
          <>
            {data.level === index && (
              <>
                {data.description}{' '}
                <a
                  title="Edit"
                  onClick={() => {
                    editMenu(data);
                  }}
                >
                  <EditOutlined />
                </a>
              </>
            )}
          </>
        ),
      });
    }

    const rights = reduxStoreData.getMenuRightsByRoleId.data?.access_rights;
    rights?.map((right) => {
      mainColumns.push({
        title: right.description,
        dataIndex: right.name,
        key: right.name,
        render: (_, data: IMenu) => {
          const result = data.menu_rights.find((mr) => mr.access_rights.name === right.name);
          return (
            <>
              {result?.is_rights !== undefined && (
                <Form.Item
                  noStyle
                  name={['menu_rights', `${result.id}`]}
                  valuePropName="checked"
                  initialValue={result?.is_rights}
                >
                  <Switch />
                </Form.Item>
              )}
            </>
          );
        },
      });
    });
    setColumns(mainColumns);
    const roleId = form.getFieldValue('role_id');
    form.resetFields();
    form.setFieldsValue({ role_id: roleId });
  }, [reduxStoreData.getMenuRightsByRoleId.data]);

  return (
    <div className="menuRights">
      <div className="title-block">
        <h4 className="p-0">Menu Rights</h4>
      </div>
      <div className="main-card">
        <Form form={form} initialValues={{}} name="menuRights" onFinish={onFinish}>
          <div className="title-block">
            <Form.Item
              name="role_id"
              className="m-0"
              label="Role"
              rules={[{ required: true }]}
              initialValue={1}
            >
              <Select onChange={handleRoleIdChange} loading={false} style={{ width: '200px' }}>
                {roles.map((option: ILookup) => (
                  <Select.Option key={option.id} value={option.id}>
                    {option.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <div className="btns-block">
              <Button
                type="primary"
                onClick={() => {
                  form.submit();
                }}
              >
                Save
              </Button>
            </div>
          </div>
          <Table
            scroll={{ x: true }}
            rowKey={(record) => record.id}
            dataSource={reduxStoreData.getMenuRightsByRoleId.data?.menus}
            columns={columns}
            loading={reduxStoreData.getMenuRightsByRoleId.loading}
            className="custom-table"
            pagination={false}
          />
        </Form>
      </div>
      {editModalVisible && (
        <EditMenuModal
          showModal={editModalVisible}
          handleModalClose={() => {
            setEditModalVisible(false);
          }}
          selectedMenu={selectedMenu}
          parentMenu={getMenuDropdown(selectedMenu.id)}
          refreshDataTable={() => handleRoleIdChange(form.getFieldValue('role_id'))}
        />
      )}
    </div>
  );
};

export default MenuRights;
