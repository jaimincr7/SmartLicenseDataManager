import {
  IMenuAccessRights,
  IAccessMenu,
  IAddParentMenu,
} from '../../../services/administration/menu/menu.model';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  ISearchMenu,
  IMenu,
  IAccessMenuRights,
  IAccessCompanyMenuRights,
} from '../../../services/administration/menu/menu.model';
import menuService from '../../../services/administration/menu/menu.service';
import userService from '../../../services/administration/administration.service';

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

export const addParentMenu = createAsyncThunk('addParentMenu', async (data: IAddParentMenu) => {
  const response = await menuService.addParentMenu(data).then((res) => {
    return res.body;
  });
  return response;
});

export const deleteParentMenu = createAsyncThunk('deleteParentMenu', async (id: number) => {
  const response = await menuService.deleteParentMenu(id).then((res) => {
    return res.body;
  });
  return response;
});

export const saveMenuAccessRights = createAsyncThunk(
  'saveMenuAccessRights',
  async (data: IAccessMenuRights) => {
    const response = await menuService.saveMenuAccessRights(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const saveCompanyMenuAccessRights = createAsyncThunk(
  'saveCompanyMenuAccessRights',
  async (data: IAccessCompanyMenuRights) => {
    const response = await menuService.saveCompanyMenuAccessRights(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const saveAddRemoveMenuAccessRights = createAsyncThunk(
  'saveAddRemoveMenuAccessRights',
  async (data: IMenuAccessRights) => {
    const response = await menuService.saveAddRemoveMenuAccessRights(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const getRoleLookup = createAsyncThunk('getRoleLookup', async () => {
  const response = await userService.getRoleLookup().then((res) => {
    return res.body;
  });
  return response.data;
});

// Get child menu
const getChildMenus = (menus: IMenu[], menuId: number, result: IMenu[]) => {
  menus.map((c: IMenu) => {
    if (menuId === +c.parent_menu_id) {
      result.push(c);
      result = getChildMenus(menus, c.id, result);
    }
  });
  return result;
};

const getChildMenuRights = (menus: IMenu[], menuId: number) => {
  let result: number[] = [];
  menus.map((m: IMenu) => {
    if (m.id === menuId) {
      const right = m.menu_rights.map((mr) => {
        return mr.id;
      });
      result = [...result, ...right];
    } else if (+m.parent_menu_id === menuId) {
      result = [...result, ...getChildMenuRights(menus, m.id)];
    }
  });
  return result;
};

const getChildAccessMenus = (menus: IAccessMenu[], menuId: number, result: IAccessMenu[]) => {
  menus.map((c: IAccessMenu) => {
    if (menuId === +c.parent_menu_id) {
      result.push(c);
      result = getChildMenus(menus, c.id, result);
    }
  });
  return result;
};

const getChildMenuAccessRights = (menus: IAccessMenu[], menuId: number) => {
  let result: number[] = [];
  menus.map((m: IAccessMenu) => {
    if (m.id === menuId) {
      const right = m.menu_access_rights.map((mr) => {
        return mr.id;
      });
      result = [...result, ...right];
    } else if (+m.parent_menu_id === menuId) {
      result = [...result, ...getChildMenuAccessRights(menus, m.id)];
    }
  });
  return result;
};

const optimizeMenuRights = (response) => {
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

  // set child menu rights array to parent
  menuArray = menuArray.map((m: IMenu) => {
    m.child_menu_rights = getChildMenuRights(menuArray, m.id);
    return m;
  });

  response.data.menus = menuArray;
  response.data.maxLevel = maxLevel;
  return response.data;
};

const optimizeMenuAccessRights = (response) => {
  // set parent child order
  let menuArray = [];
  menuArray = getChildAccessMenus(response.data.menus, 0, menuArray);

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

  // set child menu rights array to parent
  menuArray = menuArray.map((m: IAccessMenu) => {
    m.child_menu_rights = getChildMenuAccessRights(menuArray, m.id);
    return m;
  });

  response.data.menus = menuArray;
  response.data.maxLevel = maxLevel;

  return response.data;
};

export const getMenuRightsByRoleId = createAsyncThunk(
  'getMenuRightsByRoleId',
  async (roleId: number) => {
    const response = await menuService.getMenuRightsByRoleId(roleId).then((res) => {
      return res.body;
    });
    return optimizeMenuRights(response);
  }
);

export const getMenuRightsByCompanyId = createAsyncThunk(
  'getMenuRightsByCompanyId',
  async (companyId: number) => {
    const response = await menuService.getMenuRightsByCompanyId(companyId).then((res) => {
      return res.body;
    });
    return optimizeMenuRights(response);
  }
);

export const getMenuAccessRights = createAsyncThunk('getMenuAccessRights', async () => {
  const response = await menuService.getMenuAccessRights().then((res) => {
    return res.body;
  });
  return optimizeMenuAccessRights(response);
});
