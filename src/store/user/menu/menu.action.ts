import { createAsyncThunk } from '@reduxjs/toolkit';
import { ISearchMenu, IMenu } from '../../../services/user/menu/menu.model';
import menuService from '../../../services/user/menu/menu.service';

// Asynchronous thunk action

export const searchMenu = createAsyncThunk('searchMenu', async (searchParam?: ISearchMenu) => {
  const response = await menuService.searchMenu(searchParam).then((res) => {
    return res.body;
  });
  return response.data;
});

export const getMenuById = createAsyncThunk('getMenuById', async (id: number) => {
  const response = await menuService.getMenuById(id).then((res) => {
    return res.body;
  });
  return response.data;
});

export const saveMenu = createAsyncThunk('saveMenu', async (data: IMenu) => {
  const response = await menuService.saveMenu(data).then((res) => {
    return res.body;
  });
  return response;
});

// Get child menu
const getChildMenus = (menus: IMenu[] , menuId: number, result: IMenu[]) =>{
  menus.map((c: IMenu) => {
    if (menuId === +c.parent_menu_id) {
      result.push(c);
      result = getChildMenus(menus, c.id, result);
    }
  });
  return result;
}

export const getMenuRightsByRoleId = createAsyncThunk(
  'getMenuRightsByRoleId',
  async (roleId: number) => {
    const response = await menuService.getMenuRightsByRoleId(roleId).then((res) => {
      return res.body;
    });
    // set parent child order
    let menuArray = [];
    menuArray = getChildMenus(response.data.menus, 0, menuArray);

    // set level of the menu
    let maxLevel = 1;
    menuArray.map((m) => {
      if (+m.parent_menu_id === 0) {
        m.level = 1;
      } else {
        menuArray.map((sm) => {
          if (+sm.id === +m.parent_menu_id) {
            m.level = sm.level + 1;
            if (m.level > maxLevel) {
              maxLevel = m.level;
            }
          }
        });
      }
      return m;
    });
    response.data.menus = menuArray;
    response.data.maxLevel = maxLevel;
    return response.data;
  }
);
