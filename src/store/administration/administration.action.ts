import { createAsyncThunk } from '@reduxjs/toolkit';
import menuService from '../../services/administration/menu/menu.service';

export const getMenuRights = createAsyncThunk('getMenuRights', async () => {
  const response = await menuService.getSideBarMenuRights().then((res) => {
    return res.body;
  });

  return response.data;
});
