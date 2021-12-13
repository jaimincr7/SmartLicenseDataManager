import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IMenu, ISideBarRights } from '../../services/administration/menu/menu.model';
import { RootState } from '../app.model';
import { getMenuRights } from './administration.action';
import { IActiveAccount, IUserState } from './administration.model';

export const initialState: IUserState = {
  activeAccount: null,
  getMenuRight: {
    loading: false,
    hasErrors: false,
    data: null,
    sideBarData: null,
  },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setActiveAccount: (state, action: PayloadAction<IActiveAccount>) => {
      state.activeAccount = action.payload;
    },
    clearActiveAccount: (state) => {
      state.activeAccount = null;
    },
    clearMenuRights: (state) => {
      state.getMenuRight = initialState.getMenuRight;
    },
  },
  extraReducers: {
    // Get Menu Rights
    [getMenuRights.pending.type]: (state) => {
      state.getMenuRight.loading = true;
    },
    [getMenuRights.fulfilled.type]: (state, action: PayloadAction<ISideBarRights>) => {
      state.getMenuRight.data = action.payload;
      state.getMenuRight.loading = false;
      state.getMenuRight.hasErrors = false;

      const setChildMenus = (menu: IMenu) => {
        const childMenus = menuArray?.filter(
          (x) =>
            x.parent_menu_id === menu.id &&
            x.is_display &&
            (x.menu_rights.length === 0 ||
              x.menu_rights?.find(
                (y) => y.is_rights && y.access_rights?.name === 'view' && y.access_rights?.status
              ))
        );
        if (childMenus.length > 0) {
          menu['childMenus'] = childMenus;
          childMenus?.forEach((menu) => {
            setChildMenus(menu);
          });
        }
      };

      const hasChild = (menu: IMenu) => {
        let validChild = 0;
        if (menu['childMenus'] && menu['childMenus'].length > 0) {
          const childMenus = menu['childMenus'];
          childMenus?.forEach((m, index) => {
            if (m.menu_rights.length !== 0) {
              validChild = validChild + 1;
            } else if (m.childMenus && m.childMenus.length > 0) {
              if (hasChild(m)) {
                validChild = validChild + 1;
              } else {
                childMenus.splice(index, 1);
              }
            } else {
              childMenus.splice(index, 1);
            }
          });
        }
        if (validChild > 0 || menu.menu_rights.length > 0) {
          return true;
        } else {
          return false;
        }
      };

      const menuArray = action.payload.menus;
      const parentMenuDetails: IMenu[] = menuArray?.filter(
        (x) => !(x.parent_menu_id > 0) && x.is_display
      );
      parentMenuDetails?.forEach((menu) => {
        setChildMenus(menu);
      });
      parentMenuDetails?.forEach((menu, index) => {
        if (!hasChild(menu)) {
          parentMenuDetails.splice(index, 1);
        }
      });

      state.getMenuRight.sideBarData = parentMenuDetails;
    },
    [getMenuRights.rejected.type]: (state) => {
      state.getMenuRight.loading = false;
      state.getMenuRight.hasErrors = true;
    },
  },
});

// A selector
export const userSelector = (state: RootState) => state.user;

// Actions
export const { setActiveAccount, clearActiveAccount, clearMenuRights } = userSlice.actions;

// The reducer
export default userSlice.reducer;
