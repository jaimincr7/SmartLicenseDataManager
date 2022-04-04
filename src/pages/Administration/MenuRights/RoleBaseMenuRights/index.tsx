import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import React, { useEffect } from 'react';
import { IMenuRights } from '../menuRights.model';
import {
  clearGetMenuRightsByRoleId,
  clearMenuAccessRights,
  clearMenuMessages,
  menuSelector,
} from '../../../../store/administration/menu/menu.reducer';
import { Button, Checkbox, Form, Select, Switch, Table } from 'antd';
import {
  getMenuRightsByRoleId,
  getRoleLookup,
  saveMenuAccessRights,
} from '../../../../store/administration/menu/menu.action';
import { IMenu } from '../../../../services/administration/menu/menu.model';
import _ from 'lodash';
import EditMenuModal from '../EditMenuModal';
import { EditOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { ILookup } from '../../../../services/common/common.model';
import { getPageHeight } from '../../../../common/helperFunction';

const RoleBaseMenuRights: React.FC<IMenuRights> = () => {
  const reduxStoreData = useAppSelector(menuSelector);
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [columns, setColumns] = React.useState<any>([]);
  const [editModalVisible, setEditModalVisible] = React.useState(false);
  const [selectedMenu, setSelectedMenu] = React.useState<IMenu>(null);
  const [height, setHeight] = React.useState<number>(350);

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
    form.setFieldsValue({ role_id: null });
    return () => {
      dispatch(clearMenuAccessRights());
      dispatch(clearGetMenuRightsByRoleId());
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
                <Can I={Action.Update} a={Page.Menu}>
                  <a
                    title="Edit"
                    onClick={() => {
                      editMenu(data);
                    }}
                  >
                    <EditOutlined />
                  </a>
                </Can>
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
      setHeight(getPageHeight());
      checkAllRights();
    });
  }, [reduxStoreData.getMenuRightsByRoleId.data]);

  return (
    <div className="menuRights">
      <div className="title-block">
        <h4 className="p-0">
          <BreadCrumbs pageName={Page.RoleMenuRights} />
        </h4>
      </div>
      <div className="main-card">
        <Form form={form} initialValues={{}} name="menuRights" onFinish={onFinish}>
          <div className="title-block">
            <Form.Item
              name="role_id"
              className="m-0"
              label="Role"
              rules={[{ required: true, message: 'Role is required' }]}
            >
              <Select
                onChange={handleRoleIdChange}
                loading={reduxStoreData.roleLookup.loading}
                style={{ width: '200px' }}
                placeholder="Please Select"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option: any) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                filterSort={(optionA: any, optionB: any) =>
                  optionA.children?.toLowerCase()?.localeCompare(optionB.children?.toLowerCase())
                }
              >
                {reduxStoreData.roleLookup.data.map((option: ILookup) => (
                  <Select.Option key={option.id} value={option.id}>
                    {option.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <div className="btns-block">
              <Can I={Action.Update} a={Page.RoleMenuRights}>
                <Button
                  type="primary"
                  onClick={() => {
                    form.submit();
                  }}
                  disabled={reduxStoreData.getMenuRightsByRoleId.data?.menus == null}
                  loading={reduxStoreData.saveMenuAccessRights.loading}
                >
                  Save
                </Button>
              </Can>
            </div>
          </div>
          <Table
            scroll={{ x: true, y: height }}
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
