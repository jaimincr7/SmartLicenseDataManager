import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import React, { useEffect } from 'react';
import { IMenuRights } from '../menuRights.model';
import {
  clearMenuAccessRights,
  clearMenuMessages,
  menuSelector,
} from '../../../../store/user/menu/menu.reducer';
import { Button, Checkbox, Form, Select, Switch, Table } from 'antd';
import {
  getMenuRightsByRoleId,
  getRoleLookup,
  saveMenuAccessRights,
} from '../../../../store/user/menu/menu.action';
import { IMenu } from '../../../../services/user/menu/menu.model';
import _ from 'lodash';
import EditMenuModal from '../EditMenuModal';
import { EditOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { IRoleLookup } from '../../../../services/user/user.model';

const RoleBaseMenuRights: React.FC<IMenuRights> = () => {
  const reduxStoreData = useAppSelector(menuSelector);
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [columns, setColumns] = React.useState<any>([]);
  const [editModalVisible, setEditModalVisible] = React.useState(false);
  const [selectedMenu, setSelectedMenu] = React.useState<IMenu>(null);

  const onFinish = (values: any) => {
    const accessRights = Object.keys(_.pickBy(values.menu_rights, _.identity));
    const accessRightsInputValues = {
      role_id: values.role_id,
      menu_access_right_ids: accessRights,
    };
    dispatch(saveMenuAccessRights(accessRightsInputValues));
  };

  useEffect(() => {
    if (reduxStoreData.saveMenuAccessRights.messages.length > 0) {
      if (reduxStoreData.saveMenuAccessRights.hasErrors) {
        toast.error(reduxStoreData.saveMenuAccessRights.messages.join(' '));
      } else {
        toast.success(reduxStoreData.saveMenuAccessRights.messages.join(' '));
      }
      dispatch(clearMenuMessages());
    }
  }, [reduxStoreData.saveMenuAccessRights.messages]);

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
    dispatch(getRoleLookup());
    return () => {
      dispatch(clearMenuAccessRights());
    };
  }, []);

  const handleRoleIdChange = (roleId: number) => {
    dispatch(getMenuRightsByRoleId(roleId));
  };

  const handleAllChange = (checked, menu: IMenu) => {
    const menuRights = form.getFieldValue('menu_rights');
    const selectRight: any = {};
    menu.child_menu_rights.map((m) => {
      selectRight[m] = checked;
    });
    form.setFieldsValue({ menu_rights: { ...menuRights, ...selectRight } });
    setTimeout(() => {
      checkAllRights();
    });
  };

  const checkAllRights = () => {
    const checkbox: any = {};
    reduxStoreData.getMenuRightsByRoleId.data?.menus.map((m: IMenu) => {
      const selectRight: any = {};
      m.child_menu_rights.map((mr) => {
        selectRight[mr] = form.getFieldValue(['menu_rights', mr]);
      });
      checkbox[m.id] = false;
      if (Object.values(selectRight).every((el) => el === true)) {
        checkbox[m.id] = true;
      }
    });
    form.setFieldsValue({ selectAll: checkbox });
  };

  React.useEffect(() => {
    const mainColumns = [];
    const maxLevel = reduxStoreData.getMenuRightsByRoleId.data?.maxLevel;
    for (let index = 1; index <= maxLevel; index++) {
      mainColumns.push({
        title: index == 1 ? 'Menu' : `Sub Menu ${index - 1}`,
        dataIndex: 'description',
        key: 'description',
        render: (_, data: IMenu) => (
          <>
            {data.level === index && (
              <>
                <Form.Item noStyle name={['selectAll', `${data.id}`]} valuePropName="checked">
                  <Checkbox onChange={(e) => handleAllChange(e.target.checked, data)}>
                    {data.description}
                  </Checkbox>
                </Form.Item>{' '}
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
                  <Switch
                    onChange={() => {
                      setTimeout(() => {
                        checkAllRights();
                      });
                    }}
                  />
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
    setTimeout(() => {
      checkAllRights();
    });
  }, [reduxStoreData.getMenuRightsByRoleId.data]);

  return (
    <div className="menuRights">
      <div className="title-block">
        <h4 className="p-0">Role Base Menu Rights</h4>
      </div>
      <div className="main-card">
        <Form form={form} initialValues={{}} name="menuRights" onFinish={onFinish}>
          <div className="title-block">
            <Form.Item name="role_id" className="m-0" label="Role" rules={[{ required: true }]}>
              <Select
                onChange={handleRoleIdChange}
                loading={reduxStoreData.roleLookup.loading}
                style={{ width: '200px' }}
                placeholder="Please Select"
              >
                {reduxStoreData.roleLookup.data.map((option: IRoleLookup) => (
                  <Select.Option key={option.c_RoleId} value={option.c_RoleId}>
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
                loading={reduxStoreData.saveMenuAccessRights.loading}
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

export default RoleBaseMenuRights;
