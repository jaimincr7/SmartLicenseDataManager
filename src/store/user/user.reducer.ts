import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IMenu, ISideBarRights } from '../../services/user/menu/menu.model';
import { RootState } from '../app.model';
import { getMenuRights } from './user.action';
import { IActiveAccount, IUserState } from './user.model';

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
    }
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

      const setChildMenus = (menu: IMenu, isIterativeCall = false) => {
        const childMenus = menuArray?.filter((x) => x.parent_menu_id === menu.id && x.is_display);
        menuArray?.filter((x) => x.parent_menu_id === menu.id)?.forEach((childMenu: IMenu) => {
          const index = childMenus.findIndex(x => x.id === childMenu.id)
          const grandChildMenus = menuArray?.filter((x) => x.parent_menu_id === childMenu.id && x.is_display);
          if (grandChildMenus.length > 0) {
            (childMenus[index])["childMenus"] = grandChildMenus;
            grandChildMenus?.forEach(gChildMenu => {
              const greatGrandChild = menuArray?.filter((x) => x.parent_menu_id === gChildMenu.id && x.is_display);
              if (greatGrandChild?.length > 0) {
                setChildMenus(gChildMenu, true)
              }
            });
          }
          if (!childMenu?.menu_rights?.some(x => x.is_rights && x.access_rights?.name === "view" && x.access_rights?.status)) {
            childMenus?.splice(index, 1)
          }
        });
        menu["childMenus"] = childMenus;
        if (!isIterativeCall) {
          sideBarMenuDetail.push(menu)
        }
      }

      const menuArray = action.payload.menus;
      const parentMenuDetails: IMenu[] = menuArray?.filter((x) => (!(x.parent_menu_id > 0) && x.is_display));
      const sideBarMenuDetail: any = [];

      parentMenuDetails?.forEach(menu => {
        setChildMenus(menu);
      });
      state.getMenuRight.sideBarData = sideBarMenuDetail;

    },
    [getMenuRights.rejected.type]: (state) => {
      state.getMenuRight.loading = false;
      state.getMenuRight.hasErrors = true;
    },
  }
});

// A selector
export const userSelector = (state: RootState) => state.user;

// Actions
export const { setActiveAccount, clearActiveAccount, clearMenuRights } = userSlice.actions;

// The reducer
export default userSlice.reducer;
