import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  ISpsApiOauthUrlInjectionSite,
  ISearchSpsApiOauthUrlInjectionSite,
} from '../../../services/sps/apiOauthUrlInjectionSite/apiOauthUrlInjectionSite.model';
import apiOauthUrlInjectionSiteService from '../../../services/sps/apiOauthUrlInjectionSite/apiOauthUrlInjectionSite.service';

// Asynchronous thunk action

export const searchSpsApiOauthUrlInjectionSite = createAsyncThunk(
  'searchSpsApiOauthUrlInjectionSite',
  async (searchParam?: ISearchSpsApiOauthUrlInjectionSite) => {
    const response = await apiOauthUrlInjectionSiteService
      .searchSpsApiOauthUrlInjectionSite(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getSpsApiOauthUrlInjectionSiteById = createAsyncThunk(
  'getSpsApiOauthUrlInjectionSiteById',
  async (id: number) => {
    const response = await apiOauthUrlInjectionSiteService
      .getSpsApiOauthUrlInjectionSiteById(id)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const saveSpsApiOauthUrlInjectionSite = createAsyncThunk(
  'saveSpsApiOauthUrlInjectionSite',
  async (data: ISpsApiOauthUrlInjectionSite) => {
    const response = await apiOauthUrlInjectionSiteService
      .saveSpsApiOauthUrlInjectionSite(data)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);

export const deleteSpsApiOauthUrlInjectionSite = createAsyncThunk(
  'deleteSpsApiOauthUrlInjectionSite',
  async (id: number) => {
    const response = await apiOauthUrlInjectionSiteService
      .deleteSpsApiOauthUrlInjectionSite(id)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);
