import { ISearch } from '../../../common/models/common';

export interface ICurrency {
  id?: number;
  currency?: string;
  exchange_rate?: number;
  symbol?: string;
}

export interface ISearchCurrency extends ISearch { }
