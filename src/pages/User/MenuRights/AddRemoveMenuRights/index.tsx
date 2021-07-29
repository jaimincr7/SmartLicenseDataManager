import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import React, { useEffect } from 'react';
import { IMenuRights } from '../menuRights.model';
import {
  clearMenuAccessRights,
  clearMenuMessages,
  menuSelector,
} from '../../../../store/user/menu/menu.reducer';
import { Button, Checkbox, Form, Switch, Table } from 'antd';
import {
  getMenuAccessRights,
  saveAddRemoveMenuAccessRights,
} from '../../../../store/user/menu/menu.action';
import { IAccessMenu } from '../../../../services/user/menu/menu.model';
import _ from 'lodash';
import EditMenuModal from '../EditMenuModal';
import { EditOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';

const MenuAccessRights: React.FC<IMenuRights> = () => {
  const reduxStoreData = useAppSelector(menuSelector);
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [columns, setColumns] = React.useState<any>([]);
  const [editModalVisible, setEditModalVisible] = React.useState(false);
  const [selectedMenu, setSelectedMenu] = React.useState<IAccessMenu>(null);

  const onFinish = (values: any) => {
    const accessRights = Object.keys(_.pickBy(values.menu_rights, _.identity)).map(function (key) {
      return Number(key);
    });
    const accessRightsInputValues = {
      menu_access_right_ids: accessRights,
    };
    dispatch(saveAddRemoveMenuAccessRights(accessRightsInputValues));
  };

  useEffect(() => {
    if (reduxStoreData.saveAddRemoveMenuAccessRights.messages.length > 0) {
      if (reduxStoreData.saveAddRemoveMenuAccessRights.hasErrors) {
        toast.error(reduxStoreData.saveAddRemoveMenuAccessRights.messages.join(' '));
      } else {
        toast.success(reduxStoreData.saveAddRemoveMenuAccessRights.messages.join(' '));
      }
      dispatch(clearMenuMessages());
    }
  }, [reduxStoreData.saveAddRemoveMenuAccessRights.messages]);

  const editMenu = (menu: IAccessMenu) => {
    setSelectedMenu(menu);
    setEditModalVisible(true);
  };

  const getMenuDropdown = (selectedMenuId: number, menuId = 0) => {
    const dropdown = [];
    reduxStoreData.getMenuAccessRights.data?.menus.map((m: IAccessMenu) => {
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
    dispatch(getMenuAccessRights());
    return () => {
      dispatch(clearMenuAccessRights());
    };
  }, []);

  const handleAllChange = (checked, menu: IAccessMenu) => {
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
    reduxStoreData.getMenuAccessRights.data?.menus.map((m: IAccessMenu) => {
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
    const maxLevel = reduxStoreData.getMenuAccessRights.data?.maxLevel;
    for (let index = 1; index <= maxLevel; index++) {
      mainColumns.push({
        title: index == 1 ? 'Menu' : `Sub Menu ${index - 1}`,
        dataIndex: 'description',
        key: 'description',
        render: (_, data: IAccessMenu) => (
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

    const rights = reduxStoreData.getMenuAccessRights.data?.access_rights;
    rights?.map((right) => {
      mainColumns.push({
        title: right.description,
        dataIndex: right.name,
        key: right.name,
        render: (_, data: IAccessMenu) => {
          const result = data.menu_access_rights.find((mr) => mr.access_rights.name === right.name);
          return (
            <>
              {result?.status !== undefined && (
                <Form.Item
                  noStyle
                  name={['menu_rights', `${result.id}`]}
                  valuePropName="checked"
                  initialValue={result?.status}
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
    form.resetFields();
    setTimeout(() => {
      checkAllRights();
    });
  }, [reduxStoreData.getMenuAccessRights.data]);

  return (
    <div className="menuRights">
      <div className="title-block">
        <BreadCrumbs pageName={Page.MenuAccessRights} />
      </div>
      <div className="main-card">
        <Form form={form} initialValues={{}} name="menuRights" onFinish={onFinish}>
          <div className="title-block">
            <div className="btns-block">
              <Can I={Action.Update} a={Page.MenuAccessRights}>
                <Button
                  type="primary"
                  onClick={() => {
                    form.submit();
                  }}
                  loading={reduxStoreData.saveAddRemoveMenuAccessRights.loading}
                >
                  Save
                </Button>
              </Can>
            </div>
          </div>
          <Table
            scroll={{ x: true }}
            rowKey={(record) => record.id}
            dataSource={reduxStoreData.getMenuAccessRights.data?.menus}
            columns={columns}
            loading={reduxStoreData.getMenuAccessRights.loading}
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
          refreshDataTable={() => dispatch(getMenuAccessRights())}
        />
      )}
    </div>
  );
};

export default MenuAccessRights;
