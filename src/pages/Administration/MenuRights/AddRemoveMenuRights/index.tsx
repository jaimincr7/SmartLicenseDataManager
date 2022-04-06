import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import React, { useEffect } from 'react';
import { IMenuRights } from '../menuRights.model';
import {
  clearMenuAccessRights,
  clearMenuMessages,
  menuSelector,
} from '../../../../store/administration/menu/menu.reducer';
import { Button, Checkbox, Form, Popconfirm, Switch, Table } from 'antd';
import {
  deleteParentMenu,
  getMenuAccessRights,
  saveAddRemoveMenuAccessRights,
} from '../../../../store/administration/menu/menu.action';
import { IAccessMenu, IMenu } from '../../../../services/administration/menu/menu.model';
import _ from 'lodash';
import EditMenuModal from '../EditMenuModal';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import ReactDragListView from 'react-drag-listview';
import { getPageHeight } from '../../../../common/helperFunction';
import AddParentMenuModal from './AddParentMenuModal';

const MenuAccessRights: React.FC<IMenuRights> = () => {
  const reduxStoreData = useAppSelector(menuSelector);
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [columns, setColumns] = React.useState<any>([]);
  const [editModalVisible, setEditModalVisible] = React.useState(false);
  const [addModalVisible, setAddModalVisible] = React.useState(false);
  const [selectedMenu, setSelectedMenu] = React.useState<IAccessMenu>(null);
  const [storeMenus, SetStoreMenus] = React.useState<IMenu[]>([]);
  const [height, setHeight] = React.useState<number>(350);

  const onFinish = (values: any) => {
    const accessRights = Object.keys(_.pickBy(values.menu_rights, _.identity)).map(function (key) {
      return Number(key);
    });
    const menu_orders = storeMenus?.map((menu: IMenu, index: number) => {
      return { menu_id: menu.id, order: index + 1 };
    });
    const accessRightsInputValues = {
      menu_access_right_ids: accessRights,
      menu_orders,
    };
    dispatch(saveAddRemoveMenuAccessRights(accessRightsInputValues));
  };

  const deleteParent = (id: number) => {
    dispatch(deleteParentMenu(id));
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

  useEffect(() => {
    if (reduxStoreData.deleteParentMenu.messages.length > 0) {
      if (reduxStoreData.deleteParentMenu.hasErrors) {
        toast.error(reduxStoreData.deleteParentMenu.messages.join(' '));
      } else {
        toast.success(reduxStoreData.deleteParentMenu.messages.join(' '));
      }
      dispatch(clearMenuMessages());
    }
    dispatch(getMenuAccessRights());
  }, [reduxStoreData.deleteParentMenu.messages]);

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

  const canDelete = (id: number) => {
    let result = true;
    reduxStoreData.getMenuAccessRights.data?.menus.map((data) => {
      if (data.parent_menu_id == id) {
        result = false;
      }
    });
    return result;
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
                    className="mr-1"
                    onClick={() => {
                      editMenu(data);
                    }}
                  >
                    <EditOutlined />
                  </a>
                </Can>
                {data.type == 'ExternalParentMenu' && !(data?.parent_menu_id > 0) ? (
                  canDelete(data.id) ? (
                    <Popconfirm title="Delete Parent Menu?" onConfirm={() => deleteParent(data.id)}>
                      <a title="Delete">
                        <DeleteOutlined />
                      </a>
                    </Popconfirm>
                  ) : (
                    <></>
                  )
                ) : (
                  <></>
                )}
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
      setHeight(getPageHeight());
      checkAllRights();
    });
  }, [reduxStoreData.getMenuAccessRights.data]);

  useEffect(() => {
    SetStoreMenus(reduxStoreData.getMenuAccessRights.data?.menus);
  }, [reduxStoreData.getMenuAccessRights.data?.menus]);

  const manageChildMenus = (menus: IMenu[], item: IMenu): IMenu[] => {
    const chidMenus = menus.filter((x) => x.parent_menu_id === item.id);
    menus = menus.filter((x) => x.parent_menu_id !== item.id);
    const newIndex = menus.findIndex((x) => x.id === item.id);
    menus.splice(newIndex + 1, 0, ...chidMenus);
    chidMenus?.forEach((childItem) => {
      const item = menus.find((x) => x.parent_menu_id === childItem.id);
      if (item) {
        menus = manageChildMenus(menus, childItem);
      }
    });
    return menus;
  };

  const dragProps = {
    onDragEnd(fromIndex, toIndex) {
      let updatedColumns = [...storeMenus];
      const draggedItem = updatedColumns.splice(fromIndex - 1, 1)[0];
      const item = storeMenus[toIndex - 1];
      if (draggedItem.parent_menu_id !== item.parent_menu_id) {
        return toast.error('Menu must be dragged inside same parent.');
      }
      updatedColumns.splice(toIndex - 1, 0, draggedItem);
      updatedColumns = manageChildMenus(updatedColumns, draggedItem);
      updatedColumns = manageChildMenus(updatedColumns, item);
      SetStoreMenus(updatedColumns);
    },
    nodeSelector: 'tr',
    handleSelector: '.ant-table-row',
  };

  return (
    <div className="menuRights">
      <div className="title-block">
        <h4 className="p-0">
          <BreadCrumbs pageName={Page.MenuAccessRights} />
        </h4>
      </div>
      <div className="main-card">
        <Form form={form} initialValues={{}} name="menuRights" onFinish={onFinish}>
          <div className="title-block">
            <div></div>
            <div className="btns-block">
              <Can I={Action.Add} a={Page.MenuAccessRights}>
                <Button
                  type="primary"
                  onClick={() => {
                    setAddModalVisible(true);
                  }}
                >
                  Add Parent Menu
                </Button>
              </Can>
              <Can I={Action.Update} a={Page.MenuAccessRights}>
                <Button
                  type="primary"
                  onClick={() => {
                    form.submit();
                  }}
                  disabled={reduxStoreData.getMenuAccessRights.data?.menus == undefined }
                  loading={reduxStoreData.saveAddRemoveMenuAccessRights.loading}
                >
                  Save
                </Button>
              </Can>
            </div>
          </div>
          <ReactDragListView {...dragProps}>
            <Table
              scroll={{ x: true, y: height }}
              rowKey={(record) => record.id}
              dataSource={storeMenus}
              columns={columns}
              loading={reduxStoreData.getMenuAccessRights.loading}
              className="custom-table"
              pagination={false}
            />
          </ReactDragListView>
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
      {addModalVisible && (
        <AddParentMenuModal
          showModal={addModalVisible}
          handleModalClose={() => {
            setAddModalVisible(false);
          }}
          refreshDataTable={() => dispatch(getMenuAccessRights())}
        />
      )}
    </div>
  );
};

export default MenuAccessRights;
