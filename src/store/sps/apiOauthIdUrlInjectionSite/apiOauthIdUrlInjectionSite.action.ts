import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  ISpsApiOauthIdUrlInjectionSite,
  ISearchSpsApiOauthIdUrlInjectionSite,
} from '../../../services/sps/apiOauthIdUrlInjectionSite/apiOauthIdUrlInjectionSite.model';
import apiOauthIdUrlInjectionSiteService from '../../../services/sps/apiOauthIdUrlInjectionSite/apiOauthIdUrlInjectionSite.service';

// Asynchronous thunk action

export const searchSpsApiOauthIdUrlInjectionSite = createAsyncThunk(
  'searchSpsApiOauthIdUrlInjectionSite',
  async (searchParam?: ISearchSpsApiOauthIdUrlInjectionSite) => {
    const response = await apiOauthIdUrlInjectionSiteService
      .searchSpsApiOauthIdUrlInjectionSite(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getSpsApiOauthIdUrlInjectionSiteById = createAsyncThunk(
  'getSpsApiOauthIdUrlInjectionSiteById',
  async (id: number) => {
    const response = await apiOauthIdUrlInjectionSiteService
      .getSpsApiOauthIdUrlInjectionSiteById(id)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const saveSpsApiOauthIdUrlInjectionSite = createAsyncThunk(
  'saveSpsApiOauthIdUrlInjectionSite',
  async (data: ISpsApiOauthIdUrlInjectionSite) => {
    const response = await apiOauthIdUrlInjectionSiteService
      .saveSpsApiOauthIdUrlInjectionSite(data)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);

export const deleteSpsApiOauthIdUrlInjectionSite = createAsyncThunk(
  'deleteSpsApiOauthIdUrlInjectionSite',
  async (id: number) => {
    const response = await apiOauthIdUrlInjectionSiteService
      .deleteSpsApiOauthIdUrlInjectionSite(id)
      .then((res) => {
        return res.body;
      });
    return response;
  }
);
