import {
  ISearchO365Reservations,
  IO365Reservations,
} from '../../../services/o365/o365Reservations/o365Reservations.model';
import o365ReservationsService from '../../../services/o365/o365Reservations/o365Reservations.service';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Asynchronous thunk action

export const searchO365Reservations = createAsyncThunk(
  'searchO365Reservations',
  async (searchParam?: ISearchO365Reservations) => {
    const response = await o365ReservationsService
      .searchO365Reservations(searchParam)
      .then((res) => {
        return res.body;
      });
    return response.data;
  }
);

export const getO365ReservationsById = createAsyncThunk(
  'getO365ReservationsById',
  async (id: number) => {
    const response = await o365ReservationsService.getO365ReservationsById(id).then((res) => {
      return res.body;
    });
    return response.data;
  }
);

export const saveO365Reservations = createAsyncThunk(
  'saveO365Reservations',
  async (data: IO365Reservations) => {
    const response = await o365ReservationsService.saveO365Reservations(data).then((res) => {
      return res.body;
    });
    return response;
  }
);

export const deleteO365Reservations = createAsyncThunk(
  'deleteO365Reservations',
  async (id: number) => {
    const response = await o365ReservationsService.deleteO365Reservations(id).then((res) => {
      return res.body;
    });
    return response;
  }
);
