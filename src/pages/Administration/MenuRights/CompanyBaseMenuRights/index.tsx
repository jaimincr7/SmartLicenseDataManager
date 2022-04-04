import { useAppSelector, useAppDispatch } from '../../../../store/app.hooks';
import React, { useEffect } from 'react';
import { IMenuRights } from '../menuRights.model';
import {
  clearGetMenuRightsByCompanyId,
  clearMenuAccessRights,
  clearMenuMessages,
  menuSelector,
} from '../../../../store/administration/menu/menu.reducer';
import { Button, Checkbox, Form, Select, Switch, Table } from 'antd';
import {
  getMenuRightsByCompanyId,
  saveCompanyMenuAccessRights,
} from '../../../../store/administration/menu/menu.action';
import { IMenu } from '../../../../services/administration/menu/menu.model';
import _ from 'lodash';
import EditMenuModal from '../EditMenuModal';
import { EditOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { getAllCompanyLookup } from '../../../../store/common/common.action';
import { commonSelector } from '../../../../store/common/common.reducer';
import { ILookup } from '../../../../services/common/common.model';
import { Can } from '../../../../common/ability';
import { Action, Page } from '../../../../common/constants/pageAction';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { getPageHeight } from '../../../../common/helperFunction';

const CompanyBaseMenuRights: React.FC<IMenuRights> = () => {
  const reduxStoreData = useAppSelector(menuSelector);
  const commonReduxStoreData = useAppSelector(commonSelector);
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [columns, setColumns] = React.useState<any>([]);
  const [editModalVisible, setEditModalVisible] = React.useState(false);
  const [selectedMenu, setSelectedMenu] = React.useState<IMenu>(null);
  const [height, setHeight] = React.useState<number>(350);

  const onFinish = (values: any) => {
    const accessRights = Object.keys(_.pickBy(values.menu_rights, _.identity));
    const accessRightsInputValues = {
      company_id: values.company_id,
      menu_access_right_ids: accessRights,
    };
    dispatch(saveCompanyMenuAccessRights(accessRightsInputValues));
  };

  useEffect(() => {
    if (reduxStoreData.saveCompanyMenuAccessRights.messages.length > 0) {
      if (reduxStoreData.saveCompanyMenuAccessRights.hasErrors) {
        toast.error(reduxStoreData.saveCompanyMenuAccessRights.messages.join(' '));
      } else {
        toast.success(reduxStoreData.saveCompanyMenuAccessRights.messages.join(' '));
      }
      dispatch(clearMenuMessages());
    }
  }, [reduxStoreData.saveCompanyMenuAccessRights.messages]);

  const editMenu = (menu: IMenu) => {
    setSelectedMenu(menu);
    setEditModalVisible(true);
  };

  const getMenuDropdown = (selectedMenuId: number, menuId = 0) => {
    const dropdown = [];
    reduxStoreData.getMenuRightsByCompanyId.data?.menus.map((m: IMenu) => {
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
    dispatch(getAllCompanyLookup());
    form.setFieldsValue({ company_id: null });
    return () => {
      dispatch(clearMenuAccessRights());
      dispatch(clearGetMenuRightsByCompanyId());
    };
  }, []);

  const handleCompanyIdChange = (companyId: number) => {
    dispatch(getMenuRightsByCompanyId(companyId));
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
    reduxStoreData.getMenuRightsByCompanyId.data?.menus.map((m: IMenu) => {
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
    const maxLevel = reduxStoreData.getMenuRightsByCompanyId.data?.maxLevel;
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

    const rights = reduxStoreData.getMenuRightsByCompanyId.data?.access_rights;
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
    const companyId = form.getFieldValue('company_id');
    form.resetFields();
    form.setFieldsValue({ company_id: companyId });
    setTimeout(() => {
      setHeight(getPageHeight());
      checkAllRights();
    });
  }, [reduxStoreData.getMenuRightsByCompanyId.data]);

  return (
    <div className="menuRights">
      <div className="title-block">
        <h4 className="p-0">
          <BreadCrumbs pageName={Page.CompanyMenuRights} />
        </h4>
      </div>
      <div className="main-card">
        <Form form={form} initialValues={{}} name="menuRights" onFinish={onFinish}>
          <div className="title-block">
            <Form.Item
              name="company_id"
              className="m-0"
              label="Company"
              rules={[{ required: true, message: 'Company is required' }]}
            >
              <Select
                onChange={handleCompanyIdChange}
                loading={commonReduxStoreData.allCompanyLookup.loading}
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
                {commonReduxStoreData.allCompanyLookup.data.map((option: ILookup) => (
                  <Select.Option key={option.id} value={option.id}>
                    {option.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <div className="btns-block">
              <Can I={Action.Update} a={Page.CompanyMenuRights}>
                <Button
                  type="primary"
                  onClick={() => {
                    form.submit();
                  }}
                  disabled={reduxStoreData.getMenuRightsByCompanyId.data?.menus == null}
                  loading={reduxStoreData.saveCompanyMenuAccessRights.loading}
                >
                  Save
                </Button>
              </Can>
            </div>
          </div>
          <Table
            scroll={{ x: true, y: height }}
            rowKey={(record) => record.id}
            dataSource={reduxStoreData.getMenuRightsByCompanyId.data?.menus}
            columns={columns}
            loading={reduxStoreData.getMenuRightsByCompanyId.loading}
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
          refreshDataTable={() => handleCompanyIdChange(form.getFieldValue('company_id'))}
        />
      )}
    </div>
  );
};

export default CompanyBaseMenuRights;
