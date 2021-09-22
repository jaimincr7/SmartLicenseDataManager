import { ISearch } from '../../../common/models/common';

export interface ICurrency {
  [x: string]: any;
  id?: number;
  currency?: string;
  exchange_rate?: number;
  symbol?: string;
}

export interface ISearchCurrency extends ISearch {}
