import { createAsyncThunk } from '@reduxjs/toolkit';
import { ICmsContact, ISearchCmsContact } from '../../../services/cms/contact/contact.model';
import contactService from '../../../services/cms/contact/contact.service';

// Asynchronous thunk action

export const searchCmsContact = createAsyncThunk(
  'searchCmsContact',
  async (searchParam?: ISearchCmsContact) => {
    const response = await contactService.searchCmsContact(searchParam).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const getCmsContactById = createAsyncThunk('getCmsContactById', async (id: number) => {
  const response = await contactService.getCmsContactById(id).then((res) => {
    return res.body;
  });
  return response.data;
});

export const saveCmsContact = createAsyncThunk('saveCmsContact', async (data: ICmsContact) => {
  const response = await contactService.saveCmsContact(data).then((res) => {
    return res.body;
  });
  return response;
});

export const deleteCmsContact = createAsyncThunk('deleteCmsContact', async (id: number) => {
  const response = await contactService.deleteCmsContact(id).then((res) => {
    return res.body;
  });
  return response;
});
