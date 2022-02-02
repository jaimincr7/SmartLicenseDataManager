import { ISearch } from '../../../common/models/common';

export interface IConfigO365Products {
  id?: number;
  product?: string;
  price?: number;
  units?: string;
  enterprise_product?: boolean;
  component_only?: boolean;
  hide?: boolean;
}

export interface ISearchConfigO365Products extends ISearch {}
