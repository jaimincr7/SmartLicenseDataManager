export type orderByType = 'ASC' | 'DESC';

export interface ISearch {
  limit?: number;
  offset?: number;
  order_by?: string;
  order_direction?: orderByType;
  keyword?: string;
  filter_keys?: any;
  is_export_to_excel?: boolean;
  is_column_selection?: boolean;
  is_lookup?: boolean;
}

export interface IApiResponseBody<T> {
  data?: T;
  messages?: string[];
  errors?: string[];
}

export interface IApiResponse<T> {
  status: number;
  body: IApiResponseBody<T>;
}

export interface ITableColumnSelection {
  id?: number;
  table_name?: string;
  columns?: { [key: string]: boolean };
}

export interface ISearchResult<T> {
  records: T[];
  total_count: number;
  table_name?: string;
  column_selection?: ITableColumnSelection;
}

export interface ISearchResponse<T> {
  search_result: ISearchResult<T>;
}

export interface IDropDownOption {
  id: number;
  name: string;
}

export type fixedColumn = 'right' | 'left';

export interface IInlineSearch {
  [key: string]: string | string[] | number[];
}

export interface IDetailParams {
  id: string;
}
