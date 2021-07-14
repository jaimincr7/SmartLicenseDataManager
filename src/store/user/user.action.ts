import { createAsyncThunk } from '@reduxjs/toolkit';
import { IMenu } from '../../services/user/menu/menu.model';
import menuService from '../../services/user/menu/menu.service';

export const getMenuRights = createAsyncThunk('getMenuRights', async () => {
  const response = await menuService.getSideBarMenuRights().then((res) => {
    return res.body;
  });

  return response.data;
});
